import { useState, useMemo } from "react";

const PRESET_ALLOYS = [
  { name: "Pure Lead",              tin: 0,     antimony: 0,   arsenic: 0,     copper: 0,   silver: 0, lead: 100,    hardness: 5  },
  { name: "Stick-On Wheel Weight",  tin: 0.25,  antimony: 0,   arsenic: 0,     copper: 0,   silver: 0, lead: 99.75,  hardness: 6  },
  { name: "40 to 1",                tin: 2.44,  antimony: 0,   arsenic: 0,     copper: 0,   silver: 0, lead: 97.56,  hardness: 8  },
  { name: "30 to 1",                tin: 3.23,  antimony: 0,   arsenic: 0,     copper: 0,   silver: 0, lead: 96.77,  hardness: 9  },
  { name: "25 to 1",                tin: 3.85,  antimony: 0,   arsenic: 0,     copper: 0,   silver: 0, lead: 96.15,  hardness: 9  },
  { name: "20 to 1",                tin: 4.76,  antimony: 0,   arsenic: 0,     copper: 0,   silver: 0, lead: 95.24,  hardness: 10 },
  { name: "16 to 1",                tin: 5.88,  antimony: 0,   arsenic: 0,     copper: 0,   silver: 0, lead: 94.12,  hardness: 11 },
  { name: "10 to 1",                tin: 9.09,  antimony: 0,   arsenic: 0,     copper: 0,   silver: 0, lead: 90.91,  hardness: 12 },
  { name: "Chilled Shot",           tin: 0,     antimony: 2,   arsenic: 0.625, copper: 0,   silver: 0, lead: 97.375, hardness: 10 },
  { name: "Antimonial Lead",        tin: 0,     antimony: 5,   arsenic: 0,     copper: 0,   silver: 0, lead: 95,     hardness: 13 },
  { name: "Magnum Shot (6 or 9)",   tin: 0,     antimony: 4,   arsenic: 1.25,  copper: 0,   silver: 0, lead: 94.75,  hardness: 13 },
  { name: "Magnum Shot (7-8.5)",    tin: 0,     antimony: 6,   arsenic: 1.25,  copper: 0,   silver: 0, lead: 92.75,  hardness: 13 },
  { name: "Range Lead (avg.)",      tin: 0.17,  antimony: 1,   arsenic: 0,     copper: 0,   silver: 0, lead: 98.83,  hardness: 10 },
  { name: "Clip-On Wheel Weight",   tin: 0.5,   antimony: 3,   arsenic: 0.25,  copper: 0,   silver: 0, lead: 96.25,  hardness: 12 },
  { name: "Isotope Lead (lg. cores)",tin: 1,    antimony: 3,   arsenic: 0,     copper: 0,   silver: 0, lead: 96,     hardness: 11 },
  { name: "Isotope Lead (ingots)",  tin: 2.5,   antimony: 2.5, arsenic: 0,     copper: 0,   silver: 0, lead: 95,     hardness: 11 },
  { name: "Electrotype",            tin: 2.5,   antimony: 2.5, arsenic: 0,     copper: 0,   silver: 0, lead: 95,     hardness: 11 },
  { name: "Hardball Alloy",         tin: 2,     antimony: 6,   arsenic: 0,     copper: 0,   silver: 0, lead: 92,     hardness: 16 },
  { name: "Lyman No. 2",            tin: 5,     antimony: 5,   arsenic: 0,     copper: 0,   silver: 0, lead: 90,     hardness: 15 },
  { name: "Linotype",               tin: 4,     antimony: 12,  arsenic: 0,     copper: 0,   silver: 0, lead: 84,     hardness: 19 },
  { name: "Stereotype",             tin: 6,     antimony: 14,  arsenic: 0,     copper: 0,   silver: 0, lead: 80,     hardness: 23 },
  { name: "Monotype",               tin: 9,     antimony: 19,  arsenic: 0,     copper: 0,   silver: 0, lead: 72,     hardness: 26 },
  { name: "Foundrytype",            tin: 15,    antimony: 23,  arsenic: 0,     copper: 0,   silver: 0, lead: 62,     hardness: 30 },
  { name: "Rotometals Super Hard",  tin: 0,     antimony: 30,  arsenic: 0,     copper: 0,   silver: 0, lead: 70,     hardness: 36 },
  { name: "Pure Antimony",          tin: 0,     antimony: 100, arsenic: 0,     copper: 0,   silver: 0, lead: 0,      hardness: 50 },
  { name: "40/60 Solder",           tin: 40,    antimony: 0,   arsenic: 0,     copper: 0,   silver: 0, lead: 60,     hardness: 15 },
  { name: "50/50 Solder",           tin: 50,    antimony: 0,   arsenic: 0,     copper: 0,   silver: 0, lead: 50,     hardness: 14 },
  { name: "60/40 Solder",           tin: 60,    antimony: 0,   arsenic: 0,     copper: 0,   silver: 0, lead: 40,     hardness: 16 },
  { name: "63/37 Solder",           tin: 63,    antimony: 0,   arsenic: 0,     copper: 0,   silver: 0, lead: 37,     hardness: 17 },
  { name: "Pewter",                 tin: 92.5,  antimony: 6,   arsenic: 0,     copper: 1.5, silver: 0, lead: 0,      hardness: 23 },
  { name: "Lead Free 95/5 Solder",  tin: 95,    antimony: 5,   arsenic: 0,     copper: 0,   silver: 0, lead: 0,      hardness: 15 },
  { name: "Pure Tin",               tin: 100,   antimony: 0,   arsenic: 0,     copper: 0,   silver: 0, lead: 0,      hardness: 7  },
];

