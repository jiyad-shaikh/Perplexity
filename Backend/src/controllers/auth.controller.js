import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import {sendEmail} from '../services/mail.services.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashedPassword });
  const verificationToken = jwt.sign(
    { userId: user._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: '24h' },
  );
  const apiBaseUrl = `http://localhost:${process.env.PORT}`;
  const verificationUrl = `${apiBaseUrl}/api/auth/verify-email/${verificationToken}`;

    await sendEmail({
      to: email,
    subject: 'Verify your email address',
    text: `Hello ${name},\n\nThank you for registering with our service! Please verify your email by opening this link:\n${verificationUrl}\n\nThis link expires in 24 hours.\n\nBest regards,\nThe Team`,
    html: `<p>Hello ${name},</p>
           <p>Thank you for registering with our service!</p>
           <p><a href="${verificationUrl}">Verify your email address</a></p>
           <p>This link expires in 24 hours.</p>
           <p>Best regards,<br>The Team</p>`,
    });

    return res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email address.',
      user: { id: user._id, name: user.name, email: user.email },
    });
  } 
    catch (error) {
        if (error?.code === 11000) {
          return res.status(409).json({ success: false, message: 'Email is already registered' });
        }

        return res.status(500).json({ success: false, message: 'Unable to register user' });
      }
}; 

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
    });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (!user.verified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email address before logging in',
      });
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    );

    user.lastLoginAt = new Date();
    await user.save();

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        verified: user.verified,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to log in',
    });
  }
};

export const logout = async (_req, res) => {
  res.clearCookie('authToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  return res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
};

export const getMe = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'User retrieved successfully',
    user: req.user
  });
};

export const verifyEmail = async (req, res) => {
    const { token } = req.params;

    if (!token) {
        return res.status(400).json({
            success: false,
            message: 'Verification token is required',
        });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const userId = payload.userId ?? payload.sub;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'Invalid verification token',
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        if (!user.verified) {
            user.verified = true;
            await user.save();
        }

        return res.status(200).json({
            success: true,
            message: 'Email verified successfully',
        });
    } catch (error) {
        if (error?.name === 'TokenExpiredError') {
            return res.status(400).json({
                success: false,
                message: 'Verification token has expired',
            });
        }

        if (error?.name === 'JsonWebTokenError' || error?.name === 'NotBeforeError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid verification token',
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Unable to verify email',
        });
    }
};
