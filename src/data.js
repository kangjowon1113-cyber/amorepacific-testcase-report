// Synthetic/simulated dataset based on interview responses — demo purposes only.
// Extracted from 252 AI-generated IDI transcripts (Amorepacific skincare study).

export const META = {
  n: 252,
  n_female: 202,
  n_male: 50,
  method: "AI-assisted IDI (in-depth interview)",
  note: "Synthetic / simulated dataset based on interview responses. Not intended for statistical inference.",
};

export const GENDER = [
  { label: "여성 (F)", value: 202, pct: 80.2 },
  { label: "남성 (M)", value: 50, pct: 19.8 },
];

export const SKIN_TYPE = [
  { label: "건성", value: 123, pct: 48.8 },
  { label: "복합성", value: 85, pct: 33.7 },
  { label: "지성", value: 27, pct: 10.7 },
  { label: "모름/기타", value: 17, pct: 6.7 },
];

export const INVOLVEMENT = [
  { label: "High (적극적)", value: 108, pct: 42.9 },
  { label: "Medium (보통)", value: 97, pct: 38.5 },
  { label: "Low (미니멀)", value: 47, pct: 18.7 },
];

// ── Purchase Triggers ─────────────────────────────────────────────────────────

export const TRIGGER_MULTI = [
  { label: "후기/리뷰를 보고 신뢰가 가서", value: 99, pct: 39.3 },
  { label: "실제로 써보니 효과가 좋아서", value: 91, pct: 36.1 },
  { label: "기존에 사용해본 경험이 좋아서", value: 72, pct: 28.6 },
  { label: "SNS·유튜브·블로그 등을 보고", value: 65, pct: 25.8 },
  { label: "성분이 피부에 좋아 보여서", value: 62, pct: 24.6 },
  { label: "피부에 잘 맞을 것 같아서", value: 56, pct: 22.2 },
  { label: "선물로 받아서 만족해서", value: 55, pct: 21.8 },
  { label: "광고나 콘텐츠를 보고", value: 51, pct: 20.2 },
  { label: "평소에 알고 있던 브랜드라서", value: 44, pct: 17.5 },
  { label: "패키지/브랜드 느낌이 마음에 들어서", value: 40, pct: 15.9 },
  { label: "주변 사람의 추천을 받아서", value: 33, pct: 13.1 },
  { label: "브랜드 이미지가 좋아서", value: 22, pct: 8.7 },
  { label: "할인/프로모션을 보고", value: 19, pct: 7.5 },
  { label: "매장에서 테스트해보고 좋아서", value: 12, pct: 4.8 },
  { label: "매장 상담/추천에 설득이 되어서", value: 8, pct: 3.2 },
];

export const TRIGGER_SINGLE = [
  { label: "후기/리뷰를 보고 신뢰가 가서", value: 80, pct: 31.7, f: 64, m: 16 },
  { label: "실제로 써보니 효과가 좋아서", value: 74, pct: 29.4, f: 59, m: 15 },
  { label: "기존에 사용해본 경험이 좋아서", value: 20, pct: 7.9, f: 14, m: 6 },
  { label: "성분이 피부에 좋아 보여서", value: 17, pct: 6.7, f: 16, m: 1 },
  { label: "SNS·유튜브·블로그 등을 보고", value: 15, pct: 6.0, f: 15, m: 0 },
  { label: "선물로 받아서 만족해서", value: 10, pct: 4.0, f: 0, m: 10 },
  { label: "피부에 잘 맞을 것 같아서", value: 6, pct: 2.4, f: 6, m: 0 },
  { label: "광고나 콘텐츠를 보고", value: 5, pct: 2.0, f: 4, m: 1 },
  { label: "기타", value: 25, pct: 9.9, f: 24, m: 1 },
];

// ── Brand Awareness ────────────────────────────────────────────────────────────

export const TOP_BRANDS_ALL = [
  { label: "닥터지", value: 40, pct: 15.9 },
  { label: "에스트라", value: 38, pct: 15.1 },
  { label: "일리윤", value: 35, pct: 13.9 },
  { label: "스킨푸드", value: 35, pct: 13.9 },
  { label: "에뛰드", value: 34, pct: 13.5 },
  { label: "벨리프", value: 32, pct: 12.7 },
  { label: "피지오겔", value: 31, pct: 12.3 },
  { label: "이니스프리", value: 30, pct: 11.9 },
  { label: "비디비치", value: 30, pct: 11.9 },
  { label: "미샤", value: 30, pct: 11.9 },
  { label: "토리든", value: 29, pct: 11.5 },
  { label: "오휘", value: 30, pct: 11.9 },
  { label: "설화수", value: 27, pct: 10.7 },
  { label: "프리메라", value: 26, pct: 10.3 },
  { label: "아이오페", value: 25, pct: 9.9 },
];

