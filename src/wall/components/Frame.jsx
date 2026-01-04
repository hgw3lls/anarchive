const captionStyle = {
  fontSize: 11,
  color: "rgba(40, 40, 40, 0.7)",
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
  border: "1px solid #111",
  background: "#0d0d0d",
  borderRadius: 6,
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.18)",
  padding: 1,
  display: "inline-flex",
  width: "100%",
  boxSizing: "border-box",
};

const floatMountFrameStyle = {
  background: "#f5f2ea",
  borderRadius: 8,
  boxShadow: "0 10px 24px rgba(0, 0, 0, 0.18)",
  display: "inline-flex",
  width: "100%",
  boxSizing: "border-box",
};

const floatInnerStyle = {
  background: "#fffdfa",
  borderRadius: 4,
  boxShadow: "0 3px 10px rgba(0, 0, 0, 0.2)",
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
