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
  // Markdown headings like #, ##, ###
  {
    name: "markdown_heading",
    regex: /^(#{1,6})\s+(.+)$/,
    component: ({ level, text }) => {
      const base = "text-gray-900 font-bold tracking-wide";
      const sizes: Record<number, string> = {
        1: "text-3xl mb-4 print:text-xl print:mb-3",
        2: "text-2xl mb-3 print:text-lg print:mb-2.5",
        3: "text-xl mb-2 print:text-base print:mb-2",
        4: "text-lg mb-2 print:text-base print:mb-1.5",
        5: "text-base mb-1.5 print:text-sm print:mb-1.5",
        6: "text-sm mb-1 print:text-xs print:mb-1",
      };
      const cls = `${base} ${sizes[level as number] || sizes[3]}`;
      return (
        <div className={cls}>
          {processInlineElements(text)}
        </div>
      );
    },
    getProps: (match) => ({ level: match[1].length, text: match[2] }),
  },
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
    regex: /^\{graph\}\s*$/,
    component: () => (
      <div className="my-6 flex justify-center print:my-4 avoid-break keep-with-prev">
        <Graph />
      </div>
    ),
    getProps: () => ({}),
  },
  {
    name: "working",
    regex: /^\{working\(\s*(.*?)\s*\)\}\s*$/,
    component: ({ linesCount }) => (
      <div className="my-4 print:my-3 avoid-break keep-with-prev">
        <Working linesCount={linesCount} />
      </div>
    ),
    getProps: (match) => {
      const n = parseInt((match[1] ?? "").toString(), 10);
      return { linesCount: Number.isFinite(n) ? n : 8 };
    },
  },
  {
    name: "section_header",
    // Supports: "Section A", "SECTION A:", "Part II - Algebra", "Multiple Choice Questions", "Short-Answer Questions: Topic"
    regex: /^(?:(section|part)\s+([A-Z0-9IVX]+)\.?\s*(?:[:\-–—]\s*(.*))?|((?:Multiple(?:\s|-)?Choice(?:\s|-)?Questions?|Short(?:\s|-)?Answer(?:\s|-)?Questions?))\.?\s*(?:[:\-–—]\s*(.*))?)$/i,
    component: ({ title, subtitle }) => (
      <div className="mt-12 mb-8 first:mt-8 print:mt-8 print:mb-6 keep-with-next avoid-break">
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
    getProps: (match) => {
      // Groups: 1=kind, 2=code, 3=subtitle1, 4=label, 5=subtitle2
      const kind = match[1];
      const code = match[2];
      const subtitle1 = match[3];
      const label = match[4];
      const subtitle2 = match[5];
      const title = label || (kind && code ? `${kind.toUpperCase()} ${code}` : match[0]);
      const subtitle = subtitle1 || subtitle2 || "";
      return { title, subtitle };
    },
  },
  {
    name: "question",
    regex: /^Question (\d+):\s*(.*)$/,
    component: ({ number, text }) => {
      const isDisplayDollar = /^\$\$([\s\S]+)\$\$\s*$/.test(text);
      const isDisplayBracket = /^\\\[([\s\S]+)\\\]\s*$/.test(text);
      const isWholeLineInline = /^\$([^$]+)\$\s*$/.test(text);
      return (
  <div className="mt-8 mb-4 print:mt-6 print:mb-3 avoid-break">
          <div className="flex items-start">
            <div className="bg-gray-800 text-white px-3 py-1 rounded-sm font-bold text-lg mr-4 print:bg-black print:text-sm print:px-2">
              {number}
            </div>
            <div className="flex-1 question-header keep-with-next">
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
      <div className="text-right mt-3 mb-4 print:mt-2 print:mb-3 avoid-break keep-with-prev">
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
      <div className="ml-8 my-2 flex items-start print:ml-6 print:my-1.5 avoid-break">
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
    regex: /^\{answer\}\s*$/,
    component: () => (
      <div className="my-4 border-2 border-gray-800 min-h-[100px] p-4 print:border-black print:my-3 print:min-h-[80px] avoid-break keep-with-prev">
        <div className="text-sm font-semibold text-gray-600 mb-2 print:text-xs">Answer:</div>
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
  const lines = sanitizedInput.split("\n");
  let key = 0;

  // Page-break tracking for sections
  let sectionCount = 0;
  let enteredExam = false;

  // Grouping state per question
  let group: React.ReactNode[] = [];
  let inQuestion = false;

  const flushGroup = () => {
    if (inQuestion && group.length > 0) {
      nodes.push(
        <div key={key++} className="question-group my-6 print:my-4 avoid-break">
          {group}
        </div>
      );
    }
    inQuestion = false;
    group = [];
  };

  // Useful rules
  const questionRule = renderRules.find(r => r.name === "question")!;
  const sectionRule = renderRules.find(r => r.name === "section_header")!;
  const mcqRule = renderRules.find(r => r.name === "mcq_option")!;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();
    const stripped = trimmed.replace(/^\*\*(.+)\*\*$|^__(.+)__$/,(m,_a,_b)=> (_a||_b||"")).trim() || trimmed;

    if (!trimmed) {
      // Skip blank lines inside groups; renderer creates spacing
      continue;
    }

    // Section header — flush question and add page break before second
    const sMatch = stripped.match(sectionRule.regex);
    if (sMatch) {
      flushGroup();
      const props = sectionRule.getProps(sMatch as RegExpMatchArray);
      const Comp = sectionRule.component;
      const el = <Comp {...props} />;
      nodes.push(sectionCount >= 1 ? (
        <div key={key++} className="page-break-before">{el}</div>
      ) : (
        <React.Fragment key={key++}>{el}</React.Fragment>
      ));
      sectionCount++;
      enteredExam = true;
      continue;
    }

    // New question
    const qMatch = stripped.match(questionRule.regex);
    if (qMatch) {
      flushGroup();
      const Comp = questionRule.component;
      // If no text on the same line, consume the next non-empty, non-option line as stem
      let qNum = qMatch[1];
      let qText = (qMatch[2] || "").trim();
      if (!qText) {
        let j = i + 1;
        while (j < lines.length) {
          const nxtRaw = lines[j];
          const nxt = nxtRaw.trim();
          if (!nxt) { j++; continue; }
          const nxtStripped = nxt.replace(/^\*\*(.+)\*\*$|^__(.+)__$/,(m,_a,_b)=> (_a||_b||"")).trim() || nxt;
          // stop if next is options, marks, section, or a new question
          if (mcqRule.regex.test(nxtStripped) || sectionRule.regex.test(nxtStripped) || questionRule.regex.test(nxtStripped)) break;
          // otherwise take as stem and consume
          qText = nxtStripped;
          i = j; // consume this line
          break;
        }
      }
      const props = { number: qNum, text: qText } as any;
      group.push(<Comp key={key++} {...props} />);
      inQuestion = true;
      enteredExam = true;
      continue;
    }

    // MCQ options block
    const firstOpt = stripped.match(mcqRule.regex);
    if (firstOpt) {
      const opts: React.ReactNode[] = [];
      let j = i;
      while (j < lines.length) {
        const r = lines[j].trim();
        const rb = r.replace(/^\*\*(.+)\*\*$|^__(.+)__$/,(m,_a,_b)=> (_a||_b||"")).trim() || r;
        const m = rb.match(mcqRule.regex);
        if (!m) break;
        const p = mcqRule.getProps(m as RegExpMatchArray);
        const C = mcqRule.component;
        opts.push(<C key={`opt-${j}`} {...p} />);
        j++;
      }
      // Skip prompt-error tokens following options
      while (j < lines.length) {
        const nxt = lines[j].trim();
        if (/^\{working\(/i.test(nxt) || /^\{answer\}/i.test(nxt)) { j++; continue; }
        break;
      }
      group.push(
        <div key={key++} className="ml-4 mt-1 mb-2 print:mt-1 print:mb-2 avoid-break keep-with-prev">
          {opts}
        </div>
      );
      i = j - 1;
      continue;
    }

    // Display math start
    if (trimmed.startsWith("$$")) {
      if (trimmed.endsWith("$$") && trimmed.length > 3) {
        const content = trimmed.replace(/^\$\$|\$\$$/g, "").trim();
        const node = <BlockMath key={key++}>{content}</BlockMath>;
        inQuestion ? group.push(node) : nodes.push(node);
      } else {
        // accumulate until closing $$
        const buf: string[] = [raw.replace(/^\$\$/, "")];
        i++;
        while (i < lines.length) {
          const rr = lines[i];
          const t = rr.trim();
          if (t.endsWith("$$")) {
            buf.push(rr.replace(/\$\$/g, ""));
            break;
          }
          buf.push(rr);
          i++;
        }
        const node = <BlockMath key={key++}>{buf.join("\n").trim()}</BlockMath>;
        inQuestion ? group.push(node) : nodes.push(node);
      }
      continue;
    }

    // Bracket display math start
    if (trimmed.startsWith("\\[")) {
      if (trimmed.endsWith("\\]") && trimmed.length > 3) {
        const content = trimmed.replace(/^\\\\\[|\\\\\]$/g, "").trim();
        const node = <BlockMath key={key++}>{content}</BlockMath>;
        inQuestion ? group.push(node) : nodes.push(node);
      } else {
        const buf: string[] = [raw.replace(/^\\\\\[/, "")];
        i++;
        while (i < lines.length) {
          const rr = lines[i];
          const t = rr.trim();
          if (t.endsWith("\\]")) {
            buf.push(rr.replace(/\\\\\]/, ""));
            break;
          }
          buf.push(rr);
          i++;
        }
        const node = <BlockMath key={key++}>{buf.join("\n").trim()}</BlockMath>;
        inQuestion ? group.push(node) : nodes.push(node);
      }
      continue;
    }

    // Fallback: other rules and paragraphs
    let handled = false;
    for (const rule of renderRules) {
      if (rule.name === "question" || rule.name === "mcq_option" || rule.name === "section_header") continue;
      const m = stripped.match(rule.regex);
      if (m) {
        const props = rule.getProps(m);
        const Comp = rule.component;
        const node = <Comp key={key++} {...props} />;
        inQuestion ? group.push(node) : nodes.push(node);
        handled = true;
        enteredExam = true;
        break;
      }
    }
    if (handled) continue;

    const hasInlineToken = /\{graph\}|\{working\((.*?)\)\}|\{answer\}/.test(trimmed);
    const textNode = (
      <div key={key++} className="text-gray-800 leading-relaxed my-2 print:my-1.5 print:text-sm">
        {hasInlineToken ? processInlineTokens(trimmed) : processInlineElements(trimmed)}
      </div>
    );
    inQuestion ? group.push(textNode) : nodes.push(textNode);
  }

  flushGroup();
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

/**
 * Process inline special tokens within a text line:
 * - {graph}
 * - {working(n)} with optional n
 * - {answer}
 * Text between tokens still supports inline math via processInlineElements.
 */
function processInlineTokens(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let key = 0;
  const tokenRegex = /(\{graph\}|\{working\((.*?)\)\}|\{answer\})/g;
  let last = 0;
  for (const m of text.matchAll(tokenRegex)) {
    const idx = m.index as number;
    if (idx > last) {
      const segment = text.substring(last, idx);
      nodes.push(...processInlineElements(segment).map((n, i) => <React.Fragment key={key++}>{n}</React.Fragment>));
    }
    const token = m[1];
    if (token.startsWith('{graph')) {
      nodes.push(
        <div key={key++} className="my-4 flex justify-center print:my-3 avoid-break keep-with-prev">
          <Graph />
        </div>
      );
    } else if (token.startsWith('{working')) {
      const n = parseInt((m[2] ?? '').toString(), 10);
      const linesCount = Number.isFinite(n) ? n : 8;
      nodes.push(
        <div key={key++} className="my-3 print:my-2 avoid-break keep-with-prev">
          <Working linesCount={linesCount} />
        </div>
      );
    } else if (token.startsWith('{answer')) {
      nodes.push(
        <div key={key++} className="my-3 border-2 border-gray-800 min-h-[100px] p-4 print:border-black print:my-2 print:min-h-[80px] avoid-break keep-with-prev">
          <div className="text-sm font-semibold text-gray-600 mb-2 print:text-xs">Answer:</div>
        </div>
      );
    }
    last = idx + token.length;
  }
  if (last < text.length) {
    nodes.push(...processInlineElements(text.substring(last)).map((n, i) => <React.Fragment key={key++}>{n}</React.Fragment>));
  }
  return nodes;
}
