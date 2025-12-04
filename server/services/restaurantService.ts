// 타입 정의 (types.ts와 동일하게 유지)
export enum Campus {
  SINCHON = '신촌 캠퍼스',
  SONGDO = '국제 캠퍼스 (송도)'
}

export interface MacroNutrients {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
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
  distance?: number;
}

export interface RestaurantData {
  campus: Campus;
  restaurants: RestaurantMenu[];
}

/**
 * 캠퍼스 주변 식당 정보를 가져옵니다.
 * 현재는 Google Maps Grounding을 통해 Gemini에서 처리하므로,
 * 여기서는 기본적인 식당 목록만 제공합니다.
 */
export const fetchNearbyRestaurants = async (
  campus: string,
  limit: number = 20
): Promise<RestaurantMenu[]> => {
  try {
    // 캠퍼스 좌표
    const location = campus === Campus.SINCHON
      ? { latitude: 37.5640, longitude: 126.9370 }
      : { latitude: 37.3820, longitude: 126.6690 };

    // TODO: Google Places API 또는 네이버/카카오 지도 API를 사용하여
    // 실제 주변 식당 정보를 가져오는 로직 구현
    
    // 현재는 빈 배열 반환 (Gemini의 Google Maps Grounding이 대신 처리)
    const restaurants: RestaurantMenu[] = [];

    return restaurants;
  } catch (error) {
    console.error('Error fetching nearby restaurants:', error);
    return [];
  }
};

