"""
Dev Personality — 픽셀 아트 캐릭터 생성기 v2
좌표 기반 드로잉으로 소품을 크고 명확하게 재디자인
"""
from PIL import Image
import os

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))
SCALE = 8
K = (30, 30, 30, 255)

def canvas():
    return Image.new("RGBA", (32, 32), (0, 0, 0, 0))

def save(img, name):
    img = img.resize((32 * SCALE, 32 * SCALE), Image.NEAREST)
    img.save(os.path.join(OUTPUT_DIR, f"{name}.png"))
    print(f"saved → {name}.png")

def dot(img, x, y, c):
    if 0 <= x < 32 and 0 <= y < 32:
        img.putpixel((x, y), c)

def box(img, x, y, w, h, c):
    for r in range(y, min(y + h, 32)):
        for cc in range(x, min(x + w, 32)):
            dot(img, cc, r, c)

def frame(img, x, y, w, h, fill, border=K):
    box(img, x, y, w, h, fill)
    for cc in range(x, min(x + w, 32)):
        dot(img, cc, y, border)
        dot(img, cc, min(y + h - 1, 31), border)
    for r in range(y, min(y + h, 32)):
        dot(img, x, r, border)
        dot(img, min(x + w - 1, 31), r, border)

def row(img, x, y, n, c):
    for cc in range(x, min(x + n, 32)):
        dot(img, cc, y, c)

def col(img, x, y, n, c):
    for r in range(y, min(y + n, 32)):
        dot(img, x, r, c)

def circle(img, cx, cy, r, fill, border=K):
    for y in range(cy - r - 1, cy + r + 2):
        for x in range(cx - r - 1, cx + r + 2):
            d = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5
            if d <= r - 0.5:
                dot(img, x, y, fill)
            elif d <= r + 0.7:
                dot(img, x, y, border)

def head(img, x, y, skin, hair):
    frame(img, x, y, 6, 5, skin)
    row(img, x, y, 6, hair)
    row(img, x, y + 1, 3, hair)
    dot(img, x + 1, y + 3, K)
    dot(img, x + 4, y + 3, K)
    dot(img, x + 2, y + 4, K)
    dot(img, x + 3, y + 4, K)

def body(img, x, y, shirt, dark):
    frame(img, x, y, 6, 7, shirt)
    col(img, x + 1, y + 1, 5, dark)

def harm(img, x, y, n, skin):
    row(img, x, y, n, skin)
    dot(img, x, y - 1, K); dot(img, x + n - 1, y - 1, K)
    dot(img, x, y + 1, K); dot(img, x + n - 1, y + 1, K)

def varm(img, x, y, n, skin):
    col(img, x, y, n, skin)
    dot(img, x - 1, y, K); dot(img, x + 1, y, K)
    dot(img, x - 1, y + n - 1, K); dot(img, x + 1, y + n - 1, K)

def legs(img, x, y, c):
    frame(img, x, y, 2, 7, c)
    frame(img, x + 3, y, 2, 7, c)


# ── 1. Gardener 🌱 ────────────────────────────────
def gardener():
    S = (255, 218, 185, 255); H = (101, 67, 33, 255)
    G = (76, 175, 80, 255);   g = (56, 142, 60, 255)
    W = (100, 181, 246, 255); w = (66, 165, 245, 255)
    P = (121, 85, 72, 255);   Y = (255, 235, 59, 255)
    y = (249, 168, 37, 255)
    img = canvas()

    # 큰 꽃 (오른쪽, 꽃잎 각 4px)
    for dx in [-4, -3, 3, 4]:
        col(img, 24 + dx, 3, 4, Y)
    for dy in [-4, -3, 3, 4]:
        row(img, 21, 3 + dy, 8, Y)
    frame(img, 21, 3, 8, 8, y)   # 꽃 중심
    box(img, 22, 4, 6, 6, Y)     # 중심 밝게

    # 줄기
    col(img, 24, 11, 14, g)
    col(img, 25, 11, 14, G)

    # 잎사귀
    frame(img, 18, 14, 6, 3, G)
    frame(img, 25, 18, 6, 3, G)

    # 화분 (크게)
    frame(img, 19, 25, 13, 6, P)
    row(img, 19, 26, 13, (78, 52, 46, 255))

    # 물뿌리개 (9x6)
    frame(img, 7, 13, 9, 5, W)
    box(img, 8, 14, 7, 3, w)
    row(img, 8, 12, 6, W)
    dot(img, 8, 12, K); dot(img, 13, 12, K)
    # 주둥이
    row(img, 16, 15, 3, W); row(img, 16, 16, 3, w)
    dot(img, 16, 14, K); dot(img, 18, 14, K)
    dot(img, 16, 17, K); dot(img, 18, 17, K)
    # 물줄기
    for i in range(5):
        dot(img, 19 + i, 16 + i, w)
        dot(img, 19 + i, 17 + i, w)

    # 캐릭터
    head(img, 0, 4, S, H)
    body(img, 0, 9, G, g)
    harm(img, 6, 15, 3, S)
    legs(img, 1, 16, g)

    save(img, "gardener")


