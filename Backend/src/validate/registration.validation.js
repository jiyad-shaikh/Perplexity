import { body, validationResult } from 'express-validator';

const registrationRules = [
  body('name')
    .isString()
    .withMessage('Name is required')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .bail()
    .isLength({ min: 2, max: 80 }) 
    .withMessage('Name must be between 2 and 80 characters'),
  body('email')
    .isString()
    .withMessage('Email is required')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .bail()
    .toLowerCase(),
  body('password')
    .isString()
    .withMessage('Password is required')
    .bail()
    .notEmpty()
    .withMessage('Password is required')
    .bail()
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters'),
];

const validateRegistration = [
  ...registrationRules,
  (req, res, next) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: result.array().map(({ path, msg }) => ({
          field: path,
          message: msg,
        })),
      });
    }

    next();
  },
];

export default validateRegistration;
