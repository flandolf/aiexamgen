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

  IMPORTANT OUTPUT CONTRACT (strict):
  - Output plain text only. Do NOT use Markdown headings (#, ##), bold (**), or italics (*). No titles, prefaces, or extra commentary.
  - Use the exact section header lines specified below. No extra punctuation or styling.
  - Follow the exact line structure for questions, options, marks, and tokens as described.
  - Do NOT include any debug lines, metadata, or trailing markers (e.g., "debug:", "examOutput ^").

  EXAM STRUCTURE:
  - Generate exactly ${mcq} multiple choice questions (MCQs) if ${mcq} > 0.
  - Generate exactly ${shortAnswerQuestions} short answer questions if ${shortAnswerQuestions} > 0.
  - Total questions: ${mcq + shortAnswerQuestions}.

  SECTION HEADERS:
  ${mcq > 0 && shortAnswerQuestions > 0 ? `
  1) First print this line exactly: SECTION A: Multiple Choice Questions
  2) After all MCQs, print this line exactly: SECTION B: Short Answer Questions
  ` : mcq > 0 ? `
  1) Print this line exactly: Multiple Choice Questions
  ` : `
  1) Print this line exactly: Short Answer Questions
  `}

  QUESTION FORMAT (all questions):
  - First line: "Question X: question" where X is 1, 2, 3, ... And question is a clear, specific question.
  - For MCQs:
    • Next 4 lines are the choices on separate lines labeled exactly: "A. ", "B. ", "C. ", "D. ".
    • Then add one line with marks in the format: "[N marks]" (use singular "mark" if N=1). No {working} or {answer} in MCQs.
  - For short answer:
    • Ask a clear, specific question. If graphing is required, include a line with "{graph}".
    • For calculation questions, include a line with "{working(K)}" (K = a reasonable number of working lines for the marks).
    • If a boxed final answer is appropriate, include a line with "{answer}".
    • Then add one line with marks in the format: "[N marks]" (use singular "mark" if N=1).
  - Insert exactly one blank line between questions (i.e., leave one empty line after the marks/tokens).

  PROFESSIONAL ELEMENTS:
  - Include the line "Instructions: Show all working clearly" exactly once at the beginning of the short answer section (if it exists). Do not place instructions at the very start of the document.
  - Use {graph} only when needed (graph sketching or coordinate geometry).
  - Use {working(K)} only for calculation-style short answers; never include it for MCQs.
  - Use {answer} for short answers requiring a final boxed value.

  MATH FORMATTING:
  - Inline math: $x^2 + 3x - 4 = 0$
  - Display equations on their own line using: $$\\frac{dy}{dx} = 2x + 3$$
  - Do not use code blocks. No currency symbols; write "twenty-five dollars" instead of "$25".

  MARK ALLOCATION GUIDANCE:
  - MCQ: 1–2 marks each
  - Short answer: 3–8 marks depending on complexity (include method marks)
  - Graph/diagram questions: 4–6 marks

  STYLE AND QUALITY:
  - Clear, unambiguous language; logical progression from easier to harder; relevant real-world contexts where appropriate.
  - No answer keys, no solutions.
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
