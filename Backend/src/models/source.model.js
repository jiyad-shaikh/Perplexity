import mongoose from 'mongoose';

const sourceSchema = new mongoose.Schema(
  {
    message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    url: {
      type: String,
      required: true,
      trim: true,
      match: /^https?:\/\/.+/i,
    },
    domain: {
      type: String,
      trim: true,
    },
    snippet: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    favicon: {
      type: String,
      trim: true,
    },
    position: {
      type: Number,
      min: 0,
    },
  },
  { timestamps: true }
);

sourceSchema.index({ message: 1, position: 1 });

const Source = mongoose.models.Source || mongoose.model('Source', sourceSchema);

export default Source;
