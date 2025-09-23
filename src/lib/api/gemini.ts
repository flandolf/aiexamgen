import { GoogleGenAI } from "@google/genai";

/**
 * Generates an exam based on the provided parameters using Google's Gemini AI.
 * @param topic - The topic for the exam.
 * @param apiKey - The API key for Google GenAI.
 * @param mcq - Number of multiple choice questions.
 * @param shortAnswerQuestions - Number of short answer questions.
 * @param files - Array of files to include (only first file is processed).
 * @param model - The AI model to use.
 * @returns The generated exam as a string.
 */
export async function generateExam({
  topic,
  apiKey,
  mcq,
  shortAnswerQuestions,
  files,
  model,
}: {
  topic: string;
  apiKey: string;
  mcq: number;
  shortAnswerQuestions: number;
  files: File[];
  model: string;
}): Promise<string> {
  // Input validation
  if (!apiKey) {
    throw new Error("API key is required");
  }
  if (mcq < 0 || shortAnswerQuestions < 0) {
    throw new Error("Number of questions must be non-negative");
  }
  if (!topic.trim()) {
    throw new Error("Topic is required");
  }
  if (files.length > 1) {
    console.warn("Only the first file will be processed. Multiple files are not supported.");
  }

  const prompt = `
  You are an AI exam generator creating a professional, print-ready examination paper on the topic: "${topic}".

  EXAM STRUCTURE:
  - Generate exactly ${mcq} multiple choice questions (MCQs) if ${mcq} > 0.
  - Generate exactly ${shortAnswerQuestions} short answer questions if ${shortAnswerQuestions} > 0.
  - Total questions: ${mcq + shortAnswerQuestions}.

  FORMATTING REQUIREMENTS:
  ${mcq > 0 && shortAnswerQuestions > 0 ? `
  1. Start with "SECTION A: Multiple Choice Questions" (if MCQs exist)
  2. Follow with "SECTION B: Short Answer Questions" (if both types exist)
  ` : mcq > 0 ? `
  1. Start with "Multiple Choice Questions"
  ` : `
  1. Start with "Short Answer Questions"
  `}

  QUESTION FORMAT:
  - Each question: "Question X:" where X is the question number (1, 2, 3, etc.).
  - For MCQs: Provide exactly 4 options labeled A, B, C, D on separate lines.
  - For short answer: Ask clear, specific questions requiring written responses.
  - Follow each question with marks in format: [X marks] where X is appropriate for difficulty.

  PROFESSIONAL ELEMENTS:
  - Add {working(X)} after calculation questions where X = number of marks for working space.
  - Use {graph} if graph sketching or coordinate geometry is required.
  - Add {answer} for questions requiring boxed final answers.
  - Include "Instructions: Show all working clearly" before calculation sections.

  MATH FORMATTING:
  - Use LaTeX notation: $x^2 + 3x - 4 = 0$ for inline math.
  - Display equations: $$\\frac{dy}{dx} = 2x + 3$$ for complex expressions.
  - No currency symbols; write "twenty-five dollars" instead of "$25".

  MARK ALLOCATION:
  - MCQ questions: 1-2 marks each
  - Short answer: 3-8 marks depending on complexity
  - Calculation questions: Include method marks
  - Graph/diagram questions: 4-6 marks

  PROFESSIONAL STANDARDS:
  - Clear, unambiguous language
  - Appropriate difficulty for the topic level
  - Logical progression from easier to harder questions
  - Real-world applications where relevant
  - No answer keys or solutions provided

  OUTPUT FORMAT:
  - Use proper section headers
  - Leave blank lines between questions
  - Include mark allocations for every question
  - Add working space for appropriate questions
  - End with clear question numbering throughout
  `;

  const ai = new GoogleGenAI({
    apiKey: apiKey,
  });

  try {
    if (files.length > 0) {
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

      return response.text!;
    } else {
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
      });

      return response.text!;
    }
  } catch (error) {
    console.error("Error generating exam:", error);
    throw new Error("Failed to generate exam. Please check your API key and try again.");
  }
}

/**
 * Generates a title for the given topic using Google's Gemini AI.
 * @param topic - The topic for the title.
 * @param apiKey - The API key for Google GenAI.
 * @param model - The AI model to use (default: "gemma-3-1b-it").
 * @returns The generated title as a string.
 */
/**
 * Generates a title for the given topic using Google's Gemini AI.
 * @param topic - The topic for the title.
 * @param apiKey - The API key for Google GenAI.
 * @param model - The AI model to use (default: "gemma-3-1b-it").
 * @returns The generated title as a string.
 */
export async function generateTitle(topic: string, apiKey: string, model: string = "gemma-3-1b-it"): Promise<string> {
  if (!apiKey) {
    throw new Error("API key is required");
  }
  if (!topic.trim()) {
    throw new Error("Topic is required");
  }

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

  const ai = new GoogleGenAI({
    apiKey: apiKey,
  });

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text!;
  } catch (error) {
    console.error("Error generating title:", error);
    throw new Error("Failed to generate title. Please check your API key and try again.");
  }
}

/**
 * Converts a File object to a base64 string.
 * @param file - The file to convert.
 * @returns A promise that resolves to the base64 string.
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;
      if (base64String) {
        resolve(base64String.split(",")[1]); // remove data:mime/type;base64, part
      } else {
        reject(new Error("Failed to read file as base64"));
      }
    };

    reader.onerror = () => reject(new Error("Error reading file"));

    reader.readAsDataURL(file); // Encodes the file as a base64 data URL
  });
}
