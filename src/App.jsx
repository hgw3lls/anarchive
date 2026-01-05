import { useEffect, useMemo, useRef, useState } from "react";
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

const recentItems = [
  { title: "Threshold Studies", updated: "2h ago" },
  { title: "Signal Archive", updated: "Yesterday" },
  { title: "Echoes 1994", updated: "Apr 02" },
];

export default function App() {
  const [debugGrid, setDebugGrid] = useState(false);
  const [isIndexOpen, setIsIndexOpen] = useState(true);
  const searchRef = useRef(null);

  const isDev = import.meta.env.DEV;
  const debugToggle = useMemo(() => (isDev ? debugGrid : false), [debugGrid, isDev]);

  const totalCount = useMemo(
    () => sidebarSections.reduce((sum, section) => sum + section.count, 0),
    [],
  );

  const routeLabel = "Wall";
  const lastUpdated = "5 min ago";

  useEffect(() => {
    const handleKey = (event) => {
      if (event.defaultPrevented) {
        return;
      }

      const isTypingTarget =
        event.target instanceof HTMLElement &&
        ["INPUT", "TEXTAREA"].includes(event.target.tagName);

      if (event.key === "/" && !isTypingTarget) {
        event.preventDefault();
        setIsIndexOpen(true);
        searchRef.current?.focus();
      }

      if (event.key?.toLowerCase() === "i" && !isTypingTarget) {
        event.preventDefault();
        setIsIndexOpen((current) => !current);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="app-frame" data-debug={debugToggle ? "true" : "false"}>
      <header className="app-masthead">
        <div className="app-masthead__title">
          <span className="app-masthead__label">Anarchive</span>
          <span className="app-masthead__sub">Brutalist Wall</span>
        </div>

        <div className="app-masthead__crumbs" aria-label="Breadcrumb">
          <span className="app-masthead__crumb ui-chip">Archive</span>
          <span className="app-masthead__crumb-sep">▣</span>
          <span className="app-masthead__crumb ui-chip">Index</span>
          <span className="app-masthead__crumb-sep">▣</span>
          <span className="app-masthead__crumb app-masthead__crumb--active ui-chip">
            {routeLabel}
          </span>
        </div>

        <nav className="app-masthead__nav">
          <button type="button" className="app-masthead__chip ui-button">
            Archive
          </button>
          <button type="button" className="app-masthead__chip ui-button">
            Studio
          </button>
          <button type="button" className="app-masthead__chip ui-button">
            Timeline
          </button>
        </nav>

        <div className="app-masthead__status">
          <span className="app-masthead__pill ui-chip">You are here: {routeLabel}</span>
          <span className="app-masthead__pill ui-chip">Last updated: {lastUpdated}</span>
          <span className="app-masthead__pill ui-chip">Items: {totalCount}</span>

          {isDev ? (
            <button
              type="button"
              className="app-masthead__pill app-masthead__pill--toggle ui-button"
              onClick={() => setDebugGrid((current) => !current)}
            >
              Debug Grid: {debugGrid ? "On" : "Off"}
            </button>
          ) : null}
        </div>
      </header>

      <div
        className="app-body"
        style={{
          gridTemplateColumns: isIndexOpen ? "minmax(220px, 260px) 1fr" : "72px 1fr",
        }}
      >
        <aside
          className="app-sidebar"
          data-open={isIndexOpen ? "true" : "false"}
          aria-label="Index panel"
        >
          <div className="app-sidebar__header">
            <div className="app-sidebar__heading">Index</div>
            <button
              type="button"
              className="app-sidebar__toggle ui-button"
              onClick={() => setIsIndexOpen((current) => !current)}
            >
              {isIndexOpen ? "Collapse" : "Expand"}
            </button>
          </div>

          <label className="app-sidebar__search">
            <span>Search</span>
            <input
              ref={searchRef}
              type="search"
              placeholder="Search index..."
              className="app-sidebar__input ui-input"
            />
          </label>

          <div className="app-sidebar__section ui-card ui-card--tape">
            <div className="app-sidebar__section-title">Major Sections</div>
            {sidebarSections.map((section) => (
              <div key={section.title} className="app-sidebar__row">
                <span className="app-sidebar__title">{section.title}</span>
                <span className="app-sidebar__count">{section.count}</span>
              </div>
            ))}
          </div>

          <div className="app-sidebar__section ui-card ui-card--tape">
            <div className="app-sidebar__section-title">Recent</div>
            {recentItems.map((item) => (
              <div key={item.title} className="app-sidebar__recent">
                <span className="app-sidebar__title">{item.title}</span>
                <span className="app-sidebar__meta">{item.updated}</span>
              </div>
            ))}
          </div>

          <div className="app-sidebar__tags">
            {sidebarSections.flatMap((section) =>
              section.tags.map((tag) => (
                <span
                  key={`${section.title}-${tag}`}
                  className="app-sidebar__tag ui-chip"
                >
                  {tag}
                </span>
              )),
            )}
          </div>

          <div className="app-sidebar__hint">
            Press <span>/</span> to search · Press <span>I</span> to toggle index
          </div>
        </aside>

        <main className="app-main">
          <Wall />
        </main>
      </div>
    </div>
  );
}
