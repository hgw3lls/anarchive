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
<<<<<<< ours
<<<<<<< ours
  borderLeft: "2px solid var(--color-black)",
  boxShadow: "var(--shadow-hard)",
  padding: "24px 20px",
=======
  borderLeft: "var(--border-strong)",
  boxShadow: "var(--shadow-hard)",
  padding: "var(--space-5) var(--space-4)",
>>>>>>> theirs
=======
  borderLeft: "var(--border-strong)",
  boxShadow: "var(--shadow-hard)",
  padding: "var(--space-5) var(--space-4)",
>>>>>>> theirs
  overflowY: "auto",
  zIndex: 30,
};

const closeButtonStyle = {
  position: "absolute",
  top: 16,
  right: 16,
  background: "var(--color-white)",
  color: "var(--color-black)",
<<<<<<< ours
<<<<<<< ours
  border: "2px solid var(--color-black)",
=======
  border: "var(--border-strong)",
>>>>>>> theirs
=======
  border: "var(--border-strong)",
>>>>>>> theirs
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
  fontSize: "var(--font-size-xl)",
  fontWeight: 600,
  marginBottom: "var(--space-3)",
  paddingRight: 48,
};

const tagListStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "var(--space-2)",
  marginBottom: "var(--space-4)",
};

const tagStyle = {
<<<<<<< ours
<<<<<<< ours
  padding: "4px 10px",
  borderRadius: "var(--radius-pill)",
  background: "var(--color-offwhite-alt)",
  border: "2px solid var(--color-black)",
  color: "var(--color-text)",
  fontWeight: 600,
  fontSize: 12,
=======
=======
>>>>>>> theirs
  padding: "2px 10px",
  borderRadius: "var(--radius-pill)",
  background: "var(--color-offwhite-alt)",
  border: "var(--border-strong)",
  color: "var(--color-text)",
  fontWeight: 600,
  fontSize: "var(--font-size-sm)",
<<<<<<< ours
>>>>>>> theirs
=======
>>>>>>> theirs
};

const sectionTitleStyle = {
  fontSize: "var(--font-size-sm)",
  letterSpacing: 0.12,
  textTransform: "uppercase",
  color: "var(--color-text-muted)",
<<<<<<< ours
<<<<<<< ours
  marginTop: 20,
  marginBottom: 8,
=======
  marginTop: "var(--space-5)",
  marginBottom: "var(--space-2)",
>>>>>>> theirs
=======
  marginTop: "var(--space-5)",
  marginBottom: "var(--space-2)",
>>>>>>> theirs
};

const imageStyle = {
  width: "100%",
  borderRadius: "var(--radius-lg)",
  background: "var(--color-surface-muted)",
<<<<<<< ours
<<<<<<< ours
  border: "2px solid var(--color-black)",
=======
  border: "var(--border-strong)",
>>>>>>> theirs
=======
  border: "var(--border-strong)",
>>>>>>> theirs
};

const relatedListStyle = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "grid",
  gap: "var(--space-2)",
};

const relatedButtonStyle = {
  width: "100%",
  textAlign: "left",
  background: "var(--color-white)",
<<<<<<< ours
<<<<<<< ours
  border: "2px solid var(--color-black)",
  borderRadius: "var(--radius-md)",
  padding: "10px 12px",
  color: "var(--color-black)",
  cursor: "pointer",
  fontSize: 13,
=======
  border: "var(--border-strong)",
  borderRadius: "var(--radius-md)",
  padding: "var(--space-3)",
  color: "var(--color-black)",
  cursor: "pointer",
  fontSize: "var(--font-size-md)",
>>>>>>> theirs
=======
  border: "var(--border-strong)",
  borderRadius: "var(--radius-md)",
  padding: "var(--space-3)",
  color: "var(--color-black)",
  cursor: "pointer",
  fontSize: "var(--font-size-md)",
>>>>>>> theirs
  boxShadow: "var(--shadow-hard-sm)",
};

const markdownStyle = {
  lineHeight: 1.6,
};

const controlLabelStyle = {
<<<<<<< ours
<<<<<<< ours
  fontSize: 12,
=======
  fontSize: "var(--font-size-sm)",
>>>>>>> theirs
=======
  fontSize: "var(--font-size-sm)",
>>>>>>> theirs
  color: "var(--color-text)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-2)",
};

const controlSelectStyle = {
  width: "100%",
<<<<<<< ours
<<<<<<< ours
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
=======
  padding: "var(--space-2) var(--space-3)",
  borderRadius: "var(--radius-md)",
  border: "var(--border-strong)",
  background: "var(--color-white)",
  color: "var(--color-black)",
  fontSize: "var(--font-size-sm)",
};

const controlButtonStyle = {
=======
  padding: "var(--space-2) var(--space-3)",
  borderRadius: "var(--radius-md)",
  border: "var(--border-strong)",
  background: "var(--color-white)",
  color: "var(--color-black)",
  fontSize: "var(--font-size-sm)",
};

const controlButtonStyle = {
>>>>>>> theirs
  border: "var(--border-strong)",
  borderRadius: "var(--radius-md)",
  background: "var(--color-white)",
  color: "var(--color-black)",
  fontSize: "var(--font-size-sm)",
  padding: "var(--space-2) var(--space-3)",
<<<<<<< ours
>>>>>>> theirs
=======
>>>>>>> theirs
  cursor: "pointer",
  boxShadow: "var(--shadow-hard-sm)",
};

const inspectButtonStyle = {
<<<<<<< ours
<<<<<<< ours
  border: "2px solid var(--color-black)",
  borderRadius: "var(--radius-pill)",
  background: "var(--color-accent)",
  color: "var(--color-black)",
  fontSize: 11,
  padding: "6px 12px",
=======
=======
>>>>>>> theirs
  border: "var(--border-strong)",
  borderRadius: "var(--radius-pill)",
  background: "var(--color-accent)",
  color: "var(--color-black)",
  fontSize: "var(--font-size-xs)",
  padding: "var(--space-2) var(--space-3)",
<<<<<<< ours
>>>>>>> theirs
=======
>>>>>>> theirs
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
<<<<<<< ours
<<<<<<< ours
                  border: "2px solid var(--color-black)",
=======
                  border: "var(--border-strong)",
>>>>>>> theirs
=======
                  border: "var(--border-strong)",
>>>>>>> theirs
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
<<<<<<< ours
<<<<<<< ours
                  border: "2px solid var(--color-black)",
=======
                  border: "var(--border-strong)",
>>>>>>> theirs
=======
                  border: "var(--border-strong)",
>>>>>>> theirs
                }}
              />
            ) : null}
          </div>
        ) : null}
        {canEditFrame ? (
          <section>
            <div style={sectionTitleStyle}>Frame</div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-3)",
              }}
            >
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
