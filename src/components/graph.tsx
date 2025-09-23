export default function Graph() {
  const width = 600;
  const height = 600;
  const xMid = width / 2;
  const yMid = height / 2;
  const gridSpacing = 20; // pixels between grid lines

  return (
    <div className="w-full bg-white flex items-center justify-center border-2 border-gray-800 p-6 print:border-black print:p-4">
      <div className="space-y-3">
        <div className="text-sm font-semibold text-gray-800 text-center print:text-xs">
          Graph Paper - Use this space for sketching graphs or diagrams
        </div>
        <svg width="400" height="400" viewBox={`0 0 ${width} ${height}`} className="border-2 border-gray-800 print:border-black">
          {/* Grid lines */}
          {[...Array(width / gridSpacing)].map((_, i) => {
            const x = i * gridSpacing;
            return (
              <line
                key={`v-${i}`}
                x1={x}
                y1={0}
                x2={x}
                y2={height}
                stroke="#d1d5db"
                strokeWidth="0.5"
              />
            );
          })}
          {[...Array(height / gridSpacing)].map((_, i) => {
            const y = i * gridSpacing;
            return (
              <line
                key={`h-${i}`}
                x1={0}
                y1={y}
                x2={width}
                y2={y}
                stroke="#d1d5db"
                strokeWidth="0.5"
              />
            );
          })}
          {/* Axes */}
          <line
            x1="0"
            y1={yMid}
            x2={width}
            y2={yMid}
            stroke="#000000"
            strokeWidth="2"
          />
          <line
            x1={xMid}
            y1="0"
            x2={xMid}
            y2={height}
            stroke="#000000"
            strokeWidth="2"
          />
          {/* Bounding box */}
          <rect
            x="0"
            y="0"
            width={width}
            height={height}
            fill="none"
            stroke="#000000"
            strokeWidth="3"
          />
          {/* Axis labels */}
          <text x={xMid + 10} y="20" fontSize="16" fill="#000000" fontWeight="bold">
            y
          </text>
          <text x={width - 20} y={yMid - 10} fontSize="16" fill="#000000" fontWeight="bold">
            x
          </text>
          {/* Origin */}
          <text x={xMid + 5} y={yMid - 5} fontSize="14" fill="#000000" fontWeight="500">
            O
          </text>
        </svg>
        <div className="text-xs text-gray-600 text-center print:text-[10px]">
          Note: Each square represents one unit. Label your axes and show key points clearly.
        </div>
      </div>
    </div>
  );
}
