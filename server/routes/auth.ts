import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import { Campus, Gender, Goal, ActivityLevel } from '../types.js';

// Campus, Gender, Goal, ActivityLevel enum 값 검증 함수
const isValidCampus = (value: string): value is Campus => {
  return Object.values(Campus).includes(value as Campus);
};

const isValidGender = (value: string): value is Gender => {
  return Object.values(Gender).includes(value as Gender);
};

const isValidGoal = (value: string): value is Goal => {
  return Object.values(Goal).includes(value as Goal);
};

const isValidActivityLevel = (value: string): value is ActivityLevel => {
  return Object.values(ActivityLevel).includes(value as ActivityLevel);
};

export const authRouter = express.Router();

// 회원가입
authRouter.post('/register', async (req, res) => {
  try {
    const {
      email,
      password,
      name,
      campus,
      gender,
      age,
      height,
      weight,
      muscleMass,
      bodyFat,
      goal,
      activityLevel,
      allergies
    } = req.body;

    // 유효성 검사
    if (!email || !password || !name || !campus || !gender || !age || !height || !weight || !goal || !activityLevel) {
      return res.status(400).json({ 
        error: '필수 필드가 누락되었습니다.',
        required: ['email', 'password', 'name', 'campus', 'gender', 'age', 'height', 'weight', 'goal', 'activityLevel']
      });
    }

    // Enum 값 검증
    if (!isValidCampus(campus)) {
      return res.status(400).json({ error: '유효하지 않은 캠퍼스 값입니다.' });
    }
    if (!isValidGender(gender)) {
      return res.status(400).json({ error: '유효하지 않은 성별 값입니다.' });
    }
    if (!isValidGoal(goal)) {
      return res.status(400).json({ error: '유효하지 않은 목표 값입니다.' });
    }
    if (!isValidActivityLevel(activityLevel)) {
      return res.status(400).json({ error: '유효하지 않은 활동량 값입니다.' });
    }

    // 이메일 중복 확인
    const existingUser = User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: '이미 등록된 이메일입니다.' });
    }

    // 사용자 생성
    const user = await User.create({
      email: email.trim(),
      password,
      name: name.trim(),
      campus,
      gender,
      age: parseInt(age),
      height: parseFloat(height),
      weight: parseFloat(weight),
      muscleMass: muscleMass ? parseFloat(muscleMass) : undefined,
      bodyFat: bodyFat ? parseFloat(bodyFat) : undefined,
      goal,
      activityLevel,
      allergies: allergies ? allergies.trim() : undefined
    });

    // JWT 토큰 생성
    const token = generateToken(user.id);

    res.status(201).json({
      message: '회원가입이 완료되었습니다.',
      user,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: '회원가입 중 오류가 발생했습니다.',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// 로그인
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: '이메일과 비밀번호를 입력해주세요.' });
    }

    const user = await User.verifyPassword(email, password);
    if (!user) {
      return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    const token = generateToken(user.id);

    res.json({
      message: '로그인 성공',
      user,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: '로그인 중 오류가 발생했습니다.',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// 현재 사용자 정보 조회
authRouter.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
      const user = User.findById(decoded.userId);
      
      if (!user) {
        return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
      }

      res.json({ user });
    } catch (error) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      error: '사용자 정보 조회 중 오류가 발생했습니다.',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

