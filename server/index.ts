import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './db/database.js';
import { cafeteriaRouter } from './routes/cafeteria.js';
import { restaurantRouter } from './routes/restaurant.js';
import { authRouter } from './routes/auth.js';

dotenv.config();

// 데이터베이스 초기화
initDatabase();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());

// 요청 로깅 (디버깅용)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Y-Nutri server is running' });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/cafeteria', cafeteriaRouter);
app.use('/api/restaurants', restaurantRouter);

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found', 
    message: `경로를 찾을 수 없습니다: ${req.method} ${req.path}`,
    availableRoutes: ['/health', '/api/auth', '/api/cafeteria', '/api/restaurants']
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

