export default function Graph() {
  const width = 600;
  const height = 600;
  const xMid = width / 2;
  const yMid = height / 2;
  const gridSpacing = 20; // pixels between grid lines

  return (
    <div className="w-full bg-white flex items-center justify-center border border-gray-200 rounded-lg p-4">
      <div className="space-y-2">
        <div className="text-xs text-gray-500 font-medium text-center">Graph Paper</div>
        <svg width="400" height="400" viewBox={`0 0 ${width} ${height}`} className="border border-gray-300">
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
                stroke="#e5e7eb"
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
                stroke="#e5e7eb"
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
            stroke="#374151"
            strokeWidth="1.5"
          />
          <line
            x1={xMid}
            y1="0"
            x2={xMid}
            y2={height}
            stroke="#374151"
            strokeWidth="1.5"
          />
          {/* Bounding box (encloses all edges) */}
          <line
            x1="0"
            y1="0"
            x2={width}
            y2="0"
            stroke="#374151"
            strokeWidth="2"
          /> {/* Top */}
          <line
            x1="0"
            y1="0"
            x2="0"
            y2={height}
            stroke="#374151"
            strokeWidth="2"
          /> {/* Left */}
          <line
            x1="0"
            y1={height}
            x2={width}
            y2={height}
            stroke="#374151"
            strokeWidth="2"
          /> {/* Bottom */}
          <line
            x1={width}
            y1="0"
            x2={width}
            y2={height}
            stroke="#374151"
            strokeWidth="2"
          /> {/* Right */}
          {/* Axis labels */}
          <text x={xMid + 5} y="15" fontSize="14" fill="#374151" fontWeight="500">
            y
          </text>
          <text x={width - 15} y={yMid - 5} fontSize="14" fill="#374151" fontWeight="500">
            x
          </text>
        </svg>
      </div>
    </div>
  );
}
