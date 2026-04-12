"use client";

import { motion } from "framer-motion";
import ResumeEnhancer from "@/components/ResumeEnhancer";
import Chatbot from "@/components/Chatbot";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-foreground overflow-hidden selection:bg-fuchsia-500/30">
      {/* Background gradients and noise */}
      <div className="fixed inset-0 z-0 flex items-center justify-center opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-fuchsia-600/30 blur-[120px]" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-pink-600/20 blur-[100px]" />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-12 md:py-24 flex flex-col items-center">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto mb-16 md:mb-24"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8"
          >
            <Sparkles className="w-4 h-4 text-fuchsia-400" />
            <span className="text-sm font-medium text-zinc-300">Shaswat's Tech</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-tight">
            Elevate Your Career with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 inline-block">
              Intelligent Resume
            </span>{" "}
            Analysis
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Upload your resume or paste its text below. Our product will analyze your experience, skills, and formatting to provide actionable, ATS-friendly suggestions.
          </p>
        </motion.div>

        {/* Main Tool Component */}
        <ResumeEnhancer />

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-24 py-8">
        <div className="container mx-auto px-4 text-center text-zinc-500 flex flex-col items-center justify-center gap-2">
          <p>Powered by Mentoria and Shaswat</p>
          <a href="https://github.com/ethyashpathak/mentoria-assis" className="flex items-center gap-1 hover:text-fuchsia-400 transition-colors group">
            <span>Learn more about the project</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </footer>
      <Chatbot />
    </div>
  );
}
