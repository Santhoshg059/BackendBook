// backend/routes/books.js

import express from 'express';
import multer from 'multer';
import Book from '../models/book.js';
import path from 'path';

const router = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Specify upload directory
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Generate unique filename
    }
  });
  
  // Initialize multer with storage options
  const upload = multer({ storage: storage });// Initialize multer without options

// Route to add a new book with image upload
router.post('/', upload.single('image'), async (req, res) => {
    try {
      const { title, author, genre, description } = req.body;
      const imagePath = req.file.path; // Get file path
      const newBook = new Book({ title, author, genre, description, imagePath });
      await newBook.save();
      res.status(201).json(newBook);
    } catch (error) {
      console.error('Error adding book:', error);
      res.status(500).json({ error: 'Error adding book' });
    }
  });

// Route to fetch all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Error fetching books' });
  }
});





export default router;
