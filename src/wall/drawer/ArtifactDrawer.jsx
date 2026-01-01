import { marked } from "marked";

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(8, 8, 12, 0.55)",
  zIndex: 20,
};

const drawerStyle = {
  position: "fixed",
  top: 0,
  right: 0,
  height: "100vh",
  width: "min(420px, 92vw)",
  background: "rgba(20, 20, 26, 0.98)",
  color: "#f5f5f5",
  borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
  boxShadow: "-12px 0 24px rgba(0, 0, 0, 0.35)",
  padding: "24px 20px",
  overflowY: "auto",
  zIndex: 30,
};

const closeButtonStyle = {
  position: "absolute",
  top: 16,
  right: 16,
  background: "transparent",
  color: "#f5f5f5",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: 999,
  width: 32,
  height: 32,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: 16,
};

const titleStyle = {
  fontSize: 20,
  fontWeight: 600,
  marginBottom: 12,
  paddingRight: 48,
};

const tagListStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  marginBottom: 16,
};

const tagStyle = {
  padding: "4px 10px",
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.08)",
  fontSize: 12,
};

const sectionTitleStyle = {
  fontSize: 12,
  letterSpacing: 0.12,
  textTransform: "uppercase",
  opacity: 0.6,
  marginTop: 20,
  marginBottom: 8,
};

const imageStyle = {
  width: "100%",
  borderRadius: 12,
  background: "rgba(255, 255, 255, 0.04)",
};

const relatedListStyle = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "grid",
  gap: 8,
};

const relatedButtonStyle = {
  width: "100%",
  textAlign: "left",
  background: "rgba(255, 255, 255, 0.06)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: 10,
  padding: "10px 12px",
  color: "#f5f5f5",
  cursor: "pointer",
  fontSize: 13,
};

const markdownStyle = {
  lineHeight: 1.6,
};

marked.setOptions({
  mangle: false,
  headerIds: false,
});

export default function ArtifactDrawer({
  artifact,
  relatedArtifacts,
  onClose,
  onSelectRelated,
}) {
  if (!artifact) {
    return null;
  }

  const tags = Array.isArray(artifact.tags) ? artifact.tags : [];
  const markdown = artifact.body ? marked.parse(artifact.body) : "";

  return (
    <>
      <div style={overlayStyle} onClick={onClose} />
      <aside style={drawerStyle} aria-label="Artifact details">
        <button type="button" onClick={onClose} style={closeButtonStyle}>
          ×
        </button>
        <div style={titleStyle}>{artifact.title ?? "Untitled"}</div>
        {tags.length ? (
          <div style={tagListStyle}>
            {tags.map((tag) => (
              <span key={tag} style={tagStyle}>
                {tag}
              </span>
            ))}
          </div>
        ) : null}
        {artifact.type === "image" && artifact.full ? (
          <img src={artifact.full} alt={artifact.title ?? "Artifact"} style={imageStyle} />
        ) : null}
        {artifact.type === "text" ? (
          <div
            style={markdownStyle}
            dangerouslySetInnerHTML={{ __html: markdown }}
          />
        ) : null}
        {artifact.type === "video" ? (
          <div>
            {artifact.youtubeId ? (
              <iframe
                width="100%"
                height="215"
                src={`https://www.youtube.com/embed/${artifact.youtubeId}`}
                title={artifact.title ?? "Artifact video"}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ borderRadius: 12 }}
              />
            ) : null}
            {!artifact.youtubeId && artifact.mp4 ? (
              <video
                controls
                src={artifact.mp4}
                style={{ width: "100%", borderRadius: 12 }}
              />
            ) : null}
          </div>
        ) : null}
        {relatedArtifacts?.length ? (
          <section>
            <div style={sectionTitleStyle}>Related</div>
            <ul style={relatedListStyle}>
              {relatedArtifacts.map((related) => (
                <li key={related.id}>
                  <button
                    type="button"
                    style={relatedButtonStyle}
                    onClick={() => onSelectRelated(related.id)}
                  >
                    {related.title ?? "Untitled"}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </aside>
    </>
  );
}
