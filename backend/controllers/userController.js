const { Op, fn, col } = require('sequelize');
const { validationResult } = require('express-validator');
const { Store, Rating } = require('../models');

// GET /api/stores?name=&address=
// Every logged-in user (any role) can browse/search stores.
// Response includes the store's overall average rating AND, if this user
// has already rated it, their own rating — so the frontend can pre-fill
// the star input and show "edit" vs "rate" state.
exports.listStores = async (req, res) => {
  try {
    const { name, address } = req.query;

    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };

    const stores = await Store.findAll({
      where,
      attributes: {
        include: [[fn('AVG', col('ratings.rating')), 'averageRating']],
      },
      include: [{ model: Rating, as: 'ratings', attributes: [] }],
      group: ['Store.id'],
      subQuery: false,
    });

    const storeIds = stores.map((s) => s.id);
    const myRatings = await Rating.findAll({
      where: { user_id: req.user.id, store_id: storeIds },
      attributes: ['store_id', 'rating'],
      raw: true,
    });
    const myRatingByStore = Object.fromEntries(myRatings.map((r) => [r.store_id, r.rating]));

    const result = stores.map((store) => {
      const plain = store.toJSON();
      return {
        ...plain,
        averageRating: plain.averageRating ? Number(plain.averageRating).toFixed(2) : null,
        myRating: myRatingByStore[store.id] || null,
      };
    });

    res.json({ stores: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while listing stores' });
  }
};

// POST /api/stores/:id/rating
// First-time rating. If the user already rated this store, they should
// use PUT instead (kept separate so each endpoint has one clear job).
exports.submitRating = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const storeId = req.params.id;
    const { rating } = req.body;

    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const existing = await Rating.findOne({ where: { user_id: req.user.id, store_id: storeId } });
    if (existing) {
      return res.status(409).json({ message: 'You already rated this store. Use PUT to update it.' });
    }

    const created = await Rating.create({ user_id: req.user.id, store_id: storeId, rating });
    res.status(201).json({ message: 'Rating submitted', rating: created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while submitting rating' });
  }
};

// PUT /api/stores/:id/rating
exports.updateRating = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const storeId = req.params.id;
    const { rating } = req.body;

    const existing = await Rating.findOne({ where: { user_id: req.user.id, store_id: storeId } });
    if (!existing) {
      return res.status(404).json({ message: 'No existing rating found. Use POST to create one.' });
    }

    existing.rating = rating;
    await existing.save();

    res.json({ message: 'Rating updated', rating: existing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while updating rating' });
  }
};
