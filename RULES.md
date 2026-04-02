# ArcadeDeck Development Rules

## 1. 새 게임 추가 시 체크리스트

새 게임을 추가할 때 **`src/data/games.json`만 수정**하면 됩니다. 다른 파일을 직접 수정하지 마세요.

### 필수 필드

```json
{
  "id": "15",
  "title": "Game Title",
  "titleKo": "게임 제목",
  "description": "Short description",
  "descriptionKo": "짧은 설명",
  "fullDescription": "...",
  "fullDescriptionKo": "...",
  "controls": "...",
  "controlsKo": "...",
  "tips": "...",
  "tipsKo": "...",
  "lore": "...",
  "loreKo": "...",
  "features": ["Feature 1", "Feature 2"],
  "featuresKo": ["특징 1", "특징 2"],
  "thumbnail": "images/game-thumbnail.webp",
  "genres": ["Action"],
  "gameUrl": "https://...",
  "aspectRatio": "16/9",
  "status": "PLAYABLE",
  "isOriginal": true,
  "leaderboard": {
    "title": "Game Leaderboard",
    "primaryLabel": "Score",
    "primaryUnit": "",
    "secondaryLabel": "Level",
    "secondaryUnit": "",
    "dualSort": true,
    "subSortAsc": false
  }
}
```

### `leaderboard` 필드 설명

| 필드 | 타입 | 설명 |
|------|------|------|
| `title` | string | 리더보드 제목 |
| `primaryLabel` | string | 주 점수 라벨 (예: `"Score"`, `"Waves"`) |
| `primaryUnit` | string | 주 점수 단위 (예: `" pts"`, `"%"`, `""`) |
| `secondaryLabel` | string | 부 점수 라벨. 없으면 `""` |
| `secondaryUnit` | string | 부 점수 단위 접두사 (예: `"Lv."`) |
| `dualSort` | boolean | `true`면 Firestore 쿼리에 `orderBy("subScore")` 추가 |
| `subSortAsc` | boolean | `true`면 동점 시 subScore가 낮을수록 유리 (Gem Merge 방식) |

### 게임 추가 후 해야 할 일

- [ ] `public/sitemap.xml`에 `/play/{id}` URL 추가
- [ ] `public/images/`에 WebP 썸네일 추가 (`convert_to_webp.cjs` 활용)
- [ ] `firebase deploy --only firestore:rules` — rules 변경 시에만

---

## 2. 보안 규칙

### Firestore

- `leaderboards` 업데이트 시 `name`, `gameId` 필드는 **변경 불가** (rules에서 강제)
- `score`는 `0 이상 10,000,000 이하`만 허용
- `comments` 텍스트는 **300자 이하**, 닉네임은 **30자 이하**
- Firestore rules 수정 후 반드시 배포: `firebase deploy --only firestore:rules --project ultragames-website`

### postMessage (게임 점수 수신)

- `event.origin`이 해당 게임의 iframe 도메인과 일치해야만 처리
- `score`는 `0 이상 10,000,000 이하`, `isFinite(score)`인 경우만 제출
- 위 조건을 벗어나는 메시지는 **조용히 무시** (alert/error 없이)

### 금지 사항

- `allow update: if true` — Firestore rules에 절대 사용 금지
- `// @ts-ignore` — 타입 선언(`declare global`)으로 해결할 것
- `any` 타입 — 명시적 인터페이스 정의로 대체

---

## 3. 성능 규칙

### GlobalLeaderboard (Hall of Fame)

- Firestore 쿼리 결과는 **5분 TTL 캐싱** (`rankCache` 모듈 변수)
- 수동 새로고침(🔄 버튼)만 캐시를 무효화
- `Promise.all`로 병렬 실행 유지 — 순차 실행 금지

### CommentSection

- 초기 로드는 **최신 20개**만 (`limit(20)`)
- 추가 로드는 `startAfter` 커서 기반 페이지네이션
- `onSnapshot` 실시간 구독 사용 금지 (비용 및 성능 이슈)

### 코드 분할

- `App.tsx`에서 `Home` 제외 모든 페이지는 `React.lazy`로 지연 로드
- `Suspense` fallback은 빈 화면(`<div style={{ minHeight: '100vh' }} />`) 유지
- 새 페이지 추가 시 반드시 `lazy(() => import('./pages/NewPage'))` 사용

---

## 4. 코드 품질 규칙

### TypeScript

- `any` 타입 사용 금지 — 인터페이스를 명시적으로 정의
- 외부 전역 객체(window 등)는 `declare global { interface Window {...} }` 으로 선언
- `verbatimModuleSyntax` 활성화 상태 → 타입 import는 반드시 `import type` 사용

### 컴포넌트

- 모든 라우트는 `<ErrorBoundary>`로 감싸져 있음 — 별도 try/catch UI 불필요
- 점수 표시 문자열은 `games.json`의 `leaderboard` 설정에서 읽어올 것
- 게임 ID를 코드에 직접 작성하는 것 (`id === '7'` 등) 금지

### 파일 구조

```
src/
├── components/   # 재사용 컴포넌트 (CSS 동일 폴더)
├── pages/        # 라우트 페이지
├── data/
│   ├── games.json    # 게임 데이터 (단일 진실의 원천)
│   └── games.ts      # Game / LeaderboardConfig 타입 정의 + export
├── constants/    # 금지어 등 상수
└── firebase.ts   # Firestore 초기화
```

---

## 5. 배포 절차

```bash
# 1. 빌드
npm run build

# 2. Firestore rules만 배포 (rules 변경 시)
cd e:\WebGame\ArcadeDeck
firebase deploy --only firestore:rules --project ultragames-website

# 3. 전체 배포 (hosting + rules)
firebase deploy --project ultragames-website
```

> Firebase CLI가 없는 경우: `npm install -g firebase-tools` → `firebase login`

---

## 6. 이미지 규칙

- 포맷: **WebP만 사용** (`convert_to_webp.cjs` 스크립트 활용)
- 경로: `public/images/` → 참조 시 `"images/파일명.webp"`
- 아이콘: `192x192`, `512x512` 두 가지 필요 (PWA manifest)
- 썸네일 권장 비율: 게임 `aspectRatio` 값과 일치시킬 것
