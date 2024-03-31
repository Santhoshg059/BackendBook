// backend/models/book.js

import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  description: String,
  imagePath: String
});

const Book = mongoose.model('Book', bookSchema);

export default Book;