# ── 2. Sprinter 🏃 ────────────────────────────────
def sprinter():
    S = (255, 218, 185, 255); H = (30, 30, 30, 255)
    R = (229, 57, 53, 255);   r = (183, 28, 28, 255)
    C = (255, 193, 7, 255);   c = (255, 160, 0, 255)
    img = canvas()

    # 속도선 5개 (매우 두드러지게, 오른쪽 절반)
    speeds = [(2, 26), (6, 22), (10, 18), (14, 14), (18, 10)]
    for sy, length in speeds:
        row(img, 32 - length, sy, length, (255, 120, 60, 120))
        row(img, 32 - length, sy, length - 3, (255, 80, 30, 200))
        dot(img, 32 - length, sy, K)
        dot(img, 31, sy, K)

    # 에너지 드링크 캔 (6x14, 매우 크게)
    frame(img, 23, 1, 7, 14, C)
    box(img, 24, 2, 5, 12, c)
    row(img, 23, 7, 7, (255, 220, 100, 255))
    row(img, 23, 8, 7, (255, 220, 100, 255))
    # 뚜껑
    frame(img, 24, 1, 5, 2, (220, 220, 220, 255))
    # 라벨 !!
    dot(img, 26, 4, K); dot(img, 26, 5, K); dot(img, 26, 6, K)
    dot(img, 26, 10, K)

    # 캐릭터 (앞으로 기울인 달리기 포즈)
    head(img, 4, 1, S, H)
    body(img, 3, 6, R, r)
    # 오른팔 (캔 방향으로 뻗음)
    harm(img, 9, 7, 8, S)
    # 왼팔
    harm(img, 0, 11, 4, S)
    # 다리 (달리는 포즈)
    frame(img, 4, 13, 2, 8, r)
    frame(img, 2, 13, 2, 5, r)

    save(img, "sprinter")


# ── 3. Architect 🧱 ────────────────────────────────
def architect():
    S = (255, 218, 185, 255); H = (80, 50, 20, 255)
    B = (63, 81, 181, 255);   b = (40, 53, 147, 255)
    N = (200, 220, 255, 255); n = (130, 160, 220, 255)
    Y = (255, 235, 59, 255)
    img = canvas()

    # 청사진 (오른쪽, 15x24 — 이미지 절반)
    frame(img, 15, 2, 17, 28, N)
    box(img, 16, 3, 15, 26, n)

    # 그리드 선
    for gx in range(19, 31, 4):
        col(img, gx, 3, 26, (100, 140, 200, 255))
    for gy in range(6, 29, 4):
        row(img, 16, gy, 15, (100, 140, 200, 255))

    # 도면 마킹
    frame(img, 18, 8, 5, 4, (180, 200, 255, 255))
    frame(img, 24, 14, 5, 5, (180, 200, 255, 255))
    row(img, 17, 20, 12, B)
    row(img, 17, 21, 12, B)

    # 연필 (굵게, 세로로)
    frame(img, 12, 3, 3, 18, Y)
    box(img, 13, 3, 1, 18, (240, 220, 100, 255))
    frame(img, 12, 21, 3, 4, (200, 180, 160, 255))
    dot(img, 13, 25, K)

    # 캐릭터
    head(img, 1, 4, S, H)
    body(img, 1, 9, B, b)
    harm(img, 7, 11, 5, S)
    legs(img, 2, 16, b)

    save(img, "architect")


