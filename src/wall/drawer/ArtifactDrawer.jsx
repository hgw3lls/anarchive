import { marked } from "marked";

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "var(--color-overlay-soft)",
  zIndex: 20,
};

const drawerStyle = {
  position: "fixed",
  top: 0,
  right: 0,
  height: "100vh",
  width: "min(420px, 92vw)",
  background: "var(--color-surface)",
  color: "var(--color-text)",
  borderLeft: "2px solid var(--color-black)",
  boxShadow: "var(--shadow-hard)",
  padding: "24px 20px",
  overflowY: "auto",
  zIndex: 30,
};

const closeButtonStyle = {
  position: "absolute",
  top: 16,
  right: 16,
  background: "var(--color-white)",
  color: "var(--color-black)",
  border: "2px solid var(--color-black)",
  borderRadius: "var(--radius-pill)",
  width: 32,
  height: 32,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: 16,
  boxShadow: "var(--shadow-hard-sm)",
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
  borderRadius: "var(--radius-pill)",
  background: "var(--color-offwhite-alt)",
  border: "2px solid var(--color-black)",
  color: "var(--color-text)",
  fontWeight: 600,
  fontSize: 12,
};

const sectionTitleStyle = {
  fontSize: 12,
  letterSpacing: 0.12,
  textTransform: "uppercase",
  color: "var(--color-text-muted)",
  marginTop: 20,
  marginBottom: 8,
};

const imageStyle = {
  width: "100%",
  borderRadius: "var(--radius-lg)",
  background: "var(--color-surface-muted)",
  border: "2px solid var(--color-black)",
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
  background: "var(--color-white)",
  border: "2px solid var(--color-black)",
  borderRadius: "var(--radius-md)",
  padding: "10px 12px",
  color: "var(--color-black)",
  cursor: "pointer",
  fontSize: 13,
  boxShadow: "var(--shadow-hard-sm)",
};

const markdownStyle = {
  lineHeight: 1.6,
};

const controlLabelStyle = {
  fontSize: 12,
  color: "var(--color-text)",
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const controlSelectStyle = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: "var(--radius-md)",
  border: "2px solid var(--color-black)",
  background: "var(--color-white)",
  color: "var(--color-black)",
  fontSize: 12,
};

const controlButtonStyle = {
  border: "2px solid var(--color-black)",
  borderRadius: "var(--radius-md)",
  background: "var(--color-white)",
  color: "var(--color-black)",
  fontSize: 12,
  padding: "8px 12px",
  cursor: "pointer",
  boxShadow: "var(--shadow-hard-sm)",
};

const inspectButtonStyle = {
  border: "2px solid var(--color-black)",
  borderRadius: "var(--radius-pill)",
  background: "var(--color-accent)",
  color: "var(--color-black)",
  fontSize: 11,
  padding: "6px 12px",
  cursor: "pointer",
  alignSelf: "flex-start",
  fontWeight: 600,
  boxShadow: "var(--shadow-hard-sm)",
};

marked.setOptions({
  mangle: false,
  headerIds: false,
});

export default function ArtifactDrawer({
  artifact,
  node,
  relatedArtifacts,
  onClose,
  onSelectRelated,
  onUpdateFrameOverride,
  onInspect,
}) {
  if (!artifact) {
    return null;
  }

  const tags = Array.isArray(artifact.tags) ? artifact.tags : [];
  const markdown = artifact.body ? marked.parse(artifact.body) : "";
  const nodeFrameOverride = node?.data?.frameOverride ?? null;
  const effectiveFrame = nodeFrameOverride ?? artifact?.frame ?? {
    variant: "none",
    mat: 0,
  };
  const effectiveMat = Number.isFinite(effectiveFrame?.mat)
    ? effectiveFrame.mat
    : effectiveFrame.variant === "floatMount"
      ? 16
      : 0;
  const canEditFrame =
    (artifact.type === "image" || artifact.type === "video") && Boolean(node?.id);
  const canInspect =
    (artifact.type === "image" || artifact.type === "video") && Boolean(node?.id);

  return (
    <>
      <div style={overlayStyle} onClick={onClose} />
      <aside style={drawerStyle} aria-label="Artifact details">
        <button type="button" onClick={onClose} style={closeButtonStyle}>
          ×
        </button>
        <div style={titleStyle}>{artifact.title ?? "Untitled"}</div>
        {canInspect ? (
          <button type="button" style={inspectButtonStyle} onClick={onInspect}>
            Inspect
          </button>
        ) : null}
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
                style={{
                  borderRadius: "var(--radius-lg)",
                  border: "2px solid var(--color-black)",
                }}
              />
            ) : null}
            {!artifact.youtubeId && artifact.mp4 ? (
              <video
                controls
                src={artifact.mp4}
                style={{
                  width: "100%",
                  borderRadius: "var(--radius-lg)",
                  border: "2px solid var(--color-black)",
                }}
              />
            ) : null}
          </div>
        ) : null}
        {canEditFrame ? (
          <section>
            <div style={sectionTitleStyle}>Frame</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label style={controlLabelStyle}>
                Variant
                <select
                  style={controlSelectStyle}
                  value={effectiveFrame.variant ?? "none"}
                  onChange={(event) => {
                    const variant = event.target.value;
                    const mat = variant === "floatMount" ? 16 : 0;
                    onUpdateFrameOverride?.(node?.id, { variant, mat });
                  }}
                >
                  <option value="none">None</option>
                  <option value="thinBlack">Thin Black</option>
                  <option value="floatMount">Float Mount</option>
                </select>
              </label>
              <label style={controlLabelStyle}>
                Mat size
                <select
                  style={controlSelectStyle}
                  value={effectiveMat}
                  disabled={effectiveFrame.variant !== "floatMount"}
                  onChange={(event) =>
                    onUpdateFrameOverride?.(node?.id, {
                      variant: "floatMount",
                      mat: Number(event.target.value),
                    })
                  }
                >
                  <option value={0}>0</option>
                  <option value={8}>8</option>
                  <option value={16}>16</option>
                  <option value={24}>24</option>
                </select>
              </label>
              <button
                type="button"
                style={controlButtonStyle}
                onClick={() => onUpdateFrameOverride?.(node?.id, null)}
                disabled={!nodeFrameOverride}
              >
                Clear Override
              </button>
            </div>
          </section>
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
