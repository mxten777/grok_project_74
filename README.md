# Annual Leave Manager (연차 관리 시스템)

연차·휴가 관리를 위한 현대적인 웹 애플리케이션입니다. 직원과 관리자가 실시간으로 연차 신청, 승인, 조회를 할 수 있습니다.

## 🚀 주요 기능

### 직원 기능
- **연차 잔여일 확인**: 개인 대시보드에서 남은 연차 일수 확인
- **연차 신청**: 날짜 범위 선택, 사유 입력, 첨부파일 지원
- **신청 내역 조회**: 승인/반려/대기 상태별 내역 확인
- **실시간 알림**: 신청 상태 변경 시 알림
- **풍부한 대시보드**: 최근 신청 내역, 상태 통계, 휴가 캘린더, 빠른 액션

### 관리자 기능
- **직원 관리**: 직원 목록 조회, 연차 기본일수 설정
- **신청 관리**: 모든 연차 신청 승인/거절
- **통계 대시보드**: 월별/연도별 휴가 통계, 실시간 데이터
- **CSV 다운로드**: 신청 데이터 내보내기
- **관리자 대시보드**: 회사 전체 통계, 최근 활동 피드, 빠른 관리 액션

### 공통 기능
- **Firebase 인증**: 이메일/비밀번호 기반 로그인
- **역할 기반 접근**: 직원(user) / 관리자(admin) 권한 분리
- **실시간 데이터**: Firestore를 통한 실시간 반영
- **반응형 디자인**: 모바일 최적화 UI
- **다크모드 지원**: 테마 전환
- **프리미엄 UI/UX**: Montserrat 폰트, 미니멀 디자인, 헤더/푸터 레이아웃 (추후 구현)

## 🛠 기술 스택

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v3.4 + 커스텀 디자인 시스템
- **Backend**: Firebase (Auth, Firestore, Storage, Functions)
- **Routing**: React Router v6
- **UI Components**: Headless UI + Framer Motion
- **Date Handling**: date-fns + react-day-picker
- **Deployment**: Vercel

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 UI 컴포넌트
│   ├── AdminDashboard.tsx
│   └── EmployeeDashboard.tsx
├── pages/               # 라우팅 페이지 컴포넌트
│   ├── Login.tsx        # 로그인 페이지
│   ├── Dashboard.tsx    # 메인 대시보드
│   ├── LeaveApply.tsx   # 연차 신청
│   ├── LeaveHistory.tsx # 연차 내역 조회
│   ├── AdminRequests.tsx    # 관리자: 신청 관리
│   ├── AdminEmployees.tsx   # 관리자: 직원 관리
│   └── AdminStatistics.tsx  # 관리자: 통계
├── contexts/            # React Context 상태 관리
│   └── DarkModeContext.tsx
├── firebase/            # Firebase 설정 및 초기화
│   └── config.ts
├── types/               # TypeScript 타입 정의
│   └── index.ts
├── utils/               # 유틸리티 함수들
│   ├── dateUtils.ts     # 날짜 관련 함수
│   ├── validation.ts    # 폼 유효성 검사
│   └── constants.ts     # 공통 상수
├── App.tsx              # 메인 애플리케이션 컴포넌트
├── main.tsx             # 애플리케이션 진입점
└── index.css            # 글로벌 스타일
```

## 🗄 Firestore 데이터 구조

### users 컬렉션
```json
{
  "uid": "firebase-user-id",
  "name": "홍길동",
  "role": "user", // "user" | "admin"
  "annualLeaveTotal": 20,
  "annualLeaveUsed": 0,
  "companyId": "company-id", // 다중 회사 지원
  "createdAt": "2025-12-06T00:00:00.000Z"
}
```

### leaveRequests 컬렉션
```json
{
  "id": "auto-generated",
  "userId": "firebase-user-id",
  "companyId": "company-id", // 다중 회사 지원
  "startDate": "2025-12-10T00:00:00.000Z",
  "endDate": "2025-12-12T00:00:00.000Z",
  "reason": "개인 사유",
  "status": "pending", // "pending" | "approved" | "rejected"
  "createdAt": "2025-12-06T10:00:00.000Z"
}
```

## 🚀 설치 및 실행

### 사전 요구사항
- Node.js 18+
- npm 또는 yarn
- Firebase 프로젝트

### 설치
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### Firebase 설정
1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
2. Authentication 활성화 (이메일/비밀번호)
3. Firestore Database 생성
4. 프로젝트 설정 > 웹 앱 추가 > config 복사
5. `src/firebase/config.ts`에 config 붙여넣기

### 테스트 사용자 추가
Firebase Console > Authentication > Users에서 테스트 계정 추가
- 이메일: test@example.com
- 비밀번호: password123

Firestore > users 컬렉션에 문서 추가 (UID는 Auth에서 복사)
```json
{
  "name": "테스트 사용자",
  "role": "user",
  "annualLeaveTotal": 20,
  "annualLeaveUsed": 0,
  "createdAt": "2025-12-06T00:00:00.000Z"
}
```

## 🎨 디자인 시스템

### 색상 팔레트
- Primary: Blue (#3B82F6)
- Secondary: Gray (#64748B)
- Success: Green (#22C55E)
- Warning: Yellow (#F59E0B)
- Danger: Red (#EF4444)

### 타이포그래피
- 헤드라인: Montserrat Bold
- 본문: Montserrat Regular
- 모노스페이스: JetBrains Mono

### 컴포넌트 스타일
- 둥근 모서리: 8px
- 그림자: subtle box-shadow
- 애니메이션: Framer Motion

## 📱 사용법

### 직원으로 로그인
1. `/login`에서 이메일/비밀번호 입력
2. 대시보드에서 연차 잔여일 확인
3. "연차 신청" 클릭 > 날짜 선택 > 사유 입력 > 제출
4. "내역 조회"에서 신청 상태 확인

### 관리자로 로그인
1. role이 "admin"인 계정으로 로그인
2. "신청 관리"에서 대기 중인 신청 승인/반려
3. "직원 관리", "통계 보기" 메뉴 (추후 구현)

## 🔧 개발 가이드

### 코드 스타일
- TypeScript strict 모드 활성화
- ESLint 설정으로 코드 품질 관리
- 컴포넌트별 일관된 스타일링 패턴
- 커밋 메시지: Conventional Commits

### 환경 변수
`.env.local` 파일 생성:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 개발 환경 설정
- Node.js 18+ 필수
- Vite 개발 서버로 HMR 지원
- Tailwind CSS IntelliSense 확장 권장

### 빌드 및 배포
```bash
# 빌드
npm run build

