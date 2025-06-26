import { GoogleGenAI } from "@google/genai";

export async function generateExam({
  topic,
  apiKey,
  questions,
  files,
  model,
}: {
  topic: string;
  apiKey: string;
  questions: number;
  files: File[];
  model: string;
}) {
  const prompt = `
  You are generating a structured, high-quality exam. Follow these instructions **exactly**:

  - Generate exactly ${questions} distinct exam questions on the topic: "${topic}".
  - Each question must begin with the format: "Question X:" where X is the question number.
  - All mathematical notation must be written using **LaTeX formatting**, with inline math mode using the delimiter: $ ($...$).
    - Use LaTeX only for equations, variables, and numeric expressions that are part of the mathematics.
    - For any monetary values or currency (e.g., $25), **do NOT use the "$" symbol or LaTeX**.
      - Instead, write out the amount in words, e.g., **"25 dollars"**.
  - After each question:
    - Insert the appropriate mark allocation in the format: [X marks], where X is a positive integer reflecting complexity.
    - Then insert: **{working(X)}** where X matches the number of marks, to indicate how many lines of working should be printed.
      - Example: If a question is worth 4 marks, append **{working(4)}**.
  - Insert a newline after each question and its working tag.
  - Do NOT include any images, diagrams, or graphs.
    - To request a user to sketch, include the placeholder **{graph}** where relevant (e.g., sketching a function).
  - Do NOT include any explanations, answers, or solutions.
  - Do NOT include any headings, titles, summaries, or preambles.

  Strictly follow this format without deviations. This is for auto-generation in an exam interface.
  `;

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
      model: model,
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

export async function generateTitle(topic: string, apiKey: string) {
  const prompt = `
  You are a professional educator generating clean, descriptive titles for educational resources.

  Instructions:
  - Create **one** clear, concise, and academically appropriate title.
  - The title should reflect the topic: "${topic}".
  - Use proper title casing (Capitalize Main Words).
  - Do NOT include a colon, dash, or subtitle—just a single-line title.
  - Do NOT include quotation marks, explanations, or any additional text.
  - Your output should only be the title. No prefixes like "Title:" or any extra content.

  Topic: "${topic}"
  `;

  const model = "gemma-3-1b-it";
  const ai = new GoogleGenAI({
    apiKey: apiKey,
  });

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
  });

  return response.text;
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
