import express from 'express';

export const mapRouter = express.Router();

const NAVER_API_GATEWAY_URL = 'https://naveropenapi.apigw.ntruss.com';
const X_NCP_APIGW_API_KEY = process.env.X_NCP_APIGW_API_KEY;
const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

/**
 * 주소를 좌표로 변환 (Geocoding)
 * GET /api/map/geocode?address=주소
 */
mapRouter.get('/geocode', async (req, res) => {
  try {
    const address = req.query.address as string;

    if (!address) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'address 파라미터가 필요합니다.'
      });
    }

    if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
      return res.status(500).json({
        error: 'Server Error',
        message: '네이버 API 인증 정보가 설정되지 않았습니다.'
      });
    }

    // 네이버 Geocoding API 호출
    const geocodeUrl = `${NAVER_API_GATEWAY_URL}/map-geocode/v2/geocode`;
    const params = new URLSearchParams({
      query: address
    });

    const response = await fetch(`${geocodeUrl}?${params}`, {
      method: 'GET',
      headers: {
        'X-NCP-APIGW-API-KEY-ID': NAVER_CLIENT_ID,
        'X-NCP-APIGW-API-KEY': NAVER_CLIENT_SECRET
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Geocoding API error:', response.status, errorText);
      return res.status(response.status).json({
        error: 'Geocoding API Error',
        message: '주소를 좌표로 변환하는데 실패했습니다.',
        details: errorText
      });
    }

    const data = await response.json();
    
    if (data.status === 'OK' && data.addresses && data.addresses.length > 0) {
      const firstAddress = data.addresses[0];
      res.json({
        address: firstAddress.roadAddress || firstAddress.jibunAddress,
        coordinates: {
          latitude: parseFloat(firstAddress.y),
          longitude: parseFloat(firstAddress.x)
        }
      });
    } else {
      res.status(404).json({
        error: 'Not Found',
        message: '주소를 찾을 수 없습니다.'
      });
    }
  } catch (error) {
    console.error('Error in geocode route:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * 경로 안내 (Directions 5)
 * GET /api/map/directions?start=시작좌표&goal=도착좌표
 * 좌표 형식: "위도,경도" (예: "37.5665,126.9780")
 */
mapRouter.get('/directions', async (req, res) => {
  try {
    const start = req.query.start as string;
    const goal = req.query.goal as string;

    if (!start || !goal) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'start와 goal 파라미터가 필요합니다. 형식: "위도,경도"'
      });
    }

    if (!X_NCP_APIGW_API_KEY) {
      return res.status(500).json({
        error: 'Server Error',
        message: '네이버 API Gateway 키가 설정되지 않았습니다.'
      });
    }

    // 좌표 파싱
    const [startLat, startLng] = start.split(',').map(Number);
    const [goalLat, goalLng] = goal.split(',').map(Number);

    if (isNaN(startLat) || isNaN(startLng) || isNaN(goalLat) || isNaN(goalLng)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: '좌표 형식이 올바르지 않습니다. 형식: "위도,경도"'
      });
    }

    // 네이버 Directions 5 API 호출
    const directionsUrl = `${NAVER_API_GATEWAY_URL}/map-direction/v1/driving`;
    const params = new URLSearchParams({
      start: `${startLng},${startLat}`, // 네이버 API는 경도,위도 순서
      goal: `${goalLng},${goalLat}`,
      option: 'trafast' // 최적 경로
    });

    const response = await fetch(`${directionsUrl}?${params}`, {
      method: 'GET',
      headers: {
        'X-NCP-APIGW-API-KEY': X_NCP_APIGW_API_KEY,
        'X-NCP-APIGW-API-KEY-ID': NAVER_CLIENT_ID || ''
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Directions API error:', response.status, errorText);
      return res.status(response.status).json({
        error: 'Directions API Error',
        message: '경로를 찾는데 실패했습니다.',
        details: errorText
      });
    }

    const data = await response.json();

    if (data.code === 0 && data.route && data.route.trafast) {
      const route = data.route.trafast[0];
      const summary = route.summary;
      
      // 경로 좌표 추출
      const path: Array<{ latitude: number; longitude: number }> = [];
      route.path.forEach((point: number[]) => {
        path.push({
          latitude: point[1], // 네이버 API는 [경도, 위도] 순서
          longitude: point[0]
        });
      });

      // 경로 안내 추출
      const guide: Array<{
        point: { latitude: number; longitude: number };
        instructions: string;
        distance: number;
        duration: number;
      }> = [];
      
      route.guide?.forEach((g: any) => {
        guide.push({
          point: {
            latitude: g.location[1],
            longitude: g.location[0]
          },
          instructions: g.instructions || '',
          distance: g.distance || 0,
          duration: g.duration || 0
        });
      });

      res.json({
        summary: {
          distance: summary.distance || 0, // 미터
          duration: summary.duration || 0 // 초
        },
        path,
        guide
      });
    } else {
      res.status(404).json({
        error: 'Not Found',
        message: '경로를 찾을 수 없습니다.'
      });
    }
  } catch (error) {
    console.error('Error in directions route:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

