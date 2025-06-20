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
    You are generating a high quality exam. Instructions:
    Generate ${questions} exam questions on the topic: "${topic}".
    - Use LaTeX formatting for equations ($...$) and all numbers and variable definitions otherwise plain text.
    - Include mark allocations (e.g., [3 marks]).
    - Newline after each question.
    - No images / graphs with data, you are not capable of generating graphs or images.
    - Blank graph can be inserted in order to get user to sketch a function, just type "{graph}".
    - Only respond with questions, no intro.
    - Insert {working(num)} after each question to insert *num* working out appropriate for each mark allocation. So, for example for 3 lines do {working(3)} not {working(1)} {working(2)} {working(3)}.
    - Do NOT give working out / answers.
    - Include question numbers in the format "Question X: ".
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
