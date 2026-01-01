import { useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import ArtifactDrawer from "./drawer/ArtifactDrawer.jsx";
import YarnEdge from "./edges/YarnEdge.jsx";
import ArtifactNode from "./nodes/ArtifactNode.jsx";

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

const ALL_KINDS = ["sequence", "echoes", "threshold", "samples", "witness"];

const fitViewOptions = { padding: 0.2 };
const cameraStorageKey = "anarchive.camera";

export default function Wall() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [allEdges, setAllEdges, onEdgesChange] = useEdgesState([]);
  const [artifacts, setArtifacts] = useState([]);
  const [camera, setCamera] = useState(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [error, setError] = useState(null);
  const [selectedArtifactId, setSelectedArtifactId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isArrangeMode, setIsArrangeMode] = useState(false);
  const [enabledKinds, setEnabledKinds] = useState(new Set(ALL_KINDS));

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
        const [artifactsResponse, boardResponse] = await Promise.all([
          fetch("/data/artifacts.json"),
          fetch("/data/boards/default.json"),
        ]);

        if (!artifactsResponse.ok) {
          throw new Error("Unable to load artifacts.");
        }
        if (!boardResponse.ok) {
          throw new Error("Unable to load board.");
        }

        const artifactsPayload = await artifactsResponse.json();
        const boardPayload = await boardResponse.json();

        if (!isMounted) {
          return;
        }

        const nextArtifacts = Array.isArray(artifactsPayload?.artifacts)
          ? artifactsPayload.artifacts
          : [];
        const nextArtifactsById = new Map();
        nextArtifacts.forEach((artifact) => {
          if (artifact?.id !== undefined && artifact?.id !== null) {
            nextArtifactsById.set(String(artifact.id), artifact);
          }
        });
        const boardNodes = Array.isArray(boardPayload?.nodes)
          ? boardPayload.nodes
          : [];
        const boardEdges = Array.isArray(boardPayload?.edges)
          ? boardPayload.edges
          : [];

        let nextCamera = null;
        if (typeof window !== "undefined") {
          try {
            const storedCamera = window.localStorage.getItem(cameraStorageKey);
            if (storedCamera) {
              const parsed = JSON.parse(storedCamera);
              if (
                typeof parsed?.x === "number" &&
                typeof parsed?.y === "number" &&
                typeof parsed?.zoom === "number"
              ) {
                nextCamera = {
                  x: parsed.x,
                  y: parsed.y,
                  zoom: parsed.zoom,
                };
              }
            }
          } catch (storageError) {
            console.warn("Unable to read stored camera.", storageError);
          }
        }

        setArtifacts(nextArtifacts);
        setNodes(
          boardNodes.map((node) => {
            const hasTopLevelX = Number.isFinite(node?.x);
            const hasTopLevelY = Number.isFinite(node?.y);
            const position = {
              x: hasTopLevelX
                ? node.x
                : Number.isFinite(node?.position?.x)
                  ? node.position.x
                  : 0,
              y: hasTopLevelY
                ? node.y
                : Number.isFinite(node?.position?.y)
                  ? node.position.y
                  : 0,
            };
            return {
              id: String(node.id),
              position,
              data: {
                artifactId:
                  node?.data?.artifactId ?? node?.artifactId ?? node?.id,
                artifactsById: nextArtifactsById,
              },
              type: "artifact",
              style: {
                width: Number.isFinite(node?.w) ? node.w : undefined,
                height: Number.isFinite(node?.h) ? node.h : undefined,
              },
            };
          }),
        );
        setAllEdges(
          boardEdges.map((edge) => {
            const nextEdge = {
              id: String(edge.id),
              source: String(edge.source),
              target: String(edge.target),
              type: edge.type ?? "yarn",
              data: {
                kind: edge?.kind,
              },
              label: edge?.label,
            };
            if (edge?.sourceHandle) {
              nextEdge.sourceHandle = edge.sourceHandle;
            }
            if (edge?.targetHandle) {
              nextEdge.targetHandle = edge.targetHandle;
            }
            return nextEdge;
          }),
        );
        if (!nextCamera && boardPayload?.camera) {
          nextCamera = {
            x: boardPayload.camera.x ?? 0,
            y: boardPayload.camera.y ?? 0,
            zoom: boardPayload.camera.zoom ?? 1,
          };
        }
        if (nextCamera) {
          setCamera(nextCamera);
        }
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
  }, [setAllEdges, setNodes]);

  useEffect(() => {
    if (!reactFlowInstance || !camera) {
      return;
    }

    reactFlowInstance.setViewport(camera);
  }, [camera, reactFlowInstance]);

  return (
    <section style={wallStyle}>
      <ReactFlow
        nodes={nodes}
        edges={visibleEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={setReactFlowInstance}
        onNodeClick={(_, node) =>
          setSelectedArtifactId(String(node?.data?.artifactId ?? node.id))
        }
        onNodeDoubleClick={(_, node) => centerOnNode(node)}
        onMoveEnd={(_, viewport) => {
          if (!viewport) {
            return;
          }
          setCamera(viewport);
          if (typeof window !== "undefined") {
            try {
              window.localStorage.setItem(
                cameraStorageKey,
                JSON.stringify(viewport),
              );
            } catch (storageError) {
              console.warn("Unable to store camera.", storageError);
            }
          }
        }}
        fitView
        fitViewOptions={fitViewOptions}
        panOnScroll
        zoomOnScroll
        zoomOnPinch
        panOnDrag={!isArrangeMode}
        nodesDraggable={isArrangeMode}
        nodesConnectable={false}
        elementsSelectable={isArrangeMode}
        snapToGrid={isArrangeMode}
        snapGrid={[16, 16]}
        minZoom={0.1}
        maxZoom={3}
      >
        <Background gap={32} size={1} />
        <Controls />
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
