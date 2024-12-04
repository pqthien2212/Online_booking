import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './backend/routes/auth.route.js';
import tourRoutes from './backend/routes/tour.route.js';
import reviewRoutes from './backend/routes/review.route.js';
import userRoutes from './backend/routes/user.route.js';

dotenv.config();

const app = express();

// Cấu hình CORS: nên có điều kiện cụ thể cho origin trong môi trường sản xuất
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*', // Có thể đặt môi trường cho CORS origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: false,
  })
);

// Middleware phân tích JSON (sử dụng express built-in)
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
