import React, { useRef } from 'react';
import VariableProximity from './VariableProximity';
import { ArrowRight, Sparkles } from 'lucide-react';
import Ballpit from './Ballpit';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Ballpit 배경 */}
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', zIndex: 0}}>
        <Ballpit
          count={100}
          gravity={0.01}
          friction={0.9975}
          wallBounce={0.95}
          followCursor={false}
        />
      </div>
      
      {/* 배경 오버레이 (가독성을 위한 반투명 레이어) */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-indigo-50/80 to-purple-50/80 pointer-events-none z-10"></div>

      {/* 메인 콘텐츠 */}
      <div
        ref={containerRef}
        className="relative z-20 flex flex-col items-center justify-center px-6 py-20 text-center"
        style={{ position: 'relative' }}
      >
        {/* 브랜드명 */}
        <div className="mb-8">
          <div className="min-h-[120px] flex items-center justify-center">
            <VariableProximity
              label="Y-NUTRI"
              className="variable-proximity-demo text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900"
              fromFontVariationSettings="'wght' 400, 'opsz' 9"
              toFontVariationSettings="'wght' 1000, 'opsz' 40"
              containerRef={containerRef}
              radius={150}
              falloff="linear"
            />
          </div>
        </div>

        {/* 서브타이틀 */}
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4 max-w-2xl">
          연세대학교 학생을 위한
          <br />
          <span className="text-yonsei-blue">AI 맞춤형 영양 식단 서비스</span>
        </h2>

        {/* 설명 */}
        <p className="text-gray-600 text-lg md:text-xl mb-12 max-w-2xl leading-relaxed">
          신촌과 송도 캠퍼스의 학식과 근처 맛집 정보를 바탕으로
          <br />
          당신만을 위한 최적의 식단을 추천해드립니다
        </p>

        {/* 시작하기 버튼 */}
        <button
          onClick={onGetStarted}
          className="group relative px-8 py-4 bg-yonsei-blue text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-3"
        >
          <Sparkles className="group-hover:rotate-12 transition-transform duration-300" size={20} />
          <span>시작하기</span>
          <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={20} />
        </button>

        {/* 특징 아이콘들 */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/80">
            <div className="text-3xl mb-3">🍎</div>
            <h3 className="font-semibold text-gray-800 mb-2">맞춤형 추천</h3>
            <p className="text-sm text-gray-600">개인 목표와 신체 정보 기반 식단</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/80">
            <div className="text-3xl mb-3">🏫</div>
            <h3 className="font-semibold text-gray-800 mb-2">캠퍼스 정보</h3>
            <p className="text-sm text-gray-600">실시간 학식 메뉴와 주변 맛집</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/80">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="font-semibold text-gray-800 mb-2">AI 분석</h3>
            <p className="text-sm text-gray-600">Google Gemini 기반 영양 분석</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

