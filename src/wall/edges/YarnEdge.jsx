import { EdgeLabelRenderer, getBezierPath } from "reactflow";

const kindStyles = {
  sequence: {
    stroke: "var(--color-black)",
    strokeWidth: 2.2,
    strokeDasharray: "0",
    strokeOpacity: 0.75,
  },
  echoes: {
    stroke: "var(--color-black)",
    strokeWidth: 1.8,
    strokeDasharray: "4 6",
    strokeOpacity: 0.55,
  },
  threshold: {
    stroke: "var(--color-accent)",
    strokeWidth: 2.6,
    strokeDasharray: "0",
    strokeOpacity: 0.9,
  },
  samples: {
    stroke: "var(--color-black)",
    strokeWidth: 1.6,
    strokeDasharray: "2 6",
    strokeOpacity: 0.45,
  },
  witness: {
    stroke: "var(--color-black)",
    strokeWidth: 1.4,
    strokeDasharray: "1 7",
    strokeOpacity: 0.3,
  },
};

const getEdgeStyle = (kind) =>
  kindStyles[kind] ?? {
    stroke: "var(--color-black)",
    strokeWidth: 1.8,
    strokeDasharray: "3 6",
    strokeOpacity: 0.5,
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
    stroke: "var(--color-white)",
    strokeWidth: Math.max(baseStyle.strokeWidth - 1, 0.6),
    strokeOpacity: 0.12,
  };

  const tackStyle = {
    fill: baseStyle.stroke,
    opacity: Math.min(baseStyle.strokeOpacity + 0.1, 1),
  };

  const tackShadowStyle = {
    fill: baseStyle.stroke,
    opacity: baseStyle.strokeOpacity * 0.25,
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

      <circle
        cx={sourceX}
        cy={sourceY}
        r={6}
        fill={tackShadowStyle.fill}
        opacity={tackShadowStyle.opacity}
        pointerEvents="none"
      />
      <circle
        cx={targetX}
        cy={targetY}
        r={6}
        fill={tackShadowStyle.fill}
        opacity={tackShadowStyle.opacity}
        pointerEvents="none"
      />
      <circle
        cx={sourceX}
        cy={sourceY}
        r={3.4}
        fill={tackStyle.fill}
        opacity={tackStyle.opacity}
        pointerEvents="none"
      />
      <circle
        cx={targetX}
        cy={targetY}
        r={3.4}
        fill={tackStyle.fill}
        opacity={tackStyle.opacity}
        pointerEvents="none"
      />

      {edgeLabel ? (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan"
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              background: "var(--color-white)",
              border: "2px solid var(--color-black)",
              padding: "4px 8px",
              borderRadius: "var(--radius-pill)",
              color: "var(--color-black)",
              fontSize: 11,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              boxShadow: "var(--shadow-hard-sm)",
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
