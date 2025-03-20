import React, { useState } from "react";
import { Button } from "@shadcn/ui";
import { Input } from "@shadcn/ui";
import Graph from "graph-data-structure";
import { Graphviz } from "@hpcc-js/wasm";

export default function GraphSimulation() {
  const [numVertices, setNumVertices] = useState(0);
  const [numEdges, setNumEdges] = useState(0);
  const [graphType, setGraphType] = useState("adjacencyList");
  const [graphData, setGraphData] = useState(null);

  const generateGraph = () => {
    const g = Graph();
    let edges = [];
    for (let i = 0; i < numEdges; i++) {
      let u = Math.floor(Math.random() * numVertices);
      let v = Math.floor(Math.random() * numVertices);
      if (u !== v) {
        g.addEdge(u, v, Math.floor(Math.random() * 10) + 1);
        edges.push([u, v]);
      }
    }

    let representation;
    if (graphType === "adjacencyList") {
      representation = g.serialize();
    } else if (graphType === "adjacencyMatrix") {
      representation = generateAdjMatrix(edges, numVertices);
    } else if (graphType === "edgeList") {
      representation = edges;
    }

    setGraphData({ graph: g, representation });
  };

  const generateAdjMatrix = (edges, vertices) => {
    let matrix = Array(vertices)
      .fill(null)
      .map(() => Array(vertices).fill(0));
    edges.forEach(([u, v]) => {
      matrix[u][v] = 1;
      matrix[v][u] = 1;
    });
    return matrix;
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Graph Simulation</h1>
      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="Vertices"
          onChange={(e) => setNumVertices(Number(e.target.value))}
        />
        <Input
          type="number"
          placeholder="Edges"
          onChange={(e) => setNumEdges(Number(e.target.value))}
        />
        <select onChange={(e) => setGraphType(e.target.value)}>
          <option value="adjacencyList">Adjacency List</option>
          <option value="adjacencyMatrix">Adjacency Matrix</option>
          <option value="edgeList">Edge List</option>
        </select>
        <Button onClick={generateGraph}>Generate Graph</Button>
      </div>

      {graphData && (
        <div className="mt-4">
          <h2 className="text-lg font-bold">Graph Representation</h2>
          <pre>{JSON.stringify(graphData.representation, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
