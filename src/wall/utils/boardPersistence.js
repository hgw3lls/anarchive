export const BOARD_STORAGE_KEY = "anarchive.board.default";

const DEFAULT_CAMERA = { x: 0, y: 0, zoom: 1 };

export const normalizeCamera = (camera) => {
  const nextCamera = {
    x: Number.isFinite(camera?.x) ? camera.x : DEFAULT_CAMERA.x,
    y: Number.isFinite(camera?.y) ? camera.y : DEFAULT_CAMERA.y,
    zoom: Number.isFinite(camera?.zoom) ? camera.zoom : DEFAULT_CAMERA.zoom,
  };
  return nextCamera;
};

export const normalizeBoard = (board) => {
  return {
    camera: normalizeCamera(board?.camera),
    nodes: Array.isArray(board?.nodes) ? board.nodes : [],
    edges: Array.isArray(board?.edges) ? board.edges : [],
  };
};

export const readBoardFromStorage = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(BOARD_STORAGE_KEY);
    if (!stored) {
      return null;
    }
    return normalizeBoard(JSON.parse(stored));
  } catch (error) {
    console.warn("Unable to read stored board.", error);
    return null;
  }
};

export const writeBoardToStorage = (board) => {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    window.localStorage.setItem(
      BOARD_STORAGE_KEY,
      JSON.stringify(normalizeBoard(board)),
    );
    return true;
  } catch (error) {
    console.warn("Unable to store board.", error);
    return false;
  }
};

export const removeStoredBoard = () => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(BOARD_STORAGE_KEY);
  } catch (error) {
    console.warn("Unable to clear stored board.", error);
  }
};

export const mapBoardNodesToFlowNodes = (nodes, artifactsById) => {
  return nodes.map((node) => {
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
        artifactId: node?.data?.artifactId ?? node?.artifactId ?? node?.id,
        artifactsById,
      },
      type: "artifact",
      style: {
        width: Number.isFinite(node?.w) ? node.w : undefined,
        height: Number.isFinite(node?.h) ? node.h : undefined,
      },
    };
  });
};

export const mapBoardEdgesToFlowEdges = (edges) => {
  return edges.map((edge) => {
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
  });
};

const getNodeDimension = (value) => {
  if (Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
};

export const mapFlowNodesToBoardNodes = (nodes) => {
  return nodes.map((node) => {
    const width = getNodeDimension(node?.style?.width ?? node?.width);
    const height = getNodeDimension(node?.style?.height ?? node?.height);

    return {
      id: String(node.id),
      artifactId: node?.data?.artifactId ?? node?.id,
      x: Number.isFinite(node?.position?.x) ? node.position.x : 0,
      y: Number.isFinite(node?.position?.y) ? node.position.y : 0,
      w: width,
      h: height,
    };
  });
};

export const mapFlowEdgesToBoardEdges = (edges) => {
  return edges.map((edge) => ({
    id: String(edge.id),
    source: String(edge.source),
    target: String(edge.target),
    kind: edge?.data?.kind,
    label: edge?.label,
  }));
};

export const buildBoardSnapshot = ({ nodes, edges, camera }) => {
  return normalizeBoard({
    camera: normalizeCamera(camera),
    nodes: mapFlowNodesToBoardNodes(nodes),
    edges: mapFlowEdgesToBoardEdges(edges),
  });
};