# ── 4. Hacker ⚡ ────────────────────────────────
def hacker():
    S = (210, 185, 155, 255); H = (20, 20, 20, 255)
    D = (45, 45, 55, 255);    d = (25, 25, 35, 255)
    MF = (20, 30, 20, 255)    # 모니터 프레임
    MG = (0, 220, 80, 255)    # 화면 초록
    mg = (0, 140, 50, 255)    # 코드 텍스트
    F  = (255, 220, 0, 255)   # 번개
    img = canvas()

    # 어두운 배경
    box(img, 0, 0, 32, 32, (15, 20, 25, 220))

    # 큰 모니터 (오른쪽, 15x16)
    frame(img, 15, 2, 16, 16, MF)
    box(img, 16, 3, 14, 14, MG)

    # 코드 라인
    for ly in range(4, 16, 2):
        ln = 8 + (ly % 3) * 2
        row(img, 17, ly, min(ln, 12), mg)

    # 번개 마크 (크게)
    lightning = [
        (25, 4), (24, 5), (23, 6),
        (24, 6), (25, 6),
        (24, 7), (23, 8),
        (22, 9), (23, 9), (24, 9),
        (23, 10), (22, 11)
    ]
    for lx, ly in lightning:
        dot(img, lx, ly, F)

    # 모니터 받침
    row(img, 20, 18, 6, MF)
    row(img, 18, 19, 10, MF)

    # 캐릭터 (화면 앞, 얼굴에 초록빛)
    head(img, 1, 4, S, H)
    body(img, 0, 9, D, d)
    harm(img, 6, 11, 8, D)
    legs(img, 1, 16, d)

    # 눈에 초록 반사
    dot(img, 3, 7, (0, 255, 100, 255))
    dot(img, 6, 7, (0, 255, 100, 255))

    # 키보드
    frame(img, 0, 22, 14, 4, (50, 55, 60, 255))
    for kx in range(1, 13, 2):
        dot(img, kx, 23, (80, 90, 90, 255))
        dot(img, kx, 24, (80, 90, 90, 255))

    save(img, "hacker")


