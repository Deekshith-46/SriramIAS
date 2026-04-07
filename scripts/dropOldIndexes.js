const mongoose = require('mongoose');
const Center = require('../models/Center');
const Category = require('../models/Category');
const Course = require('../models/Course');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

async function dropIndexes() {
  try {
    console.log('\n🧹 Cleaning up old indexes...\n');

    // Drop all indexes from Center collection (except _id)
    console.log('📍 Center Collection:');
    const centerIndexes = await Center.collection.indexes();
    console.log('   Current indexes:', centerIndexes.map(i => i.name).join(', '));
    
    // Drop the old location index
    try {
      await Center.collection.dropIndex('location_1');
      console.log('   ✅ Dropped old "location_1" index');
    } catch (err) {
      if (err.code === 27) {
        console.log('   ⚠️  "location_1" index does not exist (already removed)');
      } else {
        throw err;
      }
    }

    // Drop all indexes from Category collection (except _id)
    console.log('\n📚 Category Collection:');
    const categoryIndexes = await Category.collection.indexes();
    console.log('   Current indexes:', categoryIndexes.map(i => i.name).join(', '));
    
    // Drop old indexes if they exist
    try {
      await Category.collection.dropIndex('displayOrder_1');
      console.log('   ✅ Dropped old "displayOrder_1" index');
    } catch (err) {
      if (err.code === 27) {
        console.log('   ⚠️  "displayOrder_1" index does not exist (already removed)');
      } else {
        throw err;
      }
    }

    try {
      await Category.collection.dropIndex('isActive_1');
      console.log('   ✅ Dropped old "isActive_1" index');
    } catch (err) {
      if (err.code === 27) {
        console.log('   ⚠️  "isActive_1" index does not exist (already removed)');
      } else {
        throw err;
      }
    }

    // Show final indexes
    console.log('\n✅ Final indexes:');
    console.log('   Centers:', (await Center.collection.indexes()).map(i => i.name).join(', '));
    console.log('   Categories:', (await Category.collection.indexes()).map(i => i.name).join(', '));

    console.log('\n✨ Index cleanup complete! You can now create centers and categories.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error cleaning indexes:', error);
    process.exit(1);
  }
}

dropIndexes();
