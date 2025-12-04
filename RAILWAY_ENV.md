# Railway 환경 변수 설정 가이드

Railway 대시보드의 **Settings → Variables**에서 다음 환경 변수들을 설정하세요.

## 필수 환경 변수

### 1. `NODE_ENV`
```
NODE_ENV=production
```
- **용도**: 프로덕션 모드 활성화 (프론트엔드 정적 파일 서빙)
- **필수**: ✅ 예

### 2. `JWT_SECRET`
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```
- **용도**: JWT 토큰 서명 및 검증
- **필수**: ✅ 예
- **주의**: 강력한 랜덤 문자열 사용 권장

### 3. `GEMINI_API_KEY`
```
GEMINI_API_KEY=your-gemini-api-key-here
```
- **용도**: Google Gemini API 호출 (프론트엔드 빌드 시 주입)
- **필수**: ✅ 예
- **참고**: [Google AI Studio](https://makersuite.google.com/app/apikey)에서 발급

## 자동 설정되는 변수 (설정 불필요)

### `PORT`
- Railway가 자동으로 설정
- 서버 포트 번호

### `RAILWAY_PUBLIC_DOMAIN`
- Railway가 자동으로 설정
- 생성된 공개 도메인 (예: `your-app.railway.app`)

## 선택적 환경 변수

### `FRONTEND_URL`
```
FRONTEND_URL=https://your-custom-domain.com
```
- **용도**: CORS 설정 (커스텀 도메인 사용 시)
- **필수**: ❌ 아니오
- **참고**: 커스텀 도메인을 사용하지 않으면 설정 불필요

## 네이버 지도 API

### `VITE_NAVER_CLIENT_ID` (프론트엔드)
```
VITE_NAVER_CLIENT_ID=your-naver-client-id
```
- **용도**: 네이버 지도 Dynamic Map API 클라이언트 ID
- **필수**: ✅ 예 (지도 기능 사용 시)
- **참고**: [네이버 클라우드 플랫폼 콘솔](https://console.ncloud.com/)에서 발급
- **주의**: `VITE_` 접두사 필수 (Vite 환경 변수)

### `NAVER_CLIENT_ID` (백엔드)
```
NAVER_CLIENT_ID=your-naver-client-id
```
- **용도**: 네이버 지도 Geocoding API 클라이언트 ID
- **필수**: ✅ 예 (지도 기능 사용 시)
- **참고**: 프론트엔드와 동일한 Client ID 사용 가능

### `NAVER_CLIENT_SECRET` (백엔드)
```
NAVER_CLIENT_SECRET=your-naver-client-secret
```
- **용도**: 네이버 지도 Geocoding API 클라이언트 시크릿
- **필수**: ✅ 예 (지도 기능 사용 시)
- **참고**: [네이버 클라우드 플랫폼 콘솔](https://console.ncloud.com/)에서 발급

### `X_NCP_APIGW_API_KEY` (백엔드)
```
X_NCP_APIGW_API_KEY=your-api-gateway-key
```
- **용도**: 네이버 지도 Directions 5 API Gateway 키
- **필수**: ✅ 예 (길찾기 기능 사용 시)
- **참고**: [네이버 클라우드 플랫폼 콘솔](https://console.ncloud.com/)에서 발급
- **주의**: Directions 5 API는 무료 5건/일 제한이 있습니다

## 환경 변수 설정 방법

1. Railway 대시보드 접속
2. 프로젝트 선택
3. **Settings** 탭 클릭
4. **Variables** 섹션에서 **New Variable** 클릭
5. 변수 이름과 값 입력
6. **Add** 클릭

## 최소 필수 설정 예시

```
NODE_ENV=production
JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_NAVER_CLIENT_ID=your-naver-client-id
NAVER_CLIENT_ID=your-naver-client-id
NAVER_CLIENT_SECRET=your-naver-client-secret
X_NCP_APIGW_API_KEY=your-api-gateway-key
```

## 로컬 개발 환경 설정

로컬 개발 시 다음 파일에 환경 변수를 설정하세요:

### 루트 `.env` (프론트엔드)
```
VITE_NAVER_CLIENT_ID=your-naver-client-id
```

### `server/.env` (백엔드)
```
NAVER_CLIENT_ID=your-naver-client-id
NAVER_CLIENT_SECRET=your-naver-client-secret
X_NCP_APIGW_API_KEY=your-api-gateway-key
```

## 주의사항

- 환경 변수는 배포 후에도 수정 가능합니다
- 민감한 정보(API 키, 시크릿)는 절대 GitHub에 커밋하지 마세요
- `.env` 파일은 `.gitignore`에 포함되어 있습니다
- 환경 변수 변경 후 재배포가 필요할 수 있습니다

