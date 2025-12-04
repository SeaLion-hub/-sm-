import React, { useState } from 'react';
import { LogIn } from 'lucide-react';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-center mb-6">
        <div className="w-12 h-12 bg-yonsei-blue rounded-full flex items-center justify-center">
          <LogIn className="text-white" size={24} />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">로그인</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
          <input
            type="email"
            required
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yonsei-blue focus:border-transparent outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@yonsei.ac.kr"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
          <input
            type="password"
            required
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yonsei-blue focus:border-transparent outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yonsei-blue text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>

        <div className="text-center text-sm text-gray-600">
          계정이 없으신가요?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-yonsei-blue hover:underline font-medium"
          >
            회원가입
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;

