<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1CvGQ7gjLlYt0UtmSXGLvcpW9YRR5ArYb

## Run Locally

**Prerequisites:**  Node.js

### 프론트엔드 실행

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. Run the app:
   ```bash
   npm run dev
   ```

### 백엔드 서버 실행

백엔드는 학식 메뉴 크롤링과 주변 식당 정보를 제공합니다.

1. 백엔드 디렉토리로 이동:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. 개발 서버 실행:
   ```bash
   npm run dev
   ```

백엔드 서버는 기본적으로 `http://localhost:3001`에서 실행되며, 프론트엔드의 Vite 프록시를 통해 자동으로 연결됩니다.

### 전체 시스템 실행

1. 터미널 1: 백엔드 서버 실행
   ```bash
   cd server
   npm run dev
   ```

2. 터미널 2: 프론트엔드 실행
   ```bash
   npm run dev
   ```

프론트엔드는 `http://localhost:3000`에서 실행됩니다.
