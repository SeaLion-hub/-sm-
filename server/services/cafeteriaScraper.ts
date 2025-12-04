import * as cheerio from 'cheerio';

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

export interface CafeteriaMenu {
  cafeteriaName: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  menus: {
    name: string;
    price?: number;
    macros?: MacroNutrients;
  }[];
}

export interface CafeteriaData {
  campus: Campus;
  date: string;
  cafeterias: CafeteriaMenu[];
}

// 간단한 메모리 캐시 (실제 운영 시 Redis 등 사용 권장)
const cache = new Map<string, CafeteriaData>();

/**
 * 연세대학교 생활협동조합 식단 페이지에서 학식 메뉴를 가져옵니다.
 * 참고: https://yonseicoop.co.kr/m/?act=info.page&seq=29
 */
export const fetchCafeteriaMenus = async (
  campus: string,
  date?: string
): Promise<CafeteriaData | null> => {
  try {
    // 날짜가 없으면 오늘 날짜 사용
    const targetDateStr = date || new Date().toISOString().split('T')[0];
    const targetDate = new Date(targetDateStr);

    // 요일 인덱스 계산 (월요일=0, ..., 일요일=6)
    const day = targetDate.getDay();
    const dayIndex = (day + 6) % 7;

    // 캐시 키 생성
    const cacheKey = `${campus}-${targetDateStr}`;

    // 캐시 확인
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)!;
    }

    // iframe URL (실제 데이터가 있는 곳)
    const url = 'https://www.yonsei.ac.kr/_custom/yonsei/m/menu.jsp';

    // 페이지 가져오기
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://yonseicoop.co.kr/'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();

    // weekData JSON 추출
    const match = html.match(/var weekData = (\[.*?\]);/s);
    if (!match) {
      throw new Error('Could not find weekData in response');
    }

    const weekData = JSON.parse(match[1]);

    // 해당 요일의 데이터 가져오기
    const dayData = weekData[dayIndex];

    if (!dayData) {
      console.log('No data for this day');
      return {
        campus: campus as Campus,
        date: targetDateStr,
        cafeterias: []
      };
    }

    const cafeterias: CafeteriaMenu[] = [];

    // 캠퍼스 필터링 (신촌 / 국제)
    // 데이터 상: 신촌 -> "신촌", 국제 -> "국제"
    const targetCampusName = campus === Campus.SINCHON ? '신촌' : '국제';

    dayData.forEach((campusData: any) => {
      if (campusData.campusName === targetCampusName) {
        campusData.refectory.forEach((refectory: any) => {
          const cafeteriaName = refectory.name;

          refectory.type.forEach((type: any) => {
            const mealTypeName = type.name; // 예: "아침\n(조식)", "중식", "Hotbowl", "Soban" 등

            // 식사 유형 분류 (간단하게 매핑)
            let mealType: 'breakfast' | 'lunch' | 'dinner' = 'lunch'; // 기본값
            if (mealTypeName.includes('아침') || mealTypeName.includes('조식')) mealType = 'breakfast';
            else if (mealTypeName.includes('저녁') || mealTypeName.includes('석식')) mealType = 'dinner';

            const menus: { name: string; price?: number }[] = [];

            if (type.item) {
              type.item.forEach((item: any) => {
                if (item.name) {
                  // 가격 파싱
                  let price: number | undefined;
                  if (item.price) {
                    const priceMatch = item.price.toString().match(/([\d,]+)/);
                    if (priceMatch) {
                      price = parseInt(priceMatch[1].replace(/,/g, ''));
                    }
                  }

                  menus.push({
                    name: item.name.replace(/\n/g, ' '), // 줄바꿈 제거
                    price
                  });
                }
              });
            }

            if (menus.length > 0) {
              cafeterias.push({
                cafeteriaName: `${cafeteriaName} - ${mealTypeName.replace(/\n/g, ' ')}`, // 코너 이름 포함
                date: targetDateStr,
                mealType,
                menus
              });
            }
          });
        });
      }
    });

    // 결과 생성
    const result: CafeteriaData = {
      campus: campus as Campus,
      date: targetDateStr,
      cafeterias
    };

    // 캐시에 저장 (1시간 유효 - 데이터가 자주 바뀔 수 있으므로 줄임)
    cache.set(cacheKey, result);
    setTimeout(() => cache.delete(cacheKey), 60 * 60 * 1000);

    return result;
  } catch (error) {
    console.error('Error fetching cafeteria menus:', error);
    return null;
  }
};

/**
 * 캠퍼스별 학식 식당 목록
 */
export const getCafeteriaNames = (campus: string): string[] => {
  if (campus === Campus.SINCHON) {
    return ['학생회관', '고를샘', '맛나샘', '청경관', '공학원'];
  } else {
    return ['1기숙사 식당', '2기숙사 식당', 'Y-Plaza'];
  }
};

