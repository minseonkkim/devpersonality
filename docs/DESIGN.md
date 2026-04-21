# Dev Personality — 디자인 시스템

> 버전: v1.0 · 작성일: 2026-04-17  
> 픽셀 아트 캐릭터를 중심으로 한 레트로-개발자 감성 UI

---

## 목차

1. [디자인 방향성](#1-디자인-방향성)
2. [컬러 시스템](#2-컬러-시스템)
3. [타이포그래피](#3-타이포그래피)
4. [픽셀 아트 사용 규칙](#4-픽셀-아트-사용-규칙)
5. [유형별 색상 및 스프라이트](#5-유형별-색상-및-스프라이트)
6. [컴포넌트 스타일 가이드](#6-컴포넌트-스타일-가이드)
7. [페이지별 레이아웃 방향](#7-페이지별-레이아웃-방향)
8. [모션 & 인터랙션](#8-모션--인터랙션)

---

## 1. 디자인 방향성

### 핵심 컨셉: **"Retro Dev Terminal"**

> 픽셀 아트 캐릭터가 살아 숨쉬는 개발자 감성 UI

GitHub의 어두운 분위기를 기반으로 하되, 레트로 게임의 픽셀 감성을 입힌 스타일. 
8비트 게임처럼 각 유형의 캐릭터가 결과 화면에서 살아있는 존재처럼 느껴지게 한다.

### 3가지 키워드

| 키워드 | 의미 |
|--------|------|
| **Pixel** | 모든 UI 요소가 픽셀 캐릭터와 어울리는 방식으로 설계 |
| **Terminal** | 개발자 친화적인 모노스페이스 느낌, 코드 에디터 감성 |
| **Alive** | 캐릭터가 단순한 이미지가 아닌 결과의 "얼굴"처럼 느껴지도록 |

### 무드 레퍼런스

- GitHub Dark 테마 (`#0d1117` 배경)
- 레트로 JRPG 결과 화면 (FF, 포켓몬 배틀 결과)
- VS Code 다크 테마 + 터미널 컬러
- shields.io 배지 UI

---

## 2. 컬러 시스템

### 베이스 팔레트

```
배경 (Base)       #0d1117   GitHub Dark — 스프라이트가 돋보이는 최어두운 배경
표면 (Surface)    #161b22   카드 · 패널 배경
경계선 (Border)   #30363d   섹션 구분선
텍스트 기본       #e6edf3   본문 텍스트
텍스트 보조       #8b949e   설명 · 메타 텍스트
텍스트 희미       #484f58   비활성 · 플레이스홀더
```

### 강조 팔레트

```
GitHub 링크   #58a6ff   GitHub 로그인 버튼, 링크
성공 / 완료   #3fb950   분석 완료 상태
경고          #d29922   주의 메시지
에러          #f85149   에러 상태
```

### 사용 원칙

- **배경에 흰색을 쓰지 않는다.** 스프라이트가 흰 배경을 가지고 있어 대비가 필요.
- **강조 포인트는 유형 색상** — 각 유형의 대표 색상을 accent로 사용.
- **그라디언트는 최소화** — 사용 시 두 색상만, 수직 또는 대각선 방향만 허용.
- **투명도 오버레이** — `bg-white/5`, `bg-white/10` 같은 미묘한 오버레이로 깊이감 표현.

---

## 3. 타이포그래피

### 폰트 역할 분리

| 역할 | 폰트 | 적용 위치 |
|------|------|-----------|
| **메인 타이틀** | `Press Start 2P` (Google Fonts) | h1 랜딩 타이틀, 결과 유형명 |
| **UI 본문** | `Geist Sans` (기존 설정 유지) | 설명 · 버튼 · 라벨 |
| **코드 · 수치** | `Geist Mono` | 점수 숫자, 지표 값, 배지 코드 |

> `Press Start 2P`는 픽셀 아트와 직접 연결되는 폰트. 제목과 유형명에만 제한적으로 사용해 레트로 포인트를 준다. 본문에 쓰면 가독성이 떨어지므로 금지.

### 타이포 스케일

```
유형명 (결과 화면)   : Press Start 2P, 20px, leading-loose
페이지 타이틀        : Press Start 2P, 14–16px
섹션 서브타이틀      : Geist Sans, 18–22px, font-bold
본문                 : Geist Sans, 14–16px, text-zinc-400
수치 · 점수          : Geist Mono, 14px, tabular-nums
```

---

## 4. 픽셀 아트 사용 규칙

### 스프라이트 렌더링

```css
/* 픽셀이 뭉개지지 않게 — 가장 중요한 규칙 */
image-rendering: pixelated;

/* Tailwind에서 */
style={{ imageRendering: 'pixelated' }}
```

- **절대 안티앨리어싱 금지.** `image-rendering: pixelated` 항상 적용.
- **크기는 원본의 정수배**만 허용 — 64px, 128px, 192px, 256px (원본이 ~64px 기준).
- **배경 처리**: 스프라이트는 흰 배경을 가짐 → 카드 배경색을 `#161b22`로 사용하거나, PNG의 흰 픽셀을 투명 처리한 버전 별도 제작 필요 (Phase 2).

### 스프라이트 사이즈 가이드

| 사용 위치 | 표시 크기 |
|-----------|-----------|
| 랜딩 유형 카드 미리보기 | 64 × 64 px |
| 결과 페이지 메인 | 192 × 192 px |
| OG / SNS 이미지 | 256 × 256 px |
| 배지 (SVG 내) | 32 × 32 px |

### 픽셀 아트 테마 UI 요소

스프라이트와 어울리는 UI를 만들기 위해 아래 요소를 활용한다.

**픽셀 보더**: 기본 `rounded` 대신 **sharp corners** + 내부 그림자
```css
/* 픽셀 느낌의 박스 */
border: 2px solid #30363d;
box-shadow: 2px 2px 0px #000;
border-radius: 0;  /* 둥근 모서리 금지 */
```

**픽셀 버튼 효과**:
```css
/* 클릭 시 픽셀 눌림 효과 */
active:translate-y-0.5 active:shadow-none
```

---

## 5. 유형별 색상 및 스프라이트

각 유형의 대표 색상은 스프라이트 의상 색상에서 추출했다.

| ID | 유형명 | 대표 색상 | Hex | 스프라이트 의상 |
|----|--------|-----------|-----|----------------|
| `gardener` | 꾸준형 | 초록 | `#4CAF50` | 초록 후드, 물뿌리개 |
| `sprinter` | 몰입형 | 빨강-주황 | `#FF5722` | 빨간 수트, 불꽃 |
| `architect` | 설계형 | 인디고 | `#3B5EDE` | 파란 수트, 청사진 |
| `hacker` | 실험형 | 라임 그린 | `#00C853` | 검정 후드, 터미널 |
| `researcher` | 탐구형 | 틸 | `#009688` | 청록 재킷, 책 |
| `craftsman` | 장인형 | 앰버 | `#FF8F00` | 갈색 외투, 클래퍼보드 |
| `explorer` | 탐험형 | 스카이 블루 | `#29B6F6` | 하늘색 수트, 배낭 |
| `builder` | 빌더형 | 딥 오렌지 | `#E53935` | 빨간 수트, 드럼통 |

### 유형 색상 사용 방법

```tsx
// 유형 ID → 색상 매핑
const TYPE_COLORS: Record<string, string> = {
  gardener:   '#4CAF50',
  sprinter:   '#FF5722',
  architect:  '#3B5EDE',
  hacker:     '#00C853',
  researcher: '#009688',
  craftsman:  '#FF8F00',
  explorer:   '#29B6F6',
  builder:    '#E53935',
};

// 결과 카드 글로우 효과
boxShadow: `0 0 24px ${TYPE_COLORS[typeId]}40`  // 25% opacity
```

---

## 6. 컴포넌트 스타일 가이드

### 카드 (Card)

```
배경      : #161b22
테두리    : 2px solid #30363d
모서리    : 0px (sharp, 픽셀 느낌)
그림자    : 4px 4px 0px #000
패딩      : 24px
```

결과 카드는 유형 대표 색상으로 테두리 + 글로우:
```
border-color : TYPE_COLOR
box-shadow   : 4px 4px 0px #000, 0 0 24px TYPE_COLOR + "33"
```

### 버튼

**Primary (GitHub 로그인)**
```
배경      : #ffffff
텍스트    : #0d1117
테두리    : none
모서리    : 0px
그림자    : 4px 4px 0px #8b949e
hover     : bg #f0f6fc, translate-y -1px
active    : translate-y 1px, shadow none  ← 픽셀 눌림
```

**Secondary**
```
배경      : transparent
텍스트    : #e6edf3
테두리    : 2px solid #30363d
모서리    : 0px
hover     : border-color #58a6ff
```

**Type Accent (유형별 CTA)**
```
배경      : TYPE_COLOR
텍스트    : #0d1117 (어두운 텍스트)
모서리    : 0px
그림자    : 4px 4px 0px TYPE_COLOR_DARK
```

### 배지 (TypeBadge)

```
배경      : TYPE_COLOR + "1a"   (10% opacity)
텍스트    : TYPE_COLOR
테두리    : 1px solid TYPE_COLOR + "4d"  (30% opacity)
모서리    : 0px
폰트      : Geist Mono, 11px, uppercase, tracking-wider
패딩      : 2px 8px
```

### 진행 바 (AnalysisProgress)

```
트랙 배경  : #21262d
채움 색상  : 현재 단계 TYPE_COLOR 또는 #58a6ff
모서리     : 0px
높이       : 4px
애니메이션 : CSS transition 0.3s ease
```

픽셀 스타일 세그먼트 바 옵션:
```
블록 단위로 채워지는 진행 바 (8px 블록 + 1px gap)
```

### 훅 카피 (HookQuote)

결과 카드 내 유형 뱃지 아래, 설명 텍스트 위에 배치하는 공감 한 줄 문구.

```
배경      : TYPE_COLOR + "0d"   (5% opacity)
테두리    : 1px solid TYPE_COLOR + "33"  (20% opacity)
텍스트    : TYPE_COLOR
폰트      : Geist Mono, 12px
패딩      : 10px 16px
정렬      : center
형식      : ❝ ... ❞  (typographic quotes)
```

각 유형별 훅 카피는 `TYPE_META[type].hook`에 정의. 사용자가 "맞다!" 하고 공감할 수 있는 개발 습관 묘사.

### 점수 레이더 차트

- 일반 curved 레이더 대신 **각진 폴리곤** 사용 (pixel-friendly)
- 선 색상: 유형별 `TYPE_COLOR`
- 채움: `TYPE_COLOR + "33"` (20% opacity)
- 그리드 선: `#30363d`
- 레이블 폰트: Geist Mono, 10px

---

## 7. 페이지별 레이아웃 방향

### 랜딩 페이지 (`/`)

```
┌─────────────────────────────────────┐
│  Header: "Dev Personality"  로고     │  배경: #0d1117
├─────────────────────────────────────┤
│                                     │
│    [픽셀 타이틀 - Press Start 2P]    │
│    "당신의 코딩 스타일은?"            │
│                                     │
│    [설명 텍스트 - Geist Sans]         │
│                                     │
│    ■ GitHub로 분석 시작하기           │  흰 버튼 + 픽셀 그림자
│                                     │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐              │
│  │  │ │  │ │  │ │  │  ...8개 유형   │  스프라이트 64px 미리보기 카드
│  └──┘ └──┘ └──┘ └──┘              │
│                                     │
└─────────────────────────────────────┘
```

8개 유형 카드는 스크롤 없이 2×4 또는 4×2 그리드. 각 카드는 유형 색상 테두리.

### 결과 페이지 (`/result/[username]`)

```
┌─────────────────────────────────────┐
│                                     │
│  ┌──────────────────────────────┐   │
│  │  [스프라이트 96px]            │   │  메인 결과 카드
│  │  유형 뱃지 (Geist Mono)      │   │  border: TYPE_COLOR
│  │  ❝ 훅 카피 (공감 한 줄) ❞    │   │  bg: TYPE_COLOR 5%
│  │  긴 설명 (#8b949e)           │   │  glow: TYPE_COLOR
│  └──────────────────────────────┘   │
│                                     │
│  [성향 스펙트럼 — 4개 축]             │  MBTI 스타일 바
│  꾸준함 ████░░░░░░ 몰아치기          │  우세한 쪽에서 채워짐
│  정밀   ███░░░░░░░ 대담              │  퍼센트 표시
│                                     │
│  [유형 궁합]                          │
│  ✅ 잘 맞는 유형  ❌ 안 맞는 유형    │
│  [스프라이트] 장인형  [스프라이트] 몰입형 │
│  이유 한 줄         이유 한 줄       │
│                                     │
│  [공유 패널]                         │
│  □ X에 공유하기  □ 다시 분석하기     │
│                                     │
└─────────────────────────────────────┘
```

### 분석 로딩 페이지 (`/analyze`)

```
중앙에 현재 분석 중인 단계 텍스트 (타이핑 애니메이션)
+ 픽셀 세그먼트 프로그레스 바
+ 배경에 매우 흐린 스프라이트 실루엣 (힌트)
```

---

## 8. 모션 & 인터랙션

### 원칙

- **픽셀 애니메이션은 step 기반** — `transition-timing-function: steps(N)` 사용
- **부드러운 애니메이션은 UI 요소에만** — 버튼 hover, 카드 진입 등
- **스프라이트 자체 애니메이션** — CSS sprite sheet 또는 GIF (Phase 2)

### 주요 모션

| 요소 | 모션 | 구현 |
|------|------|------|
| 결과 카드 진입 | 아래에서 올라오며 등장 | `translateY(16px) → 0`, 300ms ease-out |
| 스프라이트 등장 | 위에서 바운스 | `translateY(-8px) → 0`, steps(4), 200ms |
| 스프라이트 아이들 | 위아래 플로팅 | `translateY(0) ↔ translateY(-6px)`, 2s ease-in-out infinite (`animate-float`) |
| 버튼 클릭 | 픽셀 눌림 | `translateY(0) → translateY(2px)`, 즉시 |
| 점수 바 채움 | 블록 단위 채워짐 | `width: 0 → N%`, steps(8), 800ms delay |
| 타이핑 텍스트 | 커서 깜빡이며 한 글자씩 | CSS animation, steps(1) |

### 호버 효과

```css
/* 유형 카드 hover */
.type-card:hover {
  border-color: TYPE_COLOR;
  box-shadow: 4px 4px 0px TYPE_COLOR;  /* 컬러 그림자로 변경 */
  transform: translate(-2px, -2px);
}
```

---

## Appendix. 빠른 참조

### 핵심 클래스 조합 (Tailwind)

```tsx
// 픽셀 카드
"bg-[#161b22] border-2 border-[#30363d] p-6"
// + style={{ boxShadow: '4px 4px 0px #000' }}

// 픽셀 버튼 (Primary)
"bg-white text-[#0d1117] font-bold px-6 py-3 border-0"
// + style={{ boxShadow: '4px 4px 0px #8b949e' }}

// 유형 배지
"font-mono text-xs uppercase tracking-wider px-2 py-0.5"
// + 인라인 style로 TYPE_COLOR 적용

// 스프라이트 이미지
"block"
// + style={{ imageRendering: 'pixelated', width: 192, height: 192 }}
```

### 금지 사항

- `rounded-full`, `rounded-xl` 등 둥근 모서리 — 픽셀 감성과 충돌
- `backdrop-blur` 글래스모피즘 — 레트로 감성과 상반됨
- 흰 배경 (`bg-white`) — 스프라이트와 구분 불가
- `transition ease-in-out` 부드러운 스프라이트 이동 — steps 기반 사용
- 과도한 그라디언트 — 포인트 1개로 제한
