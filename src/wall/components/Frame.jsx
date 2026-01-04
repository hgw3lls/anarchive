const captionStyle = {
  fontSize: 11,
  color: "var(--color-text-muted)",
  letterSpacing: 0.2,
  lineHeight: 1.4,
  pointerEvents: "none",
};

const containerBaseStyle = {
  display: "inline-flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: 6,
  width: "100%",
};

const thinBlackFrameStyle = {
  border: "2px solid var(--color-black)",
  background: "var(--color-black)",
  borderRadius: "var(--radius-sm)",
  boxShadow: "var(--shadow-hard-sm)",
  padding: 1,
  display: "inline-flex",
  width: "100%",
  boxSizing: "border-box",
};

const floatMountFrameStyle = {
  background: "var(--color-offwhite-alt)",
  borderRadius: "var(--radius-md)",
  border: "2px solid var(--color-black)",
  boxShadow: "var(--shadow-hard)",
  display: "inline-flex",
  width: "100%",
  boxSizing: "border-box",
};

const floatInnerStyle = {
  background: "var(--color-white)",
  borderRadius: "var(--radius-sm)",
  border: "2px solid var(--color-black)",
  boxShadow: "var(--shadow-hard-sm)",
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
