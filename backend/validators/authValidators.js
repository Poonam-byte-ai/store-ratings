const { body } = require('express-validator');

const nameRule = body('name')
  .trim()
  .isLength({ min: 20, max: 60 })
  .withMessage('Name must be between 20 and 60 characters');

const emailRule = body('email')
  .trim()
  .isEmail()
  .withMessage('Must be a valid email address')
  .normalizeEmail();

const addressRule = body('address')
  .trim()
  .isLength({ max: 400 })
  .withMessage('Address must be at most 400 characters');

const passwordRule = body('password')
  .isLength({ min: 8, max: 16 })
  .withMessage('Password must be 8-16 characters')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/[!@#$%^&*(),.?":{}|<>]/)
  .withMessage('Password must contain at least one special character');

const signupValidators = [nameRule, emailRule, addressRule, passwordRule];

const loginValidators = [
  body('email').trim().isEmail().withMessage('Must be a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

const changePasswordValidators = [
  body('oldPassword').notEmpty().withMessage('Old password is required'),
  body('newPassword')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be 8-16 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character'),
];

module.exports = {
  nameRule,
  emailRule,
  addressRule,
  passwordRule,
  signupValidators,
  loginValidators,
  changePasswordValidators,
};