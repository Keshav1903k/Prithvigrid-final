import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB, isMongoDBConnected } from './config/db.js';
import { seedData } from './seed.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import estimateRoutes from './routes/estimateRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health & Status
app.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    project: 'PrithviGrid Construction & Luxury Architecture Platform',
    version: '1.0.0',
    storageMode: isMongoDBConnected() ? 'MongoDB (Mongoose)' : 'Local FileStore (Auto-fallback)',
    endpoints: {
      auth: '/api/auth',
      inquiries: '/api/inquiries',
      projects: '/api/projects',
      blogs: '/api/blogs',
      services: '/api/services',
      testimonials: '/api/testimonials',
      estimates: '/api/estimates',
      health: '/api/health',
    },
  });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: isMongoDBConnected() ? 'connected (MongoDB)' : 'fallback (Local JSON Store)',
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/estimates', estimateRoutes);

// 404 Route handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Resource or API endpoint not found' });
});

// Global error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[ServerError]', err);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Connect to DB and Start Server
const startServer = async () => {
  try {
    await connectDB();
    await seedData();

    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 PrithviGrid Full-Stack Backend running on PORT ${PORT}`);
      console.log(`📡 REST API Base: http://localhost:${PORT}/api`);
      console.log(`🛡️ Default Admin: admin@prithvigrid.com | Admin@12345`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

