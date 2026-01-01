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
    strokeOpacity: 0.55,
  },
  witness: {
    stroke: "#d1d1d6",
    strokeWidth: 1.4,
    strokeDasharray: "1 7",
    strokeOpacity: 0.35,
  },
};

const getEdgeStyle = (kind) =>
  kindStyles[kind] ?? {
    stroke: "#c9c3d1",
    strokeWidth: 1.8,
    strokeDasharray: "3 6",
    strokeOpacity: 0.7,
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

  const shadowStyle = {
    stroke: baseStyle.stroke,
    strokeWidth: baseStyle.strokeWidth + 2,
    strokeOpacity: baseStyle.strokeOpacity * 0.35,
  };

  const pathId = `yarn-edge-${id}`;

  return (
    <g>
      {/* shadow / fiber glow */}
      <path
        id={`${pathId}-shadow`}
        d={edgePath}
        fill="none"
        stroke={shadowStyle.stroke}
        strokeWidth={shadowStyle.strokeWidth}
        strokeOpacity={shadowStyle.strokeOpacity}
        strokeLinecap="round"
        strokeLinejoin="round"
        // NOTE: intentionally no react-flow__edge-path class
      />

      {/* main yarn */}
      <path
        id={pathId}
        d={edgePath}
        fill="none"
        stroke={baseStyle.stroke}
        strokeWidth={baseStyle.strokeWidth}
        strokeOpacity={baseStyle.strokeOpacity}
        strokeDasharray={baseStyle.strokeDasharray}
        strokeLinecap="round"
        strokeLinejoin="round"
        markerEnd={markerEnd}
        // NOTE: intentionally no react-flow__edge-path class
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
