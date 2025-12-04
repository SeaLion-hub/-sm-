import React, { useState, useEffect } from 'react';
import { UserProfile, Gender, Goal, ActivityLevel, Campus } from '../types';
import { X, Activity, Save } from 'lucide-react';
import CampusSelector from './CampusSelector';
import { updateProfile } from '../services/authService';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: Partial<UserProfile>;
  onUpdate: (updatedProfile: Partial<UserProfile>) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, userProfile, onUpdate }) => {
  const [formData, setFormData] = useState<Partial<UserProfile>>(userProfile);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(userProfile);
      setError('');
      setSuccess(false);
    }
  }, [isOpen, userProfile]);

  const handleChange = (field: keyof UserProfile, value: string | number | Campus | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const result = await updateProfile(formData);
      onUpdate(result.user as Partial<UserProfile>);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '프로필 업데이트에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">프로필 수정</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              프로필이 성공적으로 업데이트되었습니다.
            </div>
          )}

          <div className="space-y-6">
            {/* 캠퍼스 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">캠퍼스</label>
              <CampusSelector
                selected={formData.campus || null}
                onSelect={(campus) => handleChange('campus', campus)}
              />
            </div>

            {/* 기본 정보 */}
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
                  type="number"
                  required
                  min="16"
                  max="99"
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
                  type="number"
                  required
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yonsei-blue focus:border-transparent outline-none"
                  value={formData.height || ''}
                  onChange={(e) => handleChange('height', parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">체중 (kg)</label>
                <input
                  type="number"
                  required
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yonsei-blue focus:border-transparent outline-none"
                  value={formData.weight || ''}
                  onChange={(e) => handleChange('weight', parseInt(e.target.value))}
                />
              </div>
            </div>

            {/* 인바디 정보 */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 mb-4 text-yonsei-blue">
                <Activity size={20} />
                <span className="text-base font-bold">인바디 정보 (선택사항)</span>
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
            </div>

            {/* 활동량 */}
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

            {/* 목표 설정 */}
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

            {/* 알레르기 */}
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

            {/* 버튼 */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-yonsei-blue text-white py-3 rounded-xl font-bold hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    저장 중...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    저장
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;

