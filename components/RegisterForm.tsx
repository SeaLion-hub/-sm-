import React, { useState } from 'react';
import { UserProfile, Gender, Goal, ActivityLevel, Campus } from '../types';
import { UserPlus, Activity } from 'lucide-react';

interface RegisterData extends Omit<UserProfile, 'name'> {
  email: string;
  password: string;
  name: string;
}

interface RegisterFormProps {
  onRegister: (data: RegisterData) => Promise<void>;
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState<RegisterData & { confirmPassword: string }>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    campus: Campus.SINCHON,
    gender: Gender.MALE,
    age: 20,
    height: 170,
    weight: 70,
    goal: Goal.MAINTAIN,
    activityLevel: ActivityLevel.MODERATE,
    allergies: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof typeof formData, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 비밀번호 확인
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (formData.password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await onRegister(registerData as RegisterData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-center mb-6">
        <div className="w-12 h-12 bg-yonsei-blue rounded-full flex items-center justify-center">
          <UserPlus className="text-white" size={24} />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">회원가입</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {/* 계정 정보 */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">계정 정보</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
              <input
                type="email"
                required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yonsei-blue focus:border-transparent outline-none"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="example@yonsei.ac.kr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
              <input
                type="password"
                required
                minLength={6}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yonsei-blue focus:border-transparent outline-none"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="최소 6자 이상"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
              <input
                type="password"
                required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yonsei-blue focus:border-transparent outline-none"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                placeholder="비밀번호를 다시 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <input
                type="text"
                required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yonsei-blue focus:border-transparent outline-none"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="이름을 입력하세요"
              />
            </div>
          </div>
        </div>

        {/* 기본 정보 */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">기본 정보</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">캠퍼스</label>
              <select
                required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yonsei-blue focus:border-transparent outline-none"
                value={formData.campus}
                onChange={(e) => handleChange('campus', e.target.value as Campus)}
              >
                {Object.values(Campus).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">성별</label>
                <select
                  required
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yonsei-blue focus:border-transparent outline-none"
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value as Gender)}
                >
                  {Object.values(Gender).map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">나이 (만)</label>
                <input
                  type="number"
                  required
                  min="16"
                  max="99"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yonsei-blue focus:border-transparent outline-none"
                  value={formData.age}
                  onChange={(e) => handleChange('age', parseInt(e.target.value))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">신장 (cm)</label>
                <input
                  type="number"
                  required
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yonsei-blue focus:border-transparent outline-none"
                  value={formData.height}
                  onChange={(e) => handleChange('height', parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">체중 (kg)</label>
                <input
                  type="number"
                  required
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yonsei-blue focus:border-transparent outline-none"
                  value={formData.weight}
                  onChange={(e) => handleChange('weight', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 인바디 정보 */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <div className="flex items-center gap-2 mb-3 text-yonsei-blue">
            <Activity size={18} />
            <span className="text-sm font-bold">인바디 정보 (선택사항)</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">골격근량 (kg)</label>
              <input
                type="number"
                placeholder="예: 30"
                className="w-full p-2 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-yonsei-blue outline-none text-sm"
                value={formData.muscleMass || ''}
                onChange={(e) => handleChange('muscleMass', e.target.value ? parseFloat(e.target.value) : undefined)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">체지방률 (%)</label>
              <input
                type="number"
                placeholder="예: 15"
                className="w-full p-2 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-yonsei-blue outline-none text-sm"
                value={formData.bodyFat || ''}
                onChange={(e) => handleChange('bodyFat', e.target.value ? parseFloat(e.target.value) : undefined)}
              />
            </div>
          </div>
        </div>

        {/* 목표 및 활동량 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">평소 활동량</label>
            <select
              required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yonsei-blue focus:border-transparent outline-none text-sm"
              value={formData.activityLevel}
              onChange={(e) => handleChange('activityLevel', e.target.value as ActivityLevel)}
            >
              {Object.values(ActivityLevel).map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">목표 설정</label>
            <div className="grid grid-cols-1 gap-2">
              {Object.values(Goal).map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => handleChange('goal', g)}
                  className={`p-3 rounded-lg text-sm font-medium border transition-colors text-left ${
                    formData.goal === g
                      ? 'bg-yonsei-blue text-white border-yonsei-blue'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">알레르기 / 기피 음식 (선택)</label>
            <input
              type="text"
              placeholder="예: 오이, 땅콩, 매운 음식"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yonsei-blue focus:border-transparent outline-none"
              value={formData.allergies || ''}
              onChange={(e) => handleChange('allergies', e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yonsei-blue text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '회원가입 중...' : '회원가입'}
        </button>

        <div className="text-center text-sm text-gray-600">
          이미 계정이 있으신가요?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-yonsei-blue hover:underline font-medium"
          >
            로그인
          </button>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;

