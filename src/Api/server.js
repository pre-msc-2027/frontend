import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import authService from './route/authRoutes.js';

dotenv.config();
const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  }));
const PORT = process.env.PORT;

app.use('/auth', authService);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});