# 미리보기
npm run preview

# Vercel 배포
npm install -g vercel
vercel --prod
```

## ✅ 현재 구현 상태

### 완료된 기능
- [x] Firebase 인증 시스템
- [x] 사용자 역할 기반 접근 제어
- [x] 연차 신청/조회/관리 기본 기능
- [x] 반응형 UI 디자인
- [x] 다크모드 지원
- [x] 첨부파일 업로드 기능
- [x] 통계 대시보드 (차트, CSV 다운로드, 필터링)
- [x] 직원 관리 페이지
- [x] 캘린더 뷰
- [x] 프리미엄 UI/UX (헤더/푸터, Montserrat 폰트, 미니멀 디자인)

### 진행 중인 작업
- [ ] 실시간 알림 시스템 (브라우저 알림 구현 완료)
- [ ] 고급 통계 및 리포트 기능 (PDF 내보내기 코드 추가, 빌드 오류로 임시 비활성화)
- [ ] 푸시 알림 (브라우저 알림으로 구현)

## 🔮 향후 개선사항

### Phase 2
- [x] 첨부파일 업로드 (Firebase Storage)
- [ ] 이메일 알림 (Cloud Functions)
- [x] 직원 관리 페이지 완성
- [x] 고급 통계 및 리포트 기능 (PDF 내보내기)
- [x] 캘린더 뷰
- [x] CSV/Excel 내보내기

### Phase 3
- [x] 푸시 알림 (브라우저 알림 구현)
- [x] 다중 회사 지원
- [ ] 모바일 앱 (React Native)

## 📄 라이선스

MIT License

## 👥 기여

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📞 문의

이슈나 질문이 있으시면 [GitHub Issues](https://github.com/your-repo/issues)로 연락주세요.
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
