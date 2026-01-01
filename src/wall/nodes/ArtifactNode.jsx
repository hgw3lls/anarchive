import { Handle, Position } from "reactflow";

const cardStyle = {
  width: 220,
  borderRadius: 12,
  backgroundColor: "#f5f0e6",
  backgroundImage:
    "linear-gradient(135deg, rgba(255, 255, 255, 0.65), rgba(240, 232, 218, 0.92)), repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.025) 0, rgba(0, 0, 0, 0.025) 1px, transparent 1px, transparent 4px)",
  color: "#2f2a24",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  boxShadow: "0 12px 24px rgba(0, 0, 0, 0.32)",
  padding: 12,
  display: "flex",
  flexDirection: "column",
  gap: 8,
  fontSize: 12,
  lineHeight: 1.4,
  wordBreak: "break-word",
  position: "relative",
  transformOrigin: "center",
};

const titleStyle = {
  fontWeight: 600,
  fontSize: 13,
};

const thumbStyle = {
  width: "100%",
  height: 120,
  borderRadius: 10,
  objectFit: "cover",
  display: "block",
  background: "rgba(0, 0, 0, 0.08)",
};

const overlayStyle = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "rgba(255, 255, 255, 0.9)",
  fontSize: 28,
  textShadow: "0 4px 10px rgba(0, 0, 0, 0.45)",
};

const handleStyle = {
  opacity: 0,
};

const pinStyle = {
  position: "absolute",
  width: 8,
  height: 8,
  borderRadius: "50%",
  background: "#b85a52",
  boxShadow:
    "0 2px 4px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.4)",
  pointerEvents: "none",
};

const pinOffsets = [
  { top: 6, left: 6 },
  { top: 6, right: 6 },
  { bottom: 6, left: 6 },
  { bottom: 6, right: 6 },
];

const hashToUnit = (value) => {
  let hash = 0;
  const text = String(value ?? "");
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return (hash >>> 0) / 0xffffffff;
};

const rotationForId = (value) => {
  const rotation = Math.round(hashToUnit(value) * 24) - 12;
  return rotation / 10;
};

const pinsForId = (value) => {
  const seed = Math.round(hashToUnit(value) * 1000);
  const count = 2 + (seed % 3);
  const startIndex = seed % pinOffsets.length;
  const ordered = [
    ...pinOffsets.slice(startIndex),
    ...pinOffsets.slice(0, startIndex),
  ];
  return ordered.slice(0, count);
};

export default function ArtifactNode({ data }) {
  const artifactId = data?.artifactId;
  const artifactsById = data?.artifactsById;
  const artifact = artifactId ? artifactsById?.get(String(artifactId)) : null;
  const cardRotation = rotationForId(artifactId ?? "missing");
  const pins = pinsForId(artifactId ?? "missing");
  const cardStyleWithRotation = {
    ...cardStyle,
    transform: `rotate(${cardRotation}deg)`,
  };
  const pinElements = pins.map((offsets, index) => (
    <div
      key={`pin-${index}`}
      style={{
        ...pinStyle,
        ...offsets,
      }}
    />
  ));

  if (!artifactId) {
    return (
      <div style={cardStyleWithRotation}>
        <Handle type="target" position={Position.Left} style={handleStyle} />
        <Handle type="source" position={Position.Right} style={handleStyle} />
        {pinElements}
        <div style={{ opacity: 0.7, fontSize: 11, letterSpacing: 0.5 }}>
          Missing artifact
        </div>
        <div>Link this node to an artifact to preview it.</div>
      </div>
    );
  }

  if (!artifact) {
    return (
      <div style={cardStyleWithRotation}>
        <Handle type="target" position={Position.Left} style={handleStyle} />
        <Handle type="source" position={Position.Right} style={handleStyle} />
        {pinElements}
        <div style={{ opacity: 0.7, fontSize: 11, letterSpacing: 0.5 }}>
          Artifact {String(artifactId)}
        </div>
        <div>Unable to find artifact details.</div>
      </div>
    );
  }

  const title = artifact?.title ?? String(artifactId);
  const bodyText = artifact?.excerpt ?? artifact?.body ?? "";
  const excerpt =
    bodyText.length > 0
      ? bodyText.length > 140
        ? `${bodyText.slice(0, 140)}…`
        : bodyText
      : "";

  if (artifact?.type === "image") {
    return (
      <div style={cardStyleWithRotation}>
        <Handle type="target" position={Position.Left} style={handleStyle} />
        <Handle type="source" position={Position.Right} style={handleStyle} />
        {pinElements}
        {artifact?.thumb ? (
          <img
            src={artifact.thumb}
            alt={title}
            loading="lazy"
            style={thumbStyle}
          />
        ) : null}
        {artifact?.title ? <div style={titleStyle}>{artifact.title}</div> : null}
      </div>
    );
  }

  if (artifact?.type === "text") {
    return (
      <div style={cardStyleWithRotation}>
        <Handle type="target" position={Position.Left} style={handleStyle} />
        <Handle type="source" position={Position.Right} style={handleStyle} />
        {pinElements}
        <div style={titleStyle}>{title}</div>
        {excerpt ? <div style={{ opacity: 0.8 }}>{excerpt}</div> : null}
      </div>
    );
  }

  if (artifact?.type === "video") {
    return (
      <div style={cardStyleWithRotation}>
        <Handle type="target" position={Position.Left} style={handleStyle} />
        <Handle type="source" position={Position.Right} style={handleStyle} />
        {pinElements}
        <div style={{ position: "relative" }}>
          {artifact?.thumb ? (
            <img
              src={artifact.thumb}
              alt={title}
              loading="lazy"
              style={thumbStyle}
            />
          ) : null}
          <div style={overlayStyle}>▶</div>
        </div>
        <div style={titleStyle}>{title}</div>
      </div>
    );
  }

  return (
    <div style={cardStyleWithRotation}>
      <Handle type="target" position={Position.Left} style={handleStyle} />
      <Handle type="source" position={Position.Right} style={handleStyle} />
      {pinElements}
      <div style={titleStyle}>{title}</div>
      <div style={{ opacity: 0.7 }}>Unsupported artifact type.</div>
    </div>
  );
}
