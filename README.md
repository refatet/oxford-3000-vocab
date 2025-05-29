# Oxford 3000 Vocabulary Learning App

옥스포드 3000 핵심 단어를 기반으로 한 영어 학습 애플리케이션입니다. 단어 카드, 퀴즈, 읽으면서 듣기(RWL) 기능을 통해 효과적인 영어 학습을 지원합니다.

## 🚀 Quick Start

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 테스트 실행
npm test

# 프로덕션 빌드
npm run build

# 빌드 결과물 미리보기
npm run preview
```

## 📋 주요 기능

- **단어 카드**: 옥스포드 3000 핵심 단어를 카드 형식으로 학습
- **인터랙티브 퀴즈**: 학습한 단어를 테스트하고 복습
- **읽으면서 듣기(RWL)**: 문장 속에서 단어를 익히는 기능
- **학습 진행률 추적**: 개인 맞춤형 학습 진행 상황 확인
- **레벨업 및 업적 시스템**: 게이미피케이션을 통한 학습 동기 부여
- **스마트 복습 알고리즘**: Leitner 시스템을 활용한 효율적인 복습

## 🔧 기술 스택

- React + TypeScript
- Vite
- Tailwind CSS
- Jest + React Testing Library
- Firebase Hosting

## 📦 배포 가이드

### Firebase 배포

1. Firebase CLI 설치 (이미 설치되어 있음)
   ```bash
   npm install -g firebase-tools
   ```

2. Firebase 로그인
   ```bash
   firebase login
   ```

3. 프로젝트 초기화 (이미 설정되어 있음)
   ```bash
   firebase init
   ```

4. 배포
   ```bash
   npm run deploy
   ```

### GitHub Actions를 통한 자동 배포

1. GitHub 저장소에 다음 시크릿을 설정:
   - `FIREBASE_SERVICE_ACCOUNT_OXFORD_3000_VOCAB`: Firebase 서비스 계정 키

2. `main` 브랜치에 푸시하면 자동으로 CI/CD 파이프라인이 실행됩니다.

## 🧪 테스트

```bash
# 모든 테스트 실행
npm test

# 테스트 커버리지 확인
npm run test:coverage
```

- 테스트 커버리지 기준: 80% (브랜치, 함수, 라인, 구문)

## 📁 프로젝트 구조

```
oxford-3000-vocab/
├─ package.json         # 의존성 및 스크립트
├─ tsconfig.json        # TypeScript 설정
├─ vite.config.ts       # Vite 설정
├─ tailwind.config.js   # Tailwind CSS 설정
├─ jest.config.js       # Jest 테스트 설정
├─ .eslintrc.js         # ESLint 설정
├─ .prettierrc          # Prettier 설정
├─ firebase.json        # Firebase 설정
├─ .firebaserc          # Firebase 프로젝트 설정
├─ public/              # 정적 파일
│  └─ index.html        # HTML 템플릿
├─ src/                 # 소스 코드
│  ├─ components/       # UI 컴포넌트
│  │  ├─ ui/            # 기본 UI 요소
│  │  └─ ...            # 기타 컴포넌트
│  ├─ pages/            # 페이지 컴포넌트
│  ├─ services/         # 서비스 로직
│  ├─ contexts/         # React Context
│  ├─ hooks/            # 커스텀 훅
│  ├─ utils/            # 유틸리티 함수
│  ├─ types/            # TypeScript 타입 정의
│  ├─ __tests__/        # 테스트 코드
│  ├─ App.tsx           # 앱 컴포넌트
│  └─ index.tsx         # 진입점
└─ .github/             # GitHub 설정
   └─ workflows/        # GitHub Actions 워크플로
      ├─ ci.yml         # CI 워크플로
      └─ firebase-hosting-merge.yml # 배포 워크플로
```

## ⚠️ 주의사항

### 빌드 시 주의사항
- Node.js 18.x 이상 버전 필요
- 환경 변수는 `.env` 파일에 설정 (필요한 경우)
- 빌드 결과물은 `dist` 디렉토리에 생성됨

### 테스트 시 주의사항
- 테스트 커버리지 80% 이상 유지 필요
- 모든 테스트는 `src/__tests__` 디렉토리에 위치

### 배포 시 주의사항
- Firebase 프로젝트 ID: `oxford-3000-vocab`
- 배포 전 반드시 테스트 실행 권장
- GitHub Actions를 통한 자동 배포 시 필요한 시크릿 설정 확인

## 🔄 개발 워크플로

1. 기능 개발
2. 테스트 작성 및 실행
3. 린트 및 포맷팅 검사
4. 커밋 및 푸시
5. CI/CD 파이프라인 통과 확인
6. 배포 완료

## 📝 라이선스

MIT License
