import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactFlow, {
  Background,
  ControlButton,
  Controls,
  MiniMap,
  applyEdgeChanges,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import ArtifactDrawer from "./drawer/ArtifactDrawer.jsx";
import YarnEdge from "./edges/YarnEdge.jsx";
import ArtifactNode from "./nodes/ArtifactNode.jsx";
import {
  buildBoardSnapshot,
  mapBoardEdgesToFlowEdges,
  mapBoardNodesToFlowNodes,
  normalizeBoard,
  readBoardFromStorage,
  removeStoredBoard,
  writeBoardToStorage,
} from "./utils/boardPersistence.js";
import { downloadJson, toBoardSchema } from "./utils/boardIO.js";

const wallStyle = {
  width: "100vw",
  height: "100vh",
  position: "relative",
  backgroundColor: "#0f0f12",
  color: "#f5f5f5",
  fontFamily:
    "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
};

const overlayStyle = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(15, 15, 18, 0.9)",
  color: "#f5f5f5",
  fontSize: 16,
  zIndex: 10,
};

const searchContainerStyle = {
  position: "absolute",
  top: 16,
  left: 16,
  width: 260,
  zIndex: 12,
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const searchInputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid rgba(255, 255, 255, 0.12)",
  background: "rgba(18, 18, 24, 0.92)",
  color: "#f5f5f5",
  fontSize: 13,
};

const searchResultsStyle = {
  listStyle: "none",
  margin: 0,
  padding: 0,
  borderRadius: 10,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background: "rgba(18, 18, 24, 0.96)",
  overflow: "hidden",
};

const searchResultButtonStyle = {
  width: "100%",
  textAlign: "left",
  padding: "10px 12px",
  border: "none",
  background: "transparent",
  color: "#f5f5f5",
  fontSize: 12,
  cursor: "pointer",
};

const toolbarStyle = {
  position: "absolute",
  top: 16,
  right: 16,
  zIndex: 13,
  display: "flex",
  flexDirection: "column",
  gap: 10,
  minWidth: 220,
  padding: 12,
  borderRadius: 12,
  border: "1px solid rgba(255, 255, 255, 0.1)",
  background: "rgba(18, 18, 24, 0.92)",
  boxShadow: "0 12px 28px rgba(0, 0, 0, 0.35)",
};

const toolbarButtonStyle = {
  border: "1px solid rgba(255, 255, 255, 0.18)",
  borderRadius: 10,
  background: "rgba(18, 18, 24, 0.9)",
  color: "#f5f5f5",
  fontSize: 12,
  padding: "8px 12px",
  cursor: "pointer",
};

const toolbarSelectStyle = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 10,
  border: "1px solid rgba(255, 255, 255, 0.18)",
  background: "rgba(18, 18, 24, 0.9)",
  color: "#f5f5f5",
  fontSize: 12,
};

const toolbarInputStyle = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 10,
  border: "1px solid rgba(255, 255, 255, 0.18)",
  background: "rgba(18, 18, 24, 0.9)",
  color: "#f5f5f5",
  fontSize: 12,
};

const toolbarHintStyle = {
  fontSize: 11,
  opacity: 0.7,
};

const legendListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const legendRowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: 12,
  color: "rgba(245, 245, 245, 0.85)",
};

const legendActionsStyle = {
  display: "flex",
  gap: 8,
};

const lockedFlowStyle = {
  transition: "filter 0.2s ease",
  filter: "grayscale(0.35) brightness(0.85)",
};

const ALL_KINDS = ["sequence", "echoes", "threshold", "samples", "witness"];

const fitViewOptions = { padding: 0.2 };

