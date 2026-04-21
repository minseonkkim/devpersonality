# Dev Personality — 전체 아키텍처 설계

> 버전: v1.0 · 작성일: 2026-04-17  
> 스택: Next.js · FastAPI · Redis · GitHub REST API

---

## 목차

1. [시스템 아키텍처](#1-시스템-아키텍처)
2. [API 설계](#2-api-설계)
3. [데이터베이스 설계](#3-데이터베이스-설계)
4. [프론트엔드 구조](#4-프론트엔드-구조)
5. [데이터 흐름](#5-데이터-흐름)
6. [배포 구조](#6-배포-구조)

---

## 1. 시스템 아키텍처

```
┌──────────────────────────────────────────────────────────┐
│                        Client                            │
│              Next.js (App Router + SSR)                  │
└────────────────────────┬─────────────────────────────────┘
                         │ HTTPS
┌────────────────────────▼─────────────────────────────────┐
│                    FastAPI Backend                        │
│                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │  Auth Layer  │  │ Analyze Layer│  │  Badge Layer   │  │
│  │ GitHub OAuth │  │ Scoring Eng. │  │ Sharp SVG Gen  │  │
│  └──────┬──────┘  └──────┬───────┘  └───────┬────────┘  │
│         │                │                   │           │
│  ┌──────▼────────────────▼───────────────────▼────────┐  │
│  │                   Redis                             │  │
│  │  sessions · analysis cache · badge cache            │  │
│  └─────────────────────────────────────────────────────┘  │
│                         │                                 │
│  ┌──────────────────────▼──────────────────────────────┐  │
│  │             GitHub REST API v3                       │  │
│  │  /repos · /commits · /events · /users               │  │
│  └─────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### 컴포넌트 책임

| 컴포넌트 | 책임 |
|---|---|
| Next.js | 페이지 렌더링, OAuth 리다이렉트, OG 이미지 라우트 |
| FastAPI | 인증, 분석 오케스트레이션, 배지 생성 |
| Scoring Engine | GitHub 데이터 → 지표 계산 → 8개 유형 점수화 |
| Redis | 세션 토큰, 분석 결과 캐시(24h), 배지 캐시 |
| GitHub REST API | raw 활동 데이터 수집 |

---

## 2. API 설계

### Base URL
```
Production : https://api.dev-personality.com/v1
Development: http://localhost:8000/v1
```

### 2-1. 인증 (Auth)

#### GitHub OAuth 시작
```
GET /auth/github/login
```
- 응답: `302 Redirect → GitHub OAuth 페이지`
- Query: `?redirect_uri=<callback_url>`

#### OAuth 콜백
```
GET /auth/github/callback
```
- Query: `?code=<github_code>&state=<csrf_token>`
- 응답:
```json
{
  "access_token": "jwt_token_here",
  "expires_in": 604800,
  "user": {
    "github_id": 12345,
    "login": "octocat",
    "avatar_url": "https://...",
    "name": "Octocat"
  }
}
```

#### 현재 사용자 조회
```
GET /auth/me
Authorization: Bearer <token>
```
- 응답: `User` 객체

#### 로그아웃
```
DELETE /auth/logout
Authorization: Bearer <token>
```

---

### 2-2. 분석 (Analyze)

#### 분석 시작
```
POST /analyze
Authorization: Bearer <token>
```
- Body:
```json
{
  "username": "octocat",
  "period": 30
}
```
- `period`: `30 | 90 | 180` (일)
- 응답:
```json
{
  "job_id": "uuid-v4",
  "status": "pending",
  "estimated_seconds": 4
}
```

#### 분석 상태 폴링
```
GET /analyze/status/{job_id}
```
- 응답:
```json
{
  "job_id": "uuid",
  "status": "running | completed | failed",
  "progress": {
    "step": "야간 활동 비율 계산 중...",
    "percent": 60
  }
}
```

#### 분석 결과 조회
```
GET /analyze/{username}?period=30
```
- 캐시 히트 시 즉시 반환 (Redis TTL: 24h)
- 응답:
```json
{
  "username": "octocat",
  "period": 30,
  "analyzed_at": "2026-04-17T12:00:00Z",
  "primary_type": {
    "id": "gardener",
    "name_ko": "꾸준형",
    "name_en": "Gardener",
    "emoji": "🌱",
    "confidence": 72,
    "description": "작은 변화를 꾸준히 쌓아가는 개발 스타일입니다."
  },
  "secondary_type": null,
  "axes": [
    { "left": "꾸준함", "right": "몰아치기", "score": 22 },
    { "left": "정밀",   "right": "대담",     "score": 35 },
    { "left": "전문",   "right": "탐험",     "score": 41 },
    { "left": "주간",   "right": "야간",     "score": 12 }
  ],
  "scores": {
    "gardener": 72,
    "sprinter": 18,
    "architect": 31,
    "hacker": 22,
    "researcher": 15,
    "craftsman": 58,
    "explorer": 11,
    "builder": 44
  }
}
```

---

### 2-3. 배지 (Badge)

#### SVG 배지
```
GET /badge/{username}.svg
```
- Query: `?period=30` (기본값 30)
- Content-Type: `image/svg+xml`
- Cache-Control: `public, max-age=86400`
- shields.io 호환 포맷

```xml
<!-- 출력 예시 -->
<svg ...>꾸준형 🌱 | Gardener</svg>
```

#### OG 이미지 (SNS 공유)
```
GET /badge/{username}/og.png
```
- Content-Type: `image/png`
- 1200×630 px, Sharp로 생성

---

### 2-4. 유형 정보 (Types)

#### 전체 유형 목록
```
GET /types
```
- 응답: 8개 유형 정적 데이터 배열

#### 단일 유형 상세
```
GET /types/{slug}
```
- `slug`: `gardener | sprinter | architect | hacker | researcher | craftsman | explorer | builder`

---

### 에러 응답 포맷

```json
{
  "error": {
    "code": "GITHUB_RATE_LIMIT",
    "message": "GitHub API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.",
    "retry_after": 60
  }
}
```

| HTTP 코드 | 에러 코드 | 원인 |
|---|---|---|
| 401 | `UNAUTHORIZED` | 토큰 없음 / 만료 |
| 403 | `PRIVATE_REPO` | private repo 접근 불가 |
| 429 | `GITHUB_RATE_LIMIT` | GitHub API 한도 초과 |
| 404 | `USER_NOT_FOUND` | GitHub 사용자 없음 |
| 503 | `ANALYSIS_FAILED` | 분석 처리 실패 |

---

## 3. 데이터베이스 설계

### Redis 스키마

Redis를 단일 저장소로 사용 (MVP). Phase 2에서 PostgreSQL 추가.

#### 세션
```
KEY  : session:{jwt_jti}
TYPE : Hash
TTL  : 604800 (7일)

Fields:
  github_id     → "12345"
  login         → "octocat"
  github_token  → "<encrypted_github_token>"
  created_at    → "2026-04-17T12:00:00Z"
```

#### 분석 작업 (Job)
```
KEY  : job:{job_id}
TYPE : Hash
TTL  : 3600 (1시간)

Fields:
  status        → "pending | running | completed | failed"
  username      → "octocat"
  period        → "30"
  step          → "야간 활동 비율 계산 중..."
  percent       → "60"
  error         → "" (실패 시 메시지)
```

#### 분석 결과 캐시
```
KEY  : analysis:{username}:{period}
TYPE : String (JSON)
TTL  : 86400 (24시간)

Value: AnalysisResult JSON
```

#### 배지 캐시
```
KEY  : badge:{username}:{period}
TYPE : String (SVG text)
TTL  : 86400 (24시간)
```

#### GitHub 토큰 → Rate Limit 추적
```
KEY  : ratelimit:{github_token_hash}
TYPE : Hash
TTL  : 3600

Fields:
  remaining  → "4823"
  reset_at   → "2026-04-17T13:00:00Z"
```

---

### Phase 2 — PostgreSQL 스키마

Phase 2부터 분석 결과 영구 저장 및 시계열 추적을 위해 추가.

```sql
-- 사용자
CREATE TABLE users (
  id           BIGSERIAL PRIMARY KEY,
  github_id    BIGINT UNIQUE NOT NULL,
  login        VARCHAR(39) NOT NULL,
  avatar_url   TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW()
);

-- 분석 결과
CREATE TABLE analysis_results (
  id           BIGSERIAL PRIMARY KEY,
  user_id      BIGINT REFERENCES users(id),
  period_days  SMALLINT NOT NULL,        -- 30 | 90 | 180
  primary_type VARCHAR(20) NOT NULL,     -- 'gardener' 등
  secondary_type VARCHAR(20),
  confidence   SMALLINT NOT NULL,        -- 0-100
  scores       JSONB NOT NULL,           -- {gardener: 72, ...}
  evidence     JSONB NOT NULL,           -- [{label, value}, ...]
  raw_metrics  JSONB NOT NULL,           -- 원본 지표값 보관
  analyzed_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, period_days, analyzed_at::DATE)  -- 하루 1회
);

CREATE INDEX idx_analysis_user_period ON analysis_results(user_id, period_days);
CREATE INDEX idx_analysis_type ON analysis_results(primary_type);

-- 공유 이벤트 (바이럴 추적)
CREATE TABLE share_events (
  id          BIGSERIAL PRIMARY KEY,
  username    VARCHAR(39) NOT NULL,
  channel     VARCHAR(20) NOT NULL,  -- 'badge' | 'twitter' | 'linkedin' | 'url'
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. 프론트엔드 구조

### 디렉토리 트리

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (폰트, OG 기본값)
│   ├── page.tsx                  # 랜딩 페이지
│   ├── auth/
│   │   └── callback/
│   │       └── page.tsx          # GitHub OAuth 콜백 처리
│   ├── analyze/
│   │   └── page.tsx              # 분석 기간 선택 + 트리거
│   ├── result/
│   │   └── [username]/
│   │       ├── page.tsx          # 결과 페이지 (SSR + 캐시)
│   │       └── opengraph-image.tsx  # 동적 OG 이미지
│   ├── badge/
│   │   └── [username]/
│   │       └── page.tsx          # 배지 생성기 + 복사
│   └── types/
│       └── page.tsx              # 8가지 유형 소개
│
├── components/
│   ├── result/
│   │   ├── PersonalityCard.tsx   # 메인 결과 카드 (유형 + 확률)
│   │   ├── SpectrumAxes.tsx      # 4개 축 MBTI 스타일 스펙트럼 바
│   │   ├── ScoreRadar.tsx        # 8개 유형 점수 레이더 차트
│   │   └── SharePanel.tsx        # 배지/SNS/URL 공유 패널
│   ├── analyze/
│   │   ├── PeriodSelector.tsx    # 30/90/180일 선택
│   │   └── AnalysisProgress.tsx  # 단계별 로딩 애니메이션
│   ├── landing/
│   │   ├── HeroSection.tsx
│   │   ├── TypeShowcase.tsx      # 8개 유형 미리보기 카드
│   │   └── HowItWorks.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Badge.tsx             # shields.io 스타일 미리보기
│       └── TypeBadge.tsx         # 유형 이모지 + 이름 칩
│
├── lib/
│   ├── api/
│   │   ├── client.ts             # fetch wrapper (base URL, auth header)
│   │   ├── auth.ts               # 인증 API 호출
│   │   └── analyze.ts            # 분석 API 호출 + 폴링 로직
│   ├── types.ts                  # TypeScript 타입 정의
│   ├── personality-types.ts      # 8개 유형 정적 데이터
│   └── utils.ts                  # 날짜 포맷, confidence 색상 등
│
├── hooks/
│   ├── useAuth.ts                # 로그인 상태 관리
│   ├── useAnalysis.ts            # 분석 시작 + 폴링 상태
│   └── useClipboard.ts           # 배지 코드 복사
│
└── store/
    └── auth.ts                   # Zustand: 사용자 세션 상태
```

---

### 핵심 페이지별 책임

#### `/` 랜딩 페이지
- GitHub OAuth 로그인 CTA
- 8가지 유형 미리보기 카드
- "내 결과 보기" 바이럴 예시 표시

#### `/analyze` 분석 페이지
- 기간 선택 UI (30 / 90 / 180일)
- 분석 시작 버튼
- 단계별 진행 애니메이션:
  ```
  1. 커밋 패턴 분석 중...    (1s)
  2. 야간 활동 비율 계산 중... (1s)
  3. 언어 다양성 확인 중...   (1s)
  4. 성향 도출 중...          (1s)
  ```
- 완료 시 `/result/{username}` 으로 이동

#### `/result/[username]` 결과 페이지
- `PersonalityCard` — 유형명 + 확률 + 한 줄 설명
- `SpectrumAxes` — 4개 축 스펙트럼 바 (꾸준함↔몰아치기, 정밀↔대담, 전문↔탐험, 주간↔야간)
- `ScoreRadar` — 8개 유형 점수 레이더
- `SharePanel` — 배지 코드 / 트위터 / 링크드인 / URL 공유

#### `/badge/[username]` 배지 페이지
- 배지 미리보기 (SVG 렌더링)
- Markdown 복사 버튼
- HTML 복사 버튼

---

### 상태 관리 전략

```
Server State  → TanStack Query  (API 응답 캐시, 폴링)
Client State  → Zustand         (사용자 세션, 선택 기간)
URL State     → Next.js params  (username, period)
```

---

### TypeScript 핵심 타입

```typescript
type PersonalityTypeId =
  | 'gardener' | 'sprinter' | 'architect' | 'hacker'
  | 'researcher' | 'craftsman' | 'explorer' | 'builder';

interface PersonalityType {
  id: PersonalityTypeId;
  name_ko: string;
  name_en: string;
  emoji: string;
  confidence: number;          // 0-100
  description: string;
}

interface SpectrumAxis {
  left: string;   // 왼쪽 극단 레이블
  right: string;  // 오른쪽 극단 레이블
  score: number;  // 0(왼쪽) ~ 100(오른쪽)
}

interface AnalysisResult {
  username: string;
  period: 30 | 90 | 180;
  analyzed_at: string;
  primary_type: PersonalityType;
  secondary_type: PersonalityType | null;
  axes: SpectrumAxis[];
  scores: Record<PersonalityTypeId, number>;
}

interface AnalysisJob {
  job_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress?: {
    step: string;
    percent: number;
  };
}
```

---

## 5. 데이터 흐름

### OAuth 로그인 흐름

```
사용자 → "GitHub 로그인" 클릭
  → GET /auth/github/login
  → 302 Redirect → GitHub OAuth
  → 사용자 승인
  → GitHub → GET /auth/github/callback?code=xxx
  → FastAPI: code → GitHub Access Token 교환
  → FastAPI: GitHub Token → User 정보 조회
  → JWT 발급 + Redis session 저장
  → 302 Redirect → /analyze (with JWT in cookie)
```

### 분석 흐름

```
사용자 → 기간 선택 → "분석 시작"
  → POST /analyze {username, period}
  → FastAPI: job_id 발급, Redis에 job 저장
  → Background Task 시작:
      1. GitHub API: /repos (최근 100개)
      2. GitHub API: 각 repo의 /commits (병렬 요청, 최대 5개)
      3. 지표 계산: 활동일, 커밋 크기, 야간 비율, 언어 다양성
      4. 스코어링 엔진: 8개 유형 × 가중치 합산
      5. 결과 → Redis 캐시 저장
  → 클라이언트: GET /analyze/status/{job_id} 1초마다 폴링
  → 완료 → GET /analyze/{username}?period=30
  → 결과 화면 렌더링
```

### 배지 요청 흐름

```
GitHub README → GET /badge/{username}.svg
  → Redis 캐시 확인
  → 히트: SVG 즉시 반환 (Cache-Control: 24h)
  → 미스: 최신 분석 결과 조회 → SVG 생성 → 캐시 저장
```

---

## 6. 배포 구조

### MVP (Phase 1)

```
Vercel (Next.js)
  ↕
Railway or Render (FastAPI)
  ↕
Upstash Redis (서버리스 Redis)
```

### 환경 변수

**FastAPI (.env)**
```
APP_ENV=development
APP_PORT=8000
ALLOWED_ORIGINS=["http://localhost:3000"]

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

**Next.js (.env)**
```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000

GITHUB_CLIENT_ID=
```

---

## 설계 결정 사항 (ADR)

| # | 결정 | 이유 |
|---|---|---|
| 1 | 분석을 Background Task로 처리 | GitHub API 다수 호출로 응답 3~5초 소요 — SSE 폴링으로 UX 보완 |
| 2 | Redis 단독 사용 (MVP) | PostgreSQL 없이 빠른 출시. Phase 2에서 시계열 필요 시 추가 |
| 3 | 배지를 FastAPI에서 생성 | Sharp(Node)는 서버리스 콜드스타트가 느림 — Python + cairosvg 또는 별도 Node 마이크로서비스 검토 |
| 4 | JWT + Redis 세션 혼합 | Stateless(JWT)의 편의 + Redis로 강제 로그아웃 가능 |
| 5 | 분석 결과 24h 캐시 | GitHub 데이터가 실시간으로 바뀌지 않음. Rate Limit 절약 |
