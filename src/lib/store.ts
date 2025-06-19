import { create } from "zustand";

interface ExamConfig {
  topic: string;
  apiKey: string;
  questions: number;
  setTopic: (topic: string) => void;
  setApiKey: (apiKey: string) => void;
  setQuestions: (questions: number) => void;
}

export const useExamStore = create<ExamConfig>((set) => ({
  topic: "",
  apiKey: "",
  questions: 0,
  setTopic: (topic) => set({ topic }),
  setApiKey: (apiKey) => set({ apiKey }),
  setQuestions: (questions) => set({ questions }),
}));