export default function Wall() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [allEdges, setAllEdges] = useEdgesState([]);
  const [artifacts, setArtifacts] = useState([]);
  const [camera, setCamera] = useState(null);
  const [defaultBoard, setDefaultBoard] = useState(null);
  const [boardIndex, setBoardIndex] = useState(null);
  const [currentBoardId, setCurrentBoardId] = useState(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [error, setError] = useState(null);
  const [selectedArtifactId, setSelectedArtifactId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isArrangeMode, setIsArrangeMode] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [enabledKinds, setEnabledKinds] = useState(new Set(ALL_KINDS));
  const [editionTitle, setEditionTitle] = useState("");
  const [editionTags, setEditionTags] = useState("");
  const [editionIdInput, setEditionIdInput] = useState("");
  const [publishNotice, setPublishNotice] = useState("");
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(allEdges);
  const cameraRef = useRef(camera);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    edgesRef.current = allEdges;
  }, [allEdges]);

  useEffect(() => {
    cameraRef.current = camera;
  }, [camera]);

  const artifactsById = useMemo(() => {
    const map = new Map();
    artifacts.forEach((artifact) => {
      if (artifact?.id !== undefined && artifact?.id !== null) {
        map.set(String(artifact.id), artifact);
      }
    });
    return map;
  }, [artifacts]);

  const nodeTypes = useMemo(
    () => ({
      artifact: ArtifactNode,
    }),
    [],
  );
  const edgeTypes = useMemo(
    () => ({
      yarn: YarnEdge,
    }),
    [],
  );
  const baseUrl = import.meta.env.BASE_URL ?? "/";

  const resolveBoardFilePath = useCallback(
    (filePath) => {
      if (!filePath) {
        return null;
      }
      const trimmed = filePath.startsWith("/")
        ? filePath.slice(1)
        : filePath;
      return `${baseUrl}${trimmed}`;
    },
    [baseUrl],
  );

  const boardEntries = useMemo(
    () => (Array.isArray(boardIndex?.boards) ? boardIndex.boards : []),
    [boardIndex],
  );

  const currentBoardEntry = useMemo(() => {
    if (!currentBoardId) {
      return null;
    }
    return boardEntries.find((entry) => entry.id === currentBoardId) ?? null;
  }, [boardEntries, currentBoardId]);

  const currentBoardTitle =
    currentBoardEntry?.title ?? currentBoardId ?? "Board";

  const visibleEdges = useMemo(() => {
    return allEdges.filter((edge) => {
      const kind = edge?.data?.kind ?? "sequence";
      return enabledKinds.has(kind);
    });
  }, [allEdges, enabledKinds]);

  const selectedArtifact = useMemo(() => {
    if (!selectedArtifactId) {
      return null;
    }
    return artifactsById.get(String(selectedArtifactId)) ?? null;
  }, [artifactsById, selectedArtifactId]);

  const selectedNodeId = useMemo(() => {
    if (!selectedArtifactId) {
      return null;
    }
    const match = nodes.find(
      (node) => String(node?.data?.artifactId) === String(selectedArtifactId),
    );
    return match?.id ?? null;
  }, [nodes, selectedArtifactId]);

  const searchResults = useMemo(() => {
    const trimmed = searchTerm.trim().toLowerCase();
    if (!trimmed) {
      return [];
    }
    return artifacts
      .map((artifact) => {
        if (!artifact?.id) {
          return null;
        }
        const title = artifact.title ?? String(artifact.id);
        const tags = Array.isArray(artifact.tags)
          ? artifact.tags
          : artifact.tags
            ? [artifact.tags]
            : [];
        const searchTarget = [title, ...tags]
          .map((value) => String(value ?? ""))
          .join(" ")
          .toLowerCase();
        if (!searchTarget.includes(trimmed)) {
          return null;
        }
        return {
          id: String(artifact.id),
          title,
          tags,
        };
      })
      .filter(Boolean);
  }, [artifacts, searchTerm]);

  const relatedArtifacts = useMemo(() => {
    if (!selectedNodeId) {
      return [];
    }
    const relatedIds = new Map();
    visibleEdges.forEach((edge) => {
      if (edge.source === selectedNodeId) {
        relatedIds.set(edge.target, true);
      }
      if (edge.target === selectedNodeId) {
        relatedIds.set(edge.source, true);
      }
    });
    const results = [];
    relatedIds.forEach((_, nodeId) => {
      const relatedNode = nodes.find((node) => node.id === nodeId);
      const artifactId = relatedNode?.data?.artifactId;
      if (!artifactId) {
        return;
      }
      const relatedArtifact = artifactsById.get(String(artifactId));
      if (relatedArtifact) {
        results.push({
          id: String(artifactId),
          title: relatedArtifact.title ?? String(artifactId),
        });
      }
    });
    return results;
  }, [artifactsById, nodes, selectedNodeId, visibleEdges]);

  const centerOnNode = (node) => {
    if (!reactFlowInstance || !node) {
      return;
    }
    const position = node.positionAbsolute ?? node.position ?? { x: 0, y: 0 };
    const width = node.width ?? 0;
    const height = node.height ?? 0;
    const currentZoom = reactFlowInstance.getZoom?.() ?? camera?.zoom ?? 1;
    const zoom = Math.max(currentZoom, 1.4);
    reactFlowInstance.setCenter(
      position.x + width / 2,
      position.y + height / 2,
      { zoom },
    );
  };

  useEffect(() => {
    if (!artifactsById.size) {
      return;
    }
    setNodes((currentNodes) =>
      currentNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          artifactsById,
        },
      })),
    );
  }, [artifactsById, setNodes]);

  const getCurrentCamera = useCallback(() => {
    return (
      cameraRef.current ??
      reactFlowInstance?.getViewport?.() ?? { x: 0, y: 0, zoom: 1 }
    );
  }, [reactFlowInstance]);

  const saveBoardSnapshot = useCallback(
    (overrideCamera) => {
      const snapshot = buildBoardSnapshot({
        nodes: nodesRef.current,
        edges: edgesRef.current,
        camera: overrideCamera ?? getCurrentCamera(),
      });
      writeBoardToStorage(currentBoardId, snapshot);
      return snapshot;
    },
    [currentBoardId, getCurrentCamera],
  );

  const exportBoardSnapshot = useCallback(() => {
    const snapshot = toBoardSchema({
      nodes: nodesRef.current,
      edges: edgesRef.current,
      viewport: getCurrentCamera(),
    });
    const fileLabel = currentBoardId
      ? `anarchive-board-${currentBoardId}`
      : "anarchive-board";
    downloadJson(`${fileLabel}.json`, snapshot);
  }, [currentBoardId, getCurrentCamera]);

  const resetBoard = useCallback(() => {
    if (!defaultBoard) {
      return;
    }
    removeStoredBoard(currentBoardId);
    setNodes(mapBoardNodesToFlowNodes(defaultBoard.nodes, artifactsById));
    setAllEdges(mapBoardEdgesToFlowEdges(defaultBoard.edges));
    setCamera(defaultBoard.camera);
  }, [artifactsById, currentBoardId, defaultBoard, setAllEdges, setNodes]);

  const toSlug = useCallback((value) => {
    const base = String(value ?? "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
    return base || "edition";
  }, []);

  const buildEditionId = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    const baseSource = editionIdInput.trim()
      ? editionIdInput.trim()
      : `${editionTitle.trim() || "edition"}-${today}`;
    const base = toSlug(baseSource);
    const existingIds = new Set(boardEntries.map((entry) => entry.id));
    let attempt = 0;
    let candidate = base;
    while (attempt < 10) {
      const suffix = Math.random().toString(36).slice(2, 6);
      candidate = `${base}-${suffix}`;
      if (!existingIds.has(candidate)) {
        return candidate;
      }
      attempt += 1;
    }
    const fallback = `${base}-${Date.now()}`;
    return existingIds.has(fallback)
      ? `${fallback}-${Math.random().toString(36).slice(2, 4)}`
      : fallback;
  }, [boardEntries, editionIdInput, editionTitle, toSlug]);

  const buildEditionEntry = useCallback(
    (editionId) => {
      const today = new Date().toISOString().slice(0, 10);
      const tags = editionTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
      return {
        id: editionId,
        title: editionTitle.trim() || "Untitled Edition",
        file: `/data/boards/${editionId}.json`,
        created: today,
        updated: today,
        tags,
      };
    },
    [editionTags, editionTitle],
  );

  const copyToClipboard = useCallback(async (text) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
      return true;
    } catch (copyError) {
      console.warn("Unable to copy JSON to clipboard.", copyError);
      return false;
    }
  }, []);

  const handlePublish = useCallback(async () => {
    const editionId = buildEditionId();
    const boardPayload = toBoardSchema({
      nodes: nodesRef.current,
      edges: edgesRef.current,
      viewport: getCurrentCamera(),
    });
    const entry = buildEditionEntry(editionId);
    downloadJson(`${editionId}.json`, boardPayload);
    downloadJson("index.patch.json", entry);
    setPublishNotice(`Published ${entry.title}.`);
  }, [buildEditionEntry, buildEditionId, getCurrentCamera]);

  const handleCopyIndexEntry = useCallback(async () => {
    const editionId = buildEditionId();
    const entry = buildEditionEntry(editionId);
    const copied = await copyToClipboard(`${JSON.stringify(entry, null, 2)}\n`);
    setPublishNotice(copied ? "Index entry copied." : "Unable to copy entry.");
  }, [buildEditionEntry, buildEditionId, copyToClipboard]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (event.key.toLowerCase() === "a") {
        setIsArrangeMode((current) => !current);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [artifactsResponse, indexResponse] = await Promise.all([
          fetch(`${baseUrl}data/artifacts.json`),
          fetch(`${baseUrl}data/boards/index.json`),
        ]);

        if (!artifactsResponse.ok) {
          throw new Error("Unable to load artifacts.");
        }
        if (!indexResponse.ok) {
          throw new Error("Unable to load board index.");
        }

        const artifactsPayload = await artifactsResponse.json();
        const indexPayload = await indexResponse.json();

        if (!isMounted) {
          return;
        }

        const nextArtifacts = Array.isArray(artifactsPayload?.artifacts)
          ? artifactsPayload.artifacts
          : [];
        const nextIndex = {
          defaultBoardId: indexPayload?.defaultBoardId ?? "default",
          boards: Array.isArray(indexPayload?.boards)
            ? indexPayload.boards
            : [],
        };

        setArtifacts(nextArtifacts);
        setBoardIndex(nextIndex);
        setCurrentBoardId(nextIndex.defaultBoardId);
        setError(null);
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || "Failed to load wall data.");
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [baseUrl]);

  useEffect(() => {
    let isMounted = true;

    const loadBoard = async () => {
      if (!currentBoardId || !boardIndex || !artifactsById.size) {
        return;
      }

      try {
        const entry =
          boardEntries.find((board) => board.id === currentBoardId) ?? null;
        if (!entry?.file) {
          throw new Error("Unable to find board metadata.");
        }

        const boardUrl = resolveBoardFilePath(entry.file);
        if (!boardUrl) {
          throw new Error("Unable to resolve board file.");
        }

        const boardResponse = await fetch(boardUrl);
        if (!boardResponse.ok) {
          throw new Error("Unable to load board.");
        }

        const boardPayload = await boardResponse.json();
        if (!isMounted) {
          return;
        }

        const normalizedDefaultBoard = normalizeBoard(boardPayload);
        const storedBoard = readBoardFromStorage(currentBoardId);
        const activeBoard = storedBoard ?? normalizedDefaultBoard;

        setDefaultBoard(normalizedDefaultBoard);
        setNodes(mapBoardNodesToFlowNodes(activeBoard.nodes, artifactsById));
        setAllEdges(mapBoardEdgesToFlowEdges(activeBoard.edges));
        setCamera(activeBoard.camera);
        setSelectedArtifactId(null);
        setError(null);
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || "Failed to load board data.");
        }
      }
    };

    loadBoard();

    return () => {
      isMounted = false;
    };
  }, [
    artifactsById,
    boardEntries,
    boardIndex,
    currentBoardId,
    resolveBoardFilePath,
    setAllEdges,
    setNodes,
  ]);

  useEffect(() => {
    if (!reactFlowInstance || !camera) {
      return;
    }

    reactFlowInstance.setViewport(camera);
  }, [camera, reactFlowInstance]);

  const handleEdgesChange = useCallback(
    (changes) => {
      setAllEdges((currentEdges) => {
        const updatedEdges = applyEdgeChanges(changes, currentEdges);
        edgesRef.current = updatedEdges;
        if (isArrangeMode) {
          saveBoardSnapshot();
        }
        return updatedEdges;
      });
    },
    [isArrangeMode, saveBoardSnapshot, setAllEdges],
  );

  const handleNodeDragStop = useCallback(
    (_, node) => {
      if (!isArrangeMode) {
        return;
      }
      if (node) {
        saveBoardSnapshot();
      }
    },
    [isArrangeMode, saveBoardSnapshot],
  );

  return (
    <section style={wallStyle}>
      <ReactFlow
        style={isLocked ? lockedFlowStyle : undefined}
        nodes={nodes}
        edges={visibleEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={handleEdgesChange}
        onInit={setReactFlowInstance}
        onNodeClick={(_, node) =>
          setSelectedArtifactId(String(node?.data?.artifactId ?? node.id))
        }
        onNodeDoubleClick={(_, node) => centerOnNode(node)}
        onNodeDragStop={handleNodeDragStop}
        onMoveEnd={(_, viewport) => {
          if (!viewport) {
            return;
          }
          setCamera(viewport);
          saveBoardSnapshot(viewport);
        }}
        fitView
        fitViewOptions={fitViewOptions}
        panOnScroll={!isLocked}
        zoomOnScroll={!isLocked}
        zoomOnPinch={!isLocked}
        zoomOnDoubleClick={!isLocked}
        panOnDrag={!isLocked && !isArrangeMode}
        nodesDraggable={!isLocked && isArrangeMode}
        nodesConnectable={false}
        elementsSelectable={!isLocked}
        snapToGrid={isArrangeMode}
        snapGrid={[16, 16]}
        minZoom={0.1}
        maxZoom={3}
      >
        <Background gap={32} size={1} />
        <Controls>
          <ControlButton
            onClick={() => setIsLocked((current) => !current)}
            title={isLocked ? "Unlock interactions" : "Lock interactions"}
            aria-label={isLocked ? "Unlock interactions" : "Lock interactions"}
          >
            {isLocked ? "🔒" : "🔓"}
          </ControlButton>
        </Controls>
        <MiniMap
          nodeColor="#6a6a6a"
          maskColor="rgba(15, 15, 18, 0.5)"
        />
      </ReactFlow>
      <div style={toolbarStyle}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <button
            type="button"
            style={toolbarButtonStyle}
            onClick={() => setIsArrangeMode((current) => !current)}
          >
            {isArrangeMode ? "Arrange: ON" : "Arrange"}
          </button>
          <div style={toolbarHintStyle}>Press A to toggle Arrange</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.4 }}>
            Boards
          </div>
          <div style={{ fontSize: 12, opacity: 0.75 }}>
            Current: {currentBoardTitle}
          </div>
          <select
            style={toolbarSelectStyle}
            value={currentBoardId ?? ""}
            disabled={!boardEntries.length}
            onChange={(event) => {
              const nextId = event.target.value;
              setCurrentBoardId(nextId);
              setSelectedArtifactId(null);
            }}
          >
            {boardEntries.length ? (
              boardEntries.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.title}
                </option>
              ))
            ) : (
              <option value="">Loading...</option>
            )}
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.4 }}>
            Board
          </div>
          <button
            type="button"
            style={toolbarButtonStyle}
            onClick={() => saveBoardSnapshot()}
          >
            Save
          </button>
          <button
            type="button"
            style={toolbarButtonStyle}
            onClick={exportBoardSnapshot}
          >
            Export JSON
          </button>
          <button
            type="button"
            style={toolbarButtonStyle}
            onClick={resetBoard}
          >
            Reset
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.4 }}>
            Publish Edition
          </div>
          <input
            type="text"
            placeholder="Edition Title"
            value={editionTitle}
            onChange={(event) => setEditionTitle(event.target.value)}
            style={toolbarInputStyle}
          />
          <input
            type="text"
            placeholder="Edition Tags (comma-separated)"
            value={editionTags}
            onChange={(event) => setEditionTags(event.target.value)}
            style={toolbarInputStyle}
          />
          <input
            type="text"
            placeholder="Edition ID (optional)"
            value={editionIdInput}
            onChange={(event) => setEditionIdInput(event.target.value)}
            style={toolbarInputStyle}
          />
          <button
            type="button"
            style={toolbarButtonStyle}
            onClick={handlePublish}
          >
            Publish (Download JSON + Index Patch)
          </button>
          <button
            type="button"
            style={toolbarButtonStyle}
            onClick={handleCopyIndexEntry}
          >
            Copy index entry JSON
          </button>
          {publishNotice ? (
            <div style={toolbarHintStyle}>{publishNotice}</div>
          ) : null}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.4 }}>
            Relationships
          </div>
          <div style={legendListStyle}>
            {ALL_KINDS.map((kind) => (
              <label key={kind} style={legendRowStyle}>
                <span style={{ textTransform: "capitalize" }}>{kind}</span>
                <input
                  type="checkbox"
                  checked={enabledKinds.has(kind)}
                  onChange={() =>
                    setEnabledKinds((current) => {
                      const next = new Set(current);
                      if (next.has(kind)) {
                        next.delete(kind);
                      } else {
                        next.add(kind);
                      }
                      return next;
                    })
                  }
                />
              </label>
            ))}
          </div>
          <div style={legendActionsStyle}>
            <button
              type="button"
              style={toolbarButtonStyle}
              onClick={() => setEnabledKinds(new Set(ALL_KINDS))}
            >
              All
            </button>
            <button
              type="button"
              style={toolbarButtonStyle}
              onClick={() => setEnabledKinds(new Set())}
            >
              None
            </button>
          </div>
        </div>
      </div>
      <div style={searchContainerStyle}>
        <input
          type="search"
          placeholder="Search titles or tags..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          style={searchInputStyle}
        />
        {searchResults.length ? (
          <ul style={searchResultsStyle}>
            {searchResults.map((result) => (
              <li key={result.id}>
                <button
                  type="button"
                  style={searchResultButtonStyle}
                  onClick={() => {
                    setSelectedArtifactId(result.id);
                    const nodeMatch = nodes.find(
                      (node) =>
                        String(node?.data?.artifactId) === String(result.id),
                    );
                    if (nodeMatch) {
                      centerOnNode(nodeMatch);
                    }
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{result.title}</div>
                  {result.tags.length ? (
                    <div style={{ opacity: 0.65, marginTop: 2 }}>
                      {result.tags.join(", ")}
                    </div>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      {error ? <div style={overlayStyle}>{error}</div> : null}
      <ArtifactDrawer
        artifact={selectedArtifact}
        relatedArtifacts={relatedArtifacts}
        onClose={() => setSelectedArtifactId(null)}
        onSelectRelated={(artifactId) =>
          setSelectedArtifactId(String(artifactId))
        }
      />
    </section>
  );
}
