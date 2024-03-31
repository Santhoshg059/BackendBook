// backend/models/book.js

import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
    userId: String,
    bookId: String,
  });
  
  
  
  const Favorite = mongoose.model('Favorite', favoriteSchema);
export default Favorite;
