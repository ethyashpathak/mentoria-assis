"use client";
import { useState, useEffect } from "react";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

export default function HackerText({ text, className }: { text: string; className?: string }) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let iteration = 0;
    
    const interval = setInterval(() => {
      setDisplayText(
        text.split("")
          .map((letter, index) => {
            if(index < iteration) {
              return text[index];
            }
            return LETTERS[Math.floor(Math.random() * 42)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }

      // Calculate increment to finish in ~2 seconds max (approx 60 frames)
      const increment = Math.max(1 / 3, text.length / 60);
      iteration += increment; // speed
    }, 30);

    return () => clearInterval(interval);
  }, [text]);

  return <span className={className}>{displayText}</span>;
}
