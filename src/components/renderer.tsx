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
      <div className="my-4 flex justify-center">
        <Graph />
      </div>
    ),
    getProps: () => ({}),
  },
  {
    name: "working",
    regex: /^\{working\((\d+)\)\}$/,
    component: ({ linesCount }) => (
      <div className="my-3">
        <Working linesCount={linesCount} />
      </div>
    ),
    getProps: (match) => ({ linesCount: parseInt(match[1] || "8", 10) }),
  },
  {
    name: "section_header",
    regex: /^(SECTION [A-Z]|Part [IVX]+|Multiple Choice Questions?|Short Answer Questions?):\s*(.*)$/i,
    component: ({ title, subtitle }) => (
      <div className="mt-8 mb-6 first:mt-0">
        <h2 className="text-xl font-bold text-gray-900 border-b-2 border-gray-300 pb-2">
          {title}
          {subtitle && <span className="text-lg font-normal ml-2">{subtitle}</span>}
        </h2>
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
      <div className="mt-6 mb-4">
        <h3 className="text-lg font-semibold text-gray-900 leading-relaxed">
          <span className="mr-2">Question {number}:</span>
          <span className="font-normal">{text}</span>
        </h3>
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
      <div className="text-right mt-2 mb-1">
        <span className="text-sm font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded">
          [{marks} mark{parseInt(marks) !== 1 ? 's' : ''}]
        </span>
      </div>
    ),
    getProps: (match) => ({ marks: match[1] }),
  },
  {
    name: "mcq_option",
    regex: /^([A-D])\.\s*(.+)$/,
    component: ({ letter, text }) => (
      <div className="ml-4 my-1 flex items-start">
        <span className="font-semibold text-gray-700 mr-3 mt-0.5 min-w-[1.5rem]">
          {letter}.
        </span>
        <span className="text-gray-800 leading-relaxed">{text}</span>
      </div>
    ),
    getProps: (match) => ({ 
      letter: match[1], 
      text: match[2] 
    }),
  },
];

/**
 * Renders a string with special syntax into a tree of React components.
 * This version uses a robust tokenizer pattern to avoid parsing errors.
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
    
    // Skip empty lines but add spacing
    if (!line) {
      if (i > 0 && i < lines.length - 1) {
        nodes.push(<div key={key++} className="h-2" />);
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

    // If no special syntax matched, render as regular text
    if (!matched) {
      // Check if it's a paragraph (longer text)
      if (line.length > 50 && !line.match(/^[A-D]\./)) {
        nodes.push(
          <p key={key++} className="text-gray-800 leading-relaxed my-2 text-justify">
            {processInlineElements(line)}
          </p>
        );
      } else {
        nodes.push(
          <div key={key++} className="text-gray-800 leading-relaxed my-1">
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
