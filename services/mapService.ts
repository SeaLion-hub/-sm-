import { GeocodeResponse, DirectionsResponse, MapCoordinates } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * 주소를 좌표로 변환 (Geocoding)
 */
export const geocodeAddress = async (address: string): Promise<GeocodeResponse | null> => {
  try {
    const params = new URLSearchParams({
      address
    });

    const url = API_BASE_URL 
      ? `${API_BASE_URL}/api/map/geocode?${params}`
      : `/api/map/geocode?${params}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn(`Failed to geocode address: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data as GeocodeResponse;
  } catch (error) {
    console.warn('Error geocoding address:', error);
    return null;
  }
};

/**
 * 경로 안내 (Directions)
 */
export const getDirections = async (
  start: MapCoordinates,
  goal: MapCoordinates
): Promise<DirectionsResponse | null> => {
  try {
    const params = new URLSearchParams({
      start: `${start.latitude},${start.longitude}`,
      goal: `${goal.latitude},${goal.longitude}`
    });

    const url = API_BASE_URL 
      ? `${API_BASE_URL}/api/map/directions?${params}`
      : `/api/map/directions?${params}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn(`Failed to get directions: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data as DirectionsResponse;
  } catch (error) {
    console.warn('Error getting directions:', error);
    return null;
  }
};

/**
 * 캠퍼스 좌표 반환
 */
export const getCampusCoordinates = (campus: string): MapCoordinates => {
  // 연세대학교 캠퍼스 좌표
  if (campus === '신촌 캠퍼스') {
    return {
      latitude: 37.5642,
      longitude: 126.9370
    };
  } else if (campus === '국제 캠퍼스 (송도)') {
    return {
      latitude: 37.3841,
      longitude: 126.6566
    };
  }
  // 기본값 (신촌)
  return {
    latitude: 37.5642,
    longitude: 126.9370
  };
};

