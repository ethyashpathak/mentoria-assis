"use client";
import { useState, useEffect } from "react";

export default function GlitchText({ text, className }: { text: string; className?: string }) {
  const [isGlitching, setIsGlitching] = useState(true);

  useEffect(() => {
    // Shorter random glitch ranges to look cool and settle
    const glitchDuration = Math.random() * 1000 + 1000; // Between 1 to 2 seconds
    const timer = setTimeout(() => {
      setIsGlitching(false);
    }, glitchDuration);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <span 
      className={`relative inline-block ${className || ""} ${isGlitching ? 'glitch-effect' : ''}`}
      data-text={text}
    >
      {text}
    </span>
  );
}
