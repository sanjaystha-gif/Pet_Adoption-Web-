import mongoose, { Schema, Document } from 'mongoose';

export interface IRefreshToken extends Document {
  userId: string;
  token: string; // hashed token
  expiresAt: Date;
  createdAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      ref: 'User',
    },
    token: {
      type: String,
      required: [true, 'Token is required'],
      select: false,
    },
    expiresAt: {
      type: Date,
      required: [true, 'Expiry date is required'],
      expires: 0, // TTL index: automatically delete documents when expiresAt is reached
    },
  },
  {
    timestamps: true,
  }
);

// Index for userId for quick lookup and cleanup
refreshTokenSchema.index({ userId: 1 });
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

export const RefreshToken = mongoose.model<IRefreshToken>('RefreshToken', refreshTokenSchema);
