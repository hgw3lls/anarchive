const cardStyle = {
  width: 220,
  borderRadius: 12,
  background: "rgba(26, 26, 32, 0.92)",
  color: "#f5f5f5",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  boxShadow: "0 10px 24px rgba(0, 0, 0, 0.28)",
  padding: 12,
  display: "flex",
  flexDirection: "column",
  gap: 8,
  fontSize: 12,
  lineHeight: 1.4,
  wordBreak: "break-word",
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
  background: "rgba(255, 255, 255, 0.06)",
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

export default function ArtifactNode({ data }) {
  const artifactId = data?.artifactId;
  const artifactsById = data?.artifactsById;
  const artifact = artifactId ? artifactsById?.get(String(artifactId)) : null;

  if (!artifactId) {
    return (
      <div style={cardStyle}>
        <div style={{ opacity: 0.7, fontSize: 11, letterSpacing: 0.5 }}>
          Missing artifact
        </div>
        <div>Link this node to an artifact to preview it.</div>
      </div>
    );
  }

  if (!artifact) {
    return (
      <div style={cardStyle}>
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
      <div style={cardStyle}>
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
      <div style={cardStyle}>
        <div style={titleStyle}>{title}</div>
        {excerpt ? <div style={{ opacity: 0.8 }}>{excerpt}</div> : null}
      </div>
    );
  }

  if (artifact?.type === "video") {
    return (
      <div style={cardStyle}>
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
    <div style={cardStyle}>
      <div style={titleStyle}>{title}</div>
      <div style={{ opacity: 0.7 }}>Unsupported artifact type.</div>
    </div>
  );
}
