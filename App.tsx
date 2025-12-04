import React, { useState, useCallback, useEffect } from 'react';
import { UserProfile, DailyPlan } from './types';
import { generateYonseiMealPlan } from './services/geminiService';
import { login, register, getCurrentUser, logout, isAuthenticated } from './services/authService';
import CampusSelector from './components/CampusSelector';
import OnboardingForm from './components/OnboardingForm';
import PlanDisplay from './components/PlanDisplay';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import { Sparkles, LogOut, User } from 'lucide-react';

const App: React.FC = () => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [step, setStep] = useState<number>(1);
  const [userProfile, setUserProfile] = useState<Partial<UserProfile>>({});
  const [mealPlan, setMealPlan] = useState<DailyPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // 앱 시작 시 인증 상태 확인
  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        const user = getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setIsAuth(true);
          // 사용자 정보를 userProfile로 변환
          setUserProfile({
            name: user.name,
            campus: user.campus,
            gender: user.gender,
            age: user.age,
            height: user.height,
            weight: user.weight,
            muscleMass: user.muscleMass,
            bodyFat: user.bodyFat,
            goal: user.goal,
            activityLevel: user.activityLevel,
            allergies: user.allergies
          });
          setStep(1); // 캠퍼스 선택 단계로
        }
      }
    };
    checkAuth();
  }, []);

  const handleCampusSelect = (campus: any) => {
    setUserProfile(prev => ({ ...prev, campus }));
    setStep(2);
  };

  const handleProfileSubmit = async (data: Partial<UserProfile>) => {
    const fullProfile = { ...userProfile, ...data } as UserProfile;
    setUserProfile(fullProfile);
    await generatePlan(fullProfile, selectedDate);
  };

  const generatePlan = useCallback(async (profile: UserProfile, date?: string) => {
    setLoading(true);
    const targetDate = date || selectedDate;
    const plan = await generateYonseiMealPlan(profile, targetDate);
    setMealPlan(plan);
    setLoading(false);
    setStep(3);
  }, [selectedDate]);

  const handleRegenerate = () => {
    if (userProfile.campus) {
      generatePlan(userProfile as UserProfile, selectedDate);
    }
  };

  const handleDateChange = async (newDate: string) => {
    setSelectedDate(newDate);
    if (userProfile.campus && Object.keys(userProfile).length > 1) {
      await generatePlan(userProfile as UserProfile, newDate);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password);
    setCurrentUser(result.user);
    setIsAuth(true);
    // 사용자 정보를 userProfile로 변환
    setUserProfile({
      name: result.user.name,
      campus: result.user.campus,
      gender: result.user.gender,
      age: result.user.age,
      height: result.user.height,
      weight: result.user.weight,
      muscleMass: result.user.muscleMass,
      bodyFat: result.user.bodyFat,
      goal: result.user.goal,
      activityLevel: result.user.activityLevel,
      allergies: result.user.allergies
    });
    setStep(1);
  };

  const handleRegister = async (data: any) => {
    const result = await register(data);
    setCurrentUser(result.user);
    setIsAuth(true);
    // 사용자 정보를 userProfile로 변환
    setUserProfile({
      name: result.user.name,
      campus: result.user.campus,
      gender: result.user.gender,
      age: result.user.age,
      height: result.user.height,
      weight: result.user.weight,
      muscleMass: result.user.muscleMass,
      bodyFat: result.user.bodyFat,
      goal: result.user.goal,
      activityLevel: result.user.activityLevel,
      allergies: result.user.allergies
    });
    setStep(1);
  };

  const handleLogout = () => {
    logout();
    setIsAuth(false);
    setCurrentUser(null);
    setUserProfile({});
    setMealPlan(null);
    setStep(1);
    setShowLogin(true);
  };

  // 인증되지 않은 경우 로그인/회원가입 화면 표시
  if (!isAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-yonsei-blue rounded flex items-center justify-center text-white font-bold font-serif">Y</div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">Y-Nutri</span>
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 py-10 flex items-center justify-center">
          <div className="w-full max-w-lg">
            {showLogin ? (
              <LoginForm 
                onLogin={handleLogin} 
                onSwitchToRegister={() => setShowLogin(false)} 
              />
            ) : (
              <RegisterForm 
                onRegister={handleRegister} 
                onSwitchToLogin={() => setShowLogin(true)} 
              />
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yonsei-blue rounded flex items-center justify-center text-white font-bold font-serif">Y</div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Y-Nutri</span>
          </div>
          <div className="flex items-center gap-4">
            {currentUser && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User size={16} />
                <span>{currentUser.name}님</span>
              </div>
            )}
            {step === 3 && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-yonsei-blue font-bold text-xs">
                  {userProfile.campus?.includes('송도') ? '송도' : '신촌'}
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-yonsei-blue transition-colors"
            >
              <LogOut size={16} />
              <span>로그아웃</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-10">
        <div className="max-w-5xl mx-auto">
          
          {step === 1 && (
            <div className="flex flex-col items-center animate-in slide-in-from-bottom-5 duration-500">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-4 break-keep">
                소속 캠퍼스를 선택해주세요
              </h1>
              <p className="text-gray-500 text-center mb-10 max-w-lg break-keep">
                선택하신 캠퍼스의 학식과 근처 맛집 정보를 바탕으로<br/>최적의 맞춤 식단을 제공합니다.
              </p>
              <CampusSelector selected={userProfile.campus || null} onSelect={handleCampusSelect} />
            </div>
          )}

          {step === 2 && (
            <div className="animate-in slide-in-from-right-5 duration-500">
                <div className="mb-6">
                    <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-yonsei-blue">
                        ← 캠퍼스 다시 선택하기
                    </button>
                </div>
                {loading ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-blue-100 border-t-yonsei-blue rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles size={20} className="text-yonsei-blue" />
                            </div>
                        </div>
                        <h2 className="mt-6 text-xl font-bold text-gray-800">맞춤 식단 생성 중</h2>
                        <p className="text-gray-500 mt-2">
                            {userProfile.campus?.includes('송도') ? '송도' : '신촌'} 캠퍼스 근처 메뉴를 분석하고 있습니다...
                        </p>
                    </div>
                ) : (
                    <OnboardingForm initialData={userProfile} onSubmit={handleProfileSubmit} />
                )}
            </div>
          )}

          {step === 3 && mealPlan && (
            <div className="animate-in fade-in duration-700">
               <div className="mb-6 flex justify-between items-center">
                    <button onClick={() => setStep(2)} className="text-sm text-gray-500 hover:text-yonsei-blue">
                        ← 정보 수정하기
                    </button>
                </div>
              <PlanDisplay 
                plan={mealPlan} 
                onRegenerate={handleRegenerate} 
                loading={loading}
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
                campus={userProfile.campus}
              />
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8 text-center text-gray-400 text-sm">
        <p>© 2024 Y-Nutri. Designed for Yonsei Students.</p>
        <p className="mt-2 text-xs">Powered by Google Gemini 2.5 Flash</p>
      </footer>
    </div>
  );
};

export default App;