import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ChevronRight, Activity } from 'lucide-react';

interface BodyCompositionFormProps {
  initialData: Partial<UserProfile>;
  onSubmit: (data: Partial<UserProfile>) => void;
  onBack: () => void;
}

const BodyCompositionForm: React.FC<BodyCompositionFormProps> = ({ initialData, onSubmit, onBack }) => {
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    muscleMass: initialData.muscleMass,
    bodyFat: initialData.bodyFat
  });

  const handleChange = (field: keyof UserProfile, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">인바디 정보 입력</h2>
      <p className="text-sm text-gray-500 text-center mb-6">더 정확한 식단 추천을 위해 인바디 정보를 입력해주세요 (선택사항)</p>
      
      <div className="space-y-6">
        {/* InBody Section */}
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 mb-4 text-yonsei-blue">
                <Activity size={20} />
                <span className="text-base font-bold">인바디 정보</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">골격근량 (kg)</label>
                    <input 
                        type="number" 
                        step="0.1"
                        placeholder="예: 30.5"
                        className="w-full p-3 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-yonsei-blue outline-none"
                        value={formData.muscleMass || ''}
                        onChange={(e) => handleChange('muscleMass', e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">체지방률 (%)</label>
                    <input 
                        type="number" 
                        step="0.1"
                        placeholder="예: 15.3"
                        className="w-full p-3 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-yonsei-blue outline-none"
                        value={formData.bodyFat || ''}
                        onChange={(e) => handleChange('bodyFat', e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              인바디 측정 결과가 없으시면 건너뛰셔도 됩니다.
            </p>
        </div>

        <div className="flex gap-3">
          <button 
            type="button"
            onClick={onBack}
            className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-colors"
          >
            ← 이전
          </button>
          <button 
            type="submit"
            className="flex-1 bg-yonsei-blue text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-900 transition-colors flex items-center justify-center gap-2"
          >
            맞춤 식단 생성하기 <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </form>
  );
};

export default BodyCompositionForm;

