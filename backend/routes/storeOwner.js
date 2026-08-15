const express = require('express');
const router = express.Router();
const storeOwnerController = require('../controllers/storeOwnerController');
const { verifyToken, checkRole } = require('../middleware/auth');

router.use(verifyToken, checkRole('store_owner'));

router.get('/dashboard', storeOwnerController.dashboard);

module.exports = router;
