import { EdgeLabelRenderer, getBezierPath } from "reactflow";

const kindStyles = {
  sequence: {
    stroke: "#d8c48a",
    strokeWidth: 2.2,
    strokeDasharray: "0",
    strokeOpacity: 0.9,
  },
  echoes: {
    stroke: "#b39df0",
    strokeWidth: 1.8,
    strokeDasharray: "4 6",
    strokeOpacity: 0.8,
  },
  threshold: {
    stroke: "#f09b7a",
    strokeWidth: 2.6,
    strokeDasharray: "0",
    strokeOpacity: 0.95,
  },
  samples: {
    stroke: "#91a1c4",
    strokeWidth: 1.6,
    strokeDasharray: "2 6",
    strokeOpacity: 0.6,
  },
  witness: {
    stroke: "#d1d1d6",
    strokeWidth: 1.4,
    strokeDasharray: "1 7",
    strokeOpacity: 0.45,
  },
};

const getEdgeStyle = (kind) =>
  kindStyles[kind] ?? {
    stroke: "#c9c3d1",
    strokeWidth: 1.8,
    strokeDasharray: "3 6",
    strokeOpacity: 0.75,
  };

const hashToUnit = (value) => {
  let hash = 0;
  const text = String(value ?? "");
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return (hash >>> 0) / 0xffffffff;
};

const buildStrands = (id, count) => {
  const base = hashToUnit(id);
  return Array.from({ length: count }, (_, index) => {
    const seed = hashToUnit(`${id}-${index}`);
    const angle = (seed + base) * Math.PI * 2;
    const radius = 0.5 + seed * 1.1;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      dashOffset: Math.round((seed - 0.5) * 8),
    };
  });
};

export default function YarnEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  data,
  label,
}) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const edgeKind = data?.kind ?? "sequence";
  const edgeLabel = label;
  const baseStyle = getEdgeStyle(edgeKind);
  const strands = buildStrands(id, 4);

  const shadowStyle = {
    stroke: baseStyle.stroke,
    strokeWidth: baseStyle.strokeWidth + 3,
    strokeOpacity: baseStyle.strokeOpacity * 0.3,
  };

  const highlightStyle = {
    stroke: "#ffffff",
    strokeWidth: Math.max(baseStyle.strokeWidth - 1, 0.6),
    strokeOpacity: 0.12,
  };

  const pathId = `yarn-edge-${id}`;

  return (
    <g>
      {/* under-glow */}
      <path
        id={`${pathId}-shadow`}
        d={edgePath}
        fill="none"
        stroke={shadowStyle.stroke}
        strokeWidth={shadowStyle.strokeWidth}
        strokeOpacity={shadowStyle.strokeOpacity}
        strokeLinecap="round"
        strokeLinejoin="round"
        pointerEvents="none"
      />

      {/* main strands */}
      {strands.map((strand, index) => (
        <path
          key={`${pathId}-strand-${index}`}
          d={edgePath}
          fill="none"
          stroke={baseStyle.stroke}
          strokeWidth={baseStyle.strokeWidth}
          strokeOpacity={baseStyle.strokeOpacity}
          strokeDasharray={baseStyle.strokeDasharray}
          strokeDashoffset={
            baseStyle.strokeDasharray === "0"
              ? undefined
              : strand.dashOffset
          }
          strokeLinecap="round"
          strokeLinejoin="round"
          transform={`translate(${strand.x.toFixed(2)} ${strand.y.toFixed(2)})`}
          markerEnd={index === 0 ? markerEnd : undefined}
          pointerEvents="none"
        />
      ))}

      {/* subtle highlight fiber */}
      <path
        id={`${pathId}-highlight`}
        d={edgePath}
        fill="none"
        stroke={highlightStyle.stroke}
        strokeWidth={highlightStyle.strokeWidth}
        strokeOpacity={highlightStyle.strokeOpacity}
        strokeDasharray={baseStyle.strokeDasharray}
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(0.6 -0.4)"
        pointerEvents="none"
      />

      {edgeLabel ? (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan"
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              background: "rgba(14, 14, 20, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              padding: "4px 8px",
              borderRadius: 999,
              color: "rgba(245, 245, 245, 0.78)",
              fontSize: 11,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.35)",
              pointerEvents: "none",
            }}
          >
            {edgeLabel}
          </div>
        </EdgeLabelRenderer>
      ) : null}
    </g>
  );
}
