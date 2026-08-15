const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const {
  signupValidators,
  loginValidators,
  changePasswordValidators,
} = require('../validators/authValidators');

router.post('/signup', signupValidators, authController.signup);
router.post('/login', loginValidators, authController.login);
router.put('/password', verifyToken, changePasswordValidators, authController.changePassword);

module.exports = router;