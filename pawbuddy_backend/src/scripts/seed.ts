import 'dotenv/config';
import mongoose from 'mongoose';
import { env } from '../config/environment.js';
import { User, Pet, Booking, Favourite, RefreshToken } from '../models/index.js';
import { hashPassword } from '../utils/auth.js';

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to database
    await mongoose.connect(env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Pet.deleteMany({}),
      Booking.deleteMany({}),
      Favourite.deleteMany({}),
      RefreshToken.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminPassword = await hashPassword('admin123');
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@pawbuddy.com',
      password: adminPassword,
      role: 'admin',
      phone: '+1-555-0100',
      bio: 'Pet adoption platform administrator',
      city: 'New York',
      joinedDate: new Date('2024-01-01'),
    });
    console.log('✅ Created admin user');

    // Create adopter users
    const adopterPassword = await hashPassword('adopter123');
    const adopter1 = await User.create({
      name: 'John Smith',
      email: 'john@example.com',
      password: adopterPassword,
      role: 'adopter',
      phone: '+1-555-0101',
      bio: 'Dog lover looking for a companion',
      city: 'New York',
      joinedDate: new Date('2024-02-01'),
    });

    const adopter2 = await User.create({
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      password: adopterPassword,
      role: 'adopter',
      phone: '+1-555-0102',
      bio: 'Cat enthusiast seeking a furry friend',
      city: 'Los Angeles',
      joinedDate: new Date('2024-02-15'),
    });
    console.log('✅ Created adopter users');

    // Create pets
    const pets = await Pet.insertMany([
      {
        name: 'Max',
        type: 'dog',
        breed: 'Golden Retriever',
        age: 36, // 3 years
        gender: 'male',
        size: 'large',
        color: 'Golden',
        weight: '70 lbs',
        vaccinated: true,
        neutered: true,
        status: 'available',
        description: 'Max is a friendly and energetic Golden Retriever who loves to play fetch and swim. Perfect for active families!',
        personality: ['Friendly', 'Energetic', 'Loyal', 'Intelligent'],
        images: [
          'https://images.unsplash.com/photo-1633722715463-d30628519b6d?w=500',
        ],
        location: 'New York, NY',
        postedDate: new Date('2024-02-20'),
        createdBy: admin._id.toString(),
      },
      {
        name: 'Luna',
        type: 'dog',
        breed: 'Husky',
        age: 24, // 2 years
        gender: 'female',
        size: 'large',
        color: 'Gray and White',
        weight: '65 lbs',
        vaccinated: true,
        neutered: true,
        status: 'available',
        description: 'Luna is a beautiful Husky with striking blue eyes. She is smart and playful, ideal for families with outdoor activities.',
        personality: ['Playful', 'Intelligent', 'Independent', 'Affectionate'],
        images: [
          'https://images.unsplash.com/photo-1633722725463-d30628519b6d?w=500',
        ],
        location: 'Los Angeles, CA',
        postedDate: new Date('2024-02-18'),
        createdBy: admin._id.toString(),
      },
      {
        name: 'Bella',
        type: 'cat',
        breed: 'Persian',
        age: 48, // 4 years
        gender: 'female',
        size: 'small',
        color: 'White',
        weight: '8 lbs',
        vaccinated: true,
        neutered: true,
        status: 'available',
        description: 'Bella is a gentle and calm Persian cat who loves cuddles and relaxation. Perfect for a quiet home.',
        personality: ['Calm', 'Affectionate', 'Gentle', 'Quiet'],
        images: [
          'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500',
        ],
        location: 'New York, NY',
        postedDate: new Date('2024-02-22'),
        createdBy: admin._id.toString(),
      },
      {
        name: 'Charlie',
        type: 'dog',
        breed: 'Labrador Retriever',
        age: 12, // 1 year
        gender: 'male',
        size: 'large',
        color: 'Black',
        weight: '60 lbs',
        vaccinated: true,
        neutered: false,
        status: 'available',
        description: 'Charlie is a young and energetic Labrador Retriever full of life. He needs an active family to match his energy!',
        personality: ['Energetic', 'Playful', 'Loyal', 'Food-motivated'],
        images: [
          'https://images.unsplash.com/photo-1633722725463-d30628519b6d?w=500',
        ],
        location: 'Chicago, IL',
        postedDate: new Date('2024-02-19'),
        createdBy: admin._id.toString(),
      },
      {
        name: 'Whiskers',
        type: 'cat',
        breed: 'Tabby',
        age: 60, // 5 years
        gender: 'male',
        size: 'small',
        color: 'Orange Tabby',
        weight: '10 lbs',
        vaccinated: true,
        neutered: true,
        status: 'available',
        description: 'Whiskers is a friendly and sociable tabby cat who enjoys both playtime and cuddling. Great for families!',
        personality: ['Friendly', 'Playful', 'Social', 'Curious'],
        images: [
          'https://images.unsplash.com/photo-1574158622147-e121bf4311d3?w=500',
        ],
        location: 'Seattle, WA',
        postedDate: new Date('2024-02-21'),
        createdBy: admin._id.toString(),
      },
      {
        name: 'Rocky',
        type: 'dog',
        breed: 'German Shepherd',
        age: 84, // 7 years
        gender: 'male',
        size: 'large',
        color: 'Brown and Black',
        weight: '80 lbs',
        vaccinated: true,
        neutered: true,
        status: 'available',
        description: 'Rocky is a mature and well-trained German Shepherd. He is calm, obedient, and great for experienced dog owners.',
        personality: ['Intelligent', 'Loyal', 'Protective', 'Calm'],
        images: [
          'https://images.unsplash.com/photo-1633722725463-d30628519b6d?w=500',
        ],
        location: 'Boston, MA',
        postedDate: new Date('2024-02-17'),
        createdBy: admin._id.toString(),
      },
      {
        name: 'Mittens',
        type: 'cat',
        breed: 'Siamese',
        age: 24, // 2 years
        gender: 'female',
        size: 'small',
        color: 'Cream and Chocolate',
        weight: '7 lbs',
        vaccinated: true,
        neutered: true,
        status: 'available',
        description: 'Mittens is an elegant Siamese cat with striking blue eyes. She is vocal, playful, and loves attention!',
        personality: ['Vocal', 'Playful', 'Affectionate', 'Attention-seeking'],
        images: [
          'https://images.unsplash.com/photo-1574158622147-e121bf4311d3?w=500',
        ],
        location: 'Miami, FL',
        postedDate: new Date('2024-02-16'),
        createdBy: admin._id.toString(),
      },
      {
        name: 'Buddy',
        type: 'dog',
        breed: 'Beagle',
        age: 30, // 2.5 years
        gender: 'male',
        size: 'small',
        color: 'Tricolor',
        weight: '25 lbs',
        vaccinated: true,
        neutered: true,
        status: 'available',
        description: 'Buddy is a curious and friendly Beagle. He loves outdoor adventures and is great with children!',
        personality: ['Curious', 'Friendly', 'Energetic', 'Social'],
        images: [
          'https://images.unsplash.com/photo-1633722725463-d30628519b6d?w=500',
        ],
        location: 'Denver, CO',
        postedDate: new Date('2024-02-23'),
        createdBy: admin._id.toString(),
      },
      {
        name: 'Shadow',
        type: 'cat',
        breed: 'Black Domestic Shorthair',
        age: 36, // 3 years
        gender: 'male',
        size: 'small',
        color: 'Black',
        weight: '9 lbs',
        vaccinated: true,
        neutered: true,
        status: 'available',
        description: 'Shadow is a sleek and mysterious black cat. He is independent but will love you unconditionally once he bonds!',
        personality: ['Independent', 'Mysterious', 'Loyal', 'Quiet'],
        images: [
          'https://images.unsplash.com/photo-1574158622147-e121bf4311d3?w=500',
        ],
        location: 'Portland, OR',
        postedDate: new Date('2024-02-24'),
        createdBy: admin._id.toString(),
      },
      {
        name: 'Daisy',
        type: 'dog',
        breed: 'Poodle Mix',
        age: 18, // 1.5 years
        gender: 'female',
        size: 'medium',
        color: 'Apricot',
        weight: '35 lbs',
        vaccinated: true,
        neutered: true,
        status: 'available',
        description: 'Daisy is a adorable Poodle mix with a curly coat. She is smart, trainable, and perfect for families!',
        personality: ['Smart', 'Trainable', 'Friendly', 'Playful'],
        images: [
          'https://images.unsplash.com/photo-1633722725463-d30628519b6d?w=500',
        ],
        location: 'Austin, TX',
        postedDate: new Date('2024-02-25'),
        createdBy: admin._id.toString(),
      },
    ]);
    console.log(`✅ Created ${pets.length} pets`);

    // Create some bookings
    const booking1 = await Booking.create({
      petId: pets[0]._id.toString(),
      petName: 'Max',
      petImage: pets[0].images[0],
      adopterId: adopter1._id.toString(),
      adopterName: 'John Smith',
      adopterEmail: 'john@example.com',
      adopterPhone: '+1-555-0101',
      message: 'Max looks perfect for our family! We have a large backyard and love outdoor activities.',
      homeType: 'House',
      yardStatus: 'Large fenced yard',
      workSchedule: 'One parent works from home part-time',
      currentPets: [{ type: 'cat', breed: 'Siamese', name: 'Mittens' }],
      petExperience: 'We have owned dogs for 10 years',
      lifetimeCommitment: true,
      status: 'pending',
      submittedAt: new Date('2024-02-26'),
    });
    console.log('✅ Created sample booking');

    // Create some favourites
    await Favourite.create({
      userId: adopter1._id.toString(),
      petId: pets[2]._id.toString(),
    });

    await Favourite.create({
      userId: adopter2._id.toString(),
      petId: pets[1]._id.toString(),
    });

    await Favourite.create({
      userId: adopter2._id.toString(),
      petId: pets[3]._id.toString(),
    });
    console.log('✅ Created sample favourites');

    console.log('');
    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('📋 Sample login credentials:');
    console.log('   Admin: admin@pawbuddy.com / admin123');
    console.log('   Adopter 1: john@example.com / adopter123');
    console.log('   Adopter 2: sarah@example.com / adopter123');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
