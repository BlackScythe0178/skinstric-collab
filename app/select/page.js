"use client";
import Link from "next/link";
import { Header, NavButton } from "@/components/ui";

export default function Select() {
  return (
    <main className="page">
      <Header section="ANALYSIS" />
      <div className="analysis-head">
        <h2>A.I. ANALYSIS</h2>
        <p>
          A.I. HAS ESTIMATED THE FOLLOWING.
          <br />
          FIX ESTIMATED INFORMATION IF NEEDED.
        </p>
      </div>

      <section className="sel">
        <div className="sel__rings" aria-hidden>
          <span />
          <span />
          <span />
        </div>
        {/* 2×2 grid rotated 45° → top, right, left, bottom */}
        <div className="sel__grid">
          <Link href="/summary" className="tile tile--primary">
            <span>DEMOGRAPHICS</span>
          </Link>
          <button type="button" className="tile" disabled>
            <span>SKIN TYPE DETAILS</span>
          </button>
          <button type="button" className="tile" disabled>
            <span>COSMETIC CONCERNS</span>
          </button>
          <button type="button" className="tile" disabled>
            <span>WEATHER</span>
          </button>
        </div>
      </section>

      <NavButton href="/result" label="BACK" dir="left" />
      <NavButton href="/summary" label="GET SUMMARY" mobileLabel="NEXT" dir="right" />
    </main>
  );
}
