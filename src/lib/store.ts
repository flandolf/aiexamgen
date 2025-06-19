import { create } from "zustand";

interface ExamStore {
  topic: string;
  apiKey: string;
  questions: number;
  setTopic: (topic: string) => void;
  setApiKey: (apiKey: string) => void;
  setQuestions: (questions: number) => void;
}

// Load from localStorage (with null checks for SSR)
const getInitialApiKey = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("apiKey") || "";
  }
  return "";
};

export const useExamStore = create<ExamStore>((set) => ({
  topic: "",
  apiKey: getInitialApiKey(),
  questions: 15,
  setTopic: (topic) => set({ topic }),
  setApiKey: (apiKey) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("apiKey", apiKey);
    }
    set({ apiKey });
  },
  setQuestions: (questions) => set({ questions }),
}));
