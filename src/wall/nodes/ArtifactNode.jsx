export default function ArtifactNode({ data, artifactsById }) {
  const artifactId = data?.artifactId ?? "unknown";
  const artifact = artifactsById?.get(String(artifactId));

  return (
    <div
      style={{
        minWidth: 160,
        padding: "12px 14px",
        borderRadius: 12,
        background: "rgba(30, 30, 36, 0.9)",
        color: "#f5f5f5",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 12px 30px rgba(0, 0, 0, 0.25)",
        fontSize: 12,
      }}
    >
      <div style={{ fontSize: 10, letterSpacing: 1, opacity: 0.6 }}>
        ARTIFACT
      </div>
      <div style={{ marginTop: 6, fontWeight: 600 }}>{String(artifactId)}</div>
      {artifact?.title ? (
        <div style={{ marginTop: 4, opacity: 0.7 }}>{artifact.title}</div>
      ) : null}
    </div>
  );
}
