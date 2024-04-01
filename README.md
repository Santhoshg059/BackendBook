# BookHub Backend

Welcome to the backend repository of BookHub - a book review application.

## Prerequisites

Make sure you have Node.js and npm installed on your machine.

## Installation

Clone the repository:

```bash
git clone https://github.com/your-username/bookhub-backend.git
Configuration
Copy .env.example to .env and configure the environment variables such as database connection URL, JWT secret, etc.

Database Setup
Make sure you have MongoDB installed and running on your machine or use a cloud-hosted MongoDB service.
Update the database connection URL in the .env file.

Start the backend server:npm start

API Endpoints
POST /api/auth/register: Register a new user.
POST /api/auth/login: User login.
GET /api/books: Get a list of books.
GET /api/books/:id: Get details of a specific book.
POST /api/books/:id/reviews: Add a review to a book.
POST /api/books/:id/ratings: Add a rating to a book.
POST /api/user/profile/avatar: Upload a profile image.
GET /api/user/profile: Get user profile information.

Authentication
This backend uses JWT (JSON Web Tokens) for authentication. Make sure to include the JWT token in the request headers for protected routes.
