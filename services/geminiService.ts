
import { GoogleGenAI } from "@google/genai";
import { UserProfile, DailyPlan, Campus } from "../types";
import { fetchCafeteriaMenus, formatCafeteriaMenusForPrompt } from "./cafeteriaService";
import { fetchNearbyRestaurants, formatRestaurantMenusForPrompt } from "./restaurantService";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateYonseiMealPlan = async (user: UserProfile, date?: string, context?: string): Promise<DailyPlan | null> => {
  try {
    // 좌표 설정 (Grounding용)
    const locationConfig = user.campus === Campus.SINCHON
      ? { latitude: 37.5640, longitude: 126.9370 } // 연세대 신촌
      : { latitude: 37.3820, longitude: 126.6690 }; // 연세대 송도

    const campusContext = user.campus === Campus.SINCHON
      ? "연세대학교 신촌 캠퍼스 (학생회관, 고를샘, 맛나샘, 청경관, 공학원 등 학식 및 신촌역/이대후문 근처 맛집)"
      : "연세대학교 국제 캠퍼스 (송도 1기숙사, 2기숙사 식당, Y-Plaza 학식 및 송도 캠퍼스타운/트리플스트리트 맛집)";

    const inBodyInfo = (user.muscleMass || user.bodyFat)
      ? `[인바디] 골격근량: ${user.muscleMass}kg, 체지방률: ${user.bodyFat}%`
      : "[인바디] 정보 없음 (표준 체형 기준)";

    // 실제 학식 메뉴 데이터 가져오기
    const targetDate = date || new Date().toISOString().split('T')[0];
    const [cafeteriaData, restaurantData] = await Promise.all([
      fetchCafeteriaMenus(user.campus, targetDate),
      fetchNearbyRestaurants(user.campus)
    ]);

    const cafeteriaMenuText = formatCafeteriaMenusForPrompt(cafeteriaData);
    const restaurantMenuText = formatRestaurantMenusForPrompt(restaurantData);

    const prompt = `
      당신은 연세대학교 학생을 위한 개인 맞춤형 AI 영양사입니다. Google Maps 도구를 사용하여 실제 존재하는 식당 정보를 바탕으로 식단을 추천해주세요.

      ${cafeteriaMenuText}

      ${restaurantMenuText}

      [사용자 정보]
      - 캠퍼스: ${user.campus} (${campusContext})
      - 성별/나이: ${user.gender}, ${user.age}세
      - 신체: ${user.height}cm, ${user.weight}kg
      - ${inBodyInfo}
      - 활동량: ${user.activityLevel}
      - 목표: ${user.goal}
      - 알레르기: ${user.allergies || "없음"}
      - **현재 상황/컨텍스트**: ${context || "별도 상황 없음 (일반적인 식사)"}

      [요청 사항]
      1. 사용자의 목표(다이어트/벌크업 등)와 인바디 정보를 분석하여 하루 목표 영양소(Target Macros)를 설정하세요.
      2. **현재 상황/컨텍스트**를 최우선으로 고려하여 메뉴를 추천하세요.
         - 예: "30분 내 식사" -> 대기 시간이 짧고 조리가 빠른 학식이나 패스트푸드 위주 추천.
         - 예: "시험 기간" -> 소화가 잘 되고 집중력에 좋은 메뉴 추천.
      3. **위에 제공된 실제 학식 메뉴 정보를 우선적으로 활용**하여 추천하세요. 학식 메뉴가 제공된 경우 반드시 그 메뉴 중에서 선택하세요.
      4. **아침, 점심, 저녁 각각에 대해 2~3가지 선택지(옵션)**를 제공하세요.
         - 옵션에는 반드시 '학식'과 '캠퍼스 근처 식당(또는 편의점)'이 골고루 포함되어야 합니다.
         - 학식 옵션은 위에 제공된 실제 메뉴 중에서 선택하세요.
         - 주변 식당 옵션은 **Google Maps 도구를 반드시 사용**하여 실제 존재하는 식당의 정확한 메뉴명, 가격, 위치를 확인하세요.
      5. **Google Maps 도구를 적극 활용**하여, 실제 학교 근처에 위치한 식당의 실제 메뉴를 추천하세요. 추정하지 말고 실제 데이터를 사용하세요.
      6. 메뉴 추천 시 영양 성분(칼로리, 탄단지)은 실제 메뉴 정보를 바탕으로 정확하게 추정하세요.
      7. 가격대는 학식의 경우 위 정보를 참고하고, 식당의 경우 Google Maps 도구에서 확인한 실제 가격을 적어주세요.
      8. 각 메뉴마다 다음을 포함하세요:
         - **impact**: 이 메뉴가 사용자의 목표에 미치는 구체적인 영향
         - **detailedReason**: 상세한 추천 이유 (영양학적 관점, 목표와의 연결, 맛/편의성 등)
         - **nutritionGrade**: 영양 신호등 등급 ('GREEN', 'YELLOW', 'RED').
           - GREEN: 탄단지 균형이 완벽하고 사용자 목표에 부합함.
           - YELLOW: 나쁘지 않으나 약간의 불균형이 있음.
           - RED: 고칼로리/고지방/고당류 등으로 주의가 필요함.
      9. 식당 정보는 반드시 Google Maps에서 확인한 실제 정보를 사용하세요. 추정하지 마세요.

      [출력 형식]
      반드시 아래와 같은 순수 JSON 형식으로만 응답하세요. 마크다운 코드 블록(\`\`\`json 등)을 절대 사용하지 마세요.
      
      {
        "breakfast": [
          {
            "menuName": "메뉴 이름",
            "placeName": "식당 이름",
            "type": "학식" 또는 "식당" 또는 "편의점/카페",
            "macros": {
              "calories": 500,
              "protein": 20,
              "carbs": 60,
              "fat": 15
            },
            "reason": "간단한 추천 이유",
            "impact": "구체적인 영향",
            "detailedReason": "상세한 추천 이유",
            "priceEstimate": "가격 (예: 6000원)",
            "nutritionGrade": "GREEN" | "YELLOW" | "RED"
          }
        ],
        "lunch": [ ... 위와 동일한 구조의 배열 ... ],
        "dinner": [ ... 위와 동일한 구조의 배열 ... ],
        "totalTargetMacros": {
          "calories": 2000,
          "protein": 100,
          "carbs": 250,
          "fat": 60
        },
        "advice": "영양 분석 및 조언 텍스트"
      }
    `;

    let response;
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: prompt,
          config: {
            tools: [{ googleMaps: {} }], // Grounding 활성화
            toolConfig: {
              retrievalConfig: {
                latLng: locationConfig
              }
            },
            // Google Maps 툴 사용 시 responseMimeType: 'application/json' 및 responseSchema 사용 불가
            temperature: 0.5,
          },
        });
        break; // Success
      } catch (error: any) {
        if (error.status === 503 || (error.error && error.error.code === 503)) {
          retryCount++;
          console.log(`Gemini API 503 error, retrying... (${retryCount}/${maxRetries})`);
          if (retryCount === maxRetries) throw error;
          // Exponential backoff: 1s, 2s, 4s
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount - 1)));
        } else {
          throw error;
        }
      }
    }

    let text = response.text;
    if (!text) return null;

    // JSON 파싱 전 마크다운 코드 블록 제거
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    console.log("Grounding Chunks:", response.candidates?.[0]?.groundingMetadata?.groundingChunks);

    try {
      const plan = JSON.parse(text) as DailyPlan;
      // 날짜 정보 추가
      plan.date = targetDate;
      return plan;
    } catch (e) {
      console.error("Failed to parse JSON:", text);
      return null;
    }

  } catch (error) {
    console.error("Error generating meal plan:", error);
    return null;
  }
};
