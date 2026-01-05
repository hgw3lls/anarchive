<<<<<<< ours
import { useMemo, useState } from "react";
=======
import { useEffect, useMemo, useRef, useState } from "react";
>>>>>>> theirs
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

<<<<<<< ours
export default function App() {
  const [debugGrid, setDebugGrid] = useState(false);
  const isDev = import.meta.env.DEV;
  const debugToggle = useMemo(() => (isDev ? debugGrid : false), [debugGrid, isDev]);
=======
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
>>>>>>> theirs

  return (
    <div className="app-frame" data-debug={debugToggle ? "true" : "false"}>
      <header className="app-masthead">
        <div className="app-masthead__title">
          <span className="app-masthead__label">Anarchive</span>
          <span className="app-masthead__sub">Brutalist Wall</span>
        </div>
<<<<<<< ours
=======
        <div className="app-masthead__crumbs" aria-label="Breadcrumb">
          <span className="app-masthead__crumb">Archive</span>
          <span className="app-masthead__crumb-sep">▣</span>
          <span className="app-masthead__crumb">Index</span>
          <span className="app-masthead__crumb-sep">▣</span>
          <span className="app-masthead__crumb app-masthead__crumb--active">
            {routeLabel}
          </span>
        </div>
>>>>>>> theirs
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
<<<<<<< ours
          <span className="app-masthead__pill">Sync: Live</span>
          <span className="app-masthead__pill">Nodes: 128</span>
=======
          <span className="app-masthead__pill">You are here: {routeLabel}</span>
          <span className="app-masthead__pill">Last updated: {lastUpdated}</span>
          <span className="app-masthead__pill">Items: {totalCount}</span>
>>>>>>> theirs
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
<<<<<<< ours
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
=======
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
              className="app-sidebar__toggle"
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
              className="app-sidebar__input"
            />
          </label>
          <div className="app-sidebar__section">
            <div className="app-sidebar__section-title">Major Sections</div>
            {sidebarSections.map((section) => (
              <div key={section.title} className="app-sidebar__row">
                <span className="app-sidebar__title">{section.title}</span>
                <span className="app-sidebar__count">{section.count}</span>
              </div>
            ))}
          </div>
          <div className="app-sidebar__section">
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
                <span key={`${section.title}-${tag}`} className="app-sidebar__tag">
                  {tag}
                </span>
              )),
            )}
          </div>
          <div className="app-sidebar__hint">
            Press <span>/</span> to search · Press <span>I</span> to toggle index
          </div>
>>>>>>> theirs
        </aside>
        <main className="app-main">
          <Wall />
        </main>
      </div>
    </div>
  );
}
