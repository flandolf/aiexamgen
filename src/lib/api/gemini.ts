import { GoogleGenAI } from "@google/genai";

export async function generateExam({
  topic,
  apiKey,
  questions,
}: {
  topic: string;
  apiKey: string;
  questions: number;
}) {
  const prompt = `
    You are generating an exam. Instructions:
    Generate ${questions} exam questions on the topic: "${topic}"
    - Use LaTeX formatting for equations ($...$) and all numbers and variable definitions otherwise plain text
    - Include mark allocations (e.g., [3 marks])
    - Newline after each question
    - No images
    - Blank graph can be inserted in order to get user to sketch a function, just type "{graph}"
    - Only respond with questions, no intro
    - Insert {working(num)} after each question to insert *num* working out appropriate for each mark allocation.
    - Do NOT give working out / answers.
    - Include question numbers in the format "Question X: "
  `;

  const ai = new GoogleGenAI({
    apiKey: apiKey,
  });

  const response = await ai.models.generateContent({
    model: "gemma-3n-e4b-it",
    contents: prompt,
    // config: {
    //   responseMimeType: "application/json",
    //   responseSchema: {
    //     type: "object",
    //     properties: {
    //       questions: {
    //         type: "array",
    //         items: {
    //           type: "object",
    //           properties: {
    //             question: { type: "string" },
    //             solution: { type: "string" },
    //             markAllocation: { type: "number" },
    //           },
    //           required: ["question", "solution", "markAllocation"],
    //         },
    //       },
    //     },
    //     required: ["questions"],
    //   },
    // },
  });

  return response.text;
}
