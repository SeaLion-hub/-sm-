
import React, { useState } from 'react';
import { DailyPlan, MealOption, PlaceType, MapCoordinates } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { MapPin, Info, ExternalLink, School, Store, Coffee, Calendar, TrendingUp, Navigation, Sparkles } from 'lucide-react';
import RestaurantMap from './RestaurantMap';
import { getDirections, getCampusCoordinates } from '../services/mapService';


const PlaceIcon = ({ type }: { type: PlaceType }) => {
  switch (type) {
    case '학식': return <School className="text-yonsei-blue" size={18} />;
    case '식당': return <Store className="text-orange-500" size={18} />;
    case '편의점/카페': return <Coffee className="text-green-600" size={18} />;
    default: return <MapPin className="text-gray-500" size={18} />;
  }
};

const MealOptionCard: React.FC<{
  option: MealOption;
  onShowMap: (option: MealOption) => void;
  campus?: string;
}> = ({ option, onShowMap, campus }) => {
  // 네이버 지도 검색 링크 생성 (모바일/PC 모두 동작)
  const mapSearchUrl = `https://map.naver.com/v5/search/${encodeURIComponent(option.placeName)}`;
  const [showDirections, setShowDirections] = useState(false);

  const handleShowMap = () => {
    onShowMap(option);
  };

  const handleDirections = async () => {
    if (!option.coordinates || !campus) return;

    const campusCoords = getCampusCoordinates(campus);
    const directions = await getDirections(campusCoords, option.coordinates);

    if (directions) {
      // Directions 정보를 사용하여 네이버 지도 길찾기 링크 열기
      const directionsUrl = `https://map.naver.com/v5/directions/${campusCoords.longitude},${campusCoords.latitude},,/${option.coordinates.longitude},${option.coordinates.latitude},,?c=15,0,0,0,dh`;
      window.open(directionsUrl, '_blank');
    } else {
      // 실패 시 일반 검색 링크로 대체
      window.open(mapSearchUrl, '_blank');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 hover:border-yonsei-blue dark:hover:border-blue-500 transition-all group">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-blue-50 transition-colors">
            <PlaceIcon type={option.type} />
          </div>
          <div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full mb-1 inline-block ${option.type === '학식' ? 'bg-blue-100 text-yonsei-blue' :
              option.type === '식당' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
              }`}>
              {option.type}
            </span>
            <h4 className="font-bold text-gray-800 dark:text-gray-100 text-lg leading-tight">{option.placeName}</h4>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShowMap}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-yonsei-blue hover:underline transition-colors"
            title="지도에서 보기"
          >
            <MapPin size={12} />
            지도
          </button>
          <a
            href={mapSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-green-600 hover:underline transition-colors"
            title="네이버 지도로 보기"
          >
            <ExternalLink size={10} />
          </a>
        </div>
      </div>

      <div className="mb-3 pl-10">
        <p className="text-gray-900 dark:text-gray-200 font-medium">{option.menuName}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{option.priceEstimate ? `예상 가격: ${option.priceEstimate}` : ''}</p>
      </div>

      <div className="mb-4 space-y-2">
        {option.impact && (
          <div className="bg-blue-50 border-l-4 border-yonsei-blue p-3 rounded-r-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={14} className="text-yonsei-blue" />
              <span className="text-xs font-bold text-yonsei-blue">주요 영향</span>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed">{option.impact}</p>
          </div>
        )}
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">💡 추천 이유</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed text-xs">
            {option.detailedReason || option.reason}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1 text-center text-[10px] md:text-xs">
        <div className="bg-gray-100 p-1.5 rounded">
          <div className="font-bold text-gray-700">{option.macros.calories}</div>
          <div className="text-gray-500">kcal</div>
        </div>
        <div className="bg-red-50 p-1.5 rounded">
          <div className="font-bold text-red-600">{option.macros.protein}g</div>
          <div className="text-red-400">탄</div>
        </div>
        <div className="bg-green-50 p-1.5 rounded">
          <div className="font-bold text-green-600">{option.macros.carbs}g</div>
          <div className="text-green-400">단</div>
        </div>
        <div className="bg-yellow-50 p-1.5 rounded">
          <div className="font-bold text-yellow-600">{option.macros.fat}g</div>
          <div className="text-yellow-400">지</div>
        </div>
      </div>

      {/* Traffic Light Indicator */}
      {option.nutritionGrade && (
        <div className={`mt-3 p-2 rounded-lg flex items-center justify-center gap-2 text-xs font-bold ${option.nutritionGrade === 'GREEN' ? 'bg-green-100 text-green-800' :
          option.nutritionGrade === 'YELLOW' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
          <div className={`w-2.5 h-2.5 rounded-full ${option.nutritionGrade === 'GREEN' ? 'bg-green-500' :
            option.nutritionGrade === 'YELLOW' ? 'bg-yellow-500' :
              'bg-red-500'
            }`} />
          {option.nutritionGrade === 'GREEN' ? '영양 균형 우수' :
            option.nutritionGrade === 'YELLOW' ? '영양 균형 보통' :
              '영양 주의 필요'}
        </div>
      )}

      {option.coordinates && campus && (
        <button
          onClick={handleDirections}
          className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-yonsei-blue/10 hover:bg-yonsei-blue/20 text-yonsei-blue rounded-lg transition-colors text-xs font-medium"
        >
          <Navigation size={14} />
          캠퍼스에서 길찾기
        </button>
      )}
    </div>
  );
};

