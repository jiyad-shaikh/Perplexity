import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      trim: true,
    },
    isStreaming: {
      type: Boolean,
      default: false,
    },
    tokenCount: {
      type: Number,
      min: 0,
    },
    sources: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Source',
      },
    ],
    error: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

messageSchema.index({ chat: 1, createdAt: 1 });

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

export default Message;
