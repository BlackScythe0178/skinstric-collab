"use client";
import { useEffect, useRef, useState } from "react";
import { Header, NavButton, Diamonds, Dots } from "@/components/ui";
import { submitPhaseOne, save, STORAGE } from "@/lib/api";

// Letters (incl. accented), single spaces, hyphens, apostrophes, periods between words. No digits/symbols.
const VALID = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '\-.][A-Za-zÀ-ÖØ-öø-ÿ]+)*\.?$/;

const STEPS = [
  { key: "name", placeholder: "Introduce Yourself", error: "Please enter a valid name (letters only, no numbers or symbols)." },
  { key: "location", placeholder: "your city name", error: "Please enter a valid city (letters only, no numbers or symbols)." },
];

export default function Testing() {
  const [step, setStep] = useState(0); // 0 name, 1 location, 2 submitting, 3 done
  const [values, setValues] = useState({ name: "", location: "" });
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (step < 2) inputRef.current?.focus();
  }, [step]);

  async function onSubmit(e) {
    e.preventDefault();
    const field = STEPS[step];
    const value = values[field.key].trim().replace(/\s+/g, " ");
    if (!VALID.test(value)) {
      setError(field.error);
      return;
    }
    setError("");
    setValues((v) => ({ ...v, [field.key]: value }));

    if (step === 0) {
      setStep(1);
      return;
    }

    const name = values.name.trim().replace(/\s+/g, " ");
    save(STORAGE.name, name);
    save(STORAGE.location, value);
    setStep(2);
    try {
      await submitPhaseOne(name, value);
      setStep(3);
    } catch {
      setError("We couldn't reach the server. Please try again.");
      setStep(1);
    }
  }

  const field = STEPS[step];

  return (
    <main className="page">
      <Header />
      <p className="page-label">TO START ANALYSIS</p>

      <section className="intro">
        <Diamonds base={400} />

        {step < 2 && (
          <form className="intro__form" onSubmit={onSubmit} key={field.key} noValidate>
            <label className="intro__hint" htmlFor="intro-input">
              CLICK TO TYPE
            </label>
            <input
              ref={inputRef}
              id="intro-input"
              className="intro__input"
              type="text"
              autoComplete="off"
              placeholder={field.placeholder}
              value={values[field.key]}
              onChange={(e) => {
                setValues((v) => ({ ...v, [field.key]: e.target.value }));
                if (error) setError("");
              }}
            />
            <button type="submit" className="sr-only">
              Submit
            </button>
            <p className="intro__error" role="alert">
              {error}
            </p>
          </form>
        )}

        {step === 2 && (
          <div className="intro__done">
            <p style={{ fontSize: 14, color: "rgba(26,27,28,.6)" }}>
              Processing submission <Dots />
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="intro__done">
            <h2>Thank you!</h2>
            <p>Proceed for the next step</p>
          </div>
        )}
      </section>

      <NavButton href="/" label="BACK" dir="left" />
      {step === 3 && <NavButton href="/result" label="PROCEED" dir="right" />}
    </main>
  );
}
