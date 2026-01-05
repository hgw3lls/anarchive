import { marked } from "marked";

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "var(--overlay)",
  zIndex: "var(--z-overlay)",
};

const drawerStyle = {
  position: "fixed",
  top: 0,
  right: 0,
  height: "100vh",
  width: "min(420px, 92vw)",
  background: "var(--surface)",
  color: "var(--text)",
  borderLeft: "var(--border-2) solid var(--border)",
  boxShadow: "var(--shadow-2)",
  padding: "var(--space-6) var(--space-5)",
  overflowY: "auto",
  zIndex: "var(--z-modal)",
};

const closeButtonStyle = {
  position: "absolute",
  top: "var(--space-4)",
  right: "var(--space-4)",
  background: "var(--surface)",
  color: "var(--text)",
  border: "var(--border-2) solid var(--border)",
  borderRadius: "var(--radius-pill)",
  width: "var(--space-7)",
  height: "var(--space-7)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: "var(--fs-lg)",
  boxShadow: "var(--shadow-1)",
};

const titleStyle = {
  fontSize: "var(--fs-xl)",
  fontWeight: 600,
  marginBottom: "var(--space-3)",
  paddingRight: "calc(var(--space-8) + var(--space-2))",
};

const tagListStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "var(--space-2)",
  marginBottom: "var(--space-4)",
};

const tagStyle = {
  padding: "var(--space-1) var(--space-3)",
  borderRadius: "var(--radius-pill)",
  background: "var(--accent)",
  color: "var(--text-inverse)",
  fontSize: "var(--fs-sm)",
};

const sectionTitleStyle = {
  fontSize: "var(--fs-sm)",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "var(--text-muted)",
  marginTop: "var(--space-5)",
  marginBottom: "var(--space-2)",
};

const imageStyle = {
  width: "100%",
  borderRadius: "var(--radius-2)",
  border: "var(--border-2) solid var(--border)",
  background: "var(--surface-muted)",
  boxShadow: "var(--shadow-1)",
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
  background: "var(--surface)",
  border: "var(--border-2) solid var(--border)",
  borderRadius: "var(--radius-1)",
  padding: "var(--space-2) var(--space-3)",
  color: "var(--text)",
  cursor: "pointer",
  fontSize: "var(--fs-md)",
  boxShadow: "var(--shadow-1)",
};

const markdownStyle = {
  lineHeight: 1.6,
};

const controlLabelStyle = {
  fontSize: "var(--fs-sm)",
  color: "var(--text-muted)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-2)",
};

const controlSelectStyle = {
  width: "100%",
  padding: "var(--space-2) var(--space-3)",
  borderRadius: "var(--radius-1)",
  border: "var(--border-2) solid var(--border)",
  background: "var(--surface)",
  color: "var(--text)",
  fontSize: "var(--fs-sm)",
  boxShadow: "var(--shadow-1)",
};

const controlButtonStyle = {
  border: "var(--border-2) solid var(--border)",
  borderRadius: "var(--radius-1)",
  background: "var(--surface)",
  color: "var(--text)",
  fontSize: "var(--fs-sm)",
  padding: "var(--space-2) var(--space-3)",
  cursor: "pointer",
  boxShadow: "var(--shadow-1)",
};

const inspectButtonStyle = {
  border: "var(--border-2) solid var(--border)",
  borderRadius: "var(--radius-pill)",
  background: "var(--accent)",
  color: "var(--text-inverse)",
  fontSize: "var(--fs-xs)",
  padding: "var(--space-2) var(--space-3)",
  cursor: "pointer",
  alignSelf: "flex-start",
  boxShadow: "var(--shadow-1)",
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
                  borderRadius: "var(--radius-2)",
                  border: "var(--border-2) solid var(--border)",
                  boxShadow: "var(--shadow-1)",
                }}
              />
            ) : null}
            {!artifact.youtubeId && artifact.mp4 ? (
              <video
                controls
                src={artifact.mp4}
                style={{
                  width: "100%",
                  borderRadius: "var(--radius-2)",
                  border: "var(--border-2) solid var(--border)",
                  boxShadow: "var(--shadow-1)",
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
