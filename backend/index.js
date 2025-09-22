import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI')
.then(() => {
  console.log('✅ Connected to MongoDB');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors({
  origin: ["http://localhost:3000", "https://finesight.app",], // allowed frontends
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.options(/.*/, cors());

console.log("using cors now let's see")

app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));


// Auth routes
import authRoutes from './routes/auth/authRoute.js';
app.use('/api/auth', authRoutes);

// File upload route
import fileRoute from './routes/fileRoute.js';
app.use('/api/file', fileRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, '0.0.0.0' , () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

