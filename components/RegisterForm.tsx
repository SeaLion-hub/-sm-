import React, { useState } from 'react';
import { UserProfile, Gender, Goal, ActivityLevel, Campus } from '../types';
import { UserPlus, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';

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
  const [currentStep, setCurrentStep] = useState<number>(1);
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
    setError('');
  };

  const validateStep = (step: number): boolean => {
    setError('');
    
    if (step === 1) {
      if (!formData.email || !formData.password || !formData.confirmPassword || !formData.name) {
        setError('모든 필드를 입력해주세요.');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('비밀번호가 일치하지 않습니다.');
        return false;
      }
      if (formData.password.length < 6) {
        setError('비밀번호는 최소 6자 이상이어야 합니다.');
        return false;
      }
      if (!formData.email.includes('@')) {
        setError('올바른 이메일 형식을 입력해주세요.');
        return false;
      }
    } else if (step === 2) {
      if (!formData.campus || !formData.gender || !formData.age || !formData.height || !formData.weight) {
        setError('모든 필수 필드를 입력해주세요.');
        return false;
      }
      if (formData.age < 16 || formData.age > 99) {
        setError('나이는 16세 이상 99세 이하여야 합니다.');
        return false;
      }
    }
    
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateStep(3)) {
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

  const steps = [
    { number: 1, title: '계정 정보', description: '이메일과 비밀번호를 설정하세요' },
    { number: 2, title: '기본 정보', description: '신체 정보를 입력하세요' },
    { number: 3, title: '목표 설정', description: '운동 목표를 선택하세요' }
  ];

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
      <div className="flex items-center justify-center mb-6">
        <div className="w-12 h-12 bg-yonsei-blue rounded-full flex items-center justify-center">
          <UserPlus className="text-white" size={24} />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 text-center transition-colors duration-300">회원가입</h2>
      
      {/* 진행률 표시기 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    currentStep > step.number
                      ? 'bg-yonsei-blue text-white'
                      : currentStep === step.number
                      ? 'bg-yonsei-blue text-white ring-4 ring-yonsei-blue/20'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {currentStep > step.number ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    step.number
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div className={`text-xs font-semibold transition-colors duration-300 ${currentStep >= step.number ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500'}`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 hidden sm:block transition-colors duration-300">
                    {step.description}
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 transition-all ${
                    currentStep > step.number ? 'bg-yonsei-blue' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm transition-colors duration-300">
          {error}
        </div>
      )}

      {/* 스텝 1: 계정 정보 */}
      {currentStep === 1 && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">이메일</label>
            <input
              type="email"
              required
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yonsei-blue focus:border-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-300"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="example@yonsei.ac.kr"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">비밀번호</label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yonsei-blue focus:border-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-300"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="최소 6자 이상"
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">비밀번호 확인</label>
            <input
              type="password"
              required
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yonsei-blue focus:border-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-300"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">이름</label>
            <input
              type="text"
              required
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yonsei-blue focus:border-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-300"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="이름을 입력하세요"
              autoComplete="name"
            />
          </div>
        </div>
      )}

      {/* 스텝 2: 기본 정보 */}
      {currentStep === 2 && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">캠퍼스</label>
            <select
              required
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yonsei-blue focus:border-transparent outline-none text-gray-900 dark:text-white transition-colors duration-300"
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">성별</label>
              <select
                required
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yonsei-blue focus:border-transparent outline-none text-gray-900 dark:text-white transition-colors duration-300"
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value as Gender)}
              >
                {Object.values(Gender).map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">나이 (만)</label>
              <input
                type="number"
                required
                min="16"
                max="99"
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yonsei-blue focus:border-transparent outline-none text-gray-900 dark:text-white transition-colors duration-300"
                value={formData.age}
                onChange={(e) => handleChange('age', parseInt(e.target.value))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">신장 (cm)</label>
              <input
                type="number"
                required
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yonsei-blue focus:border-transparent outline-none text-gray-900 dark:text-white transition-colors duration-300"
                value={formData.height}
                onChange={(e) => handleChange('height', parseInt(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">체중 (kg)</label>
              <input
                type="number"
                required
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yonsei-blue focus:border-transparent outline-none text-gray-900 dark:text-white transition-colors duration-300"
                value={formData.weight}
                onChange={(e) => handleChange('weight', parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>
      )}

      {/* 스텝 3: 목표 설정 */}
      {currentStep === 3 && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">평소 활동량</label>
            <select
              required
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yonsei-blue focus:border-transparent outline-none text-sm text-gray-900 dark:text-white transition-colors duration-300"
              value={formData.activityLevel}
              onChange={(e) => handleChange('activityLevel', e.target.value as ActivityLevel)}
            >
              {Object.values(ActivityLevel).map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">목표 설정</label>
            <div className="grid grid-cols-1 gap-2">
              {Object.values(Goal).map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => handleChange('goal', g)}
                  className={`p-3 rounded-lg text-sm font-medium border transition-colors text-left ${
                    formData.goal === g
                      ? 'bg-yonsei-blue text-white border-yonsei-blue'
                      : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">알레르기 / 기피 음식 (선택)</label>
            <input
              type="text"
              placeholder="예: 오이, 땅콩, 매운 음식"
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yonsei-blue focus:border-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-300"
              value={formData.allergies || ''}
              onChange={(e) => handleChange('allergies', e.target.value)}
            />
          </div>
        </div>
      )}

      {/* 네비게이션 버튼 */}
      <div className="mt-8 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
        >
          <ChevronLeft size={18} />
          <span>이전</span>
        </button>

        {currentStep < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2 bg-yonsei-blue text-white rounded-lg font-medium hover:bg-blue-900 dark:hover:bg-blue-800 transition-colors duration-300"
          >
            <span>다음</span>
            <ChevronRight size={18} />
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-yonsei-blue text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-900 dark:hover:bg-blue-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '회원가입 중...' : '회원가입 완료'}
          </button>
        )}
      </div>

      <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6 transition-colors duration-300">
        이미 계정이 있으신가요?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-yonsei-blue dark:text-blue-400 hover:underline font-medium transition-colors duration-300"
        >
          로그인
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
