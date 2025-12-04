
export enum Campus {
  SINCHON = '신촌 캠퍼스',
  SONGDO = '국제 캠퍼스 (송도)'
}

export enum Gender {
  MALE = '남성',
  FEMALE = '여성'
}

export enum Goal {
  LOSE_WEIGHT = '체중 감량 (다이어트)',
  MAINTAIN = '현재 체중 유지',
  BUILD_MUSCLE = '근육량 증가 (벌크업)'
}

export enum ActivityLevel {
  SEDENTARY = '활동 적음 (주로 앉아서 공부)',
  LIGHT = '가벼운 활동 (통학, 가벼운 산책)',
  MODERATE = '보통 (주 1-3회 운동)',
  ACTIVE = '활동 많음 (주 4회 이상 운동/운동부)'
}

export interface UserProfile {
  name: string;
  campus: Campus;
  gender: Gender;
  age: number;
  height: number; // cm
  weight: number; // kg
  muscleMass?: number; // kg (SMM)
  bodyFat?: number; // %
  goal: Goal;
  activityLevel: ActivityLevel;
  allergies?: string;
}

export interface MacroNutrients {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export type PlaceType = '학식' | '식당' | '편의점/카페';

export enum NutritionGrade {
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
  RED = 'RED'
}

export interface MealOption {
  menuName: string;
  placeName: string; // 식당 이름
  type: PlaceType;
  macros: MacroNutrients;
  reason: string; // 추천 이유
  impact?: string; // 구체적인 영향 (예: "근육 합성 촉진", "혈당 안정화" 등)
  detailedReason?: string; // 상세한 추천 이유
  priceEstimate?: string; // 예상 가격대
  address?: string; // 식당 주소
  coordinates?: MapCoordinates; // 식당 좌표
}

export interface DailyMealSection {
  title: string; // 아침, 점심, 저녁
  options: MealOption[];
}

export interface DailyPlan {
  breakfast: MealOption[];
  lunch: MealOption[];
  dinner: MealOption[];
  totalTargetMacros: MacroNutrients; // 목표 섭취량
  advice: string;
  date?: string; // 생성 날짜 (YYYY-MM-DD)
}

export interface CafeteriaMenu {
  cafeteriaName: string; // "고를샘", "맛나샘", "학생회관" 등
  date: string; // YYYY-MM-DD
  mealType: 'breakfast' | 'lunch' | 'dinner';
  menus: {
    name: string;
    price?: number;
    macros?: MacroNutrients;
  }[];
}

export interface CafeteriaData {
  campus: Campus;
  date: string; // YYYY-MM-DD
  cafeterias: CafeteriaMenu[];
}

export interface RestaurantMenu {
  restaurantName: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  menus: {
    name: string;
    price?: number;
    macros?: MacroNutrients;
    description?: string;
  }[];
  rating?: number;
  distance?: number; // 캠퍼스로부터의 거리 (km)
}

export interface RestaurantData {
  campus: Campus;
  restaurants: RestaurantMenu[];
}

// 네이버 지도 관련 타입
export interface MapCoordinates {
  latitude: number;
  longitude: number;
}

export interface GeocodeResponse {
  address: string;
  coordinates: MapCoordinates;
}

export interface DirectionsResponse {
  summary: {
    distance: number; // 미터 단위
    duration: number; // 초 단위
  };
  path: MapCoordinates[];
  guide: Array<{
    point: MapCoordinates;
    instructions: string;
    distance: number;
    duration: number;
  }>;
}