# ── 5. Researcher 📚 ────────────────────────────────
def researcher():
    S = (255, 218, 185, 255); H = (60, 40, 10, 255)
    T = (38, 166, 154, 255);  t = (0, 121, 107, 255)
    G = (210, 210, 210, 255)  # 돋보기 유리
    books = [
        (220, 50, 50, 255),
        (50, 100, 210, 255),
        (210, 150, 50, 255),
        (100, 50, 210, 255),
        (50, 180, 80, 255),
        (210, 60, 150, 255),
        (150, 150, 50, 255),
    ]
    img = canvas()

    # 책 더미 (왼쪽, 7권 쌓기 — 각 4px 높이)
    for i, bc in enumerate(books):
        bw = 11 - (i % 3)
        frame(img, 0, i * 4, bw, 4, bc)
        col(img, bw - 2, i * 4 + 1, 2, (240, 240, 240, 255))

    # 돋보기 (크게, 반지름 7)
    circle(img, 22, 12, 7, G)
    # 유리 내부 반사
    dot(img, 19, 9, (240, 250, 255, 255))
    dot(img, 20, 9, (240, 250, 255, 255))

    # 돋보기 안 글자 확대 효과
    for ly in range(9, 16, 2):
        row(img, 17, ly, min(8, 30 - ly), (100, 100, 200, 255))

    # 손잡이 (굵게)
    for i in range(7):
        dot(img, 27 + i // 2, 18 + i, (160, 160, 160, 255))
        dot(img, 28 + i // 2, 18 + i, K)

    # 캐릭터 (책더미 옆)
    head(img, 12, 19, S, H)
    body(img, 12, 24, T, t)

    save(img, "researcher")


# ── 6. Craftsman 🔧 ────────────────────────────────
def craftsman():
    S  = (255, 210, 170, 255); H = (100, 60, 20, 255)
    B  = (141, 110, 99, 255);  b = (93, 64, 55, 255)
    WR = (190, 190, 190, 255)  # 렌치
    wr = (130, 130, 130, 255)
    GR = (80, 200, 100, 255)   # 기어
    img = canvas()

    # 렌치 (오른쪽에 세로로, 크게)
    # 머리 위
    frame(img, 20, 0, 10, 7, WR)
    box(img, 22, 1, 6, 6, (0, 0, 0, 0))   # U형 구멍
    box(img, 22, 1, 6, 5, (200, 200, 200, 50))
    # 손잡이
    frame(img, 22, 7, 4, 20, WR)
    box(img, 23, 8, 2, 18, wr)
    # 머리 아래
    frame(img, 20, 25, 10, 6, WR)
    box(img, 22, 26, 6, 5, (0, 0, 0, 0))

    # 기어 (왼쪽 중간, 반지름 5)
    circle(img, 8, 17, 5, GR)
    # 기어 이빨 (4방향)
    for dx, dy in [(0, -5), (0, 5), (-5, 0), (5, 0)]:
        dot(img, 8 + dx, 17 + dy, GR)
        dot(img, 8 + dx * 2 // 5, 17 + dy * 2 // 5, GR)
    # 가운데 구멍
    circle(img, 8, 17, 2, (200, 220, 200, 255))
    dot(img, 8, 17, K)

    # 캐릭터
    head(img, 1, 2, S, H)
    body(img, 1, 7, B, b)
    # 오른팔 → 렌치 방향
    harm(img, 7, 9, 8, S)
    # 왼팔 → 기어 방향
    harm(img, 0, 14, 5, S)
    legs(img, 2, 14, b)

    save(img, "craftsman")


# ── 7. Explorer 🧭 ────────────────────────────────
def explorer():
    S  = (255, 218, 185, 255); H = (180, 120, 40, 255)
    A  = (66, 165, 245, 255);  a = (30, 136, 229, 255)
    CG = (255, 215, 0, 255)    # 나침반 금색
    NR = (220, 50, 50, 255)    # 바늘 빨강
    NW = (240, 240, 240, 255)  # 바늘 흰색
    img = canvas()

    # 나침반 (크게, 반지름 10, 오른쪽)
    circle(img, 22, 16, 10, (240, 235, 200, 255))

    # 테두리 금색 링
    for y in range(5, 28):
        for x in range(11, 33):
            d = ((x - 22) ** 2 + (y - 16) ** 2) ** 0.5
            if 8.5 <= d <= 10:
                dot(img, x, y, CG)

    # 방위 마크
    row(img, 21, 7, 3, (0, 0, 180, 255))   # N (북)
    row(img, 21, 24, 3, (180, 0, 0, 255))   # S (남)
    col(img, 12, 15, 3, (0, 130, 0, 255))   # W (서)
    col(img, 30, 15, 3, (130, 0, 130, 255)) # E (동)

    # 바늘 (빨강 → 북, 흰색 → 남)
    col(img, 22, 9, 7, NR)
    col(img, 21, 10, 5, NR)
    col(img, 23, 10, 5, NR)
    col(img, 22, 17, 6, NW)
    col(img, 21, 18, 4, NW)
    col(img, 23, 18, 4, NW)
    dot(img, 22, 16, K)  # 중심

    # 캐릭터 (나침반 받쳐 들고)
    head(img, 1, 3, S, H)
    body(img, 1, 8, A, a)
    harm(img, 7, 10, 4, S)
    harm(img, 7, 13, 4, S)
    legs(img, 2, 15, a)

    save(img, "explorer")


# ── 8. Builder 🛠️ ────────────────────────────────
def builder():
    S  = (255, 218, 185, 255); H = (50, 30, 10, 255)
    R  = (239, 83, 80, 255);   r = (183, 28, 28, 255)
    HM = (160, 160, 160, 255)  # 망치 금속
    hm = (100, 100, 100, 255)
    HW = (180, 130, 60, 255)   # 망치 손잡이
    BK = (200, 150, 100, 255)  # 벽돌
    img = canvas()

    # 벽돌 벽 (오른쪽 절반)
    for by in range(0, 32, 5):
        offset = 4 if (by // 5) % 2 else 0
        for bx in range(16 + offset, 32, 9):
            frame(img, bx, by, 8, 4, BK)
    # 벽돌 회반죽
    for by in range(4, 32, 5):
        row(img, 16, by, 16, (160, 120, 80, 255))

    # 망치 (크게, 대각선 스윙)
    # 머리 (9x6, 회색)
    frame(img, 6, 2, 9, 6, HM)
    box(img, 7, 3, 7, 4, hm)
    # 손잡이 (대각선)
    for i in range(12):
        dot(img, 10 - i // 3, 8 + i, HW)
        dot(img, 11 - i // 3, 8 + i, HW)
        dot(img, 11 - i // 3, 9 + i, (130, 90, 30, 255))

    # 충격 이펙트
    sparks = [(16, 5), (17, 4), (18, 5), (17, 6), (16, 3), (18, 3)]
    for sx, sy in sparks:
        dot(img, sx, sy, (255, 200, 0, 255))

    # 캐릭터
    head(img, 1, 1, S, H)
    body(img, 0, 6, R, r)
    # 오른팔 (위로 들어 망치)
    varm(img, 7, 2, 5, S)
    # 왼팔
    harm(img, 0, 11, 2, S)
    legs(img, 1, 13, r)

    save(img, "builder")


if __name__ == "__main__":
    print("Dev Personality 픽셀 아트 생성 v2...\n")
    gardener()
    sprinter()
    architect()
    hacker()
    researcher()
    craftsman()
    explorer()
    builder()
    print("\n완료!")
