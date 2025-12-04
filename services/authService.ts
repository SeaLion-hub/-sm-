import { UserProfile } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export interface AuthResponse {
  message: string;
  user: {
    id: number;
    email: string;
    name: string;
    campus: string;
    gender: string;
    age: number;
    height: number;
    weight: number;
    muscleMass?: number;
    bodyFat?: number;
    goal: string;
    activityLevel: string;
    allergies?: string;
  };
  token: string;
}

export interface RegisterData extends Omit<UserProfile, 'name'> {
  email: string;
  password: string;
  name: string;
}

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const url = API_BASE_URL ? `${API_BASE_URL}/api/auth/register` : '/api/auth/register';
  
  try {
    console.log('Attempting register to:', url);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('Register response status:', response.status);

    if (!response.ok) {
      let errorMessage = '회원가입에 실패했습니다.';
      try {
        const error = await response.json();
        errorMessage = error.error || errorMessage;
      } catch {
        errorMessage = `서버 오류 (${response.status}): ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    
    // 토큰 저장
    if (result.token) {
      localStorage.setItem('auth_token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
    }

    return result;
  } catch (error) {
    console.error('Register error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('회원가입 중 네트워크 오류가 발생했습니다. 백엔드 서버가 실행 중인지 확인해주세요.');
  }
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const url = API_BASE_URL ? `${API_BASE_URL}/api/auth/login` : '/api/auth/login';
  
  try {
    console.log('Attempting login to:', url);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    console.log('Login response status:', response.status);

    if (!response.ok) {
      let errorMessage = '로그인에 실패했습니다.';
      try {
        const error = await response.json();
        errorMessage = error.error || errorMessage;
      } catch {
        errorMessage = `서버 오류 (${response.status}): ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    
    // 토큰 저장
    if (result.token) {
      localStorage.setItem('auth_token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
    }

    return result;
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('로그인 중 네트워크 오류가 발생했습니다. 백엔드 서버가 실행 중인지 확인해주세요.');
  }
};

export const logout = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

