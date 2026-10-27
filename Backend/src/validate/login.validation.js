import { body, validationResult } from 'express-validator';

const loginRules = [
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
        .withMessage('Password is required'),
];


const validateLogin = [
    ...loginRules,
    (req, res, next) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ success: false, errors: result.array() });
        }
        next();
    },
];

export default validateLogin;