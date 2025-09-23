"use client";

import { useExamStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { generateExam, generateTitle } from "@/lib/api/gemini";
import { Loader2, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import ExamHeader from "@/components/exam-header";
import ExamCover from "@/components/exam-cover";

import "katex/dist/katex.min.css";
import { renderProper } from "@/components/renderer";

export default function GeneratePage() {
  const { topic, apiKey, mcq, shortAnswerQuestions, files, model } = useExamStore();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [examOutput, setExamOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);

  useEffect(() => {
    if (!topic || !apiKey) {
      router.push("/");
      return;
    }

    generateTitle(topic, apiKey)
      .then((title) => {
        setTitle(title ? title : topic);
      })
      .catch((err) => {
        setError(err.message);
      });

    generateExam({ topic, apiKey, mcq, shortAnswerQuestions, files, model })
      .then((textOutput) => {
        if (textOutput === undefined) {
          setError("No exam generated");
          setLoading(false);
          return;
        }
        setExamOutput(textOutput);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [topic, apiKey, mcq, shortAnswerQuestions, files, router, model]);

  const calculateTotalMarks = (examText: string): number => {
    if (!examText) return mcq * 2 + shortAnswerQuestions * 5; // Default estimation
    
    const markMatches = examText.match(/\[(\d+)\s*marks?\]/g);
    if (markMatches) {
      return markMatches.reduce((total, match) => {
        const marks = parseInt(match.match(/\d+/)?.[0] || '0');
        return total + marks;
      }, 0);
    }
    return mcq * 2 + shortAnswerQuestions * 5; // Fallback estimation
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a new window with the exam content for download
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title || topic} - Exam</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            .no-print { display: none; }
          </style>
        </head>
        <body>
          ${document.getElementById('exam-content')?.innerHTML || ''}
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (!topic || !apiKey) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Action Bar - Hide on print */}
      <div className="no-print sticky top-0 bg-white border-b shadow-sm z-10 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {title ? `${title} - ${topic}` : topic}
          </h2>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handlePrint}
              disabled={loading || !!error}
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDownload}
              disabled={loading || !!error}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto bg-white min-h-screen shadow-lg">
        <div id="exam-content" className="p-8">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin h-8 w-8 text-primary mr-3" />
              <span className="text-lg text-gray-600">Generating your exam...</span>
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <div className="text-red-600 font-medium text-lg mb-2">Error</div>
              <div className="text-red-500">{error}</div>
            </div>
          )}

          {examOutput && !loading && !error && (
            <>
              {/* Cover Page - Only visible when printing */}
              <div className="hidden print:block">
                <ExamCover
                  title={title || "Examination"}
                  topic={topic}
                  mcqCount={mcq}
                  shortAnswerCount={shortAnswerQuestions}
                  totalQuestions={mcq + shortAnswerQuestions}
                  totalMarks={calculateTotalMarks(examOutput)}
                  duration="2 hours"
                  institution="Educational Institution"
                />
              </div>

              {/* Main Exam Content */}
              <div className="print:page-break-before">
                {/* Exam Header for screen and print */}
                <div className="print:hidden">
                  <ExamHeader
                    title={title || "Examination"}
                    topic={topic}
                    mcqCount={mcq}
                    shortAnswerCount={shortAnswerQuestions}
                    totalQuestions={mcq + shortAnswerQuestions}
                  />
                </div>

                {/* Print-only header (simplified) */}
                <div className="hidden print:block mb-6">
                  <div className="text-center border-b-2 border-black pb-4 mb-6">
                    <h1 className="text-xl font-bold mb-2">{title || "Examination"}</h1>
                    <p className="text-base font-medium">Subject: {topic}</p>
                    <div className="flex justify-between mt-4 text-sm">
                      <span>Total Questions: {mcq + shortAnswerQuestions}</span>
                      <span>Total Marks: {calculateTotalMarks(examOutput)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Exam Questions */}
                <div className="exam-content text-base leading-relaxed print:text-sm">
                  {renderProper(examOutput)}
                </div>

                {/* End of Exam Footer */}
                <div className="mt-12 pt-6 border-t-2 border-gray-800 text-center print:mt-8 print:pt-4">
                  <p className="text-lg font-bold print:text-base">END OF EXAMINATION</p>
                  <p className="text-sm text-gray-600 mt-2 print:text-xs">
                    Please check that you have answered all questions before submitting your paper.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
