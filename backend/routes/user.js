const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');
const { ratingValidators } = require('../validators/ratingValidators');

// Any authenticated user (any role) can browse/search stores and rate them.
// If you later want to restrict rating submission to role === 'normal' only,
// add checkRole('normal') to the two rating routes below.
router.use(verifyToken);

router.get('/', userController.listStores);
router.post('/:id/rating', ratingValidators, userController.submitRating);
router.put('/:id/rating', ratingValidators, userController.updateRating);

module.exports = router;