const ELEMENTS = [
  { key: "tin",      label: "Tin (Sn)",       color: "#60a5fa" },
  { key: "antimony", label: "Antimony (Sb)",  color: "#f59e0b" },
  { key: "arsenic",  label: "Arsenic (As)",   color: "#a78bfa" },
  { key: "copper",   label: "Copper (Cu)",    color: "#f97316" },
  { key: "silver",   label: "Silver (Ag)",    color: "#94a3b8" },
  { key: "lead",     label: "Lead (Pb)",      color: "#6b7280" },
];

function calcHardness(tin, antimony) {
  return 8.60 + (0.29 * tin) + (0.92 * antimony);
}

function HardnessBar({ brinell }) {
  const max = 50;
  const pct = Math.min((brinell / max) * 100, 100);
  const color = brinell < 10 ? "#6b7280" : brinell < 16 ? "#60a5fa" : brinell < 26 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ height: 8, background: "#1f2937", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.4s ease" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3, fontSize: 10, color: "#6b7280" }}>
        <span>Soft (5)</span><span>Medium (16)</span><span>Hard (50)</span>
      </div>
    </div>
  );
}

function CompositionDonut({ composition }) {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const segments = ELEMENTS
    .map(el => ({ ...el, pct: composition[el.key] || 0 }))
    .filter(el => el.pct > 0);

  return (
    <svg width={140} height={140} viewBox="0 0 140 140" aria-label="Alloy composition donut chart">
      <circle cx={70} cy={70} r={radius} fill="none" stroke="#1f2937" strokeWidth={20} />
      {segments.map((seg) => {
        const dash = (seg.pct / 100) * circumference;
        const gap = circumference - dash;
        const el = (
          <circle
            key={seg.key}
            cx={70} cy={70} r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth={20}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            style={{ transform: "rotate(-90deg)", transformOrigin: "70px 70px", transition: "all 0.4s ease" }}
          />
        );
        offset += dash;
        return el;
      })}
      <text x={70} y={66} textAnchor="middle" fill="#e5e7eb" fontSize={11} fontFamily="'Share Tech Mono', monospace">ALLOY</text>
      <text x={70} y={80} textAnchor="middle" fill="#9ca3af" fontSize={10} fontFamily="'Share Tech Mono', monospace">MIX</text>
    </svg>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const S = {
  page: {
    minHeight: "100vh",
    background: "#0a0e14",
    color: "#e2e8f0",
    fontFamily: "'Share Tech Mono', 'Courier New', monospace",
    paddingBottom: 60,
  },
  header: {
    background: "#0d1117",
    borderBottom: "1px solid #1f2937",
    padding: "20px 20px 16px",
    marginBottom: 20,
  },
  headerTitle: {
    display: "flex",
    alignItems: "baseline",
    gap: 12,
    flexWrap: "wrap",
  },
  h1gold: {
    fontFamily: "'Oswald', sans-serif",
    fontSize: "clamp(24px, 6vw, 36px)",
    fontWeight: 700,
    margin: 0,
    letterSpacing: 3,
    color: "#f59e0b",
  },
  h1white: {
    fontFamily: "'Oswald', sans-serif",
    fontSize: "clamp(24px, 6vw, 36px)",
    fontWeight: 400,
    margin: 0,
    letterSpacing: 3,
    color: "#e2e8f0",
  },
  subtitle: {
    color: "#4b5563",
    fontSize: 11,
    letterSpacing: 2,
    marginTop: 4,
  },
  content: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 16px",
  },
  label: {
    fontSize: 11,
    color: "#4b5563",
    letterSpacing: 2,
    marginBottom: 8,
    display: "block",
  },
  card: {
    background: "#0d1117",
    border: "1px solid #1f2937",
    borderRadius: 4,
    padding: 16,
  },
  resultBox: {
    background: "#0d1117",
    border: "1px solid #1f2937",
    borderRadius: 4,
    padding: "14px 18px",
  },
  resultVal: {
    fontFamily: "'Oswald', sans-serif",
    fontSize: 28,
    color: "#f59e0b",
    letterSpacing: 1,
  },
  input: {
    background: "#111827",
    border: "1px solid #374151",
    color: "#e2e8f0",
    padding: "7px 10px",
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 14,
    width: "100%",
    borderRadius: 3,
    outline: "none",
    transition: "border 0.2s",
  },
  tip: {
    background: "#111827",
    borderLeft: "3px solid #374151",
    padding: "10px 14px",
    fontSize: 12,
    color: "#6b7280",
    lineHeight: 1.6,
    marginTop: 4,
  },
};

// ─── Main Component ─────────────────────────────────────────────────────────
export default function LeadAlloyCalculator() {
  const [mode, setMode] = useState("preset");
  const [selectedPreset, setSelectedPreset] = useState(PRESET_ALLOYS[0]); // Pure Lead
  const [boolWeight, setBoolWeight] = useState(200);
  const [lbsAvail, setLbsAvail] = useState(10);

  const [mixEntries, setMixEntries] = useState([
    { alloyIdx: 0,  lbs: 8, price: "" },
    { alloyIdx: 17, lbs: 1, price: "" },
    { alloyIdx: 13, lbs: 1, price: "" },
  ]);

  const updateMixEntry = (i, field, val) =>
    setMixEntries(prev => prev.map((e, idx) => idx !== i ? e : { ...e, [field]: val }));
  const addMixEntry = () =>
    setMixEntries(prev => [...prev, { alloyIdx: 0, lbs: 1, price: "" }]);
  const removeMixEntry = (i) =>
    setMixEntries(prev => prev.filter((_, idx) => idx !== i));

  const activeComposition = useMemo(() => {
    if (mode === "preset") {
      const { tin, antimony, arsenic, copper, silver, lead } = selectedPreset;
      return { tin, antimony, arsenic, copper, silver, lead };
    }
    const totalLbs = mixEntries.reduce((s, e) => s + (parseFloat(e.lbs) || 0), 0);
    if (totalLbs === 0) return { tin: 0, antimony: 0, arsenic: 0, copper: 0, silver: 0, lead: 0 };
    const comp = { tin: 0, antimony: 0, arsenic: 0, copper: 0, silver: 0, lead: 0 };
    mixEntries.forEach(e => {
      const a = PRESET_ALLOYS[e.alloyIdx];
      const w = parseFloat(e.lbs) || 0;
      ELEMENTS.forEach(el => { comp[el.key] += (a[el.key] * w) / totalLbs; });
    });
    return comp;
  }, [mode, selectedPreset, mixEntries]);

  const activePricePerLb = useMemo(() => {
    if (mode === "preset") return 0;
    const totalLbs = mixEntries.reduce((s, e) => s + (parseFloat(e.lbs) || 0), 0);
    if (totalLbs === 0) return 0;
    let cost = 0;
    mixEntries.forEach(e => {
      const p = parseFloat(e.price);
      if (!isNaN(p) && p > 0) cost += p * (parseFloat(e.lbs) || 0);
    });
    return cost / totalLbs;
  }, [mode, mixEntries]);

  const estHardness = useMemo(() => {
    if (mode === "preset") return selectedPreset.hardness;
    return calcHardness(parseFloat(activeComposition.tin) || 0, parseFloat(activeComposition.antimony) || 0);
  }, [mode, selectedPreset, activeComposition]);

  const costPerBoolit = (activePricePerLb / 7000) * boolWeight;
  const boolitCount = lbsAvail > 0 && boolWeight > 0 ? Math.floor((lbsAvail * 7000) / boolWeight) : 0;

  return (
    <div style={S.page}>
      <style>{`
        .tab-btn {
          background: transparent;
          border: 1px solid #374151;
          color: #9ca3af;
          padding: 8px 18px;
          cursor: pointer;
          font-family: 'Share Tech Mono', monospace;
          font-size: 13px;
          letter-spacing: 1px;
          transition: all 0.2s;
          min-height: 44px;
        }
        .tab-btn.active { background: #f59e0b; border-color: #f59e0b; color: #0a0e14; font-weight: bold; }
        .tab-btn:hover:not(.active) { border-color: #6b7280; color: #e2e8f0; }
        .tab-btn:first-child { border-radius: 3px 0 0 3px; }
        .tab-btn:last-child  { border-radius: 0 3px 3px 0; border-left: none; }

        .field-input {
          background: #111827;
          border: 1px solid #374151;
          color: #e2e8f0;
          padding: 8px 10px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 14px;
          width: 100%;
          border-radius: 3px;
          transition: border 0.2s;
          outline: none;
          min-height: 44px;
        }
        .field-input:focus { border-color: #f59e0b; }
        select.field-input { cursor: pointer; }

        .preset-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 6px;
          max-height: 300px;
          overflow-y: auto;
          padding-right: 4px;
        }
        @media (max-width: 480px) {
          .preset-grid { grid-template-columns: repeat(2, 1fr); max-height: 260px; }
        }

        .preset-card {
          background: #111827;
          border: 1px solid #1f2937;
          border-radius: 4px;
          padding: 10px 12px;
          cursor: pointer;
          transition: all 0.15s;
          min-height: 56px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .preset-card:hover  { border-color: #f59e0b; }
        .preset-card.active { border-color: #f59e0b; background: #1c1700; }

        .remove-btn {
          background: transparent;
          border: 1px solid #374151;
          color: #6b7280;
          padding: 6px 12px;
          cursor: pointer;
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          letter-spacing: 1px;
          border-radius: 3px;
          transition: all 0.15s;
          min-height: 36px;
          white-space: nowrap;
        }
        .remove-btn:hover { border-color: #ef4444; color: #ef4444; }

        .add-btn {
          background: transparent;
          border: 1px dashed #374151;
          color: #6b7280;
          padding: 10px 16px;
          cursor: pointer;
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px;
          letter-spacing: 1px;
          border-radius: 3px;
          width: 100%;
          transition: all 0.2s;
          margin-top: 4px;
          min-height: 44px;
        }
        .add-btn:hover { border-color: #60a5fa; color: #60a5fa; }

        /* Two-column layout on wide screens, single column on mobile */
        .main-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 24px;
        }
        @media (max-width: 768px) {
          .main-grid { grid-template-columns: 1fr; }
        }

        /* Results column stacks below on mobile */
        .results-col { display: flex; flex-direction: column; gap: 12px; }

        /* Cost grid */
        .cost-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        input[type=range] { width: 100%; accent-color: #f59e0b; min-height: 24px; }
      `}</style>

      {/* ── Header ── */}
      <header style={S.header}>
        <div style={S.headerTitle}>
          <h1 style={S.h1gold}>LEAD ALLOY</h1>
          <h1 style={S.h1white}>CALCULATOR</h1>
        </div>
        <p style={S.subtitle}>CAST BULLET &amp; ALLOY COMPOSITION TOOL</p>
      </header>

      <div style={S.content}>
        <div className="main-grid">

          {/* ── LEFT COLUMN ── */}
          <div>
            {/* Mode selector */}
            <div style={{ marginBottom: 20 }}>
              <span style={S.label}>SELECT INPUT MODE</span>
              <div style={{ display: "flex" }}>
                {[["preset", "PRESET ALLOYS"], ["mix", "MIX ALLOYS"]].map(([val, label]) => (
                  <button
                    key={val}
                    className={`tab-btn ${mode === val ? "active" : ""}`}
                    onClick={() => setMode(val)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── PRESET MODE ── */}
            {mode === "preset" && (
              <div>
                <span style={S.label}>SELECT AN ALLOY</span>
                <div className="preset-grid">
                  {PRESET_ALLOYS.map((a, i) => (
                    <div
                      key={i}
                      className={`preset-card ${selectedPreset === a ? "active" : ""}`}
                      onClick={() => setSelectedPreset(a)}
                    >
                      <div style={{
                        fontSize: 13,
                        color: selectedPreset === a ? "#f59e0b" : "#d1d5db",
                        fontFamily: "'Oswald', sans-serif",
                        letterSpacing: 1,
                        lineHeight: 1.2,
                      }}>{a.name}</div>
                      <div style={{ fontSize: 11, color: "#4b5563", marginTop: 3 }}>BHN {a.hardness}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── MIX MODE ── */}
            {mode === "mix" && (
              <div>
                <span style={S.label}>MIX ALLOYS BY WEIGHT — ENTER YOUR ACTUAL PRICES</span>

                {mixEntries.map((entry, i) => {
                  const lineTotal = (parseFloat(entry.lbs) || 0) * (parseFloat(entry.price) || 0);
                  const missingPrice = entry.price === "" || isNaN(parseFloat(entry.price));
                  return (
                    <div key={i} style={{ ...S.card, marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <span style={{ fontSize: 10, color: "#374151", letterSpacing: 2 }}>ALLOY {i + 1}</span>
                        <button className="remove-btn" onClick={() => removeMixEntry(i)}>✕ REMOVE</button>
                      </div>

                      <div style={{ marginBottom: 10 }}>
                        <label style={{ ...S.label, marginBottom: 5 }}>ALLOY NAME</label>
                        <select
                          className="field-input"
                          value={entry.alloyIdx}
                          onChange={e => updateMixEntry(i, "alloyIdx", parseInt(e.target.value))}
                        >
                          {PRESET_ALLOYS.map((a, ai) => (
                            <option key={ai} value={ai}>{a.name}</option>
                          ))}
                        </select>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <div>
                          <label style={{ ...S.label, marginBottom: 5 }}>WEIGHT (LBS)</label>
                          <input
                            type="number" min="0.1" step="0.5"
                            className="field-input"
                            value={entry.lbs}
                            onChange={e => updateMixEntry(i, "lbs", e.target.value)}
                          />
                        </div>
                        <div>
                          <label style={{ ...S.label, color: "#f59e0b", marginBottom: 5 }}>PRICE ($/LB)</label>
                          <div style={{ position: "relative" }}>
                            <span style={{
                              position: "absolute", left: 9, top: "50%",
                              transform: "translateY(-50%)",
                              color: "#f59e0b", fontSize: 13, pointerEvents: "none",
                            }}>$</span>
                            <input
                              type="number" min="0" step="0.01"
                              className="field-input"
                              style={{
                                paddingLeft: 18,
                                borderColor: missingPrice ? "#78350f" : "#374151",
                              }}
                              placeholder="0.00"
                              value={entry.price}
                              onChange={e => updateMixEntry(i, "price", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div style={{ marginTop: 8, display: "flex", justifyContent: "flex-end" }}>
                        {missingPrice
                          ? <span style={{ fontSize: 11, color: "#78350f" }}>⚠ enter price</span>
                          : <span style={{ fontSize: 11, color: "#4b5563" }}>
                              subtotal: <span style={{ color: "#9ca3af", fontFamily: "'Oswald', sans-serif", fontSize: 14 }}>${lineTotal.toFixed(2)}</span>
                            </span>
                        }
                      </div>
                    </div>
                  );
                })}

                <button className="add-btn" onClick={addMixEntry}>+ ADD ALLOY TO MIX</button>

                {/* Mix totals */}
                {(() => {
                  const totalLbs  = mixEntries.reduce((s, e) => s + (parseFloat(e.lbs)   || 0), 0);
                  const totalCost = mixEntries.reduce((s, e) => s + (parseFloat(e.lbs) || 0) * (parseFloat(e.price) || 0), 0);
                  const missing   = mixEntries.some(e => e.price === "" || isNaN(parseFloat(e.price)));
                  return (
                    <div style={{ ...S.card, marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                      <div style={{ fontSize: 12 }}>
                        <span style={{ color: "#4b5563" }}>TOTAL: </span>
                        <span style={{ color: "#e2e8f0", fontFamily: "'Oswald', sans-serif", fontSize: 16 }}>{totalLbs.toFixed(1)} lbs</span>
                      </div>
                      <div style={{ fontSize: 12 }}>
                        <span style={{ color: "#4b5563" }}>COST: </span>
                        {missing
                          ? <span style={{ color: "#f59e0b", fontSize: 11 }}>⚠ MISSING PRICES</span>
                          : <span style={{ color: "#f59e0b", fontFamily: "'Oswald', sans-serif", fontSize: 16 }}>${totalCost.toFixed(2)}</span>
                        }
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Composition breakdown */}
            <div style={{ ...S.card, marginTop: 24 }}>
              <span style={S.label}>COMPOSITION BREAKDOWN</span>
              {ELEMENTS.map(el => {
                const pct = parseFloat(activeComposition[el.key]) || 0;
                if (pct <= 0) return null;
                return (
                  <div key={el.key} style={{ marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 12, color: el.color }}>{el.label}</span>
                      <span style={{ fontSize: 12, fontFamily: "'Oswald', sans-serif", color: el.color }}>{pct.toFixed(2)}%</span>
                    </div>
                    <div style={{ height: 5, background: "#1f2937", borderRadius: 3 }}>
                      <div style={{
                        width: `${Math.min(pct, 100)}%`, height: "100%",
                        background: el.color, borderRadius: 3,
                        transition: "width 0.4s ease",
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Notes */}
            <div style={{ ...S.tip, marginTop: 16 }}>
              <strong style={{ color: "#9ca3af" }}>HARDNESS FORMULA:</strong> BHN = 8.60 + (0.29 × %Sn) + (0.92 × %Sb) · Rotometals<br />
              <strong style={{ color: "#9ca3af" }}>HUNTING HP:</strong> ~2% Sn + 2% Sb optimal ·{" "}
              <strong style={{ color: "#9ca3af" }}>BRITTLENESS:</strong> Keep Sb &lt; 6%<br />
              <strong style={{ color: "#9ca3af" }}>ARSENIC:</strong> Grain refiner — greatly improves heat treating &amp; quench hardening<br />
              <strong style={{ color: "#9ca3af" }}>OPTIMAL BHN:</strong> CUP ÷ 1279.8 (Missouri Bullet formula — check your load data)
            </div>
          </div>

          {/* ── RIGHT COLUMN (Results) ── */}
          <div className="results-col">
            <span style={S.label}>RESULTS</span>

            {/* Donut */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CompositionDonut composition={activeComposition} />
            </div>

            {/* Legend */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
              {ELEMENTS
                .filter(el => (parseFloat(activeComposition[el.key]) || 0) > 0)
                .map(el => (
                  <div key={el.key} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#9ca3af" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: el.color }} />
                    {el.label.split(" ")[0]}
                  </div>
                ))
              }
            </div>

            {/* Hardness */}
            <div style={S.resultBox}>
              <div style={{ fontSize: 10, color: "#4b5563", letterSpacing: 2, marginBottom: 4 }}>
                {mode === "preset" ? "KNOWN HARDNESS" : "EST. HARDNESS (FORMULA)"}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={S.resultVal}>{typeof estHardness === "number" ? estHardness.toFixed(mode === "preset" ? 0 : 1) : estHardness}</span>
                <span style={{ color: "#6b7280", fontSize: 13 }}>Brinell (BHN)</span>
              </div>
              <HardnessBar brinell={estHardness} />
            </div>

            {/* Price per lb */}
            {activePricePerLb > 0 && (
              <div style={S.resultBox}>
                <div style={{ fontSize: 10, color: "#4b5563", letterSpacing: 2, marginBottom: 4 }}>PRICE PER POUND</div>
                <span style={S.resultVal}>${activePricePerLb.toFixed(2)}</span>
                <span style={{ color: "#6b7280", fontSize: 13 }}> / lb</span>
              </div>
            )}

            {/* Boolit parameters */}
            <div style={S.card}>
              <div style={{ fontSize: 10, color: "#4b5563", letterSpacing: 2, marginBottom: 10 }}>BOOLIT PARAMETERS</div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ ...S.label, marginBottom: 6 }}>Boolit Weight (grains)</label>
                <input
                  type="range" min="50" max="600" step="5"
                  value={boolWeight}
                  onChange={e => setBoolWeight(parseInt(e.target.value))}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <span style={{ fontSize: 11, color: "#4b5563" }}>50 gr</span>
                  <span style={{ fontFamily: "'Oswald', sans-serif", color: "#f59e0b", fontSize: 20 }}>{boolWeight} gr</span>
                  <span style={{ fontSize: 11, color: "#4b5563" }}>600 gr</span>
                </div>
              </div>
              <div>
                <label style={{ ...S.label, marginBottom: 4 }}>Alloy Available (lbs)</label>
                <input
                  type="number" min="0.1" step="0.5"
                  className="field-input"
                  value={lbsAvail}
                  onChange={e => setLbsAvail(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            {/* Cost results */}
            {activePricePerLb > 0 && (
              <div className="cost-grid">
                {[
                  ["COST / BOOLIT", `$${costPerBoolit.toFixed(4)}`],
                  ["COST / 20",     `$${(costPerBoolit * 20).toFixed(2)}`],
                  ["COST / 50",     `$${(costPerBoolit * 50).toFixed(2)}`],
                  ["COST / 100",    `$${(costPerBoolit * 100).toFixed(2)}`],
                  ["COST / 500",    `$${(costPerBoolit * 500).toFixed(2)}`],
                  ["COST / 1000",   `$${(costPerBoolit * 1000).toFixed(2)}`],
                ].map(([label, val]) => (
                  <div key={label} style={{ ...S.card, padding: "10px 12px" }}>
                    <div style={{ fontSize: 9, color: "#4b5563", letterSpacing: 2 }}>{label}</div>
                    <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 20, color: "#e2e8f0", marginTop: 2 }}>{val}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Boolit count */}
            <div style={S.resultBox}>
              <div style={{ fontSize: 10, color: "#4b5563", letterSpacing: 2, marginBottom: 4 }}>
                BOOLITS FROM {lbsAvail} LBS
              </div>
              <span style={S.resultVal}>{boolitCount.toLocaleString()}</span>
              <span style={{ color: "#6b7280", fontSize: 13 }}> pcs</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
