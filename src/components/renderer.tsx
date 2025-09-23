import React from "react";
import { InlineMath, BlockMath } from "react-katex";
import Graph from "@/components/graph";
import Working from "@/components/working";

interface RenderRule {
  name: string;
  regex: RegExp;
  component: React.ElementType;
  getProps: (match: RegExpMatchArray) => object;
}

const renderRules: RenderRule[] = [
  // Display math delimited by $$...$$ (single-line)
  {
    name: "display_math_dollars",
    regex: /^\$\$([\s\S]+?)\$\$$/,
    component: BlockMath,
    getProps: (match) => ({ children: match[1].trim() }),
  },
  // Display math delimited by \[...\] (single-line)
  {
    name: "display_math_brackets",
    regex: /^\\\[([\s\S]+?)\\\]$/,
    component: BlockMath,
    getProps: (match) => ({ children: match[1].trim() }),
  },
  // If a whole line is $...$, treat as display math
  {
    name: "inline_line_math_as_block",
    regex: /^\$([^$]+)\$$/,
    component: BlockMath,
    getProps: (match) => ({ children: match[1].trim() }),
  },
  {
    name: "graph",
    regex: /^\{graph\}$/,
    component: () => (
      <div className="my-6 flex justify-center print:my-4">
        <Graph />
      </div>
    ),
    getProps: () => ({}),
  },
  {
    name: "working",
    regex: /^\{working\((\d+)\)\}$/,
    component: ({ linesCount }) => (
      <div className="my-4 print:my-3">
        <Working linesCount={linesCount} />
      </div>
    ),
    getProps: (match) => ({ linesCount: parseInt(match[1] || "8", 10) }),
  },
  {
    name: "section_header",
    regex: /^(SECTION [A-Z]|Part [IVX]+|Multiple Choice Questions?|Short Answer Questions?):\s*(.*)$/i,
    component: ({ title, subtitle }) => (
      <div className="mt-12 mb-8 first:mt-8 print:mt-8 print:mb-6 print:page-break-before-auto">
        <div className="text-center border-2 border-gray-800 py-4 px-6 bg-gray-50 print:bg-white print:border-black">
          <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide print:text-lg">
            {title}
          </h2>
          {subtitle && (
            <p className="text-base font-medium text-gray-700 mt-2 print:text-sm">{processInlineElements(subtitle)}</p>
          )}
        </div>
        <div className="text-center mt-4 text-sm text-gray-600 italic print:text-xs print:mt-2">
          Answer all questions in this section
        </div>
      </div>
    ),
    getProps: (match) => ({ 
      title: match[1], 
      subtitle: match[2] 
    }),
  },
  {
    name: "question",
    regex: /^Question (\d+):\s*(.*)$/,
    component: ({ number, text }) => {
      const isDisplayDollar = /^\$\$([\s\S]+)\$\$\s*$/.test(text);
      const isDisplayBracket = /^\\\[([\s\S]+)\\\]\s*$/.test(text);
      const isWholeLineInline = /^\$([^$]+)\$\s*$/.test(text);
      return (
        <div className="mt-8 mb-4 print:mt-6 print:mb-3 print:page-break-inside-avoid">
          <div className="flex items-start">
            <div className="bg-gray-800 text-white px-3 py-1 rounded-sm font-bold text-lg mr-4 print:bg-black print:text-sm print:px-2">
              {number}
            </div>
            <div className="flex-1">
              {isDisplayDollar || isDisplayBracket || isWholeLineInline ? (
                <div className="mt-1">
                  <BlockMath math={text.replace(/^\$\$|\$\$$/g, "").replace(/^\\\\\[|\\\\\]$/g, "").replace(/^\$|\$$/g, "").trim()} />
                </div>
              ) : (
                <h3 className="text-lg font-medium text-gray-900 leading-relaxed print:text-base print:leading-tight">
                  {processInlineElements(text)}
                </h3>
              )}
            </div>
          </div>
        </div>
      );
    },
    getProps: (match) => ({ 
      number: match[1], 
      text: match[2] 
    }),
  },
  {
    name: "marks",
    regex: /^\[(\d+)\s*marks?\]$/,
    component: ({ marks }) => (
      <div className="text-right mt-3 mb-4 print:mt-2 print:mb-3">
        <div className="inline-flex items-center">
          <span className="text-sm font-bold text-gray-800 border-2 border-gray-800 px-3 py-1 print:text-xs print:px-2 print:border-black">
            [{marks} mark{parseInt(marks) !== 1 ? 's' : ''}]
          </span>
        </div>
      </div>
    ),
    getProps: (match) => ({ marks: match[1] }),
  },
  {
    name: "mcq_option",
    regex: /^([A-D])\.\s*(.+)$/,
    component: ({ letter, text }) => (
      <div className="ml-8 my-2 flex items-start print:ml-6 print:my-1.5">
        <div className="w-8 h-8 border-2 border-gray-800 rounded-full flex items-center justify-center mr-4 print:w-6 print:h-6 print:mr-3 print:border-black">
          <span className="font-bold text-gray-800 print:text-sm">
            {letter}
          </span>
        </div>
        <span className="text-gray-800 leading-relaxed pt-1 print:text-sm print:pt-0.5 print:leading-tight">
          {processInlineElements(text)}
        </span>
      </div>
    ),
    getProps: (match) => ({ 
      letter: match[1], 
      text: match[2] 
    }),
  },
  {
    name: "instruction",
    regex: /^(Instructions?|Note|IMPORTANT|ATTENTION):\s*(.*)$/i,
    component: ({ type, text }) => (
      <div className="my-4 p-4 border-2 border-gray-600 bg-gray-50 print:bg-white print:border-black print:my-3 print:p-3">
        <div className="flex items-start">
          <span className="font-bold text-gray-800 mr-2 print:text-sm">
            {type.toUpperCase()}:
          </span>
          <span className="text-gray-800 leading-relaxed print:text-sm">
            {processInlineElements(text)}
          </span>
        </div>
      </div>
    ),
    getProps: (match) => ({ 
      type: match[1], 
      text: match[2] 
    }),
  },
  {
    name: "answer_box",
    regex: /^\{answer\}$/,
    component: () => (
      <div className="my-4 border-2 border-gray-800 min-h-[100px] p-4 print:border-black print:my-3 print:min-h-[80px]">
        <div className="text-sm font-semibold text-gray-600 mb-2 print:text-xs">
          Answer:
        </div>
        <div className="h-full bg-transparent"></div>
      </div>
    ),
    getProps: () => ({}),
  },
];

