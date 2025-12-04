import React, { useEffect, useRef, useState } from 'react';
import { MapCoordinates } from '../types';
import { X, Navigation } from 'lucide-react';

interface RestaurantMapProps {
  placeName: string;
  address?: string;
  coordinates?: MapCoordinates;
  onClose: () => void;
  onDirections?: (coordinates: MapCoordinates) => void;
}

declare global {
  interface Window {
    naver: any;
  }
}

const RestaurantMap: React.FC<RestaurantMapProps> = ({
  placeName,
  address,
  coordinates,
  onClose,
  onDirections
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapCoordinates, setMapCoordinates] = useState<MapCoordinates | null>(coordinates || null);

  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = async () => {
      try {
        // 네이버 지도 API 동적 로드
        // @ts-ignore - Vite 환경 변수
        const clientId = (import.meta.env.VITE_NAVER_CLIENT_ID as string) || '';

        if (!clientId) {
          setError('네이버 지도 API 키가 설정되지 않았습니다.');
          setIsLoading(false);
          return;
        }

        // 네이버 지도 API가 이미 로드되었는지 확인
        if (!window.naver || !window.naver.maps) {
          // 스크립트 동적 로드
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}&submodules=geocoder`;
          script.async = true;

          script.onload = () => {
            createMap();
          };

          script.onerror = () => {
            setError('네이버 지도 API를 불러오는데 실패했습니다.');
            setIsLoading(false);
          };

          document.head.appendChild(script);
          return;
        }

        createMap();
      } catch (err) {
        console.error('Map initialization error:', err);
        setError('지도를 불러오는데 실패했습니다.');
        setIsLoading(false);
      }
    };

    const createMap = () => {
      try {
        if (!window.naver || !window.naver.maps) {
          setError('네이버 지도 API를 불러올 수 없습니다.');
          setIsLoading(false);
          return;
        }

        // 좌표가 없으면 주소로 Geocoding 시도
        let finalCoordinates = mapCoordinates;

        if (!finalCoordinates && address) {
          (async () => {
            try {
              const response = await fetch(`/api/map/geocode?address=${encodeURIComponent(address)}`);
              if (response.ok) {
                const data = await response.json();
                finalCoordinates = data.coordinates;
                setMapCoordinates(finalCoordinates);
                // Re-center map if created
                if (mapInstanceRef.current && finalCoordinates) {
                  const newCenter = new window.naver.maps.LatLng(finalCoordinates.latitude, finalCoordinates.longitude);
                  mapInstanceRef.current.setCenter(newCenter);
                  if (markerRef.current) {
                    markerRef.current.setPosition(newCenter);
                  }
                }
              }
            } catch (err) {
              console.warn('Geocoding failed:', err);
            }
          })();
        }

        // 기본 좌표 (신촌 캠퍼스)
        if (!finalCoordinates) {
          finalCoordinates = {
            latitude: 37.5642,
            longitude: 126.9370
          };
        }

        // 지도 초기화
        const mapOptions = {
          center: new window.naver.maps.LatLng(finalCoordinates.latitude, finalCoordinates.longitude),
          zoom: 15,
          zoomControl: true,
          zoomControlOptions: {
            position: window.naver.maps.Position.TOP_RIGHT
          }
        };

        const map = new window.naver.maps.Map(mapRef.current, mapOptions);
        mapInstanceRef.current = map;

        // 마커 생성
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(finalCoordinates.latitude, finalCoordinates.longitude),
          map: map,
          title: placeName
        });
        markerRef.current = marker;

        // 정보창 생성
        const infoWindow = new window.naver.maps.InfoWindow({
          content: `
            <div style="padding: 10px; min-width: 150px;">
              <div style="font-weight: bold; margin-bottom: 5px;">${placeName}</div>
              ${address ? `<div style="font-size: 12px; color: #666;">${address}</div>` : ''}
            </div>
          `
        });

        // 마커 클릭 시 정보창 표시
        window.naver.maps.Event.addListener(marker, 'click', () => {
          infoWindow.open(map, marker);
        });

        setIsLoading(false);
      } catch (err) {
        console.error('Map creation error:', err);
        setError('지도를 생성하는데 실패했습니다.');
        setIsLoading(false);
      }
    };

    initMap();

    // cleanup
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [placeName, address, coordinates, mapCoordinates]);

  const handleDirections = () => {
    if (mapCoordinates && onDirections) {
      onDirections(mapCoordinates);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-800">{placeName}</h3>
            {address && (
              <p className="text-sm text-gray-500 mt-1">{address}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {mapCoordinates && onDirections && (
              <button
                onClick={handleDirections}
                className="flex items-center gap-2 px-4 py-2 bg-yonsei-blue text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <Navigation size={16} />
                길찾기
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="닫기"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yonsei-blue mx-auto mb-4"></div>
                <p className="text-gray-600">지도를 불러오는 중...</p>
              </div>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
              <div className="text-center p-6">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          )}
          <div
            ref={mapRef}
            className="w-full h-full"
            style={{ minHeight: '400px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default RestaurantMap;

