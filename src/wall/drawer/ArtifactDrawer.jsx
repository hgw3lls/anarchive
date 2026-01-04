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

const controlLabelStyle = {
  fontSize: 12,
  opacity: 0.8,
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const controlSelectStyle = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 10,
  border: "1px solid rgba(255, 255, 255, 0.16)",
  background: "rgba(18, 18, 24, 0.8)",
  color: "#f5f5f5",
  fontSize: 12,
};

const controlButtonStyle = {
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: 10,
  background: "rgba(18, 18, 24, 0.9)",
  color: "#f5f5f5",
  fontSize: 12,
  padding: "8px 12px",
  cursor: "pointer",
};

const inspectButtonStyle = {
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: 999,
  background: "rgba(255, 255, 255, 0.08)",
  color: "#f5f5f5",
  fontSize: 11,
  padding: "6px 12px",
  cursor: "pointer",
  alignSelf: "flex-start",
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
