import {
  mapFlowEdgesToBoardEdges,
  mapFlowNodesToBoardNodes,
  normalizeCamera,
} from "./boardPersistence.js";

export const toBoardSchema = ({ nodes, edges, viewport }) => {
  return {
    camera: normalizeCamera(viewport),
    nodes: mapFlowNodesToBoardNodes(nodes),
    edges: mapFlowEdgesToBoardEdges(edges),
  };
};

export const downloadJson = (filename, payload) => {
  if (typeof window === "undefined") {
    return;
  }

  const json = `${JSON.stringify(payload, null, 2)}\n`;
  const blob = new Blob([json], { type: "application/json" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
