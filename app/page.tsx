"use client";

import { motion } from "framer-motion";
import ResumeEnhancer from "@/components/ResumeEnhancer";
import Chatbot from "@/components/Chatbot";
import { Sparkles, ArrowRight } from "lucide-react";
import GlitchText from "@/components/GlitchText";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-foreground overflow-hidden selection:bg-cyan-500/30">
      {/* Background gradients and noise */}
      <div className="fixed inset-0 z-0 flex items-center justify-center opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/30 blur-[120px]" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-teal-600/20 blur-[100px]" />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-12 md:py-24 flex flex-col items-center">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto mb-16 md:mb-24"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-sm mb-8"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-100"><GlitchText text="Shaswat's Tech" /></span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-tight">
            <GlitchText text="Elevate Your Career with" />{" "}
            <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)] inline-block">
              <GlitchText text="Intelligent Resume" />
            </span>{" "}
            <GlitchText text="Analysis" />
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            <GlitchText text="Upload your resume or paste its text below. Our product will analyze your experience, skills, and formatting to provide actionable, ATS-friendly suggestions." />
          </p>
        </motion.div>

        {/* Main Tool Component */}
        <ResumeEnhancer />

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-24 py-8">
        <div className="container mx-auto px-4 text-center text-zinc-500 flex flex-col items-center justify-center gap-2">
          <p>Powered by Mentoria and Shaswat</p>
          <a href="https://github.com/ethyashpathak/mentoria-assis" className="flex items-center gap-1 hover:text-cyan-400 transition-colors group">
            <span>Learn more about the project</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </footer>
      <Chatbot />
    </div>
  );
}
