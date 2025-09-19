import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ExamStore {
  topic: string;
  apiKey: string;
  mcq: number;
  shortAnswerQuestions: number;
  files: File[];
  model: string;
  setTopic: (topic: string) => void;
  setApiKey: (apiKey: string) => void;
  setMcq: (mcq: number) => void;
  setShortAnswerQuestions: (shortAnswerQuestions: number) => void;
  setFiles: (files: File[]) => void;
  setModel: (model: string) => void;
}

export const useExamStore = create<ExamStore>()(
  persist(
    (set) => ({
      topic: "",
      apiKey: "",
      mcq: 10,
      shortAnswerQuestions: 10,
      files: [],
      model: "",
      setTopic: (topic) => set({ topic }),
      setApiKey: (apiKey) => set({ apiKey }),
      setMcq: (mcq) => set({ mcq }),
      setShortAnswerQuestions: (shortAnswerQuestions) => set({ shortAnswerQuestions }),
      setFiles: (files) => set({ files }),
      setModel: (model) => set({ model }),
    }),
    {
      name: "exam-store", // The key in localStorage
      partialize: (state) => ({
        apiKey: state.apiKey,
        model: state.model,
        // Only persist these keys
      }),
    },
  ),
);
