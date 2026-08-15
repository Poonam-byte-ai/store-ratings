const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, checkRole } = require('../middleware/auth');
const { addUserValidators, addStoreValidators } = require('../validators/adminValidators');

// Every route here requires a valid token AND the 'admin' role.
router.use(verifyToken, checkRole('admin'));

router.post('/users', addUserValidators, adminController.addUser);
router.post('/stores', addStoreValidators, adminController.addStore);
router.get('/dashboard', adminController.dashboard);
router.get('/users', adminController.listUsers);
router.get('/stores', adminController.listStores);
router.get('/store-owners', adminController.listStoreOwners);
router.get('/users/:id', adminController.getUserById);

module.exports = router;
