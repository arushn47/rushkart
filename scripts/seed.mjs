// scripts/seed.mjs

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js'; 
import path from 'path';
import { fileURLToPath } from 'url';

// This creates a reliable path to your project's root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// This loads the .env.local file from the project root
dotenv.config({ path: path.resolve(projectRoot, '.env') });

// Your Seller ID
const SELLER_ID = '6897bcebcb8b4848936c9b33'; 

const mockProducts = [
  { name: 'Aura Smartwatch', category: 'Tech', price: 3499, rating: 5, imageUrl: 'https://images.unsplash.com/photo-1519315910113-861dcfbfb9cf?q=80&w=1288&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', description: 'The future on your wrist. Track, connect, and explore.', stock: 50, seller: SELLER_ID },
  { name: 'Nebula Sound System', category: 'Audio', price: 7999, rating: 5, imageUrl: 'https://images.unsplash.com/photo-1655831068474-00da7930d340?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', description: 'Immersive 360° audio that fills any room.', stock: 25, seller: SELLER_ID },
  { name: 'Zenith Minimalist Lamp', category: 'Lifestyle', price: 1299, rating: 4, imageUrl: 'https://images.unsplash.com/photo-1570974802254-4b0ad1a755f5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', description: 'Elegant design meets warm, ambient light.', stock: 100, seller: SELLER_ID },
  { name: 'Comfort Office Chair', category: 'Furniture', price: 8999, rating: 5, imageUrl: 'https://images.unsplash.com/photo-1670946839270-cc4febd43b09?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', description: 'Dynamic support for all-day comfort and focus.', stock: 30, seller: SELLER_ID },
  { name: 'Wireless Mechanical Keyboard', category: 'Tech', price: 2799, rating: 4, imageUrl: 'https://images.unsplash.com/photo-1659215609160-fd5afc42b8ed?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', description: 'Mechanical precision for the ultimate typing experience.', stock: 75, seller: SELLER_ID },
  { name: 'Everyday Backpack', category: 'Lifestyle', price: 1899, rating: 5, imageUrl: 'https://images.unsplash.com/photo-1702906221006-97bc40420704?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', description: 'Durable, sustainable, and ready for any adventure.', stock: 60, seller: SELLER_ID },
];

const seedDatabase = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined. Check your .env.local file and path in script.");
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Database connected');

    await Product.deleteMany({ seller: SELLER_ID });
    console.log('🗑️  Cleared existing products for this seller.');

    await Product.insertMany(mockProducts);
    console.log(`🌱 Seeded ${mockProducts.length} products successfully.`);

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Database disconnected.');
  }
};

seedDatabase();
