import mongoose, { Schema, Document } from 'mongoose';

export type PetType = 'dog' | 'cat';
export type Gender = 'male' | 'female';
export type Size = 'small' | 'medium' | 'large';
export type PetStatus = 'available' | 'pending' | 'adopted';

export interface IPet extends Document {
  name: string;
  type: PetType;
  breed: string;
  age: number; // stored in months
  gender: Gender;
  size: Size;
  color: string;
  weight: string;
  vaccinated: boolean;
  neutered: boolean;
  status: PetStatus;
  description: string;
  personality: string[];
  images: string[];
  location: string;
  postedDate: Date;
  createdBy: string; // User ID
  createdAt: Date;
  updatedAt: Date;
  // Virtual field for ageDisplay
  ageDisplay?: string;
}

const petSchema = new Schema<IPet>(
  {
    name: {
      type: String,
      required: [true, 'Pet name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['dog', 'cat'],
      required: [true, 'Pet type is required'],
    },
    breed: {
      type: String,
      required: [true, 'Breed is required'],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, 'Age is required (in months)'],
      min: 0,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: [true, 'Gender is required'],
    },
    size: {
      type: String,
      enum: ['small', 'medium', 'large'],
      required: [true, 'Size is required'],
    },
    color: {
      type: String,
      required: [true, 'Color is required'],
      trim: true,
    },
    weight: {
      type: String,
      required: [true, 'Weight is required'],
      trim: true,
    },
    vaccinated: {
      type: Boolean,
      default: false,
    },
    neutered: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['available', 'pending', 'adopted'],
      default: 'available',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    personality: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    postedDate: {
      type: Date,
      default: () => new Date(),
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        ret.ageDisplay = computeAgeDisplay(ret.age);
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Virtual for ageDisplay
petSchema.virtual('ageDisplay').get(function (this: IPet) {
  return computeAgeDisplay(this.age);
});

// Helper function to compute age display
function computeAgeDisplay(months: number): string {
  if (months < 12) {
    return `${months} months`;
  }
  const years = months / 12;
  if (years === Math.floor(years)) {
    return years === 1 ? '1 year' : `${Math.floor(years)} years`;
  }
  return `${years.toFixed(1)} years`;
}

// Indexes for filtering
petSchema.index({ status: 1 });
petSchema.index({ type: 1 });
petSchema.index({ gender: 1 });
petSchema.index({ breed: 1 });
petSchema.index({ location: 1 });
petSchema.index({ postedDate: -1 });

export const Pet = mongoose.model<IPet>('Pet', petSchema);
