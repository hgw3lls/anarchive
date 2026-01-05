import { useState } from "react";
import Wall from "./wall/Wall.jsx";

const navItems = ["Archive", "Studio", "Timeline"];

export default function App() {
  const [activeView, setActiveView] = useState("Archive");
  const [noiseEnabled] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }
    const params = new URLSearchParams(window.location.search);
    return params.get("noise") !== "off";
  });
  return (
    <div
      className="app-frame"
      data-debug="false"
      data-scanlines="false"
      data-noise={noiseEnabled ? "on" : "off"}
    >
      <header className="app-masthead">
        <div className="app-masthead__title">
          <span className="app-masthead__label">Anarchive</span>
          <span className="app-masthead__sub">Brutalist Wall</span>
        </div>
        <nav className="app-masthead__nav">
          {navItems.map((item) => (
            <button
              key={item}
              type="button"
              className="app-masthead__chip ui-button"
              onClick={() => setActiveView(item)}
              aria-current={activeView === item ? "page" : undefined}
            >
              {item}
            </button>
          ))}
        </nav>
      </header>
      <div className="app-body">
        <main className="app-main">
          <Wall />
        </main>
      </div>
    </div>
  );
}