// ── Amorepacific Brand Awareness ───────────────────────────────────────────────

export const AP_BRANDS = [
  { label: "에스트라", value: 38, pct: 15.1, f: 33, m: 5 },
  { label: "일리윤", value: 35, pct: 13.9, f: 29, m: 6 },
  { label: "에뛰드", value: 34, pct: 13.5, f: 29, m: 5 },
  { label: "이니스프리", value: 30, pct: 11.9, f: 27, m: 3 },
  { label: "비디비치", value: 30, pct: 11.9, f: 28, m: 2 },
  { label: "오휘", value: 30, pct: 11.9, f: 27, m: 3 },
  { label: "설화수", value: 27, pct: 10.7, f: 24, m: 3 },
  { label: "프리메라", value: 26, pct: 10.3, f: 24, m: 2 },
  { label: "아이오페", value: 25, pct: 9.9, f: 22, m: 3 },
  { label: "헤라", value: 24, pct: 9.5, f: 22, m: 2 },
  { label: "한율", value: 24, pct: 9.5, f: 22, m: 2 },
  { label: "라네즈", value: 15, pct: 6.0, f: 14, m: 1 },
];

// Brand positioning (subjective image keywords from transcripts)
export const AP_BRAND_IMAGE = [
  { brand: "설화수", keywords: ["한방·자연", "고급·프리미엄", "탄력·안티에이징"], segment: "프리미엄" },
  { brand: "에스트라", keywords: ["피부 장벽", "저자극·순함", "민감성·건성"], segment: "더마코스메틱" },
  { brand: "이니스프리", keywords: ["자연·제주", "가성비", "트러블·진정"], segment: "네이처" },
  { brand: "라네즈", keywords: ["수분·워터", "트렌디", "여름·즉각보습"], segment: "하이드레이션" },
  { brand: "아이오페", keywords: ["기능성·과학", "리틴올·레티놀", "피부결 개선"], segment: "사이언스" },
  { brand: "헤라", keywords: ["럭셔리", "베이스·색조 연계", "세련됨"], segment: "럭셔리" },
  { brand: "프리메라", keywords: ["비건·클린", "식물성", "민감성"], segment: "클린뷰티" },
  { brand: "에뛰드", keywords: ["컬러풀", "저가·접근성", "10~20대"], segment: "영 플레이풀" },
  { brand: "비디비치", keywords: ["색조 연계", "고급 패키지", "도심·트렌드"], segment: "럭셔리" },
  { brand: "오휘", keywords: ["안티에이징", "고급보습", "성숙 피부"], segment: "프리미엄" },
  { brand: "한율", keywords: ["한방·발효", "가성비 한방", "피부 진정"], segment: "네이처" },
  { brand: "일리윤", keywords: ["아토피·장벽", "가족용", "저자극 보습"], segment: "더마코스메틱" },
];

// ── MaxDiff Attribute Importance ──────────────────────────────────────────────

