"use client";

import { useRouter } from "next/navigation";
import { useExamStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Dropzone from "@/components/dropzone";
import ModelSelect from "@/components/model-select";

export default function Home() {
  const router = useRouter();
  const {
    topic,
    apiKey,
    mcq,
    shortAnswerQuestions,
    setTopic,
    setApiKey,
    setMcq,
    setShortAnswerQuestions,
    setFiles,
    model,
    setModel,
  } = useExamStore();

  const handleGenerate = () => {
    if (!topic || !apiKey) return alert("Please fill all fields");
    router.push("/generate");
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-muted/80 to-primary/40">
      <Card className="w-full max-w-xl shadow-xl border-none bg-background/90 backdrop-blur-sm">
        <CardContent className="p-8 space-y-4">
          {/* Header */}
          <div className="text-center space-y-1">
            <h1 className="font-bold text-4xl md:text-5xl tracking-tight">
              AI Exam Generator
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Instantly generate AI-powered practice exams.
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Trigonometry"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortAnswerQuestions">Number of Short Answer</Label>
              <Input
                type="number"
                id="shortAnswerQuestions"
                value={shortAnswerQuestions}
                onChange={(e) => setShortAnswerQuestions(parseInt(e.target.value))}
                placeholder="e.g. 5"
                min={0}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mcq">Number of MCQs</Label>
              <Input
                type="number"
                id="mcq"
                value={mcq}
                onChange={(e) => setMcq(parseInt(e.target.value))}
                placeholder="e.g. 10"
                min={1}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiKey">Google Gemini API Key</Label>
              <Input
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste your Gemini API Key"
                type="password"
              />
            </div>

            <ModelSelect model={model} setModel={setModel} />
            <Dropzone
              onDrop={(file: File[]) => {
                setFiles(file);
              }}
            />

            {/* Buttons */}
            <div className="space-y-3">
              <Button className="w-full text-lg" onClick={handleGenerate}>
                <span className="text-white">Generate Exam</span>
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setApiKey("")}
              >
                Clear API Key
              </Button>
            </div>
          </div>

          {/* Footer */}
          <p className="text-xs text-center text-muted-foreground pt-6">
            &copy; {new Date().getFullYear()} AI Exam Generator |{" "}
            {process.env.NEXT_PUBLIC_COMMIT_SHA || "development"}
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
