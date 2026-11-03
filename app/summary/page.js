"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Header, NavButton } from "@/components/ui";
import { load, save, STORAGE } from "@/lib/api";

const TABS = [
  { key: "race", label: "RACE", heading: "RACE" },
  { key: "age", label: "AGE", heading: "AGE" },
  { key: "gender", label: "SEX", heading: "SEX" },
];

const sortDesc = (obj = {}) => Object.entries(obj).sort((a, b) => b[1] - a[1]);
const topOf = (obj) => sortDesc(obj)[0]?.[0] ?? "";
const pct = (v) => (v * 100).toFixed(2);

function display(key, value) {
  if (!value) return "—";
  if (key === "age") return `${value} y.o.`;
  if (key === "gender") return value.toUpperCase();
  return value;
}

function Ring({ value }) {
  const r = 49;
  const c = 2 * Math.PI * r;
  return (
    <div className="ring">
      <svg viewBox="0 0 100 100">
        <circle className="ring__track" cx="50" cy="50" r={r} />
        <circle className="ring__bar" cx="50" cy="50" r={r} strokeDasharray={c} strokeDashoffset={c * (1 - value)} />
      </svg>
      <div className="ring__value">
        <span>
          {Math.round(value * 100)}
          <sup>%</sup>
        </span>
      </div>
    </div>
  );
}

export default function Summary() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("race");
  const [actual, setActual] = useState({ race: "", age: "", gender: "" });
  const [toast, setToast] = useState("");

  useEffect(() => {
    const d = load(STORAGE.analysis, true);
    if (!d) {
      router.replace("/result");
      return;
    }
    setData(d);
    const predicted = { race: topOf(d.race), age: topOf(d.age), gender: topOf(d.gender) };
    const confirmed = load(STORAGE.confirmed, true);
    setActual({ ...predicted, ...(confirmed || {}) });
  }, [router]);

  const rows = useMemo(() => (data ? sortDesc(data[tab]) : []), [data, tab]);

  if (!data) return <main className="page" />;

  const selected = actual[tab];
  const confidence = data[tab]?.[selected] ?? 0;
  const active = TABS.find((t) => t.key === tab);

  function reset() {
    setActual({ race: topOf(data.race), age: topOf(data.age), gender: topOf(data.gender) });
    try { localStorage.removeItem(STORAGE.confirmed); } catch {}
  }

  function confirm() {
    save(STORAGE.confirmed, actual);
    setToast("Your demographics have been saved.");
    setTimeout(() => setToast(""), 2200);
  }

  return (
    <main className="page">
      <Header section="ANALYSIS" />

      <div className="sum">
        <div className="sum__head">
          <h3>A.I. ANALYSIS</h3>
          <h1>DEMOGRAPHICS</h1>
          <p>PREDICTED RACE &amp; AGE</p>
        </div>

        <div className="sum__grid">
          <div className="sum__tabs" role="tablist">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={tab === t.key}
                className={`sum__tab${tab === t.key ? " is-active" : ""}`}
                onClick={() => setTab(t.key)}
              >
                <strong style={t.key === "age" ? { textTransform: "none" } : undefined}>{display(t.key, actual[t.key])}</strong>
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          <section className="sum__main">
            <h2 style={tab === "age" ? { textTransform: "none" } : undefined}>{display(tab, selected)}</h2>
            <Ring value={confidence} />
          </section>

          <section className="sum__list">
            <div className="sum__list-head">
              <span>{active.heading}</span>
              <span>A.I. CONFIDENCE</span>
            </div>
            {rows.map(([name, value]) => (
              <button
                key={name}
                type="button"
                className={`sum__row${selected === name ? " is-active" : ""}`}
                onClick={() => setActual((a) => ({ ...a, [tab]: name }))}
              >
                <span className="sum__row-name">
                  <span className="mini-diamond" />
                  {tab === "gender" ? name.toUpperCase() : name}
                </span>
                <span>{pct(value)}%</span>
              </button>
            ))}
          </section>
        </div>

        <p className="sum__note">If A.I. estimate is wrong, select the correct one.</p>
      </div>

      <NavButton href="/select" label="BACK" dir="left" />
      <div className="sum__actions">
        <button type="button" className="btn-outline" onClick={reset}>
          RESET
        </button>
        <button type="button" className="btn-solid" onClick={confirm}>
          CONFIRM
        </button>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}
