import mongoose, { Schema, Document } from 'mongoose';

export interface IFavourite extends Document {
  userId: string;
  petId: string;
  createdAt: Date;
  updatedAt: Date;
}

const favouriteSchema = new Schema<IFavourite>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      ref: 'User',
    },
    petId: {
      type: String,
      required: [true, 'Pet ID is required'],
      ref: 'Pet',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Unique compound index on userId and petId
favouriteSchema.index({ userId: 1, petId: 1 }, { unique: true });

export const Favourite = mongoose.model<IFavourite>('Favourite', favouriteSchema);
