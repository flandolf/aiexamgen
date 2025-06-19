/** eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useRouter } from "next/navigation";
import { useExamStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Dropzone, { DropzoneState } from "shadcn-dropzone";

export default function Home() {
  const router = useRouter();
  const {
    topic,
    apiKey,
    questions,
    setTopic,
    setApiKey,
    setQuestions,
    setFiles,
  } = useExamStore();

  const handleGenerate = () => {
    if (!topic || !apiKey) return alert("Please fill all fields");
    router.push("/generate");
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-muted">
      <Card className="w-full max-w-xl shadow-xl p-6 py-8">
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="font-bold text-4xl sm:text-5xl tracking-tight">
              AI Exam Generator
            </h1>
            <p className="text-muted-foreground text-base">
              Instantly generate AI-powered practice exams.
            </p>
          </div>

          <div className="space-y-4">
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
              <Label htmlFor="questions">Number of Questions</Label>
              <Input
                type="number"
                id="questions"
                value={questions}
                onChange={(e) => setQuestions(parseInt(e.target.value))}
                placeholder="Number of Questions"
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

            <Dropzone
              dropZoneClassName="p-3 rounded"
              onDrop={(acceptedFiles: File[]) => {
                console.log(acceptedFiles);
                setFiles(acceptedFiles);
              }}
            >
              {(dropzone: DropzoneState) => (
                <div className="flex flex-col items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    Drag and drop your file here or click to select a file.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: PDF, DOCX, TXT. 25MB max.
                  </p>
                  {dropzone.acceptedFiles.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Files: {dropzone.acceptedFiles.length}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Dropzone>

            <Button className="w-full text-lg mt-2" onClick={handleGenerate}>
              <span className="text-white">🚀 Generate Exam</span>
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setApiKey("")}
            >
              Clear API Key
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
