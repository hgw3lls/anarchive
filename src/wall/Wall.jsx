const wallStyle = {
  width: "100vw",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#0f0f12",
  color: "#f5f5f5",
  fontFamily:
    "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
};

export default function Wall() {
  // TODO: Replace with React Flow canvas and wall UI.
  return (
    <section style={wallStyle}>
      <div style={{ maxWidth: 560, padding: 24 }}>
        <h1 style={{ margin: 0, fontSize: 28, lineHeight: 1.1 }}>Anarchive</h1>
        <p style={{ marginTop: 12, marginBottom: 0, opacity: 0.85 }}>
          Placeholder wall shell. Next: infinite canvas (React Flow), artifact nodes
          (riso prints, poems, video thumbs), and a detail drawer.
        </p>
      </div>
    </section>
  );
}