/**
 * Renders a string with special syntax into a tree of React components.
 * This version processes line by line for professional exam formatting.
 */
export function renderProper(input: string): React.ReactNode[] {
  if (!input) {
    return [];
  }

  const nodes: React.ReactNode[] = [];
  const sanitizedInput = input.replace(/\n{3,}/g, "\n\n");
  
  // Split by lines to process each line individually
  const lines = sanitizedInput.split('\n');
  let key = 0;

  // Handle multi-line display math blocks
  let inDisplay = false;
  let displayDelimiter: "$$" | "\\[" | null = null;
  let displayBuffer: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // When inside a display math block, accumulate until the closing delimiter
    if (inDisplay) {
      if (displayDelimiter === "$$") {
        if (line.endsWith("$$")) {
          const content = (displayBuffer.join("\n") + "\n" + rawLine.replace(/\$\$/g, "")).trim();
          nodes.push(<BlockMath key={key++}>{content}</BlockMath>);
          inDisplay = false;
          displayDelimiter = null;
          displayBuffer = [];
          continue;
        }
      } else if (displayDelimiter === "\\[") {
        if (line.endsWith("\\]")) {
          const content = (displayBuffer.join("\n") + "\n" + rawLine.replace(/\\\\\]/, "")).trim();
          nodes.push(<BlockMath key={key++}>{content}</BlockMath>);
          inDisplay = false;
          displayDelimiter = null;
          displayBuffer = [];
          continue;
        }
      }
      displayBuffer.push(rawLine);
      continue;
    }
    
    // Skip empty lines but add appropriate spacing
    if (!line) {
      if (i > 0 && i < lines.length - 1) {
        nodes.push(<div key={key++} className="h-3 print:h-2" />);
      }
      continue;
    }

    // Start of display math blocks
    if (line.startsWith("$$")) {
      if (line.endsWith("$$") && line.length > 3) {
        const content = line.replace(/^\$\$|\$\$$/g, "").trim();
        nodes.push(<BlockMath key={key++}>{content}</BlockMath>);
      } else {
        inDisplay = true;
        displayDelimiter = "$$";
        displayBuffer = [rawLine.replace(/^\$\$/, "")];
      }
      continue;
    }
    if (line.startsWith("\\[")) {
      if (line.endsWith("\\]") && line.length > 3) {
        const content = line.replace(/^\\\\\[|\\\\\]$/g, "").trim();
        nodes.push(<BlockMath key={key++}>{content}</BlockMath>);
      } else {
        inDisplay = true;
        displayDelimiter = "\\[";
        displayBuffer = [rawLine.replace(/^\\\\\[/, "")];
      }
      continue;
    }

    // Check if line matches any special syntax
    let matched = false;
    for (const rule of renderRules) {
      const match = line.match(rule.regex);
      if (match) {
        const props = rule.getProps(match);
        const Component = rule.component;
        nodes.push(<Component key={key++} {...props} />);
        matched = true;
        break;
      }
    }

    // If no special syntax matched, render as regular text with exam formatting
    if (!matched) {
      // Check if it's a paragraph (longer text) or instruction
      if (line.length > 60 && !line.match(/^[A-D]\./)) {
        nodes.push(
          <div key={key++} className="text-gray-800 leading-relaxed my-3 text-justify print:my-2 print:text-sm print:leading-relaxed">
            <p className="indent-4">
              {processInlineElements(line)}
            </p>
          </div>
        );
      } else if (line.match(/^[ivx]+\)|^\([ivx]+\)|^\d+\.|^\([a-z]\)/i)) {
        // Sub-questions or numbered items
        nodes.push(
          <div key={key++} className="ml-6 text-gray-800 leading-relaxed my-2 print:ml-4 print:my-1.5 print:text-sm">
            {processInlineElements(line)}
          </div>
        );
      } else {
        // Regular text or instructions
        nodes.push(
          <div key={key++} className="text-gray-800 leading-relaxed my-2 print:my-1.5 print:text-sm">
            {processInlineElements(line)}
          </div>
        );
      }
    }
  }

  return nodes;
}

