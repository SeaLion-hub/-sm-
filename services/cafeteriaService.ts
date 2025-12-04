import { Campus, CafeteriaData } from '../types';

// Vite 프록시를 통해 /api로 요청하면 자동으로 백엔드로 전달됨
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * 백엔드 API를 통해 학식 메뉴를 가져옵니다.
 */
export const fetchCafeteriaMenus = async (
  campus: Campus,
  date?: string
): Promise<CafeteriaData | null> => {
  try {
    const params = new URLSearchParams({
      campus,
      ...(date && { date })
    });

    // API_BASE_URL이 있으면 절대 경로, 없으면 상대 경로 (Vite 프록시 사용)
    const url = API_BASE_URL 
      ? `${API_BASE_URL}/api/cafeteria?${params}`
      : `/api/cafeteria?${params}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      // 404나 다른 에러가 발생해도 null 반환 (fallback으로 AI가 추정)
      console.warn(`Failed to fetch cafeteria menus: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data as CafeteriaData;
  } catch (error) {
    // 네트워크 에러나 다른 에러 발생 시 null 반환 (fallback)
    console.warn('Error fetching cafeteria menus:', error);
    return null;
  }
};

/**
 * 학식 메뉴를 텍스트 형식으로 포맷팅 (Gemini 프롬프트에 사용)
 */
export const formatCafeteriaMenusForPrompt = (data: CafeteriaData | null): string => {
  if (!data || data.cafeterias.length === 0) {
    return '[학식 메뉴 정보를 불러올 수 없습니다. 일반적인 학식 메뉴를 추천해주세요.]';
  }

  let text = `[오늘의 학식 메뉴 정보 - ${data.date}]\n\n`;
  
  // 식당별로 그룹화
  const cafeteriaMap = new Map<string, CafeteriaData['cafeterias']>();
  
  data.cafeterias.forEach(cafeteria => {
    if (!cafeteriaMap.has(cafeteria.cafeteriaName)) {
      cafeteriaMap.set(cafeteria.cafeteriaName, []);
    }
    cafeteriaMap.get(cafeteria.cafeteriaName)!.push(cafeteria);
  });

  cafeteriaMap.forEach((menus, cafeteriaName) => {
    text += `📍 ${cafeteriaName}\n`;
    
    menus.forEach(cafeteria => {
      const mealTypeName = 
        cafeteria.mealType === 'breakfast' ? '아침' :
        cafeteria.mealType === 'lunch' ? '점심' : '저녁';
      
      text += `  ${mealTypeName}:\n`;
      
      cafeteria.menus.forEach(menu => {
        text += `    - ${menu.name}`;
        if (menu.price) {
          text += ` (${menu.price.toLocaleString()}원)`;
        }
        text += '\n';
      });
    });
    
    text += '\n';
  });
  
  return text;
};

