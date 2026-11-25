"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

function copyWithSelection(value: string) {
  const previouslyFocused = document.activeElement;
  const input = document.createElement("textarea");
  input.value = value;
  input.readOnly = true;
  input.style.cssText = "position:fixed;top:0;left:0;opacity:0;font-size:16px;pointer-events:none";
  document.body.appendChild(input);
  try {
    input.focus({ preventScroll: true });
    input.select();
    input.setSelectionRange(0, value.length);
    if (!document.execCommand("copy")) throw new Error("Copy failed");
  } finally {
    input.remove();
    if (previouslyFocused instanceof HTMLElement) {
      previouslyFocused.focus({ preventScroll: true });
    }
  }
}

export function CopyButton({ label, value }: { label: string; value: string }) {
  const [status, setStatus] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function copy() {
    if (timer.current) clearTimeout(timer.current);
    try {
      if (window.isSecureContext && navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(value);
        } catch {
          copyWithSelection(value);
        }
      } else {
        copyWithSelection(value);
      }
      setStatus("Copied");
    } catch {
      setStatus("Unable to copy. Please select and copy the text manually.");
    }
    timer.current = setTimeout(() => setStatus(""), 2500);
  }

  return (
    <>
      <button
        type="button"
        className={styles.copyButton}
        onClick={copy}
        aria-label={`Copy ${label}`}
        title={status || `Copy ${label}`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {status === "Copied" ? (
            <path d="m5 12 4 4L19 6" />
          ) : (
            <>
              <rect x="9" y="9" width="12" height="12" rx="2" />
              <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
            </>
          )}
        </svg>
      </button>
      {status && status !== "Copied" && (
        <span className="block text-sm">{status}</span>
      )}
      <span className="sr-only" role="status">{status && `${label}: ${status}`}</span>
    </>
  );
}