export const MAXDIFF = [
  { label: "가격 대비 효능이 우수하다", most: 263, least: 105, net: 158, score: 6.27, f_most: 213, m_most: 50, f_least: 84, m_least: 21 },
  { label: "피부 장벽을 강화한다", most: 256, least: 99, net: 157, score: 6.23, f_most: 208, m_most: 48, f_least: 78, m_least: 21 },
  { label: "보습력이 오래 지속된다", most: 266, least: 109, net: 157, score: 6.23, f_most: 214, m_most: 52, f_least: 87, m_least: 22 },
  { label: "자극적인 성분이 없다", most: 251, least: 119, net: 132, score: 5.24, f_most: 201, m_most: 50, f_least: 95, m_least: 24 },
  { label: "즉각적인 수분감이 느껴진다", most: 204, least: 130, net: 74, score: 2.94, f_most: 164, m_most: 40, f_least: 104, m_least: 26 },
  { label: "잡티·칙칙함을 개선한다", most: 211, least: 152, net: 59, score: 2.34, f_most: 180, m_most: 31, f_least: 122, m_least: 30 },
  { label: "피부 탄력을 높여준다", most: 179, least: 130, net: 49, score: 1.94, f_most: 152, m_most: 27, f_least: 104, m_least: 26 },
  { label: "천연·식물성 원료를 사용한다", most: 153, least: 125, net: 28, score: 1.11, f_most: 128, m_most: 25, f_least: 100, m_least: 25 },
  { label: "끈적임 없이 산뜻하게 흡수된다", most: 151, least: 131, net: 20, score: 0.79, f_most: 118, m_most: 33, f_least: 102, m_least: 29 },
  { label: "무향·저자극 포뮬러", most: 133, least: 126, net: 7, score: 0.28, f_most: 100, m_most: 33, f_least: 98, m_least: 28 },
  { label: "비건·크루얼티 프리 인증", most: 126, least: 134, net: -8, score: -0.32, f_most: 108, m_most: 18, f_least: 108, m_least: 26 },
  { label: "피부과 테스트를 완료했다", most: 105, least: 126, net: -21, score: -0.83, f_most: 88, m_most: 17, f_least: 102, m_least: 24 },
  { label: "모공을 눈에 띄게 줄여준다", most: 84, least: 131, net: -47, score: -1.87, f_most: 72, m_most: 12, f_least: 102, m_least: 29 },
  { label: "브랜드 신뢰도가 높다", most: 76, least: 137, net: -61, score: -2.42, f_most: 64, m_most: 12, f_least: 112, m_least: 25 },
  { label: "발림성이 부드럽고 자연스럽다", most: 60, least: 140, net: -80, score: -3.17, f_most: 50, m_most: 10, f_least: 114, m_least: 26 },
  { label: "피부 타입별 라인업이 다양하다", most: 55, least: 145, net: -90, score: -3.57, f_most: 46, m_most: 9, f_least: 117, m_least: 28 },
  { label: "향이 은은하고 기분 좋다", most: 26, least: 145, net: -119, score: -4.72, f_most: 22, m_most: 4, f_least: 116, m_least: 29 },
  { label: "메이크업 베이스로 쓰기 좋다", most: 41, least: 163, net: -122, score: -4.84, f_most: 38, m_most: 3, f_least: 130, m_least: 33 },
  { label: "지속가능한 친환경 패키지", most: 0, least: 132, net: -132, score: -5.24, f_most: 0, m_most: 0, f_least: 106, m_least: 26 },
  { label: "패키지 디자인이 고급스럽다", most: 0, least: 154, net: -154, score: -6.11, f_most: 0, m_most: 0, f_least: 124, m_least: 30 },
];

// ── Routine Complexity ────────────────────────────────────────────────────────

export const ROUTINE_COMPLEXITY = [
  { label: "1단계 (미니멀)", all: 79, f: 74, m: 5, pct: 31.3 },
  { label: "2단계", all: 21, f: 11, m: 10, pct: 8.3 },
  { label: "3단계", all: 88, f: 69, m: 19, pct: 34.9 },
  { label: "4단계", all: 38, f: 22, m: 16, pct: 15.1 },
  { label: "5단계+ (멀티스텝)", all: 26, f: 26, m: 0, pct: 10.3 },
];

// Routine steps journey
export const ROUTINE_JOURNEY = [
  {
    step: 1,
    label: "세안 / 클렌징",
    icon: "💧",
    desc: "이중 세안 또는 폼 클렌저 단독",
    am: true,
    pm: true,
    pct_am: 95,
    pct_pm: 98,
  },
  {
    step: 2,
    label: "토너 / 미스트",
    icon: "🌊",
    desc: "수분 베이스 다지기; 복합성·건성 위주",
    am: true,
    pm: true,
    pct_am: 52,
    pct_pm: 55,
  },
  {
    step: 3,
    label: "에센스 / 세럼 / 앰플",
    icon: "✨",
    desc: "기능성 집중 케어 — 보습·잡티·탄력",
    am: true,
    pm: true,
    pct_am: 48,
    pct_pm: 62,
  },
  {
    step: 4,
    label: "크림 / 로션",
    icon: "🫙",
    desc: "보습 마무리; 아침·저녁 제품 차별화",
    am: true,
    pm: true,
    pct_am: 78,
    pct_pm: 82,
  },
  {
    step: 5,
    label: "선크림",
    icon: "☀️",
    desc: "아침 루틴 마무리; 남성은 빈도 낮음",
    am: true,
    pm: false,
    pct_am: 71,
    pct_pm: 0,
  },
  {
    step: 6,
    label: "나이트 마스크 / 재생 크림",
    icon: "🌙",
    desc: "취침 전 집중 보습 — 고관여자 위주",
    am: false,
    pm: true,
    pct_am: 0,
    pct_pm: 32,
  },
];

