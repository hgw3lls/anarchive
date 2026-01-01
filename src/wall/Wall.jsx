import { useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
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

const fitViewOptions = { padding: 0.2 };

export default function Wall() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [artifacts, setArtifacts] = useState([]);
  const [camera, setCamera] = useState(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [error, setError] = useState(null);

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

        setArtifacts(nextArtifacts);
        setNodes(
          boardNodes.map((node) => ({
            id: String(node.id),
            position: {
              x: node?.position?.x ?? 0,
              y: node?.position?.y ?? 0,
            },
            data: {
              artifactId: node?.data?.artifactId ?? node?.artifactId ?? node?.id,
              artifactsById: nextArtifactsById,
            },
            type: "artifact",
          })),
        );
        setEdges(
          boardEdges.map((edge) => ({
            id: String(edge.id),
            source: String(edge.source),
            target: String(edge.target),
            type: edge.type,
            data: edge.data,
          })),
        );
        if (boardPayload?.camera) {
          setCamera({
            x: boardPayload.camera.x ?? 0,
            y: boardPayload.camera.y ?? 0,
            zoom: boardPayload.camera.zoom ?? 1,
          });
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
  }, [setEdges, setNodes]);

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
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={setReactFlowInstance}
        fitView
        fitViewOptions={fitViewOptions}
        panOnScroll
        zoomOnScroll
        zoomOnPinch
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
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
      {error ? <div style={overlayStyle}>{error}</div> : null}
    </section>
  );
}
