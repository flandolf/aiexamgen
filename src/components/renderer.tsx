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
      <div className="m-2">
        <Graph />
      </div>
    ),
    getProps: () => ({}),
  },
  {
    name: "working",
    regex: /^\{working\((\d+)\)\}$/,
    component: ({ linesCount }) => (
      <div className="m-2">
        <Working linesCount={linesCount} />
      </div>
    ),
    getProps: (match) => ({ linesCount: parseInt(match[1] || "8", 10) }),
  },
];

// This regex finds any of the tokens. It's used to iterate through them.
const tokenFinderRegex = new RegExp(
  renderRules.map((rule) => `(${rule.regex.source.slice(1, -1)})`).join("|"),
  "g",
);

/**
 * Renders a string with special syntax into a tree of React components.
 * This version uses a robust tokenizer pattern to avoid parsing errors.
 */
export function renderProper(input: string): React.ReactNode[] {
  if (!input) {
    return [];
  }

  const nodes: React.ReactNode[] = [];
  const sanitizedInput = input.replace(/\n{3,}/g, "\n");

  let lastIndex = 0;
  let key = 0;

  // 1. Iterate through all special tokens using matchAll
  for (const match of sanitizedInput.matchAll(tokenFinderRegex)) {
    const matchedToken = match[0]; // The full matched string, e.g., "{working(5)}"
    const matchIndex = match.index as number;

    // 2. Capture any plain text that came *before* this token
    if (matchIndex > lastIndex) {
      const textPart = sanitizedInput.substring(lastIndex, matchIndex);
      nodes.push(<span key={key++}>{textPart}</span>);
    }

    // 3. Find the correct rule and render the component for the token
    const rule = renderRules.find((r) => r.regex.test(matchedToken));
    if (rule) {
      // We re-match the isolated token with its specific rule to get props correctly
      const specificMatch = matchedToken.match(rule.regex)!;
      const props = rule.getProps(specificMatch);
      const Component = rule.component;
      nodes.push(<Component key={key++} {...props} />);
    }

    // 4. Update our position in the string
    lastIndex = matchIndex + matchedToken.length;
  }

  // 5. Add any remaining plain text at the very end of the string
  if (lastIndex < sanitizedInput.length) {
    const remainingText = sanitizedInput.substring(lastIndex);
    nodes.push(<span key={key++}>{remainingText}</span>);
  }

  return nodes;
}
