const { fn, col } = require('sequelize');
const { Store, Rating, User } = require('../models');

// GET /api/store-owner/dashboard
// req.user.id comes from the JWT (see middleware/auth.js) — a store owner
// can only ever see their OWN store's data, never another owner's.
exports.dashboard = async (req, res) => {
  try {
    const store = await Store.findOne({ where: { owner_id: req.user.id } });
    if (!store) {
      return res.status(404).json({ message: 'No store is registered to this account yet' });
    }

    const [avgResult, raters] = await Promise.all([
      Rating.findOne({
        where: { store_id: store.id },
        attributes: [[fn('AVG', col('rating')), 'averageRating'], [fn('COUNT', col('rating')), 'ratingCount']],
        raw: true,
      }),
      Rating.findAll({
        where: { store_id: store.id },
        include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
        attributes: ['id', 'rating', 'created_at'],
        order: [['created_at', 'DESC']],
      }),
    ]);

    res.json({
      store: { id: store.id, name: store.name, address: store.address, email: store.email },
      averageRating: avgResult?.averageRating ? Number(avgResult.averageRating).toFixed(2) : null,
      ratingCount: Number(avgResult?.ratingCount || 0),
      raters,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while loading store owner dashboard' });
  }
};
