import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 200,
      default: 'New chat',
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    model: {
      type: String,
      required: true,
      trim: true,
      default: 'default',
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
    lastMessageAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

chatSchema.index({ user: 1, updatedAt: -1 });

const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);

export default Chat;
