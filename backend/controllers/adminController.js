const bcrypt = require('bcryptjs');
const { Op, fn, col, literal } = require('sequelize');
const { validationResult } = require('express-validator');
const { sequelize, User, Store, Rating } = require('../models');

// Whitelist which columns each list endpoint is allowed to sort by.
// (Never pass req.query.sortBy straight into a raw ORDER BY — that's a
// classic SQL-injection-via-column-name mistake.)
const USER_SORT_COLUMNS = ['id', 'name', 'email', 'address', 'role', 'created_at'];
const STORE_SORT_COLUMNS = ['id', 'name', 'email', 'address', 'created_at'];

function resolveSort(sortBy, order, allowedColumns, fallback = 'id') {
  const column = allowedColumns.includes(sortBy) ? sortBy : fallback;
  const direction = String(order).toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  return [[column, direction]];
}

// POST /api/admin/users
exports.addUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, address, password, role } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      address,
      password: hashedPassword,
      role, // admin explicitly sets the role here — this is the ONLY place
            // a non-'normal' role gets created (signup always forces 'normal')
    });

    res.status(201).json({
      message: 'User created',
      user: { id: user.id, name: user.name, email: user.email, role: user.role, address: user.address },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while creating user' });
  }
};

// POST /api/admin/stores
exports.addStore = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, address, owner_id } = req.body;

    if (owner_id) {
      const owner = await User.findByPk(owner_id);
      if (!owner) {
        return res.status(404).json({ message: 'owner_id does not reference an existing user' });
      }
      if (owner.role !== 'store_owner') {
        return res.status(400).json({ message: 'owner_id must belong to a user with role store_owner' });
      }
    }

    const store = await Store.create({ name, email, address, owner_id: owner_id || null });

    res.status(201).json({ message: 'Store created', store });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while creating store' });
  }
};

// GET /api/admin/dashboard
exports.dashboard = async (req, res) => {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      User.count(),
      Store.count(),
      Rating.count(),
    ]);

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while loading dashboard' });
  }
};

// GET /api/admin/users?name=&email=&address=&role=&sortBy=&order=
exports.listUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy, order } = req.query;

    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };
    if (role) where.role = role;

    const users = await User.findAll({
      where,
      attributes: ['id', 'name', 'email', 'address', 'role', 'created_at'],
      order: resolveSort(sortBy, order, USER_SORT_COLUMNS),
    });

    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while listing users' });
  }
};

// GET /api/admin/stores?name=&email=&address=&sortBy=&order=
exports.listStores = async (req, res) => {
  try {
    const { name, email, address, sortBy, order } = req.query;

    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };

    const stores = await Store.findAll({
      where,
      attributes: {
        include: [[fn('AVG', col('ratings.rating')), 'averageRating']],
      },
      include: [{ model: Rating, as: 'ratings', attributes: [] }],
      group: ['Store.id'],
      order: resolveSort(sortBy, order, STORE_SORT_COLUMNS),
      subQuery: false,
    });

    res.json({ stores });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while listing stores' });
  }
};

// GET /api/admin/users/:id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'name', 'email', 'address', 'role', 'created_at'],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If this user is a store owner, also surface their store's average rating —
    // handy for the admin's "view user details" screen per the spec.
    let ownedStore = null;
    if (user.role === 'store_owner') {
      const store = await Store.findOne({ where: { owner_id: user.id } });
      if (store) {
        const avg = await Rating.findOne({
          where: { store_id: store.id },
          attributes: [[fn('AVG', col('rating')), 'averageRating']],
          raw: true,
        });
        ownedStore = {
          id: store.id,
          name: store.name,
          averageRating: avg?.averageRating ? Number(avg.averageRating).toFixed(2) : null,
        };
      }
    }

    res.json({ user, ownedStore });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching user' });
  }
};

// GET /api/admin/store-owners
// Returns only users who have the store_owner role.
exports.listStoreOwners = async (req, res) => {
  try {
    const owners = await User.findAll({
      where: {
        role: 'store_owner',
      },
      attributes: ['id', 'name', 'email'],
      order: [['name', 'ASC']],
    });

    res.json({ owners });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Server error while loading store owners',
    });
  }
};

// GET /api/admin/store-owners
exports.listStoreOwners = async (req, res) => {
  try {
    const owners = await User.findAll({
      where: {
        role: 'store_owner',
      },
      attributes: ['id', 'name', 'email'],
      order: [['name', 'ASC']],
    });

    res.json({ owners });
  } catch (err) {
    console.error('Error loading store owners:', err);

    res.status(500).json({
      message: 'Server error while loading store owners',
    });
  }
};