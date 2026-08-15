const { body } = require('express-validator');
const { nameRule, emailRule, addressRule, passwordRule } = require('./authValidators');

// Admin creating a user (any role, including other admins/store owners)
const addUserValidators = [
  nameRule,
  emailRule,
  addressRule,
  passwordRule,
  body('role')
    .isIn(['admin', 'normal', 'store_owner'])
    .withMessage('Role must be one of: admin, normal, store_owner'),
];

// Admin creating a store
const addStoreValidators = [
  body('name')
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Store name must be between 20 and 60 characters'),
  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('address')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 400 })
    .withMessage('Address must be at most 400 characters'),
  body('owner_id')
    .optional({ checkFalsy: true })
    .isInt()
    .withMessage('owner_id must be an integer'),
];

module.exports = { addUserValidators, addStoreValidators };
