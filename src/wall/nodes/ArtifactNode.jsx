import { Handle, Position } from "reactflow";
import Frame from "../components/Frame.jsx";

const cardStyle = {
  width: 220,
  color: "var(--text)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-3)",
  fontSize: "var(--fs-sm)",
  lineHeight: 1.4,
  wordBreak: "break-word",
  position: "relative",
};

const titleStyle = {
  fontWeight: 600,
  fontSize: "var(--fs-md)",
};

const thumbStyle = {
  width: "100%",
  height: "auto",
  borderRadius: "var(--radius-1)",
  display: "block",
  background: "var(--surface-muted)",
};

const overlayStyle = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--text-inverse)",
  fontSize: "var(--fs-2xl)",
  textShadow: "2px 2px 0 rgba(0, 0, 0, 0.35)",
  pointerEvents: "none",
};

const handleStyle = {
  opacity: 0,
};

const textCardStyle = {
  padding: "var(--space-3)",
  borderRadius: "var(--radius-2)",
  background: "var(--surface)",
  border: "var(--border-2) solid var(--border)",
  boxShadow: "var(--shadow-2)",
};

const buildCaption = (artifact) => {
  const title = artifact?.title ?? "Untitled";
  const date = artifact?.date;
  const yearMatch = date ? String(date).match(/\d{4}/) : null;
  const year = yearMatch ? yearMatch[0] : null;
  const medium = artifact?.medium;
  let caption = title;
  if (year) {
    caption += ` (${year})`;
  }
  if (medium) {
    caption += ` — ${medium}`;
  }
  return caption;
};

export default function ArtifactNode({ data }) {
  const artifactId = data?.artifactId;
  const artifactsById = data?.artifactsById;
  const artifact = artifactId ? artifactsById?.get(String(artifactId)) : null;
  const showCaptions = data?.showCaptions ?? false;
  const frameConfig = data?.frameOverride ?? artifact?.frame ?? {
    variant: "none",
  };

  if (!artifactId) {
    return (
      <div style={{ ...cardStyle, ...textCardStyle }}>
        <Handle type="target" position={Position.Left} style={handleStyle} />
        <Handle type="source" position={Position.Right} style={handleStyle} />
        <div
          style={{
            opacity: 0.7,
            fontSize: "var(--fs-xs)",
            letterSpacing: "0.05em",
          }}
        >
          Missing artifact
        </div>
        <div>Link this node to an artifact to preview it.</div>
      </div>
    );
  }

  if (!artifact) {
    return (
      <div style={{ ...cardStyle, ...textCardStyle }}>
        <Handle type="target" position={Position.Left} style={handleStyle} />
        <Handle type="source" position={Position.Right} style={handleStyle} />
        <div
          style={{
            opacity: 0.7,
            fontSize: "var(--fs-xs)",
            letterSpacing: "0.05em",
          }}
        >
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
        <Handle type="target" position={Position.Left} style={handleStyle} />
        <Handle type="source" position={Position.Right} style={handleStyle} />
        <Frame
          variant={frameConfig?.variant ?? "none"}
          mat={frameConfig?.mat ?? 0}
          caption={buildCaption(artifact)}
          showCaption={showCaptions}
        >
          {artifact?.thumb ? (
            <img
              src={artifact.thumb}
              alt={title}
              loading="lazy"
              style={thumbStyle}
            />
          ) : null}
        </Frame>
      </div>
    );
  }

  if (artifact?.type === "text") {
    return (
      <div style={{ ...cardStyle, ...textCardStyle }}>
        <Handle type="target" position={Position.Left} style={handleStyle} />
        <Handle type="source" position={Position.Right} style={handleStyle} />
        <div style={titleStyle}>{title}</div>
        {excerpt ? <div style={{ opacity: 0.8 }}>{excerpt}</div> : null}
      </div>
    );
  }

  if (artifact?.type === "video") {
    return (
      <div style={cardStyle}>
        <Handle type="target" position={Position.Left} style={handleStyle} />
        <Handle type="source" position={Position.Right} style={handleStyle} />
        <Frame
          variant={frameConfig?.variant ?? "none"}
          mat={frameConfig?.mat ?? 0}
          caption={buildCaption(artifact)}
          showCaption={showCaptions}
        >
          <div style={{ position: "relative", width: "100%" }}>
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
        </Frame>
      </div>
    );
  }

  return (
    <div style={{ ...cardStyle, ...textCardStyle }}>
      <Handle type="target" position={Position.Left} style={handleStyle} />
      <Handle type="source" position={Position.Right} style={handleStyle} />
      <div style={titleStyle}>{title}</div>
      <div style={{ opacity: 0.7 }}>Unsupported artifact type.</div>
    </div>
  );
}
