#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Parse all interview txt files and extract structured data for the report.
"""
import re, json
from pathlib import Path
from collections import defaultdict

SCRIPT_DIR = Path(__file__).resolve().parent
INTERVIEW_DIR = SCRIPT_DIR / "인터뷰 스크립트"

# ── All MaxDiff attributes ────────────────────────────────────────────────────
ATTRIBUTES = [
    "피부 장벽을 강화한다",
    "보습력이 오래 지속된다",
    "자극적인 성분이 없다",
    "가격 대비 효능이 우수하다",
    "즉각적인 수분감이 느껴진다",
    "피부 탄력을 높여준다",
    "잡티·칙칙함을 개선한다",
    "끈적임 없이 산뜻하게 흡수된다",
    "무향·저자극 포뮬러",
    "피부과 테스트를 완료했다",
    "천연·식물성 원료를 사용한다",
    "비건·크루얼티 프리 인증",
    "발림성이 부드럽고 자연스럽다",
    "모공을 눈에 띄게 줄여준다",
    "브랜드 신뢰도가 높다",
    "메이크업 베이스로 쓰기 좋다",
    "피부 타입별 라인업이 다양하다",
    "향이 은은하고 기분 좋다",
    "지속가능한 친환경 패키지",
    "패키지 디자인이 고급스럽다",
]

TRIGGER_OPTIONS = [
    "브랜드 이미지가 좋아서",
    "성분이 피부에 좋아 보여서",
    "피부에 잘 맞을 것 같아서",
    "실제로 써보니 효과가 좋아서",
    "주변 사람의 추천을 받아서",
    "후기/리뷰를 보고 신뢰가 가서",
    "매장에서 받은 상담/추천에 설득이 되어서",
    "기존에 사용해본 경험이 좋아서",
    "선물로 받아서",
    "광고나 콘텐츠를 보고",
    "패키지/브랜드 느낌이 마음에 들어서",
    "SNS나 유튜브, 블로그 등을 보고",
    "매장에서 테스트해보고 좋아서",
    "할인/프로모션을 보고",
    "평소에 알고 있던 브랜드라서",
]

# AP brands in this study
AP_BRANDS = [
    "설화수", "헤라", "라네즈", "아이오페", "한율", "오휘", "비디비치",
    "이니스프리", "에스트라", "프리메라", "에뛰드", "일리윤",
]

ALL_BRANDS = [
    "에스트라", "설화수", "라네즈", "아이오페", "헤라", "이니스프리", "한율", "프리메라",
    "오휘", "비디비치", "에뛰드", "일리윤",
    "라로슈포제", "세라베", "닥터지", "아누아", "토니모리", "미샤",
    "닥터자르트", "벨리프", "스킨푸드", "파파레서피", "라운드랩", "아로셀",
    "코스알엑스", "스킨1004", "뷰티오브조선", "아비브", "티르티르", "바이오던스", "넘버즈인",
    "피지오겔", "세타필", "유세린", "바이오더마", "아벤느", "리얼베리어",
    "구달", "토리든", "마녀공장", "더마팩토리", "디오디너리", "달바",
    "니베아", "비오템", "우르오스", "클린앤클리어", "뉴트로지나",
]

def extract_gender(text):
    if "성별: 남성" in text:
        return "M"
    return "F"

def extract_skin_type(text):
    # Look for user response to skin type question
    pattern = r"피부 타입이.*?어디에 해당.*?\n\n\[사용자\]: (.+)"
    m = re.search(pattern, text, re.DOTALL)
    if not m:
        return "unknown"
    resp = m.group(1).lower()
    if "복합" in resp:
        return "복합성"
    elif "건성" in resp or "건조" in resp:
        return "건성"
    elif "지성" in resp or "번들" in resp:
        return "지성"
    else:
        return "모름"

def extract_brands_mentioned(text):
    """Extract brands mentioned in brand recall section."""
    # Find the brand recall response
    pattern = r"5개에서 20개 정도.*?\[사용자\]: (.+?)(?:\n\n\[AI|\Z)"
    m = re.search(pattern, text, re.DOTALL)
    if not m:
        return []
    resp = m.group(1)

    found = []
    for b in ALL_BRANDS:
        if b in resp:
            found.append(b)
    return found

def extract_ap_brands(brand_list):
    return [b for b in brand_list if b in AP_BRANDS]

def extract_purchase_triggers_multi(text):
    """Extract Q3 multi-select triggers."""
    # Look for response right after "모두 선택해 주세요"
    pattern = r"모두 선택해 주세요\.\n\n\[사용자\]: (.+?)(?:\n\n\[AI|\Z)"
    m = re.search(pattern, text, re.DOTALL)
    if not m:
        return []
    resp = m.group(1)

    found = []
    for t in TRIGGER_OPTIONS:
        # Match key fragments
        key = t.split(" (")[0][:10]
        if key in resp:
            found.append(t)
    return found

def extract_purchase_trigger_single(text):
    """Extract Q4 single-select trigger."""
    pattern = r"하나만 선택해 주세요\.\n\n\[사용자\]: (.+?)(?:\n\n\[AI|\Z)"
    m = re.search(pattern, text, re.DOTALL)
    if not m:
        return None
    resp = m.group(1)

    for t in TRIGGER_OPTIONS:
        key = t[:8]
        if key in resp:
            return t
    return None

def extract_maxdiff(text):
    """Extract most/least important attributes from MaxDiff rounds."""
    most_important = []
    least_important = []

    # Find all [사용자] responses in the attribute section
    # Look after the intro text about 12 rounds
    attr_section_start = text.find("12차례 반복 될 예정입니다")
    if attr_section_start == -1:
        return most_important, least_important

    attr_section = text[attr_section_start:]

    # Find all user responses in this section
    user_responses = re.findall(r"\[사용자\]: (.+?)(?:\n\n|\Z)", attr_section)

    for resp in user_responses:
        # Skip non-attribute responses
        if any(x in resp for x in ["네.", "네,", "괜찮습니다", "물론이죠", "모르겠어요", "없어요", "딱히", "부담"]):
            if len(resp) < 20:
                continue

        # Try to find "가장 중요한" and "가장 안 중요한" patterns
        # Most important
        for attr in ATTRIBUTES:
            # Check if this attr appears after 중요한 and before 안 중요
            imp_pattern = rf"중요한[^:가]*?{re.escape(attr)}"
            if re.search(imp_pattern, resp):
                most_important.append(attr)
                break

        # Least important
        for attr in ATTRIBUTES:
            least_pattern = rf"안 중요한[^:]*?{re.escape(attr)}|덜 중요한[^:]*?{re.escape(attr)}"
            if re.search(least_pattern, resp):
                least_important.append(attr)
                break

    return most_important, least_important

def extract_wtp(text):
    """Extract willingness to pay 2x."""
    pattern = r"2배 정도 비싸더라도.*?\n\n\[사용자\]: (.+?)(?:\n\n|\Z)"
    m = re.search(pattern, text, re.DOTALL)
    if not m:
        return "unknown"
    resp = m.group(1).lower()

    if any(x in resp for x in ["네, ", "있습니다", "있어요", "있을 것", "사볼"]):
        if any(x in resp for x in ["아니요", "없습니다", "안 살", "부담"]):
            return "conditional"
        return "yes"
    elif any(x in resp for x in ["아니요", "없습니다", "안 살", "부담스러워요"]):
        return "no"
    elif any(x in resp for x in ["모르겠어요", "케이스", "고민", "효과가 확실"]):
        return "conditional"
    return "unknown"

def extract_routine_complexity(text):
    """Estimate routine steps from description."""
    pattern = r"어떤 단계로 스킨케어를 진행하시나요\?\n\n\[사용자\]: (.+?)(?:\n\n|\Z)"
    m = re.search(pattern, text, re.DOTALL)
    if not m:
        return 1
    resp = m.group(1)

    step_keywords = ["토너", "에센스", "세럼", "앰플", "크림", "선크림", "로션",
                     "미스트", "마스크", "오일", "미온수", "세안", "클렌징"]
    count = sum(1 for kw in step_keywords if kw in resp)

    if count <= 1:
        return 1
    elif count <= 2:
        return 2
    elif count <= 3:
        return 3
    elif count <= 5:
        return 4
    else:
        return 5

def extract_skincare_involvement(text):
    """Extract involvement level from first response."""
    pattern = r"신경을 많이 쓰시나요\?\s*\n\n\[사용자\]: (.+?)(?:\n\n|\Z)"
    m = re.search(pattern, text, re.DOTALL)
    if not m:
        return "medium"
    resp = m.group(1).lower()

    high_keywords = ["많이", "꽤", "신경 쓰는", "네, 신경", "피부과", "열 개"]
    low_keywords = ["아니요", "별로", "세안만", "딱히", "안 해요"]

    if any(x in resp for x in high_keywords):
        return "high"
    elif any(x in resp for x in low_keywords):
        return "low"
    return "medium"

def parse_file(filepath):
    text = filepath.read_text(encoding="utf-8")

    return {
        "file": filepath.name,
        "gender": extract_gender(text),
        "skin_type": extract_skin_type(text),
        "brands_mentioned": extract_brands_mentioned(text),
        "ap_brands": extract_ap_brands(extract_brands_mentioned(text)),
        "trigger_multi": extract_purchase_triggers_multi(text),
        "trigger_single": extract_purchase_trigger_single(text),
        "maxdiff_most": extract_maxdiff(text)[0],
        "maxdiff_least": extract_maxdiff(text)[1],
        "wtp_2x": extract_wtp(text),
        "routine_complexity": extract_routine_complexity(text),
        "involvement": extract_skincare_involvement(text),
    }

def aggregate(records):
    n = len(records)

    # Gender
    gender_counts = defaultdict(int)
    for r in records:
        gender_counts[r["gender"]] += 1

    # Skin type
    skin_counts = defaultdict(int)
    for r in records:
        skin_counts[r["skin_type"]] += 1

    # Involvement
    inv_counts = defaultdict(int)
    for r in records:
        inv_counts[r["involvement"]] += 1

    # Brand recall - top brands overall + AP brands
    brand_counts = defaultdict(int)
    ap_brand_counts = defaultdict(int)
    for r in records:
        for b in r["brands_mentioned"]:
            brand_counts[b] += 1
        for b in r["ap_brands"]:
            ap_brand_counts[b] += 1

    # Brand recall by gender
    brand_by_gender = {"F": defaultdict(int), "M": defaultdict(int)}
    for r in records:
        g = r["gender"]
        for b in r["brands_mentioned"]:
            brand_by_gender[g][b] += 1

    # Purchase triggers
    trigger_multi_counts = defaultdict(int)
    trigger_single_counts = defaultdict(int)
    for r in records:
        for t in r["trigger_multi"]:
            trigger_multi_counts[t] += 1
        if r["trigger_single"]:
            trigger_single_counts[r["trigger_single"]] += 1

    # Trigger single by gender
    trigger_single_by_gender = {"F": defaultdict(int), "M": defaultdict(int)}
    for r in records:
        if r["trigger_single"]:
            g = r["gender"]
            trigger_single_by_gender[g][r["trigger_single"]] += 1

    # MaxDiff scores
    attr_most = defaultdict(int)
    attr_least = defaultdict(int)
    for r in records:
        for a in r["maxdiff_most"]:
            attr_most[a] += 1
        for a in r["maxdiff_least"]:
            attr_least[a] += 1

    # MaxDiff by gender
    attr_most_by_gender = {"F": defaultdict(int), "M": defaultdict(int)}
    attr_least_by_gender = {"F": defaultdict(int), "M": defaultdict(int)}
    for r in records:
        g = r["gender"]
        for a in r["maxdiff_most"]:
            attr_most_by_gender[g][a] += 1
        for a in r["maxdiff_least"]:
            attr_least_by_gender[g][a] += 1

    # WTP
    wtp_counts = defaultdict(int)
    for r in records:
        wtp_counts[r["wtp_2x"]] += 1

    # WTP by gender
    wtp_by_gender = {"F": defaultdict(int), "M": defaultdict(int)}
    for r in records:
        wtp_by_gender[r["gender"]][r["wtp_2x"]] += 1

    # Routine complexity
    routine_counts = defaultdict(int)
    for r in records:
        routine_counts[r["routine_complexity"]] += 1

    # Routine by gender
    routine_by_gender = {"F": defaultdict(int), "M": defaultdict(int)}
    for r in records:
        routine_by_gender[r["gender"]][r["routine_complexity"]] += 1

    # Compute MaxDiff net scores
    all_attrs = set(list(attr_most.keys()) + list(attr_least.keys()) + ATTRIBUTES)
    maxdiff_scores = {}
    total_rounds = sum(len(r["maxdiff_most"]) for r in records)
    for a in ATTRIBUTES:
        m = attr_most.get(a, 0)
        l = attr_least.get(a, 0)
        opportunities = attr_most.get(a, 0) + attr_least.get(a, 0)
        maxdiff_scores[a] = {
            "most": m,
            "least": l,
            "net": m - l,
            "score": round((m - l) / max(1, n) * 10, 2),  # normalized score per respondent
        }

    # AP brand awareness rate
    n_f = gender_counts.get("F", 1)
    n_m = gender_counts.get("M", 1)
    ap_brand_by_gender = {"F": defaultdict(int), "M": defaultdict(int)}
    for r in records:
        g = r["gender"]
        for b in r["ap_brands"]:
            ap_brand_by_gender[g][b] += 1

    return {
        "n": n,
        "gender": dict(gender_counts),
        "skin_type": dict(skin_counts),
        "involvement": dict(inv_counts),
        "top_brands": sorted(brand_counts.items(), key=lambda x: -x[1])[:20],
        "ap_brands": sorted(ap_brand_counts.items(), key=lambda x: -x[1]),
        "brand_by_gender": {g: sorted(v.items(), key=lambda x: -x[1])[:15] for g, v in brand_by_gender.items()},
        "ap_brand_by_gender": {g: dict(v) for g, v in ap_brand_by_gender.items()},
        "trigger_multi": sorted(trigger_multi_counts.items(), key=lambda x: -x[1]),
        "trigger_single": sorted(trigger_single_counts.items(), key=lambda x: -x[1]),
        "trigger_single_by_gender": {g: dict(v) for g, v in trigger_single_by_gender.items()},
        "maxdiff": maxdiff_scores,
        "maxdiff_by_gender": {
            "F": {a: {"most": attr_most_by_gender["F"].get(a, 0), "least": attr_least_by_gender["F"].get(a, 0)} for a in ATTRIBUTES},
            "M": {a: {"most": attr_most_by_gender["M"].get(a, 0), "least": attr_least_by_gender["M"].get(a, 0)} for a in ATTRIBUTES},
        },
        "wtp_2x": dict(wtp_counts),
        "wtp_by_gender": {g: dict(v) for g, v in wtp_by_gender.items()},
        "routine_complexity": dict(routine_counts),
        "routine_by_gender": {g: dict(v) for g, v in routine_by_gender.items()},
    }

def main():
    files = sorted([f for f in INTERVIEW_DIR.iterdir() if f.suffix == ".txt"])
    print(f"Parsing {len(files)} files...")

    records = []
    for f in files:
        try:
            r = parse_file(f)
            records.append(r)
        except Exception as e:
            print(f"  Error on {f.name}: {e}")

    print(f"Parsed {len(records)} records successfully.")

    agg = aggregate(records)

    # Save individual records (anonymized)
    safe_records = []
    for r in records:
        safe_records.append({
            "file": r["file"],
            "gender": r["gender"],
            "skin_type": r["skin_type"],
            "involvement": r["involvement"],
            "routine_complexity": r["routine_complexity"],
            "wtp_2x": r["wtp_2x"],
            "brands_mentioned": r["brands_mentioned"],
            "ap_brands": r["ap_brands"],
            "trigger_single": r["trigger_single"],
            "maxdiff_most": r["maxdiff_most"],
            "maxdiff_least": r["maxdiff_least"],
        })

    out = {
        "metadata": {
            "n": agg["n"],
            "note": "Synthetic/simulated dataset based on interview responses. For demo purposes only.",
        },
        "aggregated": agg,
        "records": safe_records,
    }

    out_path = SCRIPT_DIR / "parsed_data.json"
    out_path.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Output written to {out_path}")

    # Quick summary
    print(f"\n=== SUMMARY ===")
    print(f"Total respondents: {agg['n']}")
    print(f"Gender: {agg['gender']}")
    print(f"Skin type: {agg['skin_type']}")
    print(f"WTP 2x: {agg['wtp_2x']}")
    print(f"Routine complexity: {agg['routine_complexity']}")
    print(f"\nTop 10 brands:")
    for b, c in agg["top_brands"][:10]:
        print(f"  {b}: {c}")
    print(f"\nAP brands:")
    for b, c in agg["ap_brands"]:
        print(f"  {b}: {c}")
    print(f"\nTop 5 MaxDiff (net):")
    sorted_md = sorted(agg["maxdiff"].items(), key=lambda x: -x[1]["net"])[:5]
    for a, s in sorted_md:
        print(f"  {a}: net={s['net']}, most={s['most']}, least={s['least']}")

if __name__ == "__main__":
    main()
