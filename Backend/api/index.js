import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.get('/', (req, res) => {
  res.send('Welcome to the Resume Optimiser Backend!');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(4000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.log(err));
