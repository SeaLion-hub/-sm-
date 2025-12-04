import React, { useState } from 'react';
import { UserProfile, Gender, Goal, ActivityLevel } from '../types';
import { ChevronRight } from 'lucide-react';

interface OnboardingFormProps {
  initialData: Partial<UserProfile>;
  onSubmit: (data: Partial<UserProfile>) => void;
}

const OnboardingForm: React.FC<OnboardingFormProps> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<UserProfile>>(initialData);

  const handleChange = (field: keyof UserProfile, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">기본 정보 입력</h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">성별</label>
                <select 
                    required
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yonsei-blue focus:border-transparent outline-none"
                    value={formData.gender || ''}
                    onChange={(e) => handleChange('gender', e.target.value as Gender)}
                >
                    <option value="" disabled>선택</option>
                    {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">나이 (만)</label>
                <input 
                    type="number" required min="16" max="99"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yonsei-blue focus:border-transparent outline-none"
                    value={formData.age || ''}
                    onChange={(e) => handleChange('age', parseInt(e.target.value))}
                />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">신장 (cm)</label>
            <input 
              type="number" required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yonsei-blue focus:border-transparent outline-none"
              value={formData.height || ''}
              onChange={(e) => handleChange('height', parseInt(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">체중 (kg)</label>
            <input 
              type="number" required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yonsei-blue focus:border-transparent outline-none"
              value={formData.weight || ''}
              onChange={(e) => handleChange('weight', parseInt(e.target.value))}
            />
          </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">평소 활동량</label>
            <select 
                required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yonsei-blue focus:border-transparent outline-none text-sm"
                value={formData.activityLevel || ''}
                onChange={(e) => handleChange('activityLevel', e.target.value as ActivityLevel)}
            >
                <option value="" disabled>활동량을 선택하세요</option>
                {Object.values(ActivityLevel).map(a => <option key={a} value={a}>{a}</option>)}
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

        <button 
            type="submit"
            className="w-full bg-yonsei-blue text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-900 transition-colors flex items-center justify-center gap-2"
        >
            맞춤 식단 생성하기 <ChevronRight size={20} />
        </button>
      </div>
    </form>
  );
};

export default OnboardingForm;