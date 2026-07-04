"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, Clock, ChevronRight, Zap } from "lucide-react";
import { motion } from "framer-motion";

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
      const response = await fetch("http://localhost:8000/api/v1/rfp/answer-batch", {
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
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <header className="flex items-center justify-between glass-panel rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Zap className="text-white h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">RFP Response Agent</h1>
            <p className="text-sm text-gray-400">Powered by Agentic RAG</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-full glass text-sm font-medium text-blue-400 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            System Online
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      {!showResults ? (
        <div className="mt-12">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Automate Your RFPs
            </h2>
            <p className="text-lg text-gray-400">
              Upload a complex RFP document. Our AI agent will parse the questions, search your enterprise knowledge base, and draft highly accurate responses in seconds.
            </p>
            
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="mt-8 group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-xl hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                  Processing RFP...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                  Upload RFP Document
                </>
              )}
            </button>
            <p className="text-xs text-gray-500 mt-4">Supports .docx, .xlsx, .csv up to 50MB</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="text-blue-400" />
              Generated Responses
            </h3>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1 text-green-400"><CheckCircle2 className="w-4 h-4" /> 2 Answered</div>
              <div className="flex items-center gap-1 text-orange-400"><AlertCircle className="w-4 h-4" /> 1 Needs Review</div>
            </div>
          </div>

          <div className="grid gap-4">
            {questions.map((q, idx) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-panel p-6 rounded-xl hover:border-blue-500/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h4 className="text-lg font-medium text-gray-200 leading-snug">
                    {q.question}
                  </h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                    q.confidence === 'High' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                    'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                  }`}>
                    {q.confidence} Confidence
                  </span>
                </div>
                
                <div className="bg-black/30 rounded-lg p-4 border border-white/5">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {q.answer}
                  </p>
                  
                  {q.source && (
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-gray-500">
                      <FileText className="w-3 h-3" />
                      Source: <span className="text-blue-400 hover:underline cursor-pointer">{q.source}</span>
                    </div>
                  )}
                </div>
                
                {(q.status === 'Needs Review' || q.status === 'Assigned to SME') && (
                  <div className="mt-4 flex justify-end">
                    <button 
                      onClick={() => handleAssignToSME(q.id)}
                      disabled={q.status === 'Assigned to SME'}
                      className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                        q.status === 'Assigned to SME' 
                          ? 'bg-green-600/20 text-green-400 cursor-not-allowed border border-green-500/20'
                          : 'bg-blue-600 hover:bg-blue-500 text-white'
                      }`}
                    >
                      {q.status === 'Assigned to SME' ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Assigned to SME
                        </>
                      ) : (
                        'Assign to SME'
                      )}
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
