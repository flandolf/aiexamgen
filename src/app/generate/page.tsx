"use client";

import { useExamStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { generateExam, generateTitle } from "@/lib/api/gemini";
import { Loader2 } from "lucide-react";

import "katex/dist/katex.min.css";
import { renderProper } from "@/components/renderer";

export default function GeneratePage() {
  const { topic, apiKey, questions, files, model } = useExamStore();
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

    generateExam({ topic, apiKey, questions, files, model })
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
  }, [topic, apiKey, questions, files, router, model]);

  if (!topic || !apiKey) return null;

  return (
    <main className="flex flex-col min-h-screen bg-white space-y-4 py-8 px-4">
      <h1 className="text-2xl font-bold text-center text-black">
        Generated Exam: <span className="text-primary">{title}</span>
      </h1>

      {loading && (
        <div className="flex items-center justify-center mt-6">
          <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
          <span className="ml-3 text-muted-foreground">Generating...</span>
        </div>
      )}

      {error && (
        <div className="text-red-500 font-medium text-center">{error}</div>
      )}

      {examOutput && (
        <div className="whitespace-pre-wrap text-lg bg-white p-4 rounded text-black font-sans">
          {renderProper(examOutput)}
        </div>
      )}
    </main>
  );
}
