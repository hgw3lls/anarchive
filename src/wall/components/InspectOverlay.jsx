import Frame from "./Frame.jsx";

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "var(--overlay)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: "var(--z-modal)",
  color: "var(--text-inverse)",
};

const contentStyle = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "var(--space-4)",
  padding:
    "var(--space-7) var(--space-6) calc(var(--space-6) + var(--space-1))",
  maxWidth: "90vw",
  maxHeight: "90vh",
};

const artworkShellStyle = {
  width: "min(960px, 80vw)",
  maxWidth: "80vw",
  maxHeight: "80vh",
  display: "flex",
  justifyContent: "center",
};

const mediaStyle = {
  width: "100%",
  height: "auto",
  maxHeight: "80vh",
  display: "block",
  objectFit: "contain",
  borderRadius: "var(--radius-1)",
};

const labelStyle = {
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-2)",
  maxWidth: "68ch",
  background: "var(--surface)",
  color: "var(--text)",
  border: "var(--border-2) solid var(--border)",
  boxShadow: "var(--shadow-2)",
  borderRadius: "var(--radius-2)",
  padding: "var(--space-3) var(--space-4)",
};

const labelTitleStyle = {
  fontSize: "var(--fs-lg)",
  fontWeight: 600,
  letterSpacing: "0.02em",
};

const labelMetaStyle = {
  fontSize: "var(--fs-md)",
  color: "var(--text-muted)",
};

const tagRowStyle = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: "var(--space-2)",
  marginTop: "var(--space-1)",
};

const tagStyle = {
  padding: "var(--space-1) var(--space-3)",
  borderRadius: "var(--radius-pill)",
  border: "var(--border-2) solid var(--border)",
  background: "var(--surface-muted)",
  fontSize: "var(--fs-xs)",
  color: "var(--text)",
};

const closeButtonStyle = {
  position: "absolute",
  top: "var(--space-4)",
  right: "var(--space-4)",
  borderRadius: "var(--radius-pill)",
  border: "var(--border-2) solid var(--border)",
  background: "var(--surface)",
  color: "var(--text)",
  width: "calc(var(--space-7) + var(--space-1))",
  height: "calc(var(--space-7) + var(--space-1))",
  fontSize: "var(--fs-lg)",
  cursor: "pointer",
  boxShadow: "var(--shadow-1)",
};

const navButtonStyle = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  border: "var(--border-2) solid var(--border)",
  background: "var(--surface)",
  color: "var(--text)",
  width: "calc(var(--space-8) + var(--space-4))",
  height: "calc(var(--space-8) + var(--space-4))",
  borderRadius: "var(--radius-pill)",
  cursor: "pointer",
  fontSize: "var(--fs-2xl)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "var(--shadow-2)",
};

const hintStyle = {
  fontSize: "var(--fs-xs)",
  color: "var(--text-muted)",
  display: "flex",
  gap: "var(--space-3)",
  alignItems: "center",
  justifyContent: "center",
};

export default function InspectOverlay({
  open,
  artifact,
  frameConfig,
  labelText,
  labelMeta,
  tags = [],
  onClose,
  onNext,
  onPrev,
  onJumpToNode,
}) {
  if (!open || !artifact) {
    return null;
  }

  const renderMedia = () => {
    if (artifact.type === "image") {
      const src = artifact.full ?? artifact.thumb;
      return src ? (
        <img src={src} alt={artifact.title ?? "Artwork"} style={mediaStyle} />
      ) : null;
    }
    if (artifact.type === "video") {
      if (artifact.youtubeId) {
        return (
          <iframe
            width="100%"
            height="480"
            src={`https://www.youtube.com/embed/${artifact.youtubeId}`}
            title={artifact.title ?? "Artwork video"}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ ...mediaStyle, height: "min(60vh, 480px)" }}
          />
        );
      }
      if (artifact.mp4) {
        return (
          <video
            controls
            src={artifact.mp4}
            style={{ ...mediaStyle, height: "min(60vh, 480px)" }}
          />
        );
      }
    }
    return null;
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <button type="button" style={closeButtonStyle} onClick={onClose}>
        ×
      </button>
      <button
        type="button"
        style={{ ...navButtonStyle, left: "var(--space-6)" }}
        onClick={(event) => {
          event.stopPropagation();
          onPrev?.();
        }}
        aria-label="Previous artwork"
      >
        ‹
      </button>
      <button
        type="button"
        style={{ ...navButtonStyle, right: "var(--space-6)" }}
        onClick={(event) => {
          event.stopPropagation();
          onNext?.();
        }}
        aria-label="Next artwork"
      >
        ›
      </button>
      <div
        style={contentStyle}
        onClick={(event) => event.stopPropagation()}
      >
        <div style={artworkShellStyle}>
          <Frame variant={frameConfig?.variant ?? "none"} mat={frameConfig?.mat ?? 0}>
            {renderMedia()}
          </Frame>
        </div>
        <div style={labelStyle}>
          <div style={labelTitleStyle}>{labelText}</div>
          {labelMeta ? <div style={labelMetaStyle}>{labelMeta}</div> : null}
          {tags.length ? (
            <div style={tagRowStyle}>
              {tags.map((tag) => (
                <span key={tag} style={tagStyle}>
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
          <div style={hintStyle}>
            <span>Esc</span>
            <span>←/→</span>
          </div>
        </div>
      </div>
    </div>
  );
}
