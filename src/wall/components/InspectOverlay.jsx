import Frame from "./Frame.jsx";

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "var(--color-overlay)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 50,
  color: "var(--color-white)",
};

const contentStyle = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "var(--space-5)",
  padding: "var(--space-6) var(--space-5)",
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
  gap: "var(--space-2)",
  maxWidth: "68ch",
};

const labelTitleStyle = {
  fontSize: "var(--font-size-lg)",
  fontWeight: 600,
  letterSpacing: 0.2,
};

const labelMetaStyle = {
  fontSize: "var(--font-size-md)",
  opacity: 0.75,
};

const tagRowStyle = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: "var(--space-2)",
  marginTop: "var(--space-1)",
};

const tagStyle = {
<<<<<<< ours
  padding: "3px 10px",
  borderRadius: "var(--radius-pill)",
  border: "2px solid var(--color-black)",
  background: "var(--color-accent)",
  color: "var(--color-black)",
  fontWeight: 600,
  fontSize: 11,
=======
  padding: "2px 10px",
  borderRadius: "var(--radius-pill)",
  border: "var(--border-strong)",
  background: "var(--color-accent)",
  color: "var(--color-black)",
  fontWeight: 600,
  fontSize: "var(--font-size-xs)",
>>>>>>> theirs
};

const closeButtonStyle = {
  position: "absolute",
  top: 18,
  right: 18,
  borderRadius: "var(--radius-pill)",
<<<<<<< ours
  border: "2px solid var(--color-black)",
=======
  border: "var(--border-strong)",
>>>>>>> theirs
  background: "var(--color-white)",
  color: "var(--color-black)",
  width: 36,
  height: 36,
  fontSize: 18,
  cursor: "pointer",
  boxShadow: "var(--shadow-hard-sm)",
};

const navButtonStyle = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
<<<<<<< ours
  border: "2px solid var(--color-black)",
=======
  border: "var(--border-strong)",
>>>>>>> theirs
  background: "var(--color-white)",
  color: "var(--color-black)",
  width: 56,
  height: 56,
  borderRadius: "var(--radius-pill)",
  cursor: "pointer",
  fontSize: 28,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "var(--shadow-hard-sm)",
};

const hintStyle = {
<<<<<<< ours
  fontSize: 11,
=======
  fontSize: "var(--font-size-xs)",
>>>>>>> theirs
  opacity: 0.7,
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
