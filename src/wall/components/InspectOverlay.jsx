import Frame from "./Frame.jsx";

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "var(--overlay)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 50,
  color: "var(--text-inverse)",
};

const contentStyle = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 18,
  padding: "32px 24px 28px",
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
  borderRadius: "var(--radius-sm)",
};

const labelStyle = {
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  gap: 6,
  maxWidth: "68ch",
  background: "var(--surface)",
  color: "var(--text)",
  border: "2px solid var(--border)",
  boxShadow: "var(--shadow-hard)",
  borderRadius: "var(--radius-md)",
  padding: "12px 16px",
};

const labelTitleStyle = {
  fontSize: 16,
  fontWeight: 600,
  letterSpacing: 0.2,
};

const labelMetaStyle = {
  fontSize: 13,
  color: "var(--text-muted)",
};

const tagRowStyle = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: 6,
  marginTop: 4,
};

const tagStyle = {
  padding: "3px 10px",
  borderRadius: 999,
  border: "2px solid var(--border)",
  background: "var(--surface-muted)",
  fontSize: 11,
  color: "var(--text)",
};

const closeButtonStyle = {
  position: "absolute",
  top: 18,
  right: 18,
  borderRadius: 999,
  border: "2px solid var(--border)",
  background: "var(--surface)",
  color: "var(--text)",
  width: 36,
  height: 36,
  fontSize: 18,
  cursor: "pointer",
  boxShadow: "var(--shadow-soft)",
};

const navButtonStyle = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  border: "2px solid var(--border)",
  background: "var(--surface)",
  color: "var(--text)",
  width: 56,
  height: 56,
  borderRadius: 999,
  cursor: "pointer",
  fontSize: 28,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "var(--shadow-hard)",
};

const hintStyle = {
  fontSize: 11,
  color: "var(--text-muted)",
  display: "flex",
  gap: 12,
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
        style={{ ...navButtonStyle, left: 24 }}
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
        style={{ ...navButtonStyle, right: 24 }}
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
