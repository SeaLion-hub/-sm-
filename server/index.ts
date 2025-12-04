import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase } from './db/database.js';
import { cafeteriaRouter } from './routes/cafeteria.js';
import { restaurantRouter } from './routes/restaurant.js';
import { authRouter } from './routes/auth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 데이터베이스 초기화
initDatabase();

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// Middleware
const corsOrigins: string[] = [
  'http://localhost:3000', 
  'http://127.0.0.1:3000'
];
if (process.env.FRONTEND_URL) {
  corsOrigins.push(process.env.FRONTEND_URL);
}
if (process.env.RAILWAY_PUBLIC_DOMAIN) {
  corsOrigins.push(`https://${process.env.RAILWAY_PUBLIC_DOMAIN}`);
}

app.use(cors({
  origin: corsOrigins,
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

// API Routes (프론트엔드 정적 파일 서빙 전에 위치)
app.use('/api/auth', authRouter);
app.use('/api/cafeteria', cafeteriaRouter);
app.use('/api/restaurants', restaurantRouter);

// 프론트엔드 정적 파일 서빙 (프로덕션 환경)
if (process.env.NODE_ENV === 'production') {
  const frontendDistPath = path.join(__dirname, '../../dist');
  app.use(express.static(frontendDistPath));
  
  // 모든 라우트를 index.html로 리다이렉트 (SPA 라우팅 지원)
  app.get('*', (req, res) => {
    // API 라우트는 제외
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ 
        error: 'Not Found', 
        message: `경로를 찾을 수 없습니다: ${req.method} ${req.path}`,
        availableRoutes: ['/health', '/api/auth', '/api/cafeteria', '/api/restaurants']
      });
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  // 개발 환경 404 핸들러
  app.use((req, res) => {
    res.status(404).json({ 
      error: 'Not Found', 
      message: `경로를 찾을 수 없습니다: ${req.method} ${req.path}`,
      availableRoutes: ['/health', '/api/auth', '/api/cafeteria', '/api/restaurants']
    });
  });
}

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  if (process.env.NODE_ENV === 'production') {
    console.log('Production mode: Serving frontend static files');
  }
});

