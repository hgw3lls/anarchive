import { getBezierPath } from "reactflow";

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
  const [edgePath] = getBezierPath({
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
      <path
        id={`${pathId}-shadow`}
        d={edgePath}
        fill="none"
        stroke={shadowStyle.stroke}
        strokeWidth={shadowStyle.strokeWidth}
        strokeOpacity={shadowStyle.strokeOpacity}
        strokeLinecap="round"
      />
      <path
        id={pathId}
        d={edgePath}
        fill="none"
        stroke={baseStyle.stroke}
        strokeWidth={baseStyle.strokeWidth}
        strokeOpacity={baseStyle.strokeOpacity}
        strokeDasharray={baseStyle.strokeDasharray}
        strokeLinecap="round"
        markerEnd={markerEnd}
      />
      {edgeLabel ? (
        <text
          fill="rgba(255, 255, 255, 0.7)"
          fontSize={11}
          letterSpacing="0.03em"
        >
          <textPath
            href={`#${pathId}`}
            startOffset="50%"
            textAnchor="middle"
          >
            {edgeLabel}
          </textPath>
        </text>
      ) : null}
    </g>
  );
}
