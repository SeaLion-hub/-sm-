import { Campus, RestaurantData } from '../types';

// Vite 프록시를 통해 /api로 요청하면 자동으로 백엔드로 전달됨
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * 백엔드 API를 통해 주변 식당 정보를 가져옵니다.
 */
export const fetchNearbyRestaurants = async (
  campus: Campus,
  limit: number = 20
): Promise<RestaurantData | null> => {
  try {
    const params = new URLSearchParams({
      campus,
      limit: limit.toString()
    });

    // API_BASE_URL이 있으면 절대 경로, 없으면 상대 경로 (Vite 프록시 사용)
    const url = API_BASE_URL 
      ? `${API_BASE_URL}/api/restaurants?${params}`
      : `/api/restaurants?${params}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      // 404나 다른 에러가 발생해도 null 반환 (fallback으로 Gemini가 Google Maps 사용)
      console.warn(`Failed to fetch restaurants: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data as RestaurantData;
  } catch (error) {
    // 네트워크 에러나 다른 에러 발생 시 null 반환 (fallback)
    console.warn('Error fetching nearby restaurants:', error);
    return null;
  }
};

/**
 * 주변 식당 메뉴를 텍스트 형식으로 포맷팅 (Gemini 프롬프트에 사용)
 */
export const formatRestaurantMenusForPrompt = (data: RestaurantData | null): string => {
  if (!data || data.restaurants.length === 0) {
    return '[주변 식당 메뉴 정보를 불러올 수 없습니다. Google Maps 도구를 활용하여 주변 식당 정보를 검색해주세요.]';
  }

  let text = `[주변 식당 메뉴 정보]\n\n`;
  
  data.restaurants.forEach(restaurant => {
    text += `📍 ${restaurant.restaurantName}`;
    if (restaurant.address) {
      text += ` (${restaurant.address})`;
    }
    if (restaurant.distance) {
      text += ` - 거리: ${restaurant.distance.toFixed(1)}km`;
    }
    text += '\n';
    
    restaurant.menus.forEach(menu => {
      text += `  - ${menu.name}`;
      if (menu.price) {
        text += ` (${menu.price.toLocaleString()}원)`;
      }
      if (menu.description) {
        text += ` - ${menu.description}`;
      }
      text += '\n';
    });
    
    text += '\n';
  });
  
  return text;
};

