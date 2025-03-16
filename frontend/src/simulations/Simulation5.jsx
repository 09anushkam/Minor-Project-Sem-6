import React, { useState, useEffect } from "react";
import { Network } from "vis-network/standalone";
import "./Simulation.css";

const Simulation5 = () => {
  const [vertices, setVertices] = useState(5);
  const [matrix, setMatrix] = useState([]);
  const [graph, setGraph] = useState(null);
  const [startNode, setStartNode] = useState(0);
  const [dfsTraversal, setDfsTraversal] = useState([]);
  const [visitedQueue, setVisitedQueue] = useState([]);
  const [algorithm, setAlgorithm] = useState("DFS");
  const [graphType, setGraphType] = useState("Adjacency Matrix");

  useEffect(() => {
    generateGraphRepresentation();
  }, [vertices, graphType]);

  const generateGraphRepresentation = () => {
    if (graphType === "Adjacency Matrix") {
      generateMatrix();
    } else if (graphType === "Adjacency List") {
      generateAdjacencyList();
    } else if (graphType === "Edge List") {
      generateEdgeList();
    } else if (graphType === "Random Graph Generator") {
      generateRandomGraph();
    }
  };

  const generateMatrix = () => {
    let newMatrix = Array.from({ length: vertices }, () =>
      new Array(vertices).fill(0)
    );
    setMatrix(newMatrix);
  };

  const generateGraph = () => {
    let nodes = [];
    let edges = [];
    for (let i = 0; i < vertices; i++) {
      nodes.push({ id: i, label: `${i}` });
      for (let j = 0; j < vertices; j++) {
        if (matrix[i][j] === 1) {
          edges.push({ id: `${i}-${j}`, from: i, to: j });
        }
      }
    }
    let data = { nodes, edges };
    let options = {
      nodes: {
        shape: "circle",
        size: 20,
        font: { size: 16 },
        borderWidth: 2,
        color: { background: "#d3d3d3", highlight: { border: "#ffa500" } },
      },
      edges: { color: "black" },
      physics: {
        enabled: true,
        stabilization: { iterations: 200 },
      },
    };
    let container = document.getElementById("graph");
    setGraph(new Network(container, data, options));
  };

  const handleMatrixChange = (i, j, value) => {
    let newMatrix = [...matrix];
    newMatrix[i][j] = value;
    setMatrix(newMatrix);
  };

  const runDFS = () => {
    let visited = new Array(vertices).fill(false);
    let traversal = [];
    let tempVisitedQueue = [];

    const animateNodeVisit = (node, delay) => {
      setTimeout(() => {
        if (graph && graph.body.nodes[node]) {
          graph.body.nodes[node].setOptions({
            color: { background: "#4CAF50" },
            size: 30,
          });
          graph.redraw();
          setTimeout(() => {
            graph.body.nodes[node].setOptions({ size: 20 });
            graph.redraw();
          }, 1500);
        }
      }, delay);
    };

    const highlightEdge = (from, to, delay) => {
      setTimeout(() => {
        if (graph) {
          graph.body.data.edges.update({ id: `${from}-${to}`, color: "orange" });
          graph.redraw();
          setTimeout(() => {
            graph.body.data.edges.update({ id: `${from}-${to}`, color: "black" });
            graph.redraw();
          }, 1500);
        }
      }, delay);
    };

    const dfs = (node) => {
      let stack = [node];
      while (stack.length > 0) {
        let current = stack.pop();
        if (!visited[current]) {
          visited[current] = true;
          traversal.push(current);
          tempVisitedQueue.push(current);
          setVisitedQueue([...tempVisitedQueue]);
          animateNodeVisit(current, traversal.length * 2000);
          for (let i = vertices - 1; i >= 0; i--) {
            if (matrix[current][i] === 1 && !visited[i]) {
              highlightEdge(current, i, traversal.length * 2000);
              stack.push(i);
            }
          }
        }
      }
    };

    dfs(startNode);
    setTimeout(() => {
      setDfsTraversal([...traversal]);
    }, traversal.length * 2000);
  };

  return (
    <div className="simulation-container">
      <div className="simulation-content">
        <div className="input-container">
          <label>Select Algorithm: </label>
          <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
            <option value="DFS">Depth-First Search (DFS)</option>
            <option value="BFS">Breadth-First Search (BFS)</option>
            <option value="Dijkstra">Dijkstra's Algorithm</option>
          </select>
        </div>
        <div className="input-container">
          <label>Select Graph Representation: </label>
          <select value={graphType} onChange={(e) => setGraphType(e.target.value)}>
            <option value="Adjacency Matrix">Adjacency Matrix</option>
            <option value="Adjacency List">Adjacency List</option>
            <option value="Edge List">Edge List</option>
            <option value="Random Graph Generator">Random Graph Generator</option>
          </select>
        </div>
        <div className="input-container">
          <label>Number of Vertices: </label>
          <input
            type="number"
            value={vertices}
            onChange={(e) => setVertices(Number(e.target.value))}
            style={{ width: "40px", marginRight: "15px" }}
          />
          <button onClick={generateMatrix} style={{width: "100px", background: "#ffd5d4"}}>Generate Matrix</button>
        </div>
        
        <h3>Graph Representation ({graphType})</h3>
        <div className="matrix-container">
          {graphType === "Adjacency Matrix" &&
            matrix.map((row, i) => (
              <div key={i} className="matrix-row">
                {row.map((val, j) => (
                  <input
                    key={j}
                    type="number"
                    value={val}
                    onChange={(e) => handleMatrixChange(i, j, Number(e.target.value))}
                  />
                ))}
              </div>
            ))}
        </div>
        <button onClick={generateGraph} className="center-button" style={{width: "100px", background: "#ffd5d4"}}>Generate Graph</button>
        <div className="input-container">
          <label>Start Node: </label>
          <input
            type="number"
            value={startNode}
            onChange={(e) => setStartNode(Number(e.target.value))}
          />
          <button onClick={runDFS} style={{background: "#ffd5d4", marginLeft: "10px"}}>Run DFS</button>
        </div>
        <div id="graph" className="graph-container"></div>
        <h3>DFS Traversal:</h3>
        <p>{dfsTraversal.length > 0 ? dfsTraversal.join(" → ") : "No traversal yet"}</p>
      </div>
    </div>
  );
};

export default Simulation5;
