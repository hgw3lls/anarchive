import { useMemo, useState } from "react";
import Wall from "./wall/Wall.jsx";

const sidebarSections = [
  {
    title: "Boards",
    count: 5,
    tags: ["Sequence", "Threshold", "Witness"],
  },
  {
    title: "Artifacts",
    count: 128,
    tags: ["Image", "Text", "Video"],
  },
  {
    title: "Edges",
    count: 312,
    tags: ["Echoes", "Samples"],
  },
];

export default function App() {
  const [debugGrid, setDebugGrid] = useState(false);
  const isDev = import.meta.env.DEV;
  const debugToggle = useMemo(() => (isDev ? debugGrid : false), [debugGrid, isDev]);

  return (
    <div className="app-frame" data-debug={debugToggle ? "true" : "false"}>
      <header className="app-masthead">
        <div className="app-masthead__title">
          <span className="app-masthead__label">Anarchive</span>
          <span className="app-masthead__sub">Brutalist Wall</span>
        </div>
        <nav className="app-masthead__nav">
          <button type="button" className="app-masthead__chip">
            Archive
          </button>
          <button type="button" className="app-masthead__chip">
            Studio
          </button>
          <button type="button" className="app-masthead__chip">
            Timeline
          </button>
        </nav>
        <div className="app-masthead__status">
          <span className="app-masthead__pill">Sync: Live</span>
          <span className="app-masthead__pill">Nodes: 128</span>
          {isDev ? (
            <button
              type="button"
              className="app-masthead__pill app-masthead__pill--toggle"
              onClick={() => setDebugGrid((current) => !current)}
            >
              Debug Grid: {debugGrid ? "On" : "Off"}
            </button>
          ) : null}
        </div>
      </header>
      <div className="app-body">
        <aside className="app-sidebar" aria-label="Index column">
          <div className="app-sidebar__heading">Index</div>
          {sidebarSections.map((section) => (
            <div key={section.title} className="app-sidebar__section">
              <div className="app-sidebar__row">
                <span className="app-sidebar__title">{section.title}</span>
                <span className="app-sidebar__count">{section.count}</span>
              </div>
              <div className="app-sidebar__tags">
                {section.tags.map((tag) => (
                  <span key={tag} className="app-sidebar__tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </aside>
        <main className="app-main">
          <Wall />
        </main>
      </div>
    </div>
  );
}
