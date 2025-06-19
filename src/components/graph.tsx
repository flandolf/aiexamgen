export default function Graph() {
  const width = 600;
  const height = 600;
  const xMid = width / 2;
  const yMid = height / 2;
  const gridSpacing = 20; // pixels between grid lines

  return (
    <div className="w-full bg-white flex items-center justify-center">
      <svg width="50%" height="50%" viewBox={`0 0 ${width} ${height}`}>
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
              stroke="#eee"
              strokeWidth="1"
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
              stroke="#eee"
              strokeWidth="1"
            />
          );
        })}

        {/* Axes */}
        <line
          x1="0"
          y1={yMid}
          x2={width}
          y2={yMid}
          stroke="black"
          strokeWidth="1.5"
        />
        <line
          x1={xMid}
          y1="0"
          x2={xMid}
          y2={height}
          stroke="black"
          strokeWidth="1.5"
        />

        {/* Axis labels */}
        <text x={xMid + 5} y="12" fontSize="12" fill="black">
          y
        </text>
        <text x={width - 10} y={yMid - 5} fontSize="12" fill="black">
          x
        </text>
      </svg>
    </div>
  );
}
