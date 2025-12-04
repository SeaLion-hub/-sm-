# Y-Nutri Backend Server

백엔드 서버는 학식 메뉴 크롤링과 주변 식당 정보를 제공합니다.

## 설치 및 실행

1. 의존성 설치:
```bash
cd server
npm install
```

2. 환경 변수 설정 (선택사항):
```bash
cp .env.example .env
# .env 파일을 열어 필요한 설정 추가
```

3. 개발 서버 실행:
```bash
npm run dev
```

서버는 기본적으로 `http://localhost:3001`에서 실행됩니다.

## API 엔드포인트

### GET /api/cafeteria
학식 메뉴 조회

**Query Parameters:**
- `campus` (required): "신촌 캠퍼스" 또는 "국제 캠퍼스 (송도)"
- `date` (optional): YYYY-MM-DD 형식의 날짜 (기본값: 오늘)

**Example:**
```
GET /api/cafeteria?campus=신촌 캠퍼스&date=2024-01-15
```

### GET /api/restaurants
주변 식당 정보 조회

**Query Parameters:**
- `campus` (required): "신촌 캠퍼스" 또는 "국제 캠퍼스 (송도)"
- `limit` (optional): 반환할 식당 수 (기본값: 20)

**Example:**
```
GET /api/restaurants?campus=신촌 캠퍼스&limit=10
```

## 주의사항

- 학식 메뉴 크롤링은 연세대학교 생활협동조합 페이지 구조에 의존합니다.
- 페이지 구조가 변경되면 `server/services/cafeteriaScraper.ts`의 파싱 로직을 수정해야 합니다.
- 실제 운영 환경에서는 Redis 등을 사용한 캐싱을 권장합니다.