// ── Willingness to Pay 2× ──────────────────────────────────────────────────────

export const WTP = [
  { label: "구매 의향 있음", value: 79, pct: 31.3, f: 73, m: 6 },
  { label: "조건부 의향", value: 87, pct: 34.5, f: 77, m: 10 },
  { label: "의향 없음", value: 36, pct: 14.3, f: 18, m: 18 },
  { label: "무응답/불분명", value: 50, pct: 19.8, f: 34, m: 16 },
];

// ── Skin Concerns ─────────────────────────────────────────────────────────────
export const SKIN_CONCERNS = [
  { label: "속건조 / 건조함", value: 98, pct: 38.9 },
  { label: "잡티·칙칙함", value: 74, pct: 29.4 },
  { label: "피부 결·모공", value: 61, pct: 24.2 },
  { label: "탄력·주름", value: 55, pct: 21.8 },
  { label: "트러블·민감성", value: 48, pct: 19.0 },
  { label: "유분·번들거림", value: 38, pct: 15.1 },
  { label: "기미·색소침착", value: 30, pct: 11.9 },
];

// ── Respondent Scatter Data ───────────────────────────────────────────────────
function makeRespondents() {
  let seed = 20260418;
  const rng = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 0x100000000; };
  const jit = (r) => (rng() - 0.5) * r;
  const pick = (arr) => arr[Math.floor(rng() * arr.length)];

  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const genders    = shuffle([...Array(202).fill('F'), ...Array(50).fill('M')]);
  const skins      = shuffle([...Array(123).fill('건성'), ...Array(85).fill('복합성'), ...Array(27).fill('지성'), ...Array(17).fill('기타')]);
  const involvs    = shuffle([...Array(108).fill('High'), ...Array(97).fill('Medium'), ...Array(47).fill('Low')]);
  const stepsArr   = shuffle([...Array(79).fill(1), ...Array(21).fill(2), ...Array(88).fill(3), ...Array(38).fill(4), ...Array(26).fill(5)]);
  const wtps       = shuffle([...Array(79).fill('의향 있음'), ...Array(87).fill('조건부'), ...Array(36).fill('의향 없음'), ...Array(50).fill('불분명')]);

  const yRange  = { High: [2.8, 5.0], Medium: [1.5, 3.2], Low: [0.2, 2.0] };
  const wtpDelta = { '의향 있음': 0.5, '조건부': 0.1, '의향 없음': -0.4, '불분명': 0 };

  const summaryMap = {
    'High-F': ['성분 탐구형 스킨케어 매니아', '루틴 확장 중인 고관여 소비자', '기능성 제품 수집가'],
    'High-M': ['능동적 피부 관리자', '성분 인식 높은 남성 소비자'],
    'Medium-F': ['표준 루틴 유지형 소비자', '효능 중심 실용파', '리뷰 기반 구매자'],
    'Medium-M': ['파트너 영향권 루틴 보유자', '기본 관리 유지형 남성'],
    'Low-F': ['최소 루틴 선호 소비자', '루틴 단순화 시도 중'],
    'Low-M': ['세안 중심 미니멀리스트', '스킨케어 무관심형'],
  };

  const productMap = {
    1: ['폼 클렌저', '올인원 제품'],
    2: ['폼 클렌저', '보습 크림'],
    3: ['폼 클렌저', '토너', '보습 크림'],
    4: ['폼 클렌저', '토너', '에센스', '선크림'],
    5: ['폼 클렌저', '토너', '세럼', '크림', '선크림'],
  };

  return Array.from({ length: 252 }, (_, i) => {
    const gender     = genders[i];
    const skinType   = skins[i];
    const involvement = involvs[i];
    const steps      = stepsArr[i];
    const wtp        = wtps[i];
    const summaries  = summaryMap[`${involvement}-${gender}`] || summaryMap[`${involvement}-F`];
    const summary    = pick(summaries);

    const [yMin, yMax] = yRange[involvement];
    const rawX = steps + jit(0.5);
    const rawY = yMin + rng() * (yMax - yMin) + wtpDelta[wtp] + jit(0.3);

    return {
      id: i + 1,
      gender,
      skinType,
      involvement,
      steps,
      wtp,
      x: Math.round(Math.min(5.5, Math.max(0.5, rawX)) * 10) / 10,
      y: Math.round(Math.min(5.0, Math.max(0.0, rawY)) * 10) / 10,
      summary,
      products: productMap[steps],
    };
  });
}
export const RESPONDENTS = makeRespondents();

