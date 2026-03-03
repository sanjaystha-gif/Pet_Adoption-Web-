import mongoose, { Schema, Document } from 'mongoose';

export type BookingStatus = 'pending' | 'approved' | 'rejected';

export interface CurrentPet {
  type: string;
  breed: string;
  name: string;
}

export interface IBooking extends Document {
  petId: string;
  petName: string;
  petImage: string;
  adopterId: string;
  adopterName: string;
  adopterEmail: string;
  adopterPhone: string;
  message: string;
  homeType?: string;
  yardStatus?: string;
  workSchedule?: string;
  currentPets?: CurrentPet[];
  petExperience?: string;
  lifetimeCommitment?: boolean;
  status: BookingStatus;
  submittedAt: Date;
  updatedAt: Date;
  createdAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    petId: {
      type: String,
      required: [true, 'Pet ID is required'],
      ref: 'Pet',
    },
    petName: {
      type: String,
      required: [true, 'Pet name is required'],
    },
    petImage: {
      type: String,
      required: [true, 'Pet image is required'],
    },
    adopterId: {
      type: String,
      required: [true, 'Adopter ID is required'],
      ref: 'User',
    },
    adopterName: {
      type: String,
      required: [true, 'Adopter name is required'],
    },
    adopterEmail: {
      type: String,
      required: [true, 'Adopter email is required'],
      lowercase: true,
      trim: true,
    },
    adopterPhone: {
      type: String,
      required: [true, 'Adopter phone is required'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    homeType: {
      type: String,
      default: null,
    },
    yardStatus: {
      type: String,
      default: null,
    },
    workSchedule: {
      type: String,
      default: null,
    },
    currentPets: {
      type: [
        {
          type: {
            type: String,
            required: true,
          },
          breed: {
            type: String,
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
        },
      ],
      default: [],
    },
    petExperience: {
      type: String,
      default: null,
    },
    lifetimeCommitment: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    submittedAt: {
      type: Date,
      default: () => new Date(),
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

// Indexes for filtering
bookingSchema.index({ adopterId: 1 });
bookingSchema.index({ petId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ submittedAt: -1 });
bookingSchema.index({ adopterId: 1, petId: 1, status: 1 }); // For finding duplicate active bookings

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
