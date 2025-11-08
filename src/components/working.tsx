import React from "react";

interface WorkingProps {
  linesCount?: number; // number of lines to draw, default 8
  lineSpacing?: number; // vertical spacing between lines in pixels, default 50
  strokeColor?: string; // color of lines, default black
  strokeWidth?: number; // thickness of lines, default 1
}

export default function Working({
  linesCount = 3,
  lineSpacing = 40,
  strokeColor = "#374151",
  strokeWidth = 1,
}: WorkingProps) {
  // Calculate dimensions dynamically
  const paddingTop = lineSpacing / 2;
  const height = paddingTop * 2 + (linesCount - 1) * lineSpacing;
  const width = "100%"; // Takes full width of container

  // Generate y positions for lines
  const yPositions = Array.from(
    { length: linesCount },
    (_, i) => paddingTop + i * lineSpacing,
  );

  return (
    <div className="my-4 border-2 border-gray-800 p-4 bg-white print:border-black print:my-3">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 100 ${height}`} // Using viewBox for responsive scaling
        preserveAspectRatio="none" // Stretch to fill container
        role="img"
        aria-label={`${linesCount} working lines`}
        style={{ backgroundColor: "transparent", display: "block" }}
      >
        {yPositions.map((y, idx) => (
          <line
            key={idx}
            x1={0}
            y1={y}
            x2="100" // Full width of viewBox
            y2={y}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray="none"
          />
        ))}
      </svg>
    </div>
  );
}
