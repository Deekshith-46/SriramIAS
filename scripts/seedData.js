const mongoose = require('mongoose');
const Center = require('../models/Center');
const Category = require('../models/Category');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

async function seedData() {
  try {
    console.log('\n🌱 Seeding database...\n');

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await Center.deleteMany({});
    // await Category.deleteMany({});

    // Create Centers
    console.log('📍 Creating Centers...');
    const centers = await Center.insertMany([
      { name: 'Delhi' },
      { name: 'Hyderabad' },
      { name: 'Pune' }
    ]);
    console.log('✅ Centers created:', centers.length);

    // Create Categories
    console.log('\n📚 Creating Categories...');
    const categories = await Category.insertMany([
      { name: 'GS Foundation' },
      { name: 'Optional Subjects' },
      { name: 'Test Series' },
      { name: 'Crash Courses' },
      { name: 'Interview Guidance' }
    ]);
    console.log('✅ Categories created:', categories.length);

    console.log('\n✅ Database seeded successfully!\n');
    console.log('Centers:');
    centers.forEach(c => console.log(`  - ${c.name} (${c._id})`));
    console.log('\nCategories:');
    categories.forEach(c => console.log(`  - ${c.name} (${c._id})`));
    console.log('\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