interface PlanDisplayProps {
  plan: DailyPlan;
  onRegenerate: (context?: string) => void;
  loading: boolean;
  selectedDate: string;
  onDateChange: (date: string) => void;
  campus?: string;
}

const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan, onRegenerate, loading, selectedDate, onDateChange, campus }) => {
  const [activeTab, setActiveTab] = useState<'breakfast' | 'lunch' | 'dinner'>('lunch');
  const [selectedMapOption, setSelectedMapOption] = useState<MealOption | null>(null);
  const [contextInput, setContextInput] = useState<string>('');

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = weekdays[date.getDay()];
    return `${month}월 ${day}일 (${weekday})`;
  };

  // 오늘 날짜인지 확인
  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  const chartData = [
    { name: '단백질', value: plan.totalTargetMacros.protein, color: '#EF4444' },
    { name: '탄수화물', value: plan.totalTargetMacros.carbs, color: '#22C55E' },
    { name: '지방', value: plan.totalTargetMacros.fat, color: '#EAB308' },
  ];

  const tabs = [
    { id: 'breakfast', label: '아침', icon: '🌅' },
    { id: 'lunch', label: '점심', icon: '☀️' },
    { id: 'dinner', label: '저녁', icon: '🌙' },
  ] as const;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">

      {/* Date Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar className="text-yonsei-blue" size={20} />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-500 mb-1">식단 날짜</label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => onDateChange(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  max={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  className="text-base font-bold text-gray-900 dark:text-white border-none outline-none bg-transparent cursor-pointer dark:[color-scheme:dark]"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {formatDate(selectedDate)}
                  {isToday && <span className="ml-1.5 text-yonsei-blue font-semibold">(오늘)</span>}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onRegenerate()}
            disabled={loading}
            className="flex items-center gap-2 text-sm text-yonsei-blue hover:bg-blue-50 px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 border border-yonsei-blue/20 whitespace-nowrap"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-yonsei-blue border-t-transparent rounded-full animate-spin"></div>
                <span>분석 중...</span>
              </>
            ) : (
              <>
                <span>🔄</span>
                <span>다시 생성</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Context Input - 상황에 맞춰 다시 추천받기 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 shadow-sm border border-blue-100 dark:border-blue-800">
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 bg-yonsei-blue/10 rounded-lg">
            <Sparkles className="text-yonsei-blue" size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">상황에 맞춰 다시 추천받기</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              예: "시험 기간이라 소화 잘되는 거 추천해줘", "30분 안에 빨리 먹어야 해", "매운 게 땡겨"
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={contextInput}
                onChange={(e) => setContextInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !loading && contextInput.trim()) {
                    onRegenerate(contextInput.trim());
                  }
                }}
                placeholder="지금 상황을 자유롭게 입력해주세요..."
                className="flex-1 px-4 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yonsei-blue focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                disabled={loading}
              />
              <button
                onClick={() => {
                  if (contextInput.trim()) {
                    onRegenerate(contextInput.trim());
                  }
                }}
                disabled={loading || !contextInput.trim()}
                className="px-5 py-2.5 bg-yonsei-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>분석 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>맞춤 추천</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary & Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-yonsei-blue to-blue-900 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Info className="text-blue-200" />
            <h2 className="text-xl font-bold">{formatDate(plan.date || selectedDate)} 영양 목표 및 분석</h2>
          </div>
          <p className="text-blue-50 leading-relaxed text-sm md:text-base break-keep bg-white/10 p-4 rounded-xl backdrop-blur-sm">
            {plan.advice}
          </p>
          <div className="mt-6 flex gap-8">
            <div>
              <div className="text-3xl font-bold tracking-tight">{plan.totalTargetMacros.calories}</div>
              <div className="text-blue-200 text-xs font-medium uppercase mt-1">Target Calories (kcal)</div>
            </div>
            <div className="w-px bg-white/20"></div>
            <div>
              <div className="text-3xl font-bold tracking-tight">{plan.totalTargetMacros.protein}g</div>
              <div className="text-blue-200 text-xs font-medium uppercase mt-1">Target Protein</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center relative overflow-hidden">
          <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2 z-10">목표 탄단지 비율</h3>
          <div className="h-40 w-full z-10 min-h-[160px]" style={{ minWidth: '200px' }}>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart width={200} height={160}>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-50 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-yellow-50 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        </div>
      </div>

      {/* Meal Selection Tabs */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">끼니별 추천 리스트</h2>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden min-h-[500px]">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-100 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === tab.id
                  ? 'text-yonsei-blue border-b-2 border-yonsei-blue bg-blue-50/30 dark:bg-blue-900/20'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
              >
                <span className="text-lg">{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 bg-gray-50/50 dark:bg-gray-900/50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plan[activeTab].map((option, idx) => (
                <MealOptionCard
                  key={`${activeTab}-${idx}`}
                  option={option}
                  onShowMap={setSelectedMapOption}
                  campus={campus}
                />
              ))}
            </div>
            {plan[activeTab].length === 0 && (
              <div className="text-center py-20 text-gray-400">
                추천된 식단이 없습니다.
              </div>
            )}

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start gap-3">
              <Info size={18} className="text-yonsei-blue mt-0.5 shrink-0" />
              <div className="text-sm text-gray-600">
                <p className="font-bold text-yonsei-blue mb-1">이용 팁</p>
                <p>상단 식당 이름 옆의 <strong>'지도'</strong> 링크를 클릭하면 네이버 지도 검색 결과로 바로 연결됩니다. 학식의 경우 운영 시간이 상이할 수 있으니 학교 앱(Y-Top)을 참고하세요.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 지도 모달 */}
      {selectedMapOption && (
        <RestaurantMap
          placeName={selectedMapOption.placeName}
          address={selectedMapOption.address}
          coordinates={selectedMapOption.coordinates}
          onClose={() => setSelectedMapOption(null)}
          onDirections={(coords) => {
            if (campus) {
              const campusCoords = getCampusCoordinates(campus);
              const directionsUrl = `https://map.naver.com/v5/directions/${campusCoords.longitude},${campusCoords.latitude},,/${coords.longitude},${coords.latitude},,?c=15,0,0,0,dh`;
              window.open(directionsUrl, '_blank');
            }
          }}
        />
      )}
    </div>
  );
};

export default PlanDisplay;
