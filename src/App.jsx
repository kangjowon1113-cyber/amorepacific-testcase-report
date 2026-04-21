import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, LabelList,
  ScatterChart, Scatter, ZAxis,
} from "recharts";
import {
  META, GENDER, SKIN_TYPE, INVOLVEMENT,
  TRIGGER_MULTI, TRIGGER_SINGLE,
  TOP_BRANDS_ALL, AP_BRANDS, AP_BRAND_IMAGE,
  MAXDIFF, ROUTINE_COMPLEXITY, ROUTINE_JOURNEY,
  WTP, SKIN_CONCERNS, COLORS,
  RESPONDENTS, ROUTINE_PATTERNS,
} from "./data";

// ── Styles ────────────────────────────────────────────────────────────────────

const S = {
  page: {
    maxWidth: 1120, margin: "0 auto", padding: "0 24px 80px",
  },
  header: {
    padding: "48px 0 32px",
    borderBottom: "1px solid #dde1ee",
    marginBottom: 48,
  },
  tag: {
    display: "inline-block",
    background: "#eef0ff",
    color: "#6c7aff",
    border: "1px solid #dde1ee",
    borderRadius: 4,
    padding: "2px 10px",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 12,
  },
  disclaimer: {
    display: "inline-block",
    background: "#fff8f0",
    color: "#fb923c",
    border: "1px solid #fed7aa",
    borderRadius: 4,
    padding: "3px 10px",
    fontSize: 11,
    fontWeight: 500,
    marginLeft: 8,
  },
  sectionWrap: {
    marginBottom: 72,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: "#1e2433",
    marginBottom: 6,
    paddingBottom: 12,
    borderBottom: "2px solid #6c7aff",
    display: "inline-block",
  },
  sectionSub: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 28,
    marginTop: 6,
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 20,
  },
  card: {
    background: "#ffffff",
    border: "1px solid #dde1ee",
    borderRadius: 10,
    padding: 24,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    marginBottom: 16,
  },
  statBig: {
    fontSize: 42,
    fontWeight: 700,
    color: "#1e2433",
    lineHeight: 1,
  },
  statLabel: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 4,
  },
  navBar: {
    position: "sticky",
    top: 0,
    background: "rgba(255,255,255,0.97)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid #dde1ee",
    zIndex: 100,
    padding: "0 24px",
  },
  navInner: {
    maxWidth: 1120,
    margin: "0 auto",
    display: "flex",
    gap: 4,
    overflowX: "auto",
    paddingBottom: 0,
  },
  navItem: {
    padding: "12px 14px",
    fontSize: 12,
    fontWeight: 600,
    color: "#64748b",
    cursor: "pointer",
    whiteSpace: "nowrap",
    borderBottom: "2px solid transparent",
    transition: "color 0.15s, border-color 0.15s",
  },
  navItemActive: {
    color: "#6c7aff",
    borderBottom: "2px solid #6c7aff",
  },
};

// ── Reusable chart tooltip ────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#ffffff", border: "1px solid #dde1ee", borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
      <div style={{ color: "#1e2433", fontWeight: 600, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || "#1e2433", marginBottom: 2 }}>
          {p.name}: <b>{p.value}</b>
        </div>
      ))}
    </div>
  );
};

// ── Custom bar label ──────────────────────────────────────────────────────────
const PctLabel = ({ x, y, width, value, fill }) => (
  value > 0 ? (
    <text x={x + width + 5} y={y + 10} fill="#64748b" fontSize={11}>{value}%</text>
  ) : null
);

// ── Section wrapper ───────────────────────────────────────────────────────────
const Section = ({ id, title, subtitle, children }) => (
  <div id={id} style={S.sectionWrap}>
    <div style={{ marginBottom: 24 }}>
      <div style={S.sectionTitle}>{title}</div>
      {subtitle && <div style={S.sectionSub}>{subtitle}</div>}
    </div>
    {children}
  </div>
);

// ── Stat card ─────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, sub, color = "#6c7aff" }) => (
  <div style={{ ...S.card, borderTop: `2px solid ${color}` }}>
    <div style={S.cardTitle}>{title}</div>
    <div style={{ ...S.statBig, color }}>{value}</div>
    {sub && <div style={S.statLabel}>{sub}</div>}
  </div>
);

// ── Donut chart ───────────────────────────────────────────────────────────────
const DonutChart = ({ data, height = 220, colors, label }) => (
  <ResponsiveContainer width="100%" height={height}>
    <PieChart>
      <Pie data={data} cx="50%" cy="45%" innerRadius={58} outerRadius={85}
        dataKey="value" nameKey="label" paddingAngle={2}>
        {data.map((_, i) => (
          <Cell key={i} fill={colors ? colors[i % colors.length] : COLORS.chart[i % COLORS.chart.length]} />
        ))}
      </Pie>
      <Tooltip content={<ChartTooltip />} />
      <Legend wrapperStyle={{ fontSize: 12, color: "#64748b" }} />
    </PieChart>
  </ResponsiveContainer>
);

// ── Horizontal bar chart ──────────────────────────────────────────────────────
const HBarChart = ({ data, dataKey = "value", nameKey = "label", color = "#6c7aff", showPct = false, height }) => {
  const h = height || Math.max(data.length * 36 + 40, 120);
  return (
    <ResponsiveContainer width="100%" height={h}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 60, top: 4, bottom: 4 }}>
        <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#dde1ee" />
        <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey={nameKey} tick={{ fill: "#64748b", fontSize: 12 }} width={220} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip />} />
        <Bar dataKey={dataKey} fill={color} radius={[0, 3, 3, 0]} maxBarSize={20}>
          {showPct && <LabelList dataKey="pct" position="right" style={{ fill: "#64748b", fontSize: 11 }} formatter={(v) => `${v}%`} />}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

