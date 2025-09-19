"use client";

import { useExamStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { generateExam, generateTitle } from "@/lib/api/gemini";
import { Loader2, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import ExamHeader from "@/components/exam-header";

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
              <ExamHeader
                title={title || "Examination"}
                topic={topic}
                mcqCount={mcq}
                shortAnswerCount={shortAnswerQuestions}
                totalQuestions={mcq + shortAnswerQuestions}
              />
              
              <div className="exam-content text-base leading-relaxed">
                {renderProper(examOutput)}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
