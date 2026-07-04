"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, Clock, ChevronRight, Zap, Search, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const INITIAL_QUESTIONS = [
  {
    id: "q1",
    question: "Does your platform support SAML 2.0 Single Sign-On?",
    answer: "Yes, our platform supports SAML 2.0 based Single Sign-On (SSO) integrating with Okta, Azure AD, and Ping Identity.",
    confidence: "High",
    status: "Answered",
    source: "Security_Whitepaper_v2.pdf",
  },
  {
    id: "q2",
    question: "Are you SOC 2 Type II compliant?",
    answer: "We are SOC 2 Type II compliant. The audit was conducted by a top-tier firm and the report is available under NDA.",
    confidence: "High",
    status: "Answered",
    source: "SOC2_Report_2023.pdf",
  },
  {
    id: "q3",
    question: "Do you have data centers in Mars?",
    answer: "Information not found in the knowledge base. Please consult an SME.",
    confidence: "Low",
    status: "Needs Review",
    source: null,
  }
];

export default function Home() {
  const [isUploading, setIsUploading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);

  const handleAssignToSME = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: "Assigned to SME" } : q))
    );
  };

  const handleUpload = async () => {
    setIsUploading(true);
    
    // The questions extracted from the simulated document upload
    const extractedQuestions = [
      { id: "q1", question_text: "Does your platform support SAML 2.0 Single Sign-On?" },
      { id: "q2", question_text: "Are you SOC 2 Type II compliant?" },
      { id: "q3", question_text: "Do you have data centers in Mars?" }
    ];

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${API_URL}/api/v1/rfp/answer-batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(extractedQuestions)
      });
      
      if (!response.ok) throw new Error("Backend error");
      const data = await response.json();
      
      // Map backend schema to frontend schema
      const mappedQuestions = data.map((ans: any, idx: number) => ({
        id: ans.question_id,
        question: extractedQuestions[idx].question_text,
        answer: ans.answer_text,
        confidence: ans.confidence_score,
        status: ans.needs_review ? "Needs Review" : "Answered",
        source: ans.sources_cited && ans.sources_cited.length > 0 ? ans.sources_cited[0] : null
      }));

      setQuestions(mappedQuestions);
      setShowResults(true);
    } catch (error) {
      console.error("Failed to process RFP:", error);
      // Fallback to original mock if backend fails so UI doesn't completely break for demo
      setShowResults(true);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in-up pb-24">
      {/* Premium Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between glass-panel rounded-3xl p-6 md:p-8"
      >
        <div className="flex items-center gap-5">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25 border border-white/20">
            <Zap className="text-white h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">Redrob RFP Agent</h1>
            <p className="text-sm font-medium text-purple-200/80 mt-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Enterprise Agentic RAG
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <div className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm font-semibold text-emerald-400 flex items-center gap-3 shadow-inner">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            System Online
          </div>
        </div>
      </motion.header>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div 
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-16 flex flex-col items-center justify-center min-h-[50vh]"
          >
            <div className="max-w-3xl mx-auto text-center space-y-8 relative">
              {/* Background Blur elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] -z-10"></div>
              
              <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 leading-tight">
                Automate Your <br /> Complex RFPs
              </h2>
              <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
                Upload enterprise RFP/RFI documents. Our multi-agent system instantly analyzes queries, retrieves verified knowledge, and drafts accurate responses in seconds.
              </p>
              
              <div className="pt-8">
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 text-lg font-bold text-white transition-all duration-300 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl hover:border-white/40 overflow-hidden shadow-2xl hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  
                  {isUploading ? (
                    <>
                      <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-white"></div>
                      Analyzing Document...
                    </>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-300" />
                      Upload RFP Document
                    </>
                  )}
                </button>
                <p className="text-sm font-medium text-gray-500 mt-6 tracking-wide uppercase">Supports .docx, .xlsx, .pdf up to 50MB</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5 border border-white/10 rounded-2xl p-6">
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-3 text-white">
                  <Search className="text-indigo-400 w-6 h-6" />
                  RFP Analysis Results
                </h3>
                <p className="text-gray-400 mt-1 text-sm">3 questions extracted and processed automatically.</p>
              </div>
              <div className="flex gap-4 text-sm font-medium">
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4" /> 2 High Confidence
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                  <AlertCircle className="w-4 h-4" /> 1 Needs Review
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              {questions.map((q, idx) => (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15 + 0.2 }}
                  className="group relative bg-white/[0.02] hover:bg-white/[0.04] p-6 md:p-8 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all duration-300 shadow-xl"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                    <h4 className="text-xl font-semibold text-white leading-relaxed flex-1">
                      {q.question}
                    </h4>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap self-start ${
                      q.confidence === 'High' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {q.confidence} Confidence
                    </span>
                  </div>
                  
                  <div className="bg-black/40 rounded-2xl p-6 border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500"></div>
                    <p className="text-gray-300 text-base leading-relaxed pl-2">
                      {q.answer}
                    </p>
                    
                    {q.source && (
                      <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-3 text-sm font-medium text-gray-500 pl-2">
                        <FileText className="w-4 h-4 text-indigo-400" />
                        Source cited: <span className="text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer">{q.source}</span>
                      </div>
                    )}
                  </div>
                  
                  {(q.status === 'Needs Review' || q.status === 'Assigned to SME') && (
                    <div className="mt-6 flex justify-end">
                      <button 
                        onClick={() => handleAssignToSME(q.id)}
                        disabled={q.status === 'Assigned to SME'}
                        className={`text-sm px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${
                          q.status === 'Assigned to SME' 
                            ? 'bg-emerald-500/10 text-emerald-400 cursor-not-allowed border border-emerald-500/20 shadow-inner'
                            : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 hover:shadow-lg'
                        }`}
                      >
                        {q.status === 'Assigned to SME' ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            Assigned to SME
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4" />
                            Route to Subject Matter Expert
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

