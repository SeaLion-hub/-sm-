import React, { useState, useCallback, useEffect } from 'react';
import { UserProfile, DailyPlan, Campus, Gender, Goal, ActivityLevel } from './types';
import { generateYonseiMealPlan } from './services/geminiService';
import { login, register, getCurrentUser, logout, isAuthenticated } from './services/authService';
import CampusSelector from './components/CampusSelector';
import OnboardingForm from './components/OnboardingForm';
import BodyCompositionForm from './components/BodyCompositionForm';
import PlanDisplay from './components/PlanDisplay';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import LandingPage from './components/LandingPage';
import ProfileModal from './components/ProfileModal';
import MealPlanSkeleton from './components/MealPlanSkeleton';
import { Sparkles, LogOut, User, Settings, Moon, Sun } from 'lucide-react';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const AppContent: React.FC = () => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [showLanding, setShowLanding] = useState<boolean>(true);
  const [showLogin, setShowLogin] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [step, setStep] = useState<number>(1);
  const [userProfile, setUserProfile] = useState<Partial<UserProfile>>({});
  const [mealPlan, setMealPlan] = useState<DailyPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const { theme, toggleTheme } = useTheme();

  // 사용자 정보가 완전한지 확인하는 헬퍼 함수
  const isProfileComplete = (profile: Partial<UserProfile>): boolean => {
    return !!(
      profile.campus &&
      profile.gender &&
      profile.age &&
      profile.height &&
      profile.weight &&
      profile.goal &&
      profile.activityLevel
    );
  };

  // 앱 시작 시 인증 상태 확인
  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        const user = getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setIsAuth(true);
          // 사용자 정보를 userProfile로 변환
          const profile: Partial<UserProfile> = {
            name: user.name,
            campus: user.campus as Campus,
            gender: user.gender as Gender,
            age: user.age,
            height: user.height,
            weight: user.weight,
            muscleMass: user.muscleMass,
            bodyFat: user.bodyFat,
            goal: user.goal as Goal,
            activityLevel: user.activityLevel as ActivityLevel,
            allergies: user.allergies
          };
          setUserProfile(profile);

          // 프로필이 완전하면 랜딩페이지로, 아니면 정보 입력 단계로
          if (isProfileComplete(profile)) {
            setShowLanding(true);
          } else {
            setStep(1);
          }
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
    setStep(3);
  };

  const handleBodyCompositionSubmit = async (data: Partial<UserProfile>) => {
    const fullProfile = { ...userProfile, ...data } as UserProfile;
    setUserProfile(fullProfile);
    await generatePlan(fullProfile, selectedDate);
  };

  const generatePlan = useCallback(async (profile: UserProfile, date?: string, context?: string) => {
    setLoading(true);
    const targetDate = date || selectedDate;
    try {
      const plan = await generateYonseiMealPlan(profile, targetDate, context);
      setMealPlan(plan);
      // 식단 생성 후 항상 Step 4로 이동 (정보 입력 단계로 돌아가지 않음)
      setStep(4);
    } catch (error) {
      console.error('식단 생성 오류:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  const handleRegenerate = async (context?: string) => {
    if (userProfile.campus && isProfileComplete(userProfile)) {
      await generatePlan(userProfile as UserProfile, selectedDate, context);
      // 재생성 후에도 Step 4에 머물도록 보장
      setStep(4);
    }
  };

  const handleDateChange = async (newDate: string) => {
    setSelectedDate(newDate);
    if (userProfile.campus && isProfileComplete(userProfile)) {
      await generatePlan(userProfile as UserProfile, newDate);
      // 날짜 변경 후에도 Step 4에 머물도록 보장
      setStep(4);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password);
    setCurrentUser(result.user);
    setIsAuth(true);
    // 사용자 정보를 userProfile로 변환
    const profile: Partial<UserProfile> = {
      name: result.user.name,
      campus: result.user.campus as Campus,
      gender: result.user.gender as Gender,
      age: result.user.age,
      height: result.user.height,
      weight: result.user.weight,
      muscleMass: result.user.muscleMass,
      bodyFat: result.user.bodyFat,
      goal: result.user.goal as Goal,
      activityLevel: result.user.activityLevel as ActivityLevel,
      allergies: result.user.allergies
    };
    setUserProfile(profile);

    // 회원가입 직후는 Step 2(기본 정보 확인)부터 시작하여 Step 3(인바디 정보 입력)을 거치도록
    setShowLanding(false);
    setStep(2);
  };

  const handleRegister = async (data: any) => {
    const result = await register(data);
    setCurrentUser(result.user);
    setIsAuth(true);
    // 사용자 정보를 userProfile로 변환
    const profile: Partial<UserProfile> = {
      name: result.user.name,
      campus: result.user.campus as Campus,
      gender: result.user.gender as Gender,
      age: result.user.age,
      height: result.user.height,
      weight: result.user.weight,
      muscleMass: result.user.muscleMass,
      bodyFat: result.user.bodyFat,
      goal: result.user.goal as Goal,
      activityLevel: result.user.activityLevel as ActivityLevel,
      allergies: result.user.allergies
    };
    setUserProfile(profile);

    // 회원가입 직후는 Step 2(기본 정보 확인)부터 시작하여 Step 3(인바디 정보 입력)을 거치도록
    setShowLanding(false);
    setStep(2);
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

  const handleLogoClick = () => {
    if (!isAuth) {
      // 로그인 전: 랜딩페이지로 이동
      setShowLanding(true);
    } else {
      // 로그인 후: 식단이 있으면 Step 4로, 없으면 랜딩페이지로
      if (mealPlan) {
        setShowLanding(false);
        setStep(4);
      } else {
        setShowLanding(true);
      }
    }
  };

  const handleGetMealPlan = async () => {
    // 프로필이 불완전하면 정보 입력 단계로
    if (!isProfileComplete(userProfile)) {
      console.warn('프로필이 불완전합니다:', userProfile);
      setShowLanding(false);
      setStep(1);
      return;
    }

    // 저장된 정보로 바로 식단 생성
    setShowLanding(false);
    // Step 4로 먼저 이동하여 로딩 상태 표시 (식단이 없어도 로딩 화면 표시)
    setStep(4);
    setLoading(true);

    try {
      await generatePlan(userProfile as UserProfile, selectedDate);
    } catch (error) {
      console.error('식단 생성 오류:', error);
      setLoading(false);
      // 오류 발생 시에도 정보 입력 단계로 가지 않고 Step 4에 머물도록
    }
  };

  const handleProfileUpdate = (updatedProfile: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updatedProfile }));
    // localStorage의 user 정보도 업데이트
    const user = getCurrentUser();
    if (user) {
      const updatedUser = {
        ...user,
        ...updatedProfile,
        campus: updatedProfile.campus as string || user.campus,
        gender: updatedProfile.gender as string || user.gender,
        goal: updatedProfile.goal as string || user.goal,
        activityLevel: updatedProfile.activityLevel as string || user.activityLevel
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
    }
  };

  // 인증되지 않은 경우 랜딩페이지 또는 로그인/회원가입 화면 표시
  if (!isAuth) {
    if (showLanding) {
      return (
        <LandingPage isAuth={false} onGetStarted={() => setShowLanding(false)} />
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="w-8 h-8 bg-yonsei-blue rounded flex items-center justify-center text-white font-bold font-serif">Y</div>
              <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Y-Nutri</span>
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setShowLanding(true)}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-yonsei-blue dark:hover:text-blue-400 transition-colors"
              >
                ← 홈으로
              </button>
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

  // 로그인 후 랜딩페이지 표시
  if (isAuth && showLanding) {
    return (
      <>
        <LandingPage
          isAuth={true}
          onGetStarted={() => setShowLanding(false)}
          onGetMealPlan={handleGetMealPlan}
        />
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          userProfile={userProfile}
          onUpdate={handleProfileUpdate}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="w-8 h-8 bg-yonsei-blue rounded flex items-center justify-center text-white font-bold font-serif">Y</div>
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Y-Nutri</span>
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {currentUser && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <User size={16} />
                <span>{currentUser.name}님</span>
              </div>
            )}
            {step === 3 && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-yonsei-blue dark:text-blue-300 font-bold text-xs">
                  {userProfile.campus?.includes('송도') ? '송도' : '신촌'}
                </div>
              </div>
            )}
            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-yonsei-blue dark:hover:text-blue-400 transition-colors"
            >
              <Settings size={16} />
              <span>프로필</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-yonsei-blue dark:hover:text-blue-400 transition-colors"
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

          {/* 로그인 후 프로필이 완전한 경우 Step 1-3은 표시하지 않음 */}
          {step === 1 && !isProfileComplete(userProfile) && (
            <div className="flex flex-col items-center animate-in slide-in-from-bottom-5 duration-500">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white text-center mb-4 break-keep">
                소속 캠퍼스를 선택해주세요
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-center mb-10 max-w-lg break-keep">
                선택하신 캠퍼스의 학식과 근처 맛집 정보를 바탕으로<br />최적의 맞춤 식단을 제공합니다.
              </p>
              <CampusSelector selected={userProfile.campus || null} onSelect={handleCampusSelect} />
            </div>
          )}

          {step === 2 && !isProfileComplete(userProfile) && (
            <div className="animate-in slide-in-from-right-5 duration-500">
              <div className="mb-6">
                <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-yonsei-blue">
                  ← 캠퍼스 다시 선택하기
                </button>
              </div>
              <OnboardingForm initialData={userProfile} onSubmit={handleProfileSubmit} />
            </div>
          )}

          {step === 3 && !isProfileComplete(userProfile) && (
            <div className="animate-in slide-in-from-right-5 duration-500">
              <div className="mb-6">
                <button onClick={() => setStep(2)} className="text-sm text-gray-500 hover:text-yonsei-blue">
                  ← 이전 단계로
                </button>
              </div>
              {loading ? (
                <MealPlanSkeleton />
              ) : (
                <BodyCompositionForm
                  initialData={userProfile}
                  onSubmit={handleBodyCompositionSubmit}
                  onBack={() => setStep(2)}
                />
              )}
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in duration-700">
              {loading ? (
                <MealPlanSkeleton />
              ) : mealPlan ? (
                <PlanDisplay
                  plan={mealPlan}
                  onRegenerate={handleRegenerate}
                  loading={loading}
                  selectedDate={selectedDate}
                  onDateChange={handleDateChange}
                  campus={userProfile.campus}
                />
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                  <p className="text-gray-500 dark:text-gray-400">식단을 생성할 수 없습니다. 프로필을 확인해주세요.</p>
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="mt-4 px-4 py-2 bg-yonsei-blue text-white rounded-lg hover:bg-blue-900 transition-colors"
                  >
                    프로필 수정
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8 text-center text-gray-400 text-sm transition-colors duration-300">
        <p>© 2025 Y-Nutri. Designed for Yonsei Students.</p>
        <p className="mt-2 text-xs">Powered by Google Gemini 2.5 Flash</p>
      </footer>

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        userProfile={userProfile}
        onUpdate={handleProfileUpdate}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;