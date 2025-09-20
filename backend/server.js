import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mentorRoutes from './routes/mentor.js';
import authRoutes from './routes/auth_linkedin.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/mentor', mentorRoutes);
app.use('/auth/linkedin', authRoutes);
app.use(express.static('public'));

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/udaanair';
mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('Mongo connected'))
  .catch(e=> console.error('Mongo connection error', e));

const PORT = process.env.PORT || 5004;
app.listen(PORT, ()=> console.log(`🚀 UdaanAI backend running on ${PORT}`));
