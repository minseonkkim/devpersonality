# Dev 8ersonality — 실행 매뉴얼

> 요구 환경: Python 3.10+, Node.js 20+

---

## 1. 저장소 클론

```bash
git clone https://github.com/<your-id>/dev8ersonality.git
cd dev8ersonality
```

---

## 2. GitHub OAuth App 등록

1. GitHub → Settings → Developer settings → OAuth Apps → **New OAuth App**
2. 아래 값으로 등록:

| 항목                       | 값                                               |
| -------------------------- | ------------------------------------------------ |
| Application name           | Dev 8ersonality (local)                          |
| Homepage URL               | `http://localhost:3000`                          |
| Authorization callback URL | `http://localhost:3000/api/auth/github/callback` |

3. 생성 후 **Client ID** 와 **Client Secret** 을 복사해둔다.

---

## 3. 환경 변수 설정

### 백엔드 (`backend/.env`)

```
APP_ENV=development
APP_PORT=8000
ALLOWED_ORIGINS=["http://localhost:3000"]

GITHUB_CLIENT_ID=<복사한 Client ID>
GITHUB_CLIENT_SECRET=<복사한 Client Secret>
```

### 프론트엔드 (`frontend/.env`)

```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000

GITHUB_CLIENT_ID=<복사한 Client ID>
```

---

## 4. 백엔드 실행

```bash
cd backend

# 가상환경 생성 (최초 1회)
python -m venv .venv

# 가상환경 활성화
# macOS / Linux
source .venv/bin/activate
# Windows
.venv\Scripts\activate

# 의존성 설치 (최초 1회)
pip install -r requirements.txt

# 서버 실행
uvicorn main:app --reload --port 8000
```

→ `http://localhost:8000/docs` 에서 Swagger UI 확인 가능 (개발 모드 한정)

---

## 5. 프론트엔드 실행

```bash
cd frontend

# 의존성 설치 (최초 1회)
npm install

# 개발 서버 실행
npm run dev
```

→ `http://localhost:3000` 에서 확인

---

## 6. 동작 확인

1. `http://localhost:3000` 접속
2. **GitHub 로그인** 버튼 클릭
3. GitHub 권한 승인 후 분석 결과 페이지로 이동

---

## 7. 자주 발생하는 문제

| 증상                    | 원인                           | 해결                                          |
| ----------------------- | ------------------------------ | --------------------------------------------- |
| `GITHUB_CLIENT_ID` 오류 | env 파일 누락                  | 3단계 환경 변수 확인                          |
| CORS 오류               | `ALLOWED_ORIGINS` 불일치       | backend/.env의 포트 번호 확인                 |
| OAuth callback 실패     | GitHub App callback URL 불일치 | GitHub OAuth App 설정에서 callback URL 재확인 |
| 백엔드 연결 안됨        | 백엔드 미실행                  | 4단계 서버 실행 여부 확인                     |
