import { Router } from 'express';
import { sendMessage } from '../controllers/chat.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const chatRouter = Router();

chatRouter.post('/message', protect, sendMessage);

export default chatRouter;