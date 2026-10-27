import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protect = async (req, res, next) => {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId ?? decoded.sub;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Not authorized' }); 
    }
}
