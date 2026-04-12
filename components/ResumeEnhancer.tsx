"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Loader2, Award, Zap, LayoutTemplate, SplitSquareHorizontal, FileSearch, Sparkles, Download
} from "lucide-react";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";

type Suggestion = {
  category: string;
  original: string;
  enhanced: string;
  good: string;
  improvements: string[];
};

type AIResponse = {
  atsScore: number;
  sections: Suggestion[];
};

export default function ResumeEnhancer() {
  const [textInput, setTextInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingLatex, setIsExportingLatex] = useState(false);

  const handleExportDocx = async () => {
    if (!results || !results.sections) return;
    setIsExportingDocx(true);
    
    try {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: results.sections.flatMap((section, index) => {
              // Split enhanced section by precise newlines
              const paragraphLines = section.enhanced.split('\n').filter(line => line.trim() !== '');
              
              return [
                new Paragraph({
                  text: section.category.toUpperCase(),
                  heading: HeadingLevel.HEADING_2,
                  spacing: { before: index === 0 ? 0 : 400, after: 200 },
                }),
                ...paragraphLines.map(line => {
                  const trimmedLine = line.trim();
                  // Render native docx bullets for bulleted strings
                  if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•') || trimmedLine.startsWith('*')) {
                    return new Paragraph({
                      text: trimmedLine.replace(/^[-•*]\s*/, ''),
                      bullet: { level: 0 },
                      spacing: { after: 100 }
                    });
                  }
                  
                  // Render standard paragraph lines
                  return new Paragraph({
                    text: trimmedLine,
                    spacing: { after: 150 }
                  });
                })
              ];
            })
          }
        ]
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, "Mentoria_ATS_Optimized_Resume.docx");
    } catch (err) {
      console.error("Export failed", err);
      setError("Failed to export ATS formatted resume. Please try again.");
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleExportPdf = async () => {
    if (!results || !results.sections) return;
    setIsExportingPdf(true);
    
    try {
      // Dynamically import heavy PDF library only when strictly invoked
      const { Document: PDFDocument, Page, Text: PDFText, View, StyleSheet, pdf } = await import('@react-pdf/renderer');
      
      const pdfStyles = StyleSheet.create({
        page: { flexDirection: 'column', backgroundColor: '#ffffff', padding: 40, fontFamily: 'Helvetica' },
        header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#000', borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 10 },
        category: { fontSize: 13, fontWeight: 'bold', marginTop: 15, marginBottom: 8, color: '#333', textTransform: 'uppercase' },
        text: { fontSize: 10, lineHeight: 1.5, color: '#444', marginBottom: 6 },
        bulletRow: { flexDirection: 'row', marginBottom: 4 },
        bulletPoint: { width: 12, fontSize: 10, color: '#444' },
        bulletText: { flex: 1, fontSize: 10, lineHeight: 1.5, color: '#444' }
      });

      const MyDocument = (
        <PDFDocument>
          <Page size="A4" style={pdfStyles.page}>
            <View>
              <PDFText style={pdfStyles.header}>ATS Optimized Professional Resume</PDFText>
            </View>
            
            {results.sections.map((section, idx) => {
              const paragraphLines = section.enhanced.split('\n').filter((l: string) => l.trim() !== '');
              
              return (
                <View key={idx}>
                  <PDFText wrap={false} style={pdfStyles.category}>{section.category}</PDFText>
                  
                  {paragraphLines.map((line: string, i: number) => {
                    const trimmedLine = line.trim();
                    if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•') || trimmedLine.startsWith('*')) {
                      return (
                        <View key={i} style={pdfStyles.bulletRow}>
                          <PDFText style={pdfStyles.bulletPoint}>•</PDFText>
                          <PDFText style={pdfStyles.bulletText}>{trimmedLine.replace(/^[-•*]\s*/, '')}</PDFText>
                        </View>
                      );
                    }
                    
                    return (
                      <PDFText key={i} style={pdfStyles.text}>
                        {trimmedLine}
                      </PDFText>
                    );
                  })}
                </View>
              );
            })}
          </Page>
        </PDFDocument>
      );

      const asPdf = pdf(MyDocument);
      const blob = await asPdf.toBlob();
      saveAs(blob, "Mentoria_ATS_Optimized_Resume.pdf");
    } catch (err) {
      console.error("PDF Export failed", err);
      setError("Failed to export PDF resume. Please try again.");
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleExportLatex = async () => {
    if (!results || !results.sections) return;
    setIsExportingLatex(true);
    
    try {
      const response = await fetch("/api/latex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections: results.sections }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate LaTeX");
      }

      const blob = await response.blob();
      saveAs(blob, "Mentoria_Optimized_Resume.tex");
    } catch (err: any) {
      console.error("LaTeX Export failed", err);
      setError(err.message || "Failed to export LaTeX resume. Please try again.");
    } finally {
      setIsExportingLatex(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setTextInput("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1
  });

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(e.target.value);
    if (e.target.value.trim() !== "") {
      setFile(null);
    }
  };

  const handleEnhance = async () => {
    if (!textInput.trim() && !file) {
      setError("Please paste your resume text or upload a PDF.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      } else {
        formData.append("text", textInput);
      }

      const response = await fetch("/api/enhance", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze resume.");
      }

      setResults(data.result);

      if (data.result && data.result.sections) {
        setExpandedCats(data.result.sections.map((_: any, i: number) => i));
      }
    } catch (err: any) {
      setError(err.message || "Failed to parse AI response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const [expandedCats, setExpandedCats] = useState<number[]>([]);
  // Store which tab is active for each section: "feedback" or "comparison"
  const [activeTabs, setActiveTabs] = useState<Record<number, "feedback" | "comparison">>({});

  const toggleCat = (index: number) => {
    if (expandedCats.includes(index)) {
      setExpandedCats(expandedCats.filter(i => i !== index));
    } else {
      setExpandedCats([...expandedCats, index]);
    }
  };

  const switchTab = (index: number, tab: "feedback" | "comparison") => {
    setActiveTabs(prev => ({ ...prev, [index]: tab }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    if (score >= 50) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    return "text-red-500 bg-red-500/10 border-red-500/20";
  };

  const getPercentageDashoffset = (score: number) => {
    // Circumference of circle with r=36 is ~226
    const circumference = 226;
    return circumference - (score / 100) * circumference;
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 relative z-10">
      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500" />

        <h2 className="text-2xl font-semibold mb-8 flex items-center gap-3 text-white">
          <div className="p-2 bg-fuchsia-500/20 rounded-xl">
            <FileText className="w-6 h-6 text-fuchsia-400" />
          </div>
          <span>Input Your Resume</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div
            {...getRootProps()}
            className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300 ease-out group ${isDragActive ? "border-fuchsia-500 bg-fuchsia-500/5 shadow-[0_0_30px_rgba(217,70,239,0.1)]" : "border-white/10 hover:border-white/30 hover:bg-white/5"
              } ${file ? "border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_30px_rgba(16,185,129,0.1)]" : ""}`}
            style={{ minHeight: "280px" }}
          >
            <input {...getInputProps()} />

            {file ? (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-4 text-center">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-2 ring-8 ring-emerald-500/5">
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-white text-lg truncate max-w-[220px]">{file.name}</p>
                  <p className="text-sm text-zinc-400 uppercase tracking-widest mt-2">{Math.round(file.size / 1024)} KB • PDF</p>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center gap-5 text-center">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
                  <Upload className={`w-10 h-10 ${isDragActive ? 'text-fuchsia-400' : 'text-zinc-400'}`} />
                </div>
                <div>
                  <p className="font-medium text-white text-lg mb-1">Drag & drop your PDF</p>
                  <p className="text-sm text-zinc-400">or click to browse local files</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col h-full relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/30 to-fuchsia-500/30 rounded-3xl blur-xl opacity-0 group-focus-within:opacity-100 transition duration-700 pointer-events-none"></div>
            <textarea
              className="w-full relative bg-black/40 border border-white/10 rounded-3xl p-8 text-white placeholder-zinc-500 focus:outline-none focus:border-fuchsia-500/50 focus:bg-black/60 shadow-inner resize-none transition-all duration-500 flex-grow text-base leading-relaxed"
              placeholder="Or paste your resume text manually here..."
              value={textInput}
              onChange={handleTextChange}
              style={{ minHeight: "280px" }}
            />
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/5 pt-8">
          <div className="text-sm text-zinc-400 flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
            <AlertCircle className="w-4 h-4 text-amber-500/80" />
            Your data stays safe and protected with Mentoria
          </div>
          <button
            onClick={handleEnhance}
            disabled={isLoading || (!file && !textInput.trim())}
            className="group relative px-8 py-4 bg-white text-black font-bold text-lg rounded-full overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 w-full sm:w-auto shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-200 to-fuchsia-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center gap-3 justify-center">
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Analyzing Magic...
                </>
              ) : (
                <>
                  <Zap className="w-6 h-6 text-violet-600 fill-violet-600" />
                  Enhance My Resume
                </>
              )}
            </span>
          </button>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: "auto", marginTop: 24 }} className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-200 flex items-center gap-3 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
            <p>{error}</p>
          </motion.div>
        )}
      </motion.div>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {results && results.sections && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, staggerChildren: 0.15 }}
            className="flex flex-col gap-6 w-full"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 mb-6">
              <div className="flex items-center gap-4 flex-grow w-full">
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-grow hidden sm:block" />
                <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60 tracking-tight text-center whitespace-nowrap">AI Report</h3>
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-grow hidden sm:block" />
              </div>
              <div className="flex gap-3 w-full sm:w-auto flex-wrap sm:flex-nowrap justify-center">
                <button 
                  onClick={handleExportPdf}
                  disabled={isExportingPdf || isExportingDocx || isExportingLatex}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600/20 font-bold rounded-full shadow-[0_0_20px_rgba(239,68,68,0.1)] hover:shadow-[0_0_30px_rgba(239,68,68,0.2)] transition-all duration-300 disabled:opacity-50 whitespace-nowrap active:scale-95"
                >
                  {isExportingPdf ? <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" /> : <Download className="w-4 h-4 flex-shrink-0" />}
                  Export PDF
                </button>
                <button 
                  onClick={handleExportDocx}
                  disabled={isExportingPdf || isExportingDocx || isExportingLatex}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600/10 border border-blue-500/20 text-blue-400 hover:bg-blue-600/20 font-bold rounded-full shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-300 disabled:opacity-50 whitespace-nowrap active:scale-95"
                >
                  {isExportingDocx ? <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" /> : <Download className="w-4 h-4 flex-shrink-0" />}
                  Export DOCX
                </button>
                <button 
                  onClick={handleExportLatex}
                  disabled={isExportingPdf || isExportingDocx || isExportingLatex}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-600/20 font-bold rounded-full shadow-[0_0_20px_rgba(16,185,129,0.1)] hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all duration-300 disabled:opacity-50 whitespace-nowrap active:scale-95"
                >
                  {isExportingLatex ? <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" /> : <Download className="w-4 h-4 flex-shrink-0" />}
                  Export LaTeX
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              {/* Summary Cards */}
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="col-span-1 md:col-span-2 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-xl flex items-center gap-8">
                <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="36" className="text-white/10 stroke-current" strokeWidth="8" fill="transparent" />
                    <circle
                      cx="40" cy="40" r="36"
                      className={`${results.atsScore >= 80 ? 'text-emerald-500' : results.atsScore >= 50 ? 'text-amber-500' : 'text-red-500'} stroke-current transition-all duration-1000 ease-out`}
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray="226"
                      strokeDashoffset={getPercentageDashoffset(results.atsScore || 0)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-black text-white">{results.atsScore}%</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">ATS Compatibility Score</h4>
                  <p className="text-zinc-400">This score represents how well your resume is formatted and phrased for Applicant Tracking Systems.</p>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-xl flex flex-col justify-center items-center">
                <p className="text-sm font-medium text-zinc-400 mb-2 uppercase tracking-wider text-center">Sections Analyzed</p>
                <div className="text-5xl font-black text-fuchsia-400">{results.sections.length}</div>
              </motion.div>
            </div>

            <div className="space-y-4">
              {results.sections.map((item, index) => {
                const currentTab = activeTabs[index] || "feedback";

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="bg-black/40 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl transition-all duration-300 hover:border-white/20 shadow-lg"
                  >
                    <div
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-6 md:p-8 cursor-pointer gap-4 group hover:bg-white/5 transition-colors"
                      onClick={() => toggleCat(index)}
                    >
                      <div className="flex items-center gap-5">
                        <div className="p-3 bg-white/10 rounded-2xl border border-white/5 group-hover:border-white/20 group-hover:bg-white/20 transition-all">
                          <FileSearch className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-xl font-semibold text-white group-hover:text-fuchsia-300 transition-colors">{item.category}</h4>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-white/10 group-hover:scale-110 transition-all duration-300 self-end sm:self-auto">
                        {expandedCats.includes(index) ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedCats.includes(index) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 md:px-8 pb-6 md:pb-8 pt-0 border-t border-white/5 bg-gradient-to-b from-transparent to-white/[0.02]">

                            {/* Tab Controls */}
                            <div className="flex items-center justify-center my-6">
                              <div className="p-1 bg-white/5 rounded-full border border-white/10 flex">
                                <button
                                  onClick={(e) => { e.stopPropagation(); switchTab(index, "feedback") }}
                                  className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${currentTab === 'feedback' ? 'bg-white text-black shadow-md' : 'text-zinc-400 hover:text-white'}`}
                                >
                                  <LayoutTemplate className="w-4 h-4" /> Feedback
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); switchTab(index, "comparison") }}
                                  className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${currentTab === 'comparison' ? 'bg-white text-black shadow-md' : 'text-zinc-400 hover:text-white'}`}
                                >
                                  <SplitSquareHorizontal className="w-4 h-4" /> Before / After
                                </button>
                              </div>
                            </div>

                            <AnimatePresence mode="wait">
                              {currentTab === "feedback" && (
                                <motion.div key="feedback" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.2 }}>
                                  <div className="mt-2 mb-6 relative bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6">
                                    <h5 className="flex items-center gap-3 text-emerald-400 font-bold text-lg mb-4">
                                      <div className="p-2 bg-emerald-500/20 rounded-lg"><Award className="w-5 h-5" /></div>
                                      What's Working Well
                                    </h5>
                                    <p className="text-zinc-200 leading-relaxed text-base">{item.good}</p>
                                  </div>

                                  <div className="relative bg-fuchsia-500/5 border border-fuchsia-500/10 rounded-2xl p-6">
                                    <h5 className="flex items-center gap-3 text-fuchsia-400 font-bold text-lg mb-5">
                                      <div className="p-2 bg-fuchsia-500/20 rounded-lg"><LayoutTemplate className="w-5 h-5" /></div>
                                      Areas for Improvement
                                    </h5>
                                    <ul className="space-y-4">
                                      {item.improvements.map((improvement, i) => (
                                        <li key={i} className="flex gap-4 text-zinc-200 leading-relaxed text-base">
                                          <span className="w-2 h-2 mt-2.5 rounded-full bg-fuchsia-500/70 flex-shrink-0 shadow-[0_0_10px_rgba(217,70,239,0.5)]"></span>
                                          <span>{improvement}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </motion.div>
                              )}

                              {currentTab === "comparison" && (
                                <motion.div key="comparison" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.2 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                  <div className="bg-black/30 border border-white/5 rounded-2xl p-6 overflow-x-auto">
                                    <h5 className="text-sm uppercase tracking-widest text-zinc-500 font-bold mb-4 flex items-center gap-2">Original</h5>
                                    <p className="text-zinc-400 font-mono text-sm whitespace-pre-wrap leading-relaxed">{item.original}</p>
                                  </div>
                                  <div className="bg-fuchsia-500/5 border border-fuchsia-500/20 rounded-2xl p-6 overflow-x-auto relative">
                                    <div className="absolute top-0 right-0 p-4">
                                      <Sparkles className="w-5 h-5 text-fuchsia-400 opacity-50" />
                                    </div>
                                    <h5 className="text-sm uppercase tracking-widest text-fuchsia-400 font-bold mb-4 flex items-center gap-2">Enhanced Revision</h5>
                                    <p className="text-zinc-100 font-mono text-sm whitespace-pre-wrap leading-relaxed">{item.enhanced}</p>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