/**
 * Process inline elements like math within a text line
 */
function processInlineElements(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let key = 0;

  // Split out any inline display segments $$...$$ first
  const displayRegex = /\$\$([\s\S]+?)\$\$/g;
  let lastIndex = 0;
  const segments: Array<{ type: "text" | "display"; value: string }> = [];
  for (const match of text.matchAll(displayRegex)) {
    const idx = match.index as number;
    if (idx > lastIndex) {
      segments.push({ type: "text", value: text.substring(lastIndex, idx) });
    }
    segments.push({ type: "display", value: match[1] });
    lastIndex = idx + match[0].length;
  }
  if (lastIndex < text.length) {
    segments.push({ type: "text", value: text.substring(lastIndex) });
  }
  if (segments.length === 0) segments.push({ type: "text", value: text });

  for (const seg of segments) {
    if (seg.type === "display") {
  nodes.push(<BlockMath key={key++}>{seg.value.trim()}</BlockMath>);
      continue;
    }

    // Parse inline math in text segments: $...$ and \(...\)
    const inlineRegex = /\$(.+?)\$|\\\((.+?)\\\)/g;
    let iLast = 0;
    for (const im of seg.value.matchAll(inlineRegex)) {
      const iIdx = im.index as number;
      if (iIdx > iLast) {
        nodes.push(<span key={key++}>{seg.value.substring(iLast, iIdx)}</span>);
      }
      // im[1] is from $...$, im[2] is from \(...\)
      const mathContent = (im[1] ?? im[2] ?? "").trim();
      // Handle escaped dollar \$ -> render literally
      if (im[0].startsWith("$") && seg.value[iIdx - 1] === "\\") {
        nodes.push(<span key={key++}>{im[0].replace(/\\\$/g, "$")}</span>);
      } else {
  nodes.push(<InlineMath key={key++}>{mathContent}</InlineMath>);
      }
      iLast = iIdx + im[0].length;
    }
    if (iLast < seg.value.length) {
      nodes.push(<span key={key++}>{seg.value.substring(iLast)}</span>);
    }
  }

  return nodes.length > 0 ? nodes : [text];
}
