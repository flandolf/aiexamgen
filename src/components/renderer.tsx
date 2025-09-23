import React from "react";
import { InlineMath } from "react-katex";
import Graph from "@/components/graph";
import Working from "@/components/working";

interface RenderRule {
  name: string;
  regex: RegExp;
  component: React.ElementType;
  getProps: (match: RegExpMatchArray) => object;
}

const renderRules: RenderRule[] = [
  {
    name: "math",
    regex: /^\$([^$]+)\$$/,
    component: InlineMath,
    getProps: (match) => ({ children: match[1] }),
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
            <p className="text-base font-medium text-gray-700 mt-2 print:text-sm">{subtitle}</p>
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
    component: ({ number, text }) => (
      <div className="mt-8 mb-4 print:mt-6 print:mb-3 print:page-break-inside-avoid">
        <div className="flex items-start">
          <div className="bg-gray-800 text-white px-3 py-1 rounded-sm font-bold text-lg mr-4 print:bg-black print:text-sm print:px-2">
            {number}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 leading-relaxed print:text-base print:leading-tight">
              {text}
            </h3>
          </div>
        </div>
      </div>
    ),
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
          {text}
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
            {text}
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

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines but add appropriate spacing
    if (!line) {
      if (i > 0 && i < lines.length - 1) {
        nodes.push(<div key={key++} className="h-3 print:h-2" />);
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
  const mathRegex = /\$([^$]+)\$/g;
  let lastIndex = 0;
  let key = 0;

  for (const match of text.matchAll(mathRegex)) {
    const matchIndex = match.index as number;
    
    // Add text before math
    if (matchIndex > lastIndex) {
      const textPart = text.substring(lastIndex, matchIndex);
      nodes.push(<span key={key++}>{textPart}</span>);
    }

    // Add math component
    nodes.push(<InlineMath key={key++}>{match[1]}</InlineMath>);
    lastIndex = matchIndex + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    const remainingText = text.substring(lastIndex);
    nodes.push(<span key={key++}>{remainingText}</span>);
  }

  return nodes.length > 0 ? nodes : [text];
}
