import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ExamStore {
  topic: string;
  apiKey: string;
  questions: number;
  files: File[];
  model: string;
  setTopic: (topic: string) => void;
  setApiKey: (apiKey: string) => void;
  setQuestions: (questions: number) => void;
  setFiles: (files: File[]) => void;
  setModel: (model: string) => void;
}

export const useExamStore = create<ExamStore>()(
  persist(
    (set) => ({
      topic: "",
      apiKey: "",
      questions: 15,
      files: [],
      model: "",
      setTopic: (topic) => set({ topic }),
      setApiKey: (apiKey) => set({ apiKey }),
      setQuestions: (questions) => set({ questions }),
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
