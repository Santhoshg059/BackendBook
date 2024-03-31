import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import UserModel from './src/models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // Import jwt library for backend
import Book from './src/models/book.js';
import booksRouter from './src/routes/books.js';
import Review from './src/models/review.js';
import Favorite from './src/models/favourite.js';
import multer from 'multer';
import path from 'path';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use(express.json());

mongoose.connect("mongodb+srv://santhoshg059:admin059@cluster0.uesuzwj.mongodb.net/bookriview");

//JWT Token
const generateToken = (userId, name) => {
    return jwt.sign(
        { userId, name },
        process.env.JWT_SECRET,
        { expiresIn: '1d' } // Set expiry time for 1 day
    );
};

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: 'Forbidden' });
      req.user = user;
      next();
    });
  };

app.get('/', (req, res) => {
    res.send('Welcome to the server!');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(401).json({ error: 'User not found' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ error: 'Incorrect password' });

        // Generate JWT token with user ID and name
        const token = generateToken(user._id, user.name);
        res.json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.post('/user', async (req, res) => {
    const { name, mobileNumber, email, password } = req.body;
    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json("User already exists");
        }
        const newUser = await UserModel.create({ name, mobileNumber, email, password });
        res.json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json("Internal Server Error");
    }
});

app.use('/api/books', booksRouter);
  
app.get('/api/books/:bookId', async (req, res) => {
    const { bookId } = req.params;
    try {
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }
      res.json(book);
    } catch (error) {
      console.error('Error fetching book details:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/reviews', async (req, res) => {
    try {
        const { bookId, rating, comment,username } = req.body;
        
        // Create a new review document
        const newReview = new Review({
            username,
            rating,
            comment,
            bookId,
        });

        // Save the review to the database
        await newReview.save();

        res.status(201).json({ message: 'Review saved successfully' });
    } catch (error) {
        console.error('Error saving review:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/reviews/:bookId', async (req, res) => {
    const { bookId } = req.params;
    try {
        const reviews = await Review.find({ bookId });
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/favorites', async (req, res) => {
    const { userId, bookId } = req.body;
  
    try {
      // Check if the favorite already exists
      const existingFavorite = await Favorite.findOne({ userId, bookId });
  
      if (existingFavorite) {
        return res.status(400).json({ message: 'This book is already in favorites' });
      }
  
      // Create a new favorite
      const newFavorite = new Favorite({ userId, bookId });
      await newFavorite.save();
  
      res.status(201).json({ message: 'Book added to favorites successfully' });
    } catch (error) {
      console.error('Error adding favorite:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  app.get('/api/favorites/:userId/:bookId', async (req, res) => {
    const { userId, bookId } = req.params;

    try {
        const favorite = await Favorite.findOne({ userId, bookId });
        res.json(favorite);
    } catch (error) {
        console.error('Error fetching favorite:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/favorites/:favoriteId', async (req, res) => {
    const { favoriteId } = req.params;

    try {
        await Favorite.findByIdAndDelete(favoriteId);
        res.json({ message: 'Favorite deleted successfully' });
    } catch (error) {
        console.error('Error deleting favorite:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/user/:userId/favorites', async (req, res) => {
    try {
      const favorites = await Favorite.find({ userId: req.params.userId });
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.get('/user/:userId/favorites', async (req, res) => {
    try {
      const userId = req.params.userId;
      const favorites = await Favorite.find({ userId });
      res.json(favorites);
    } catch (error) {
      console.error('Error fetching user favorites:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Route to fetch favorite books by bookIds
  app.post('/books/favorites', async (req, res) => {
    try {
      const bookIds = req.body.bookIds;
      const favoriteBooks = await Book.find({ _id: { $in: bookIds } });
      res.json(favoriteBooks);
    } catch (error) {
      console.error('Error fetching favorite books:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  
  
  // Route to upload profile image
  app.get('/api/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Include profile image path in the response
        const userInfo = {
            name: user.name,
            mobileNumber: user.mobileNumber,
            email: user.email,
            profileImagePath: user.profileImagePath // Add profile image path here
        };

        res.json(userInfo);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
  
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/profile-images'); // Destination directory for profile images
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Unique filename
    }
  });
  
  // Initialize multer with storage options
  const upload = multer({ storage: storage });
  
  // Route to handle profile image upload
  app.post('/api/user/:userId/profile-image', upload.single('image'), async (req, res) => {
    const { userId } = req.params;
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
      }
  
      const imagePath = req.file.path;
  
      // Update the user's profile image path in the database
      await UserModel.findByIdAndUpdate(userId, { profileImagePath: imagePath });
  
      res.json({ profileImagePath: imagePath });
    } catch (error) {
      console.error('Error uploading profile image:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
app.listen(PORT, () => console.log(`App listening to ${PORT}`));
