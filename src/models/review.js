// backend/models/book.js

import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    username: String,
    rating: Number,
    comment: String,
    bookId: String,
  });
  
  // Define review model
  const Review = mongoose.model('Review', reviewSchema);

export default Review;