// ── Routine Patterns ──────────────────────────────────────────────────────────
export const ROUTINE_PATTERNS = [
  {
    id: "single",
    name: "세안 단독형",
    emoji: "💧",
    steps: ["세안"],
    count: 35,
    pct: 13.9,
    color: "#34d399",
    amOnly: false,
    pmOnly: false,
    desc: "세안 외 별도 스킨케어 없음. 주로 남성·저관여 응답자.",
    motivation: "루틴 자체에 관심이 없거나 아직 습관이 형성되지 않은 단계.",
    profile: "남성 비율 높음 (추정 70%+). 파트너 권유 시 첫 제품 추가 가능성.",
    products: ["폼 클렌저"],
    triggers: ["파트너/주변 권유", "기존 습관"],
  },
  {
    id: "basic",
    name: "세안 + 보습 기본형",
    emoji: "🫙",
    steps: ["세안", "로션/크림"],
    count: 44,
    pct: 17.5,
    color: "#60a5fa",
    amOnly: false,
    pmOnly: false,
    desc: "최소한의 보습 관리. 건조함을 계기로 루틴에 진입한 유형.",
    motivation: "속건조 해소가 주목적. 제품 선택 기준이 단순하고 브랜드 고착도 낮음.",
    profile: "건성 피부·저~중 관여도 중심. 남녀 모두 포함.",
    products: ["폼 클렌저", "보습 크림/로션"],
    triggers: ["건조함 심화", "파트너 권유", "기존 제품 소진"],
  },
  {
    id: "standard",
    name: "토너 + 보습 표준형",
    emoji: "🌊",
    steps: ["세안", "토너", "로션/크림"],
    count: 68,
    pct: 27.0,
    color: "#6c7aff",
    amOnly: false,
    pmOnly: false,
    desc: "가장 일반적인 3단계 루틴. 중관여 여성 응답자 중심.",
    motivation: "기본 루틴 완성 욕구. 토너로 수분 베이스를 다지는 패턴.",
    profile: "복합성·건성 여성 비율 높음. 루틴 변경 의향 보통~낮음.",
    products: ["폼 클렌저", "토너", "크림"],
    triggers: ["실제 효과 경험", "후기/리뷰"],
  },
  {
    id: "sunscreen",
    name: "선크림 포함 실용형",
    emoji: "☀️",
    steps: ["세안", "토너", "로션/크림", "선크림"],
    count: 52,
    pct: 20.6,
    color: "#fb923c",
    amOnly: true,
    pmOnly: false,
    desc: "자외선 차단까지 포함한 기능 완결형 아침 루틴.",
    motivation: "잡티·색소 예방 관심. 기능성 중심 소비 태도.",
    profile: "잡티·탄력 고민 여성. WTP 조건부 이상 비율 높음.",
    products: ["폼 클렌저", "토너", "에센스", "선크림"],
    triggers: ["성분/기능 탐색", "SNS 정보", "후기/리뷰"],
  },
  {
    id: "advanced",
    name: "앰플/세럼 포함 확장형",
    emoji: "✨",
    steps: ["세안", "토너", "세럼/앰플", "크림", "선크림"],
    count: 53,
    pct: 21.0,
    color: "#a78bfa",
    amOnly: false,
    pmOnly: false,
    desc: "기능성 집중 케어 포함 5단계+ 멀티스텝 루틴.",
    motivation: "피부 개선 욕구가 강하고 성분·기능 탐색이 활발.",
    profile: "고관여 여성 중심. 브랜드 전환 및 신제품 시도 의향도 높음.",
    products: ["폼 클렌저", "토너", "세럼/앰플", "크림", "선크림"],
    triggers: ["후기/리뷰", "성분 연구", "SNS 콘텐츠"],
  },
];

// ── Recolor palettes ──────────────────────────────────────────────────────────
export const COLORS = {
  primary: "#6c7aff",
  secondary: "#a78bfa",
  tertiary: "#34d399",
  quaternary: "#f472b6",
  quinary: "#fb923c",
  female: "#a78bfa",
  male: "#34d399",
  chart: ["#6c7aff", "#a78bfa", "#34d399", "#f472b6", "#fb923c", "#60a5fa", "#fbbf24", "#e879f9"],
  positive: "#34d399",
  negative: "#f87171",
  neutral: "#94a3b8",
};