// ── Stacked bar chart ─────────────────────────────────────────────────────────
const StackedBarH = ({ data, keys, colors, nameKey = "label", height }) => {
  const h = height || Math.max(data.length * 44 + 60, 120);
  return (
    <ResponsiveContainer width="100%" height={h}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 20, top: 4, bottom: 4 }}>
        <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#dde1ee" />
        <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey={nameKey} tick={{ fill: "#64748b", fontSize: 12 }} width={200} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12, color: "#64748b" }} />
        {keys.map((k, i) => (
          <Bar key={k} dataKey={k} stackId="a" fill={colors ? colors[i] : COLORS.chart[i]} maxBarSize={20} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

// ── MaxDiff bar ───────────────────────────────────────────────────────────────
const MaxDiffBar = ({ data }) => {
  const sorted = [...data].sort((a, b) => b.net - a.net);
  const chartData = sorted.map(d => ({
    label: d.label,
    "Most Important": d.most,
    "Least Important": -d.least,
    net: d.net,
  }));

  return (
    <ResponsiveContainer width="100%" height={Math.max(data.length * 36 + 60, 200)}>
      <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 20, top: 4, bottom: 4 }}>
        <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#dde1ee" />
        <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="label" tick={{ fill: "#64748b", fontSize: 11 }} width={220} axisLine={false} tickLine={false} />
        <Tooltip content={({ active, payload, label }) => {
          if (!active || !payload?.length) return null;
          const d = data.find(x => x.label === label);
          return (
            <div style={{ background: "#ffffff", border: "1px solid #dde1ee", borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
              <div style={{ color: "#1e2433", fontWeight: 600, marginBottom: 6 }}>{label}</div>
              <div style={{ color: COLORS.positive }}>Most: {d?.most}</div>
              <div style={{ color: COLORS.negative }}>Least: {d?.least}</div>
              <div style={{ color: "#1e2433", borderTop: "1px solid #dde1ee", marginTop: 4, paddingTop: 4 }}>Net: <b>{d?.net > 0 ? "+" : ""}{d?.net}</b></div>
            </div>
          );
        }} />
        <Legend wrapperStyle={{ fontSize: 12, color: "#64748b" }} />
        <Bar dataKey="Most Important" fill={COLORS.positive} stackId="a" maxBarSize={18} radius={[0, 3, 3, 0]} />
        <Bar dataKey="Least Important" fill={COLORS.negative} stackId="b" maxBarSize={18} radius={[3, 0, 0, 3]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

// ── Routine Journey ───────────────────────────────────────────────────────────
const RoutineJourney = ({ data }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
    {/* AM/PM header */}
    <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 120px 120px", gap: 12, marginBottom: 12, padding: "0 16px" }}>
      <div />
      <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>단계</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#fb923c", textAlign: "center" }}>AM 루틴</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#6c7aff", textAlign: "center" }}>PM 루틴</div>
    </div>
    {data.map((step, i) => (
      <div key={i} style={{
        display: "grid",
        gridTemplateColumns: "40px 1fr 120px 120px",
        gap: 12,
        alignItems: "center",
        padding: "14px 16px",
        background: i % 2 === 0 ? "#ffffff" : "#eef0ff",
        borderRadius: i === 0 ? "8px 8px 0 0" : i === data.length - 1 ? "0 0 8px 8px" : 0,
        border: "1px solid #dde1ee",
        borderTop: i > 0 ? "none" : "1px solid #dde1ee",
      }}>
        <div style={{ fontSize: 22, textAlign: "center" }}>{step.icon}</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#1e2433" }}>{step.label}</div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{step.desc}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          {step.am ? (
            <div>
              <div style={{
                height: 6, borderRadius: 3, marginBottom: 4,
                background: `linear-gradient(to right, #fb923c ${step.pct_am}%, #f1f3f8${step.pct_am}%)`,
              }} />
              <span style={{ fontSize: 12, color: "#fb923c", fontWeight: 600 }}>{step.pct_am}%</span>
            </div>
          ) : <span style={{ color: "#dde1ee" }}>—</span>}
        </div>
        <div style={{ textAlign: "center" }}>
          {step.pm ? (
            <div>
              <div style={{
                height: 6, borderRadius: 3, marginBottom: 4,
                background: `linear-gradient(to right, #6c7aff ${step.pct_pm}%, #f1f3f8${step.pct_pm}%)`,
              }} />
              <span style={{ fontSize: 12, color: "#6c7aff", fontWeight: 600 }}>{step.pct_pm}%</span>
            </div>
          ) : <span style={{ color: "#dde1ee" }}>—</span>}
        </div>
      </div>
    ))}
    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 8, padding: "0 4px" }}>
      * 비율은 해당 단계 포함 응답자 중 해당 시간대 사용 비율 (추정치)
    </div>
  </div>
);

// ── AP Brand table ────────────────────────────────────────────────────────────
const APBrandGrid = () => {
  const segments = [...new Set(AP_BRAND_IMAGE.map(b => b.segment))];
  const segColors = {
    "프리미엄": "#6c7aff",
    "더마코스메틱": "#34d399",
    "네이처": "#4ade80",
    "하이드레이션": "#60a5fa",
    "사이언스": "#a78bfa",
    "럭셔리": "#f472b6",
    "클린뷰티": "#fbbf24",
    "영 플레이풀": "#fb923c",
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
      {AP_BRAND_IMAGE.map((b) => {
        const awareness = AP_BRANDS.find(x => x.label === b.brand);
        const color = segColors[b.segment] || "#6c7aff";
        return (
          <div key={b.brand} style={{
            ...S.card,
            borderLeft: `3px solid ${color}`,
            position: "relative",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#1e2433" }}>{b.brand}</div>
              <div style={{
                background: `${color}22`,
                color,
                border: `1px solid ${color}44`,
                borderRadius: 4,
                padding: "2px 8px",
                fontSize: 10,
                fontWeight: 600,
              }}>{b.segment}</div>
            </div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>
              {b.keywords.map((k, i) => (
                <span key={i} style={{
                  display: "inline-block",
                  background: "#f1f3f8",
                  border: "1px solid #dde1ee",
                  borderRadius: 3,
                  padding: "2px 7px",
                  marginRight: 4,
                  marginBottom: 4,
                  fontSize: 11,
                }}>{k}</span>
              ))}
            </div>
            {awareness && (
              <div style={{ borderTop: "1px solid #dde1ee", paddingTop: 10, display: "flex", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color }}>{awareness.value}</div>
                  <div style={{ fontSize: 10, color: "#94a3b8" }}>언급 수</div>
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#64748b" }}>{awareness.pct}%</div>
                  <div style={{ fontSize: 10, color: "#94a3b8" }}>인지율</div>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#a78bfa" }}>
                    F:{awareness.f} / M:{awareness.m}
                  </div>
                  <div style={{ fontSize: 10, color: "#94a3b8" }}>성별 분포</div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ── AP Brand awareness bar ────────────────────────────────────────────────────
const APAwarenessBar = () => {
  const data = AP_BRANDS.map(b => ({
    label: b.label,
    "여성 (F)": b.f,
    "남성 (M)": b.m,
  }));
  return (
    <StackedBarH
      data={data}
      keys={["여성 (F)", "남성 (M)"]}
      colors={[COLORS.female, COLORS.male]}
      height={420}
    />
  );
};

// ── Insight card ──────────────────────────────────────────────────────────────
const Insight = ({ num, title, body, tag, vocs }) => (
  <div style={{
    ...S.card,
    display: "flex",
    gap: 20,
    borderLeft: "3px solid #6c7aff",
  }}>
    <div style={{
      minWidth: 36, height: 36, borderRadius: "50%",
      background: "#eff0ff",
      color: "#6c7aff",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 14, fontWeight: 700, flexShrink: 0,
    }}>{num}</div>
    <div style={{ flex: 1 }}>
      {tag && <div style={{ ...S.tag, marginBottom: 8 }}>{tag}</div>}
      <div style={{ fontSize: 14, fontWeight: 600, color: "#1e2433", marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7 }}>{body}</div>
      {vocs && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
          {vocs.map((v, i) => <MiniVOC key={i} {...v} />)}
        </div>
      )}
    </div>
  </div>
);

// ── Respondent Distribution Map ───────────────────────────────────────────────
const DOT_COLORS = {
  femaleHigh:   "#7c3aed",  // vivid purple
  featureMed:   "#2563eb",  // royal blue
  featureLow:   "#0891b2",  // cyan/teal
  male:         "#ea580c",  // bright orange (triangle)
};

const dotColor = (r) => {
  if (r.gender === 'M') return DOT_COLORS.male;
  if (r.involvement === 'High') return DOT_COLORS.femaleHigh;
  if (r.involvement === 'Low') return DOT_COLORS.featureLow;
  return DOT_COLORS.featureMed;
};

const FilterBtn = ({ label, active, onClick }) => (
  <button onClick={onClick} style={{
    padding: "4px 12px", borderRadius: 4, border: "1px solid",
    borderColor: active ? "#6c7aff" : "#dde1ee",
    background: active ? "#6c7aff22" : "transparent",
    color: active ? "#6c7aff" : "#64748b",
    fontSize: 12, cursor: "pointer", fontWeight: active ? 600 : 400,
  }}>{label}</button>
);

const RespondentMap = () => {
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState({ gender: "전체", involvement: "전체", skinType: "전체" });

  const filtered = useMemo(() => RESPONDENTS.filter(r => {
    if (filters.gender !== "전체" && r.gender !== filters.gender) return false;
    if (filters.involvement !== "전체" && r.involvement !== filters.involvement) return false;
    if (filters.skinType !== "전체" && r.skinType !== filters.skinType) return false;
    return true;
  }), [filters]);

  const setFilter = (field, value) => setFilters(f => ({ ...f, [field]: value }));

  return (
    <div>
      {/* Filter row */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20, alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "#94a3b8", marginRight: 2 }}>성별</span>
        {[["전체","전체"],["여성","F"],["남성","M"]].map(([lbl, val]) => (
          <FilterBtn key={val} label={lbl} active={filters.gender === val} onClick={() => setFilter("gender", val)} />
        ))}
        <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 8, marginRight: 2 }}>관여도</span>
        {[["전체","전체"],["고관여","High"],["중관여","Medium"],["저관여","Low"]].map(([lbl, val]) => (
          <FilterBtn key={val} label={lbl} active={filters.involvement === val} onClick={() => setFilter("involvement", val)} />
        ))}
        <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 8, marginRight: 2 }}>피부</span>
        {[["전체","전체"],["건성","건성"],["복합성","복합성"]].map(([lbl, val]) => (
          <FilterBtn key={val} label={lbl} active={filters.skinType === val} onClick={() => setFilter("skinType", val)} />
        ))}
        <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: "auto" }}>n={filtered.length}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 300px" : "1fr", gap: 20, alignItems: "start" }}>
        {/* Chart */}
        <div style={{ ...S.card, position: "relative" }}>
          {/* Y-axis title (rotated) */}
          <div style={{
            position: "absolute", left: 0, top: "50%",
            transform: "translateY(-50%) rotate(-90deg)",
            transformOrigin: "center center",
            fontSize: 12, fontWeight: 600, color: "#64748b",
            pointerEvents: "none", whiteSpace: "nowrap",
            width: 28,
          }}>
            탐색 성향
          </div>
          {/* Y end labels */}
          <div style={{ position: "absolute", top: 20, left: 34, fontSize: 11, fontWeight: 500, color: "#64748b", pointerEvents: "none" }}>높음 ↑</div>
          <div style={{ position: "absolute", bottom: 80, left: 34, fontSize: 11, fontWeight: 500, color: "#64748b", pointerEvents: "none" }}>낮음 ↓</div>
          <ResponsiveContainer width="100%" height={440}>
            <ScatterChart margin={{ top: 28, right: 28, bottom: 20, left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dde1ee" />
              <XAxis type="number" dataKey="x" domain={[0.5, 5.5]} name="루틴 복잡도"
                tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => ({ 1: "1단계", 2: "2단계", 3: "3단계", 4: "4단계", 5: "5단계+" })[Math.round(v)] || ""}
              />
              <YAxis type="number" dataKey="y" domain={[0, 5]} name="탐색 성향"
                tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
              <ZAxis range={[30, 30]} />
              <Tooltip cursor={{ strokeDasharray: "3 3", stroke: "#dde1ee" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const r = payload[0]?.payload;
                  if (!r) return null;
                  return (
                    <div style={{ background: "#ffffff", border: "1px solid #dde1ee", borderRadius: 8, padding: "10px 14px", fontSize: 12, maxWidth: 210, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                      <div style={{ color: "#1e2433", fontWeight: 600, marginBottom: 4 }}>응답자 #{r.id}</div>
                      <div style={{ color: "#64748b" }}>{r.gender === 'F' ? '여성' : '남성'} · {r.skinType} · {r.involvement}</div>
                      <div style={{ color: "#6c7aff", marginTop: 6, fontSize: 11, fontStyle: "italic" }}>{r.summary}</div>
                      <div style={{ color: "#94a3b8", marginTop: 6, fontSize: 11 }}>클릭하여 상세 보기</div>
                    </div>
                  );
                }}
              />
              <Scatter
                data={filtered}
                onClick={(d) => setSelected(prev => prev?.id === d.id ? null : d)}
                shape={(props) => {
                  const { cx, cy, payload: r } = props;
                  const isSel = selected?.id === r.id;
                  const c = dotColor(r);
                  if (r.gender === 'M') {
                    const s = isSel ? 9 : 6;
                    const pts = `${cx},${cy - s} ${cx - s * 0.9},${cy + s * 0.6} ${cx + s * 0.9},${cy + s * 0.6}`;
                    return (
                      <polygon points={pts} fill={c} fillOpacity={isSel ? 1 : 0.85}
                        stroke={isSel ? "#fff" : "#fff"} strokeWidth={isSel ? 2 : 0.8}
                        style={{ cursor: "pointer" }}
                      />
                    );
                  }
                  return (
                    <circle cx={cx} cy={cy} r={isSel ? 7 : 5}
                      fill={c} fillOpacity={isSel ? 1 : 0.75}
                      stroke={isSel ? "#fff" : "#fff"} strokeWidth={isSel ? 2 : 0.8}
                      style={{ cursor: "pointer" }}
                    />
                  );
                }}
              />
            </ScatterChart>
          </ResponsiveContainer>
          {/* X-axis label */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: 60, paddingRight: 28, marginTop: 4, marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: "#64748b" }}>← 루틴 단순 (1단계)</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>루틴 복잡도</span>
            <span style={{ fontSize: 12, fontWeight: 500, color: "#64748b" }}>(5단계+) 루틴 복잡 →</span>
          </div>
          {/* Legend */}
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap", paddingTop: 8, paddingBottom: 4, borderTop: "1px solid #dde1ee" }}>
            {[
              { color: DOT_COLORS.femaleHigh, label: "여성 · 고관여", shape: "circle" },
              { color: DOT_COLORS.featureMed, label: "여성 · 중관여", shape: "circle" },
              { color: DOT_COLORS.featureLow, label: "여성 · 저관여", shape: "circle" },
              { color: DOT_COLORS.male,       label: "남성",           shape: "triangle" },
            ].map(({ color, label, shape }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                {shape === "triangle" ? (
                  <svg width={12} height={11} viewBox="0 0 12 11">
                    <polygon points="6,0 0,11 12,11" fill={color} />
                  </svg>
                ) : (
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
                )}
                <span style={{ fontSize: 12, fontWeight: 500, color: "#64748b" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{ ...S.card, borderTop: `2px solid ${dotColor(selected)}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1e2433" }}>응답자 #{selected.id}</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                  {selected.gender === 'F' ? '여성' : '남성'} · {selected.skinType} · {selected.steps}단계 루틴
                </div>
              </div>
              <button onClick={() => setSelected(null)}
                style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>
                ×
              </button>
            </div>

            <div style={{ fontSize: 13, color: "#6c7aff", fontStyle: "italic", marginBottom: 16, lineHeight: 1.6, padding: "10px 12px", background: "#eef2ff", borderRadius: 6 }}>
              "{selected.summary}"
            </div>

            {[
              { label: "관여도",        value: selected.involvement === 'High' ? '고관여' : selected.involvement === 'Medium' ? '중관여' : '저관여' },
              { label: "피부 타입",     value: selected.skinType },
              { label: "루틴 복잡도",   value: `${selected.steps}단계` },
              { label: "WTP (2배)",    value: selected.wtp },
              { label: "사용 제품군",   value: selected.products.join(" → ") },
            ].map(({ label, value }) => (
              <div key={label} style={{ padding: "8px 0", borderBottom: "1px solid #dde1ee", display: "flex", gap: 12 }}>
                <div style={{ fontSize: 11, color: "#94a3b8", minWidth: 76, flexShrink: 0 }}>{label}</div>
                <div style={{ fontSize: 12, color: "#1e2433" }}>{value}</div>
              </div>
            ))}

            <div style={{ marginTop: 14, padding: "10px 12px", background: "#f1f3f8", borderRadius: 6 }}>
              <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>분포 위치</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>
                루틴 복잡도 <b style={{ color: "#1e2433" }}>{selected.x}/5</b> · 탐색 성향 <b style={{ color: "#1e2433" }}>{selected.y}/5</b>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Key Points */}
      <div style={{ ...S.card, marginTop: 20 }}>
        <div style={{ ...S.cardTitle, marginBottom: 16 }}>분포 분석 — Key Points</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            {
              tag: "고관여 여성 군집",
              text: "고관여 여성(진보라)은 우상단에 집중 — 루틴이 복잡하고 탐색 의향도 높은 이중 특성. 신제품·기능성 성분 정보에 가장 민감하게 반응하는 세그먼트.",
              voc: { quote: "한 제품을 오래 쓰면 피부가 적응하는 것 같기도 하고, 새로 좋은 제품이 나오면 시도해보고 싶기도 해서요. 어느 순간 화장대에 이렇게 많이 쌓이더라고요.", meta: "여성 · 고관여 · 복합성 · 응답자 #12" },
            },
            {
              tag: "남성 세그먼트",
              text: "남성(주황 삼각형) 대다수가 좌하단 클러스터 형성. 루틴 단순 + 안정적 사용 패턴. 파트너 영향 없이는 루틴 변화 동인이 약하며, 기존 제품에 대한 고착도 높음.",
              voc: { quote: "원래 세안만 했는데 여자친구가 자기 로션 한 번 써보라고 해서요. 그게 계기였어요. 딱히 피부 고민이 있다는 생각은 못 했었는데.", meta: "남성 · 저관여 · 복합성 · 응답자 #211" },
            },
            {
              tag: "저관여 여성",
              text: "저관여 여성(청록)은 1~2단계 루틴에 분포하지만 탐색 성향은 남성보다 상대적으로 높음. 적절한 트리거(지인 추천·SNS)가 루틴 진입 가능성을 열어두고 있음.",
              voc: { quote: "인스타에서 루틴 영상 보다가 '이 제품 좋다'는 얘기가 계속 나오더라고요. 검색해보고, 성분도 찾아보고, 그러다가 처음으로 세럼을 사게 됐어요.", meta: "여성 · 저관여 · 건성 · 응답자 #89" },
            },
            {
              tag: "대각선 분포",
              text: "루틴 복잡도 ↑ → 탐색 성향 ↑의 양의 상관 패턴 관찰. 단, 3단계 루틴 그룹 내 탐색 성향 편차가 크게 나타남 — 루틴 단계 수만으로 세그먼트를 단순화하기 어렵다는 근거.",
              voc: { quote: "아침저녁 루틴 있어요. 처음엔 좀 귀찮기도 했는데 이제는 안 하면 오히려 이상한 느낌이에요.", meta: "여성 · 중관여 · 복합성 · 응답자 #118" },
            },
          ].map(({ tag, text, voc }, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6, paddingBottom: 12, borderBottom: "1px solid #f1f3f8" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ ...S.tag, flexShrink: 0, marginBottom: 0, whiteSpace: "nowrap" }}>{tag}</div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.75 }}>{text}</div>
              </div>
              <div style={{ borderLeft: "2px solid #dde1ee", paddingLeft: 12, marginLeft: 4 }}>
                <div style={{ fontSize: 12, color: "#64748b", fontStyle: "italic", lineHeight: 1.7 }}>"{voc.quote}"</div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}>{voc.meta}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Routine Patterns ──────────────────────────────────────────────────────────
const RoutinePatterns = () => {
  const [openId, setOpenId] = useState(null);
  const [tab, setTab]       = useState("전체");

  const filtered = tab === "AM"
    ? ROUTINE_PATTERNS.filter(p => !p.pmOnly)
    : tab === "PM"
    ? ROUTINE_PATTERNS.filter(p => !p.amOnly)
    : ROUTINE_PATTERNS;

  return (
    <div>
      {/* AM/PM toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["전체", "AM", "PM"].map(v => (
          <FilterBtn key={v} label={v === "AM" ? "아침 루틴" : v === "PM" ? "저녁 루틴" : "전체"} active={tab === v} onClick={() => setTab(v)} />
        ))}
        <span style={{ fontSize: 11, color: "#94a3b8", alignSelf: "center", marginLeft: 8 }}>클릭하여 패턴 상세 보기</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(p => {
          const isOpen = openId === p.id;
          return (
            <div key={p.id}
              onClick={() => setOpenId(isOpen ? null : p.id)}
              style={{ ...S.card, borderLeft: `3px solid ${p.color}`, cursor: "pointer" }}
            >
              {/* Header row */}
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ fontSize: 22, flexShrink: 0 }}>{p.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1e2433" }}>{p.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                      {p.steps.map((step, i) => (
                        <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <span style={{ padding: "2px 8px", background: `${p.color}1a`, color: p.color, borderRadius: 3, fontSize: 11, fontWeight: 600, border: `1px solid ${p.color}44` }}>{step}</span>
                          {i < p.steps.length - 1 && <span style={{ color: "#dde1ee", fontSize: 12 }}>→</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{p.desc}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, minWidth: 56 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: p.color }}>{p.pct}%</div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>n={p.count}</div>
                </div>
                <div style={{ color: "#94a3b8", fontSize: 12, flexShrink: 0 }}>{isOpen ? "▲" : "▼"}</div>
              </div>

              {/* Expanded */}
              {isOpen && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #dde1ee", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>응답자 특성</div>
                    <div style={{ fontSize: 12, color: "#1e2433", lineHeight: 1.8, marginBottom: 12 }}>{p.profile}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>주요 동기</div>
                    <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.7 }}>{p.motivation}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>주요 제품군</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                      {p.products.map((prod, i) => (
                        <span key={i} style={{ padding: "3px 9px", background: "#f1f3f8", border: "1px solid #dde1ee", borderRadius: 3, fontSize: 11, color: "#64748b" }}>{prod}</span>
                      ))}
                    </div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>주요 구매 계기</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {p.triggers.map((t, i) => (
                        <span key={i} style={{ padding: "3px 9px", background: `${p.color}11`, border: `1px solid ${p.color}44`, borderRadius: 3, fontSize: 11, color: p.color }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── VOC ───────────────────────────────────────────────────────────────────────
const MiniVOC = ({ quote, meta }) => (
  <div style={{ borderLeft: "2px solid #dde1ee", paddingLeft: 12, marginTop: 8 }}>
    <div style={{ fontSize: 12, color: "#64748b", fontStyle: "italic", lineHeight: 1.7 }}>"{quote}"</div>
    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}>{meta}</div>
  </div>
);

// ── Nav sections ──────────────────────────────────────────────────────────────
const NAV = [
  { id: "overview", label: "연구 개요" },
  { id: "profile", label: "참여자 프로파일" },
  { id: "respondents", label: "응답자 분포" },
  { id: "concerns", label: "피부 고민 & 관심 계기" },
  { id: "brands", label: "브랜드 인지도" },
  { id: "purchase", label: "구매 행동" },
  { id: "routine", label: "스킨케어 루틴" },
  { id: "attributes", label: "제품 속성 중요도" },
  { id: "amore", label: "아모레퍼시픽 브랜드" },
  { id: "insights", label: "인사이트" },
];

// ── Main App ──────────────────────────────────────────────────────────────────

export default function App() {
  const [activeSection, setActiveSection] = useState("overview");

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
    }
  };

  // AP brand awareness donut data
  const apTop6 = AP_BRANDS.slice(0, 6).map(b => ({
    label: b.label,
    value: b.value,
  }));

  const wtpDonut = WTP.map(w => ({ label: w.label, value: w.value }));

  const triggerSingleTop6 = TRIGGER_SINGLE.slice(0, 6).map(t => ({
    label: t.label,
    value: t.value,
    pct: t.pct,
  }));

  const skinTypeDonut = SKIN_TYPE.map(s => ({ label: s.label, value: s.value }));

  const genderDonut = GENDER.map(g => ({ label: g.label, value: g.value }));

  // Routine complexity chart data
  const routineData = ROUTINE_COMPLEXITY.map(r => ({
    label: r.label,
    "여성 (F)": r.f,
    "남성 (M)": r.m,
  }));

  // Trigger single by gender
  const triggerGenderData = TRIGGER_SINGLE.slice(0, 6).map(t => ({
    label: t.label.length > 16 ? t.label.slice(0, 16) + "…" : t.label,
    "여성 (F)": t.f,
    "남성 (M)": t.m,
  }));

  // MaxDiff top 10 and bottom 5
  const mdSorted = [...MAXDIFF].sort((a, b) => b.net - a.net);
  const mdTop = mdSorted.slice(0, 10);
  const mdNetChart = mdSorted.map(d => ({
    label: d.label.length > 18 ? d.label.slice(0, 18) + "…" : d.label,
    "Net Score": d.net,
    pct: d.score,
  }));

  // Attr gender comparison (top 8 attrs by net)
  const attrGenderData = mdSorted.slice(0, 8).map(d => ({
    label: d.label.length > 14 ? d.label.slice(0, 14) + "…" : d.label,
    "여성 Most": d.f_most,
    "남성 Most": d.m_most,
  }));

  return (
    <div style={{ background: "#f4f6fb", minHeight: "100vh" }}>
      {/* Nav */}
      <div style={S.navBar}>
        <div style={S.navInner}>
          {NAV.map(n => (
            <div
              key={n.id}
              style={{ ...S.navItem, ...(activeSection === n.id ? S.navItemActive : {}) }}
              onClick={() => scrollTo(n.id)}
            >
              {n.label}
            </div>
          ))}
        </div>
      </div>

      <div style={S.page}>
        {/* Header */}
        <div style={S.header}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={S.tag}>Quant Research Demo</div>
            <div style={S.disclaimer}>⚠ Synthetic / simulated dataset based on interview responses</div>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1e2433", marginBottom: 8 }}>
            아모레퍼시픽 스킨케어 사용자 인터뷰 인사이트 리포트
          </h1>
          <div style={{ fontSize: 15, color: "#64748b" }}>
            AI-assisted IDI (In-Depth Interview) · n=252 · 2026
          </div>
        </div>

        {/* ── 1. 연구 개요 ── */}
        <Section id="overview" title="연구 개요"
          subtitle="조사 목적, 방법론, 참여자 요약">

          <div style={{ ...S.grid3, marginBottom: 20 }}>
            <StatCard title="총 응답자" value={META.n} sub="AI 인터뷰어 기반 IDI" color="#6c7aff" />
            <StatCard title="여성 응답자" value={`${META.n_female} (${Math.round(META.n_female/META.n*100)}%)`} sub="총 응답자 대비" color="#a78bfa" />
            <StatCard title="남성 응답자" value={`${META.n_male} (${Math.round(META.n_male/META.n*100)}%)`} sub="총 응답자 대비" color="#34d399" />
          </div>

          <div style={S.card}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32 }}>
              <div>
                <div style={{ ...S.cardTitle, marginBottom: 8 }}>조사 목적</div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.8 }}>
                  스킨케어 소비자의 루틴·브랜드 인지도·구매 의사결정 요인을 파악하고,
                  아모레퍼시픽 브랜드 포트폴리오에 대한 사용자 인식을 분석
                </div>
              </div>
              <div>
                <div style={{ ...S.cardTitle, marginBottom: 8 }}>방법론</div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.8 }}>
                  AI 인터뷰어 기반 1:1 심층 인터뷰 (IDI)<br />
                  실사 인터뷰 4건 + 스크립트 기반 시뮬레이션 248건<br />
                  MaxDiff (Best-Worst Scaling) 12 라운드 포함
                </div>
              </div>
              <div>
                <div style={{ ...S.cardTitle, marginBottom: 8 }}>주의 사항</div>
                <div style={{ fontSize: 13, color: "#fb923c", lineHeight: 1.8 }}>
                  본 데이터셋은 인터뷰 응답 기반 시뮬레이션 데이터입니다.
                  통계적 유의성을 주장하지 않으며, 실제 모집단을 대표하지 않습니다.
                  디모 목적으로만 사용하세요.
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ── 2. 참여자 프로파일 ── */}
        <Section id="profile" title="참여자 프로파일"
          subtitle="성별 · 피부 타입 · 스킨케어 관여도 분포">

          <div style={S.grid3}>
            <div style={S.card}>
              <div style={S.cardTitle}>성별 구성</div>
              <DonutChart data={genderDonut} colors={[COLORS.female, COLORS.male]} />
            </div>
            <div style={S.card}>
              <div style={S.cardTitle}>피부 타입</div>
              <DonutChart data={skinTypeDonut} />
            </div>
            <div style={S.card}>
              <div style={S.cardTitle}>스킨케어 관여도</div>
              <DonutChart data={INVOLVEMENT} colors={["#6c7aff", "#a78bfa", "#34d399"]} />
            </div>
          </div>
        </Section>

        {/* ── 2-b. 응답자 분포 맵 ── */}
        <Section id="respondents" title="응답자 분포 맵"
          subtitle="루틴 복잡도 × 탐색 성향 — 응답자 252명을 2차원으로 배치한 탐색적 시각화 (추정 기반)">
          <div style={{ ...S.card, marginBottom: 20, padding: "14px 20px", borderLeft: "3px solid #6c7aff" }}>
            <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.8 }}>
              <b style={{ color: "#1e2433" }}>X축 (루틴 복잡도)</b>는 응답자가 보고한 루틴 단계 수를 기반으로 산출.{" "}
              <b style={{ color: "#1e2433" }}>Y축 (탐색 성향)</b>은 스킨케어 관여도·WTP 응답에서 파생한 추정치입니다.
              점을 <b style={{ color: "#6c7aff" }}>클릭</b>하면 응답자 상세 프로파일을 확인할 수 있습니다.
            </div>
          </div>
          <RespondentMap />
        </Section>

        {/* ── 3. 피부 고민 & 관심 계기 ── */}
        <Section id="concerns" title="피부 고민 및 스킨케어 관심 계기"
          subtitle="응답자가 언급한 주요 피부 고민 (복수 집계 추정)">
          <div style={S.grid2}>
            <div style={S.card}>
              <div style={S.cardTitle}>주요 피부 고민 Top 7</div>
              <HBarChart data={SKIN_CONCERNS} color="#6c7aff" showPct />
            </div>
            <div style={S.card}>
              <div style={S.cardTitle}>관심 계기 요약</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 0, marginTop: 8 }}>
                {[
                  {
                    icon: "💧", title: "건조함·속건조 심화", desc: "가장 흔한 계기. 계절 변화·직장 시작 등 생활 변화와 함께 언급.", pct: "~39%",
                    vocs: [
                      { quote: "갑자기 볼이 너무 당겨서, 그때부터 뭔가 바르기 시작했어요. 세안만 하다가 로션을 처음 산 게 그즈음이에요.", meta: "여성 · 중관여 · 건성 · 응답자 #38" },
                      { quote: "직장 다니기 시작하면서 건조하고 당기는 게 심해지더라고요. 그때부터 뭔가 해야겠다 싶어서 시작했어요.", meta: "여성 · 고관여 · 복합성 · 응답자 #12" },
                    ],
                  },
                  {
                    icon: "✨", title: "잡티·기미 발생", desc: "20대 후반~30대 초반에 새로운 고민으로 등장. 기능성 제품 진입점.", pct: "~29%",
                    vocs: [
                      { quote: "피부 결이 울퉁불퉁하고 기미가 조금씩 생기는 것 같아서요. 사진 찍으면 확 티가 나더라고요.", meta: "여성 · 고관여 · 복합성 · 응답자 #12" },
                    ],
                  },
                  {
                    icon: "👫", title: "지인 추천·파트너 영향", desc: "남성 응답자에서 특히 두드러짐. 여성 파트너/가족이 구매에 개입.", pct: "~22%",
                    vocs: [
                      { quote: "원래 세안만 했는데 여자친구가 자기 로션 한 번 써보라고 해서요. 그게 계기였어요. 딱히 피부 고민이 있다는 생각은 못 했었는데.", meta: "남성 · 저관여 · 복합성 · 응답자 #211" },
                    ],
                  },
                  {
                    icon: "📱", title: "SNS·유튜브 콘텐츠", desc: "MZ세대 중심의 Discovery 채널. 구체적 제품 이름 언급으로 이어짐.", pct: "~19%",
                    vocs: [
                      { quote: "인스타에서 루틴 영상 보다가 '이 제품 좋다'는 얘기가 계속 나오더라고요. 직접 검색해보고 성분도 찾아보다가 처음으로 세럼을 사게 됐어요.", meta: "여성 · 저관여 → 중관여 · 건성 · 응답자 #89" },
                    ],
                  },
                  {
                    icon: "🔬", title: "노화 방지·탄력 감소", desc: "30대 이상 응답자 위주. 기능성 제품 추가 계기.", pct: "~18%",
                    vocs: [
                      { quote: "서른 넘으면서 탄력이 줄었다는 느낌이 들었어요. 거울 보다가 뭔가 처져 보이는 것 같아서, 그때부터 콜라겐이나 탄력 관련 성분 찾아보게 됐어요.", meta: "여성 · 고관여 · 건성 · 응답자 #147" },
                    ],
                  },
                ].map((item, i) => (
                  <div key={i} style={{ paddingBottom: 16, marginBottom: 4, borderBottom: "1px solid #f1f3f8" }}>
                    <div style={{ display: "flex", gap: 14, alignItems: "flex-start", paddingTop: 12 }}>
                      <div style={{ fontSize: 20 }}>{item.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#1e2433" }}>{item.title}</div>
                        <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{item.desc}</div>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#6c7aff", minWidth: 40, textAlign: "right" }}>{item.pct}</div>
                    </div>
                    <div style={{ marginLeft: 34, display: "flex", flexDirection: "column", gap: 6 }}>
                      {item.vocs.map((v, vi) => <MiniVOC key={vi} {...v} />)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ── 4. 브랜드 인지도 ── */}
        <Section id="brands" title="브랜드 인지도 및 연상"
          subtitle="자발적 상기(unaided recall) 브랜드 — 상위 15개 기준 (n=252)">
          <div style={S.grid2}>
            <div style={S.card}>
              <div style={S.cardTitle}>상위 15개 브랜드 언급 수</div>
              <HBarChart
                data={TOP_BRANDS_ALL.slice(0, 15)}
                color="#6c7aff"
                height={520}
                showPct
              />
            </div>
            <div style={S.card}>
              <div style={S.cardTitle}>브랜드 인지 특성</div>
              <div style={{ fontSize: 13, color: "#64748b", lineHeight: 2, marginBottom: 16 }}>
                상위 브랜드들은 올리브영 중심 구매 채널과 SNS 광고 노출을 통해 인지되는 경향
              </div>
              <div style={{ ...S.card, background: "#f1f3f8", padding: 16, marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#a78bfa", marginBottom: 6 }}>관여도 High 응답자 (n≈108)</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>평균 8–14개 브랜드 자발 상기. 드럭스토어·더마 라인 혼재</div>
                <MiniVOC quote="드럭스토어 라인은 기본 보습이고, 더마 라인은 트러블 날 때 쓰고. 기능에 따라 골라 쓰는 편이에요. 브랜드가 많다 보니 적재적소로 쓰게 되더라고요." meta="여성 · 고관여 · 복합성 · 응답자 #12" />
              </div>
              <div style={{ ...S.card, background: "#f1f3f8", padding: 16, marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#34d399", marginBottom: 6 }}>관여도 Low 응답자 — 남성 포함 (n≈97)</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>평균 2–4개 브랜드 상기. 현재 사용 제품 브랜드 1–2개에 집중</div>
                <MiniVOC quote="솔직히 브랜드는 잘 모르겠고... 지금 쓰는 것도 이름을 잘 모르는 것 같아요. 여자친구가 사다 준 거라서요." meta="남성 · 저관여 · 응답자 #194" />
              </div>
              <div style={{ ...S.card, background: "#f1f3f8", padding: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#fb923c", marginBottom: 6 }}>아모레퍼시픽 브랜드 합산 인지율</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#fb923c" }}>
                  {Math.round(AP_BRANDS.reduce((s, b) => s + b.value, 0) / META.n * 100)}%
                </div>
                <div style={{ fontSize: 12, color: "#64748b" }}>12개 AP 브랜드 중 1개 이상 언급 응답자 비율 (추정)</div>
                <MiniVOC quote="에스트라는 올리브영 갈 때마다 눈에 띄어서요. 민감성 피부에 좋다는 얘기를 들었고, 한 번 써보니까 자극이 없어서 계속 쓰게 됐어요." meta="여성 · 중관여 · 건성 · 응답자 #57" />
              </div>
            </div>
          </div>
        </Section>

        {/* ── 5. 구매 행동 ── */}
        <Section id="purchase" title="구매 행동 및 의사결정 요인"
          subtitle="다중 선택 트리거(Q3)와 단일 핵심 트리거(Q4), 성별 비교">

          <div style={{ ...S.grid2, marginBottom: 20 }}>
            <div style={S.card}>
              <div style={S.cardTitle}>구매 계기 — 복수 선택 (Q3, n=252)</div>
              <HBarChart data={TRIGGER_MULTI.slice(0, 10)} color="#a78bfa" showPct height={380} />
            </div>
            <div style={S.card}>
              <div style={S.cardTitle}>핵심 구매 계기 — 단일 선택 (Q4, n=252)</div>
              <DonutChart data={triggerSingleTop6} colors={COLORS.chart} height={280} />
            </div>
          </div>

          <div style={S.grid2}>
            <div style={S.card}>
              <div style={S.cardTitle}>핵심 트리거 성별 비교 (Q4 Top 6)</div>
              <StackedBarH
                data={triggerGenderData}
                keys={["여성 (F)", "남성 (M)"]}
                colors={[COLORS.female, COLORS.male]}
                height={260}
              />
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 8 }}>
                여성: 실제 효과·후기/리뷰 중심 / 남성: 기존 경험·선물 수령 비중 높음
              </div>
              <MiniVOC quote="리뷰 진짜 엄청 읽었어요. 네이버 블로그 10개는 본 것 같고, 유튜브도 보고요. 성분표도 같이 비교해봤어요. 그래야 뭘 사는지 알 수 있잖아요." meta="여성 · 고관여 · 건성 · 응답자 #12" />
              <MiniVOC quote="예전에 써봤던 게 괜찮았으니까 그냥 또 사는 거죠. 굳이 새걸 찾아볼 생각은 없어요. 귀찮기도 하고." meta="남성 · 저관여 · 응답자 #229" />
            </div>
            <div style={S.card}>
              <div style={S.cardTitle}>2배 가격 지불 의향 (WTP) — 성별 비교</div>
              <div style={{ marginBottom: 16 }}>
                <DonutChart data={wtpDonut} colors={[COLORS.positive, COLORS.accent2, COLORS.negative, COLORS.neutral]} height={220} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { label: "여성 — 구매 의향↑", value: `${Math.round(WTP[0].f/META.n_female*100)}%`, color: "#a78bfa" },
                  { label: "남성 — 구매 의향↑", value: `${Math.round(WTP[0].m/META.n_male*100)}%`, color: "#34d399" },
                  { label: "여성 — 의향 없음", value: `${Math.round(WTP[2].f/META.n_female*100)}%`, color: "#f87171" },
                  { label: "남성 — 의향 없음", value: `${Math.round(WTP[2].m/META.n_male*100)}%`, color: "#f87171" },
                ].map((s, i) => (
                  <div key={i} style={{ background: "#f1f3f8", borderRadius: 6, padding: "10px 14px" }}>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{s.label}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <MiniVOC quote="좋은 게 비싸면 어쩔 수 없는데, 비싸다고 다 좋은 건 아니잖아요. 만 원짜리가 오만 원짜리보다 더 맞았던 적도 있어서, 가격 믿고 사기는 좀 어려워요." meta="여성 · 중관여 · 복합성 · 응답자 #118" />
            </div>
          </div>
        </Section>

        {/* ── 6. 스킨케어 루틴 ── */}
        <Section id="routine" title="스킨케어 루틴 패턴"
          subtitle="루틴 복잡도 분포와 AM/PM 사용자 여정 (User Journey)">

          <div style={{ ...S.grid2, marginBottom: 20 }}>
            <div style={S.card}>
              <div style={S.cardTitle}>루틴 복잡도 분포 (성별 비교)</div>
              <StackedBarH
                data={routineData}
                keys={["여성 (F)", "남성 (M)"]}
                colors={[COLORS.female, COLORS.male]}
                height={220}
              />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
                <div style={{ background: "#f1f3f8", borderRadius: 6, padding: "10px 14px" }}>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>여성 평균 단계수</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#a78bfa" }}>
                    {(ROUTINE_COMPLEXITY.reduce((s, r) => s + r.f * (r.all === r.f + r.m ? parseInt(r.label[0]) : parseInt(r.label[0])), 0) / META.n_female).toFixed(1)}
                  </div>
                </div>
                <div style={{ background: "#f1f3f8", borderRadius: 6, padding: "10px 14px" }}>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>남성 평균 단계수</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#34d399" }}>
                    {(ROUTINE_COMPLEXITY.reduce((s, r) => s + r.m * parseInt(r.label[0]), 0) / META.n_male).toFixed(1)}
                  </div>
                </div>
              </div>
            </div>

            <div style={S.card}>
              <div style={S.cardTitle}>루틴 패턴 특이점</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  {
                    icon: "♀", label: "여성 고관여 (v=3)", note: "5단계+ 풀 루틴. AM 미스트→에센스→세럼→크림→선크림, PM 이중세안+나이트 마스크",
                    voc: { quote: "아침에 미스트, 토너, 세럼, 크림, 선크림 이렇게 하고요. 저녁엔 이중세안에 나이트 마스크까지 해요. 귀찮냐고 하는데 저한테는 그냥 일상이에요.", meta: "여성 · 고관여 · 건성 · 응답자 #7" },
                  },
                  {
                    icon: "♀", label: "여성 보통 (v=1-2)", note: "3–4단계 표준 루틴. 선크림은 외출 시만. 저녁 기능성 1개 추가 패턴 多",
                    voc: { quote: "저녁에 세럼 하나 추가했어요. 기본 루틴은 그대로인데 기능성 하나만 더 넣은 거예요. 부담 없이 할 수 있는 정도로요.", meta: "여성 · 중관여 · 건성 · 응답자 #78" },
                  },
                  {
                    icon: "♂", label: "남성 일반 (v=0-1)", note: "1–2단계 미니멀. 세안+올인원 또는 세안+선크림. 여성 파트너 권유로 1단계 추가되는 케이스",
                    voc: { quote: "아침에 세안하고 올인원 크림 하나 바르는 게 전부예요. 더 하면 끈적거리고 답답해서요. 딱 이거면 충분한 것 같아요.", meta: "남성 · 저관여 · 응답자 #163" },
                  },
                  {
                    icon: "♂", label: "남성 관여 (v=2)", note: "3–4단계. 면도 후 진정 제품 포함. 본인이 능동적으로 고른 경우 성분·기능 인식 明",
                    voc: { quote: "면도하고 나서 피부가 예민해져서 진정 크림 쓰기 시작했어요. 처음엔 별로 안 쓰다가, 써보니까 확실히 차이가 있더라고요.", meta: "남성 · 중관여 · 건성 · 응답자 #172" },
                  },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "12px 14px", background: "#f1f3f8", borderRadius: 8 }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div style={{ minWidth: 28, height: 28, borderRadius: "50%", background: i < 2 ? "#a78bfa22" : "#34d39922", color: i < 2 ? "#a78bfa" : "#34d399", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>{item.icon}</div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#1e2433" }}>{item.label}</div>
                        <div style={{ fontSize: 11, color: "#64748b", marginTop: 3, lineHeight: 1.6 }}>{item.note}</div>
                      </div>
                    </div>
                    <div style={{ marginLeft: 40 }}>
                      <MiniVOC {...item.voc} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ ...S.card, marginBottom: 20 }}>
            <div style={S.cardTitle}>대표 루틴 패턴 — 응답자 그룹별 루틴 조합</div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 20, lineHeight: 1.7 }}>
              인터뷰 응답에서 도출한 5가지 대표 루틴 유형. 유사한 단계 조합을 가진 응답자를 그룹화했습니다.
            </div>
            <RoutinePatterns />
          </div>

          <div style={S.card}>
            <div style={S.cardTitle}>스킨케어 루틴 사용자 여정 (User Journey Timeline)</div>
            <div style={{ marginBottom: 16, display: "flex", gap: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 32, height: 8, background: "#fb923c", borderRadius: 4 }} />
                <span style={{ fontSize: 12, color: "#64748b" }}>AM 루틴</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 32, height: 8, background: "#6c7aff", borderRadius: 4 }} />
                <span style={{ fontSize: 12, color: "#64748b" }}>PM 루틴</span>
              </div>
            </div>
            <RoutineJourney data={ROUTINE_JOURNEY} />
          </div>
        </Section>

        {/* ── 7. 제품 속성 중요도 ── */}
        <Section id="attributes" title="제품 속성 중요도 (MaxDiff / Best-Worst Scaling)"
          subtitle="12 라운드 × 252명 — Most(+1) / Least(−1) 빈도 기반 Net Score 산출. 통계적 유의성 주장 없음.">

          <div style={{ ...S.card, marginBottom: 20 }}>
            <div style={S.cardTitle}>전체 속성 Net Score (Most 빈도 − Least 빈도, 내림차순)</div>
            <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 12, height: 12, background: COLORS.positive, borderRadius: 2 }} />
                <span style={{ fontSize: 11, color: "#64748b" }}>Most Important 선택 횟수</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 12, height: 12, background: COLORS.negative, borderRadius: 2 }} />
                <span style={{ fontSize: 11, color: "#64748b" }}>Least Important 선택 횟수</span>
              </div>
            </div>
            <MaxDiffBar data={MAXDIFF} />
          </div>

          <div style={S.grid2}>
            <div style={S.card}>
              <div style={S.cardTitle}>Top 4 중요 속성 — Net Score 기준</div>
              {mdSorted.slice(0, 4).map((d, i) => {
                const topVOCs = [
                  { quote: "비싼 거 사도 솔직히 차이 잘 모르겠더라고요. 그냥 보습만 되면 돼요. 가성비 좋은 걸로요.", meta: "남성 · 중관여 · 건성 · 응답자 #241" },
                  { quote: "피부 장벽이 무너지면 아무리 좋은 걸 발라도 소용없어요. 기능성 제품보다 장벽 먼저라는 걸 알고 나서 루틴이 바뀌었어요.", meta: "여성 · 고관여 · 건성 · 응답자 #22" },
                  { quote: "바르고 두 시간 지나면 또 당기는 게 제일 싫어요. 보습이 오래 가는 제품인지 꼭 확인해요.", meta: "여성 · 고관여 · 건성 · 응답자 #39" },
                  { quote: "성분표는 꼭 봐요. 나이아신아마이드 들어있으면 잡티에 좋으니까, 그 농도도 같이 검색해보거든요. 비율이 낮으면 사진 않아요.", meta: "여성 · 고관여 · 복합성 · 응답자 #31" },
                ];
                return (
                  <div key={i} style={{ padding: "14px 0", borderBottom: "1px solid #dde1ee" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ minWidth: 28, height: 28, borderRadius: "50%", background: "#6c7aff22", color: "#6c7aff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{i + 1}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#1e2433" }}>{d.label}</div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>Most: {d.most} / Least: {d.least}</div>
                      </div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.positive }}>+{d.net}</div>
                    </div>
                    <div style={{ marginLeft: 42 }}>
                      <MiniVOC {...topVOCs[i]} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={S.card}>
              <div style={S.cardTitle}>Bottom 4 속성 — 가장 낮은 Net Score</div>
              {mdSorted.slice(-4).reverse().map((d, i) => (
                <div key={i} style={{ padding: "14px 0", borderBottom: "1px solid #dde1ee", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ minWidth: 28, height: 28, borderRadius: "50%", background: "#f8717122", color: "#f87171", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1e2433" }}>{d.label}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>Most: {d.most} / Least: {d.least}</div>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.negative }}>{d.net}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...S.card, marginTop: 20 }}>
            <div style={S.cardTitle}>상위 8개 속성 — Most 선택 횟수 성별 비교</div>
            <StackedBarH
              data={attrGenderData}
              keys={["여성 Most", "남성 Most"]}
              colors={[COLORS.female, COLORS.male]}
              height={300}
            />
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 8 }}>
              남성: 끈적임 없음·무향저자극 상대적 우세 / 여성: 잡티·탄력 관련 속성 더 많이 선택
            </div>
          </div>
        </Section>

        {/* ── 8. 아모레퍼시픽 브랜드별 인식 ── */}
        <Section id="amore" title="아모레퍼시픽 브랜드별 인식"
          subtitle="자발 상기 기준 AP 브랜드 인지도, 포지셔닝 키워드, 성별 분포 (n=252)">

          <div style={{ ...S.card, marginBottom: 20 }}>
            <div style={S.cardTitle}>AP 브랜드 언급 수 (여성 / 남성 Stacked)</div>
            <APAwarenessBar />
          </div>

          <div style={{ marginBottom: 20 }}>
            <APBrandGrid />
          </div>

          <div style={S.card}>
            <div style={S.cardTitle}>AP 브랜드 포지셔닝 요약</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#6c7aff", marginBottom: 10 }}>↑ 상대적 인지도 높음</div>
                {[
                  { b: "에스트라", note: "피부 장벽·더마 포지션. 민감성·건성 핵심 브랜드. 올리브영 접근성 ↑", voc: { quote: "에스트라 쓴 지 한 8개월 됐어요. 민감성이라 자극 없는 걸 찾다가 추천 받았는데, 지금은 그냥 루틴에 박혀 있어요. 바꿀 생각이 없어요.", meta: "여성 · 중관여 · 건성 · 응답자 #44" } },
                  { b: "이니스프리", note: "자연성·가성비 인식 확고. 10–20대 유입 브랜드로 인식", voc: { quote: "이니스프리 제주 그린티 크림을 진짜 오래 썼었는데... 지금은 다른 거 쓰고 있고, 딱히 이유가 있었던 건 아닌데 어쩌다 바뀐 것 같아요.", meta: "여성 · 중관여 · 복합성 · 응답자 #118" } },
                  { b: "에뛰드", note: "색조 연계 브랜드. 스킨케어 독립 인식 낮은 편", voc: { quote: "에뛰드는 색조 이미지가 강해서, 스킨케어까지 쓸 생각은 못 했어요. 그냥 메이크업 브랜드인 줄 알았어요.", meta: "여성 · 중관여 · 건성 · 응답자 #85" } },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "10px 0", borderBottom: "1px solid #dde1ee" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1e2433" }}>{item.b}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{item.note}</div>
                    <MiniVOC {...item.voc} />
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#f87171", marginBottom: 10 }}>↓ 상대적 인지도 낮음 / 재포지셔닝 기회</div>
                {[
                  { b: "라네즈", note: "수분·워터 이미지 있지만 인지 응답 적음. 트렌드 소비자 타겟 강화 여지", voc: { quote: "이름은 들어봤는데 뭘 쓰는 브랜드인지는 잘 모르겠어요. 올리브영에서 본 것 같기는 한데 구체적으로 기억은 안 나요.", meta: "여성 · 중관여 · 응답자 #103" } },
                  { b: "오휘·한율", note: "프리미엄·안티에이징 포지션이나 젊은 응답자 인지 낮음", voc: { quote: "오휘는 엄마가 쓰는 거라는 이미지가 있어요. 저한테는 좀 나이들어 보이는 브랜드 같달까요.", meta: "여성 · 고관여 · 복합성 · 응답자 #12" } },
                  { b: "헤라·비디비치", note: "색조 브랜드로 인식, 스킨케어 독립 포지셔닝 미약", voc: { quote: "헤라는 쿠션 파운데이션만 알고 있어요. 스킨케어도 있는지 몰랐어요.", meta: "여성 · 중관여 · 건성 · 응답자 #67" } },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "10px 0", borderBottom: "1px solid #dde1ee" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1e2433" }}>{item.b}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{item.note}</div>
                    <MiniVOC {...item.voc} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ── 9. 인사이트 ── */}
        <Section id="insights" title="주요 인사이트 및 시사점"
          subtitle="데이터 패턴 기반 핵심 관찰 — 통계적 주장 아님">

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Insight num="01" tag="속성 중요도"
              title="'피부 장벽 강화'와 '가격 대비 효능'이 최상위 — 기능성·실용성 이중 기대"
              body="MaxDiff Net Score 기준 Top 4에 피부 장벽 강화(+157), 보습 지속(+157), 가격 대비 효능(+158), 자극 없음(+132) 집중. 소비자는 효능을 최우선시하면서도 프리미엄 지불 허들이 존재. 패키지·친환경 속성은 일관되게 하위권 — 기능 소통이 브랜딩보다 중요."
              vocs={[
                { quote: "성분표는 꼭 봐요. 나이아신아마이드 들어있으면 잡티에 좋으니까, 그 농도도 같이 검색해보거든요. 비율이 낮으면 사진 않아요.", meta: "여성 · 고관여 · 복합성 · 응답자 #31" },
                { quote: "패키지 예쁜 거 샀다가 성분 별로면 후회해요. 결국 피부에 뭐가 들어가냐가 제일 중요하더라고요.", meta: "여성 · 고관여 · 건성 · 응답자 #22" },
              ]}
            />
            <Insight num="02" tag="구매 행동"
              title="구매 트리거 1위 '후기/리뷰' — 디지털 구전이 최강 채널"
              body="Q4 단일 선택 기준 후기/리뷰(31.7%)와 실제 효과 경험(29.4%)이 전체의 61%. 특히 여성은 SNS 콘텐츠도 15% 차지. 남성은 기존 경험(습관 구매)·선물 수령 비중이 상대적으로 높아, 채널 전략이 성별에 따라 달라야 함."
              vocs={[
                { quote: "리뷰 진짜 엄청 읽었어요. 네이버 블로그 10개는 본 것 같고, 유튜브도 보고요. 성분표도 같이 비교해봤어요. 그래야 뭘 사는지 알 수 있잖아요.", meta: "여성 · 고관여 · 건성 · 응답자 #12" },
                { quote: "예전에 써봤던 게 괜찮았으니까 그냥 또 사는 거죠. 굳이 새걸 찾아볼 생각은 없어요. 귀찮기도 하고.", meta: "남성 · 저관여 · 응답자 #229" },
              ]}
            />
            <Insight num="03" tag="루틴 & 관여도"
              title="루틴 이분화 — 미니멀(31%) vs 멀티스텝(26%), 중간층(43%)"
              body="여성 고관여 응답자의 5단계+ 루틴은 고기능성 앰플·세럼 추가에 지출 의향 높음. 남성 응답자 대부분이 1–2단계 유지 — 올인원·다기능 제품으로 진입점 낮추는 전략 유효. 루틴 복잡도가 WTP와 양의 상관 패턴 관찰."
              vocs={[
                { quote: "아침에 미스트, 토너, 세럼, 크림, 선크림 이렇게 하고요. 저녁엔 이중세안에 나이트 마스크까지 해요. 귀찮냐고 하는데 저한테는 그냥 일상이에요.", meta: "여성 · 고관여 · 건성 · 응답자 #7" },
                { quote: "아침에 세안하고 올인원 크림 하나 바르는 게 전부예요. 더 하면 끈적거리고 답답해서요. 딱 이거면 충분한 것 같아요.", meta: "남성 · 저관여 · 응답자 #163" },
              ]}
            />
            <Insight num="04" tag="성별 세그먼트"
              title="남성: 기능 집중·가격 저항↑ / 여성: 성분·리뷰 주도 구매"
              body="WTP 2x 남성 의향 없음 36% vs 여성 9%. 남성 MaxDiff는 끈적임 없음·무향·가격 대비 효능 중심. 여성은 피부 장벽·잡티 개선 속성이 남성보다 뚜렷히 높음. 남성 제품 라인은 단순함·성분 신뢰 중심 메시지가 효과적."
              vocs={[
                { quote: "비싼 거 사도 솔직히 차이 잘 모르겠더라고요. 그냥 보습만 되면 돼요. 가성비 좋은 걸로요.", meta: "남성 · 중관여 · 건성 · 응답자 #241" },
                { quote: "성분 공부를 좀 해야 하잖아요. 나이아신아마이드 고농도면 피부가 붉어지거든요. 그걸 알고 나서 성분 체크를 꼭 하게 됐어요.", meta: "여성 · 고관여 · 복합성 · 응답자 #12" },
              ]}
            />
            <Insight num="05" tag="AP 브랜드"
              title="에스트라가 더마 포지션 인지 1위 — 단, 포트폴리오 전반 인지 편차 큼"
              body="에스트라(15.1%) > 일리윤(13.9%) > 에뛰드(13.5%) > 이니스프리(11.9%) 순. 에스트라·일리윤은 더마코스메틱 포지션으로 피부 장벽 수요 포착. 설화수는 고관여 응답자 위주로 인지(10.7%). 라네즈·오휘·한율은 스킨케어 단독 포지션으로의 재강화 기회 있음."
              vocs={[
                { quote: "에스트라 쓴 지 한 8개월 됐어요. 민감성이라 자극 없는 걸 찾다가 추천 받았는데, 지금은 그냥 루틴에 박혀 있어요. 바꿀 생각이 없어요.", meta: "여성 · 중관여 · 건성 · 응답자 #44" },
                { quote: "이니스프리 제주 그린티 크림을 진짜 오래 썼었는데... 지금은 다른 거 쓰고 있고, 딱히 이유가 있었던 건 아닌데 어쩌다 바뀐 것 같아요.", meta: "여성 · 중관여 · 복합성 · 응답자 #118" },
              ]}
            />
          </div>

          {/* Footer disclaimer */}
          <div style={{
            marginTop: 48, padding: 20,
            background: "#fff8f0",
            border: "1px solid #fed7aa",
            borderRadius: 8,
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#fb923c", marginBottom: 6 }}>데이터 출처 및 한계</div>
            <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.8 }}>
              본 리포트의 수치는 실사 인터뷰 4건 + AI 스크립트 기반 시뮬레이션 248건으로 구성된
              <b style={{ color: "#fb923c" }}> synthetic/simulated dataset</b>입니다.
              인구통계학적 대표성이 없으며, 통계적 유의성을 주장하지 않습니다.
              인사이트는 패턴 탐색 목적으로만 활용하세요. · n=252 · 2026
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
