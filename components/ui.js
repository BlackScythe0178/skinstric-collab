"use client";
import Link from "next/link";

export function Header({ section = "INTRO", dark = false }) {
  return (
    <header className={`header${dark ? " header--dark" : ""}`}>
      <div className="header__brand">
        <Link href="/" className="header__logo">
          SKINSTRIC
        </Link>
        <span className="header__crumb">
          <span className="bracket">[</span>
          {section}
          <span className="bracket">]</span>
        </span>
      </div>
      <button type="button" className="header__code">
        ENTER CODE
      </button>
    </header>
  );
}

/** Diamond-arrow icon: a rotated square holding a small play triangle. */
export function ArrowIcon({ dir = "right", size = 30 }) {
  return (
    <span className="arrow-icon" style={{ width: size, height: size }}>
      <span className={`tri tri--${dir}`} />
    </span>
  );
}

/** BACK / PROCEED style buttons pinned to the bottom corners. */
export function NavButton({ href, onClick, label, mobileLabel, dir = "left", dark = false, className = "" }) {
  const cls = `nav-btn nav-btn--${dir === "left" ? "back" : "next"}${dark ? " nav-btn--dark" : ""} ${className}`;
  const inner = (
    <>
      <ArrowIcon dir={dir} />
      <span className="nav-btn__label">{label}</span>
      <span className="nav-btn__mobile">{mobileLabel || label}</span>
    </>
  );
  if (href)
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  return (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

/** Three nested dotted diamonds, slowly rotating. `base` is the smallest one's size in px. */
export function Diamonds({ base = 400, still = false, className = "" }) {
  return (
    <div className={`diamonds ${still ? "diamonds--still" : ""} ${className}`} style={{ "--base": `${base}px` }} aria-hidden>
      <span className="diamond diamond--1" />
      <span className="diamond diamond--2" />
      <span className="diamond diamond--3" />
    </div>
  );
}

export function Dots() {
  return (
    <span className="dots" aria-hidden>
      <span>.</span>
      <span>.</span>
      <span>.</span>
    </span>
  );
}

export function AnalyzingOverlay({ text = "PREPARING YOUR ANALYSIS" }) {
  return (
    <div className="overlay" role="status">
      <Diamonds base={270} />
      <p className="overlay__text">
        {text} <Dots />
      </p>
    </div>
  );
}

export function CameraGlyph({ size = 136 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 136 136" fill="none" aria-hidden>
      <circle cx="68" cy="68" r="66" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="68" cy="68" r="54" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
      <rect x="40" y="50" width="56" height="40" rx="4" stroke="currentColor" strokeWidth="2" />
      <path d="M56 50l4-7h16l4 7" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="68" cy="70" r="11" stroke="currentColor" strokeWidth="2" />
      <circle cx="68" cy="70" r="4" fill="currentColor" />
    </svg>
  );
}

export function GalleryGlyph({ size = 136 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 136 136" fill="none" aria-hidden>
      <circle cx="68" cy="68" r="66" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="68" cy="68" r="54" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
      <rect x="42" y="46" width="52" height="44" rx="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="56" cy="59" r="5" stroke="currentColor" strokeWidth="2" />
      <path d="M44 86l16-16 10 10 8-8 14 14" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export function SmallCamera({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2.5" y="6.5" width="19" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 6.5l1.5-3h5l1.5 3" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="13.5" r="4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
