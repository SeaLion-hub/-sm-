import React, { useRef } from 'react';
import VariableProximity from './VariableProximity';
import { ArrowRight, Sparkles } from 'lucide-react';
import Ballpit from './Ballpit';

interface LandingPageProps {
  isAuth?: boolean;
  onGetStarted: () => void;
  onGetMealPlan?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ isAuth = false, onGetStarted, onGetMealPlan }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Ballpit 배경 */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <Ballpit
          count={100}
          gravity={0.01}
          friction={0.9975}
          wallBounce={0.95}
          followCursor={false}
        />
      </div>

      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-indigo-50/80 to-purple-50/80 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 pointer-events-none z-10"></div>

      {/* 메인 콘텐츠 */}
      <div
        ref={containerRef}
        className="relative z-20 flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-10 text-center"
      >
        {/* 브랜드명 */}
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="min-h-[120px] flex items-center justify-center">
            <VariableProximity
              label="Y-NUTRI"
              className="variable-proximity-demo text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 dark:text-white tracking-tighter"
              fromFontVariationSettings="'wght' 700, 'opsz' 9"
              toFontVariationSettings="'wght' 1000, 'opsz' 40"
              containerRef={containerRef}
              radius={150}
              falloff="linear"
            />
          </div>
        </div>

        {/* 서브타이틀 */}
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-200 mb-6 max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          연세대학교 학생을 위한
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yonsei-blue to-blue-600 font-bold">AI 맞춤형 영양 식단 서비스</span>
        </h2>

        {/* 설명 */}
        <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl mb-12 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          신촌과 송도 캠퍼스의 학식과 근처 맛집 정보를 바탕으로
          <br />
          당신만을 위한 최적의 식단을 추천해드립니다
        </p>

        {/* 시작하기 / 맞춤 식단 받기 버튼 */}
        <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
          <button
            onClick={isAuth && onGetMealPlan ? onGetMealPlan : onGetStarted}
            className="group relative px-8 py-4 bg-yonsei-blue text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <Sparkles className="group-hover:rotate-12 transition-transform duration-300 relative z-10" size={20} />
            <span className="relative z-10">{isAuth ? '맞춤 식단 받기' : '시작하기'}</span>
            <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300 relative z-10" size={20} />
          </button>

          {/* Pulsing Effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-yonsei-blue/30 rounded-xl blur-xl animate-pulse -z-10"></div>
        </div>

        {/* How it Works Section */}
        <div className="mt-20 w-full max-w-4xl animate-in fade-in slide-in-from-bottom-12 duration-700 delay-500">
          <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-8">How it Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent -translate-y-1/2 z-0"></div>

            {[
              { icon: "🏫", title: "캠퍼스 선택", desc: "신촌/송도 캠퍼스 선택" },
              { icon: "📝", title: "정보 입력", desc: "신체 정보 및 목표 설정" },
              { icon: "🍽️", title: "식단 추천", desc: "AI가 분석한 최적의 식단" }
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center group">
                <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 group-hover:border-yonsei-blue/30 dark:group-hover:border-blue-500/30 group-hover:shadow-lg transition-all duration-300">
                  {step.icon}
                </div>
                <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-1">{step.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 특징 아이콘들 */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full animate-in fade-in slide-in-from-bottom-12 duration-700 delay-700">
          {[
            { icon: "🍎", title: "맞춤형 추천", desc: "개인 목표와 신체 정보 기반 식단" },
            { icon: "🏫", title: "캠퍼스 정보", desc: "실시간 학식 메뉴와 주변 맛집" },
            { icon: "🤖", title: "AI 분석", desc: "Google Gemini 기반 영양 분석" }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-xl p-6 shadow-sm border border-white/80 dark:border-gray-700/80 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-20 py-6 text-center text-gray-400 dark:text-gray-500 text-xs">
        <p>© 2024 Y-Nutri. Designed for Yonsei Students.</p>
      </footer>
    </div>
  );
};

export default LandingPage;

