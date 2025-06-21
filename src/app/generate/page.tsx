"use client";

import { useExamStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { generateExam } from "@/lib/api/gemini";
import { Loader2 } from "lucide-react";

import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import Graph from "@/components/graph";
import Working from "@/components/working";

export default function GeneratePage() {
  const { topic, apiKey, questions, files } = useExamStore();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [examOutput, setExamOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!topic || !apiKey) {
      router.push("/");
      return;
    }

    generateExam({ topic, apiKey, questions, files })
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
  }, [topic, apiKey, questions, files, router]);

  if (!topic || !apiKey) return null;

  function renderProper(input: string) {
    const parts = input
      .replace(/\n{3,}/g, "\n")
      .split(/(\$[^$]+\$|\{graph\}|\{working\(\d+\)\})/g);
    return parts
      .filter((part) => part !== "")
      .map((part, index) => {
        if (part.startsWith("$") && part.endsWith("$")) {
          const math = part.slice(1, -1);
          return <InlineMath key={index}>{math}</InlineMath>;
        } else if (part === "{graph}") {
          return (
            <div key={index} className="m-2">
              <Graph />
            </div>
          );
        } else if (part.startsWith("{working(") && part.endsWith(")}")) {
          const linesCount = parseInt(
            part.match(/\{working\((\d+)\)\}/)?.[1] || "8",
          );
          return (
            <div key={index} className="m-2">
              <Working linesCount={linesCount} />
            </div>
          );
        } else {
          return <span key={index}>{part}</span>;
        }
      });
  }

  return (
    <main className="flex flex-col min-h-screen bg-white space-y-4 py-8 px-4">
      <h1 className="text-2xl font-bold text-center text-black">
        Generated Exam: <span className="text-primary">{topic}</span>
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
