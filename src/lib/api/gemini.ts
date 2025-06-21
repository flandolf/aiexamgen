import { GoogleGenAI } from "@google/genai";

export async function generateExam({
  topic,
  apiKey,
  questions,
  files,
}: {
  topic: string;
  apiKey: string;
  questions: number;
  files: File[];
}) {
  const prompt = `
  You are generating a structured, high-quality exam. Follow these instructions **exactly**:

  - Generate exactly ${questions} distinct exam questions on the topic: "${topic}".
  - Each question must begin with the format: **"Question X:"** where X is the question number.
  - All mathematical notation must be written using **LaTeX formatting**, using inline math mode with dollar signs ($...$).
    - Use LaTeX for all equations, variables, and numeric expressions.
    - Use plain text only for instructions, descriptions, or context—not for maths.
  - After each question:
    - Insert the appropriate mark allocation in the format: [X marks], where X is a positive integer reflecting complexity.
    - Then insert: **{working(X)}** where X matches the number of marks, to indicate how many lines of working should be printed.
      - Example: If a question is worth 4 marks, append **{working(4)}**.
  - Insert a newline after each question and its working tag.
  - Do NOT include any images, diagrams, or graphs.
    - To request a user to sketch, include the placeholder **{graph}** where relevant (e.g., sketching a function).
  - Do NOT include any explanations, answers, or solutions.
  - Do NOT include any headings, titles, summaries, or preambles.
  - You MUST only output the questions, formatted exactly as described.

  Strictly follow this format without deviations. This is for auto-generation in an exam interface.
  `;

  const model = "gemma-3n-e4b-it";
  const ai = new GoogleGenAI({
    apiKey: apiKey,
  });
  if (files.length != 0) {
    const contents = [
      { text: prompt },
      {
        inlineData: {
          mimeType: "application/pdf",
          data: await fileToBase64(files[0]),
        },
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemma-3-27b-it",
      contents: contents,
    });

    return response.text;
  } else {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text;
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;
      resolve(base64String.split(",")[1]); // remove data:mime/type;base64, part
    };

    reader.onerror = (error) => reject(error);

    reader.readAsDataURL(file); // Encodes the file as a base64 data URL
  });
}
