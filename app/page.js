"use client";
import Link from "next/link";
import { useState } from "react";
import { Header, ArrowIcon, Diamonds } from "@/components/ui";

export default function Home() {
  const [hover, setHover] = useState(null); // "left" | "right" | null

  return (
    <main className={`page landing${hover ? ` landing--${hover}` : ""}`}>
      <Header />

      <div className="landing__side landing__side--left">
        <span className="landing__frame" />
        <button
          type="button"
          className="side-btn side-btn--left"
          onMouseEnter={() => setHover("left")}
          onMouseLeave={() => setHover(null)}
        >
          <ArrowIcon dir="left" />
          DISCOVER A.I.
        </button>
      </div>

      <div className="landing__side landing__side--right">
        <span className="landing__frame" />
        <Link
          href="/testing"
          className="side-btn side-btn--right"
          onMouseEnter={() => setHover("right")}
          onMouseLeave={() => setHover(null)}
        >
          TAKE TEST
          <ArrowIcon dir="right" />
        </Link>
      </div>

      <div className="landing__center">
        <Diamonds base={340} still className="landing__mobile-diamonds" />
        <h1 className="landing__title">
          <span>Sophisticated</span>
          <span>skincare</span>
        </h1>
        <p className="landing__lede">
          Skinstric developed an A.I. that creates a highly-personalized routine tailored to what your skin needs.
        </p>
        <Link href="/testing" className="landing__cta">
          ENTER EXPERIENCE
          <ArrowIcon dir="right" size={24} />
        </Link>
      </div>

      <p className="landing__blurb">
        Skinstric developed an A.I. that creates a highly-personalized routine tailored to what your skin needs.
      </p>
    </main>
  );
}
