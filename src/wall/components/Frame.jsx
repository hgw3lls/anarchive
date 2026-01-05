const captionStyle = {
  fontSize: "var(--fs-xs)",
  color: "var(--text-muted)",
  letterSpacing: "0.02em",
  lineHeight: 1.4,
  pointerEvents: "none",
};

const containerBaseStyle = {
  display: "inline-flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "var(--space-2)",
  width: "100%",
};

const thinBlackFrameStyle = {
  border: "var(--border-2) solid var(--border)",
  background: "var(--border)",
  borderRadius: "var(--radius-1)",
  boxShadow: "var(--shadow-2)",
  padding: 1,
  display: "inline-flex",
  width: "100%",
  boxSizing: "border-box",
};

const floatMountFrameStyle = {
  background: "var(--surface-muted)",
  borderRadius: "var(--radius-2)",
  border: "var(--border-2) solid var(--border)",
  boxShadow: "var(--shadow-2)",
  display: "inline-flex",
  width: "100%",
  boxSizing: "border-box",
};

const floatInnerStyle = {
  background: "var(--surface)",
  borderRadius: "var(--radius-1)",
  border: "var(--border-2) solid var(--border)",
  boxShadow: "var(--shadow-1)",
  display: "inline-flex",
  width: "100%",
  boxSizing: "border-box",
};

export default function Frame({
  variant = "none",
  mat = 0,
  caption,
  showCaption = false,
  children,
}) {
  const resolvedMat =
    variant === "floatMount"
      ? Number.isFinite(mat)
        ? mat
        : 16
      : 0;
  const containerStyle = containerBaseStyle;

  if (variant === "thinBlack") {
    return (
      <div style={containerStyle}>
        <div style={thinBlackFrameStyle}>{children}</div>
        {showCaption && caption ? (
          <div style={captionStyle}>{caption}</div>
        ) : null}
      </div>
    );
  }

  if (variant === "floatMount") {
    return (
      <div style={containerStyle}>
        <div style={{ ...floatMountFrameStyle, padding: resolvedMat }}>
          <div style={floatInnerStyle}>{children}</div>
        </div>
        {showCaption && caption ? (
          <div style={captionStyle}>{caption}</div>
        ) : null}
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {children}
      {showCaption && caption ? <div style={captionStyle}>{caption}</div> : null}
    </div>
  );
}
