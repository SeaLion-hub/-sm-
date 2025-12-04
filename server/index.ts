import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync, statSync } from 'fs';
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

// API Routes (프론트엔드 정적 파일 서빙 전에 위치 - 모든 HTTP 메서드 처리)
app.use('/api/auth', authRouter);
app.use('/api/cafeteria', cafeteriaRouter);
app.use('/api/restaurants', restaurantRouter);

// 프론트엔드 정적 파일 서빙 (프로덕션 환경)
if (process.env.NODE_ENV === 'production') {
  // dist 폴더 경로 수정 (server/dist가 아닌 루트의 dist)
  const frontendDistPath = path.join(__dirname, '../dist');
  console.log('Frontend dist path:', frontendDistPath);
  console.log('Dist path exists:', existsSync(frontendDistPath));
  
  // 정적 파일 서빙 (CSS, JS 등) - API 경로는 명시적으로 제외
  const staticMiddleware = express.static(frontendDistPath, {
    maxAge: '1y',
    etag: true,
    setHeaders: (res, filePath) => {
      // CSS 파일의 MIME 타입 명시적 설정
      if (filePath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css; charset=utf-8');
      } else if (filePath.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      }
    },
    index: false
  });
  
  // 정적 파일 서빙 및 SPA 라우팅 - GET 요청만 처리 (API 경로 제외)
  app.get('*', (req, res, next) => {
    // API 라우트는 제외
    if (req.path.startsWith('/api')) {
      return next();
    }
    
    // 정적 파일이 존재하는지 확인
    const filePath = path.join(frontendDistPath, req.path);
    if (existsSync(filePath) && statSync(filePath).isFile()) {
      // 정적 파일 서빙
      return staticMiddleware(req, res, next);
    }
    
    // 파일이 없으면 index.html 반환 (SPA 라우팅)
    const indexPath = path.join(frontendDistPath, 'index.html');
    if (existsSync(indexPath)) {
      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error('Error sending index.html:', err);
          res.status(500).send('Internal Server Error');
        }
      });
    } else {
      console.error('index.html not found at:', indexPath);
      res.status(500).send('Frontend files not found');
    }
  });
  
  // API가 아닌 다른 HTTP 메서드에 대한 404 처리
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.status(404).json({ 
      error: 'Not Found', 
      message: `경로를 찾을 수 없습니다: ${req.method} ${req.path}`
    });
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

