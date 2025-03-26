import React, { useState, useEffect } from "react";
import { Network } from "vis-network/standalone";
import "./Simulation.css";

const Simulation5 = () => {
  const [vertices, setVertices] = useState(5);
  const [matrix, setMatrix] = useState([]);
  const [adjacencyList, setAdjacencyList] = useState({});
  const [edgeList, setEdgeList] = useState([]);
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
    } else if (graphType === "Random Graph Generator") {
      generateRandomGraph();
    } else if (graphType === "Adjacency List") {
      generateAdjacencyList();
    } else if (graphType === "Edge List") {
      generateEdgeList();
    }
  };

  const generateMatrix = () => {
    let newMatrix = Array.from({ length: vertices }, () =>
      new Array(vertices).fill(0)
    );
    setMatrix(newMatrix);
    generateGraphFromMatrix(newMatrix);
  };

  const generateRandomGraph = () => {
    let newMatrix = Array.from({ length: vertices }, () =>
      new Array(vertices).fill(0)
    );

    for (let i = 0; i < vertices; i++) {
      for (let j = i + 1; j < vertices; j++) {
        if (Math.random() > 0.5) {
          newMatrix[i][j] = 1;
          newMatrix[j][i] = 1;
        }
      }
    }
    setMatrix(newMatrix);
    generateGraphFromMatrix(newMatrix);
  };

  const generateAdjacencyList = () => {
    let newAdjList = {};
    for (let i = 0; i < vertices; i++) {
      newAdjList[i] = [];
    }
    setAdjacencyList(newAdjList);
    generateGraphFromAdjacencyList(newAdjList);
  };

  const generateEdgeList = () => {
    setEdgeList([]);
    generateGraphFromEdgeList([]);
  };

  const generateGraphFromMatrix = (matrix) => {
    let nodes = [];
    let edges = [];
    for (let i = 0; i < vertices; i++) {
      nodes.push({ id: i, label: `${i}` });
      for (let j = 0; j < vertices; j++) {
        if (matrix[i][j] === 1) {
          edges.push({
            id: `${i}-${j}`
            , from: i, to: j
          });
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
    if (container) {
      if (graph) {
        graph.setData(data);
      } else {
        setGraph(new Network(container, data, options));
      }
    }
  };

  const generateGraphFromAdjacencyList = (adjList) => {
    let nodes = [];
    let edges = [];
    for (let i = 0; i < vertices; i++) {
      nodes.push({ id: i, label: `${i}` });
      if (adjList[i]) {
        adjList[i].forEach(neighbor => {
          edges.push({ id: `<span class="math-inline">\{i\}\-</span>{neighbor}`, from: i, to: neighbor });
        });
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
    if (container) {
      if (graph) {
        graph.setData(data);
      } else {
        setGraph(new Network(container, data, options));
      }
    }
  };

  const generateGraphFromEdgeList = (edgesList) => {
    let nodes = [];
    let edges = [];
    for (let i = 0; i < vertices; i++) {
      nodes.push({ id: i, label: `${i}` });
    }
    edgesList.forEach(edge => {
      edges.push({ id: `<span class="math-inline">\{edge\.from\}\-</span>{edge.to}`, from: edge.from, to: edge.to });
    });
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
    if (container) {
      if (graph) {
        graph.setData(data);
      } else {
        setGraph(new Network(container, data, options));
      }
    }
  };

  const handleMatrixChange = (i, j, value) => {
    let newMatrix = [...matrix];
    newMatrix[i][j] = value;
    setMatrix(newMatrix);
    generateGraphFromMatrix(newMatrix);
  };

  const handleAdjacencyListChange = (node, neighbor) => {
    let newAdjList = { ...adjacencyList };
    if (newAdjList[node]) {
      if (newAdjList[node].includes(neighbor)) {
        newAdjList[node] = newAdjList[node].filter(n => n !== neighbor);
      } else {
        newAdjList[node].push(neighbor);
      }
    }
    setAdjacencyList(newAdjList);
    generateGraphFromAdjacencyList(newAdjList);
  };

  const handleEdgeListChange = (from, to) => {
    let newEdgeList = [...edgeList];
    const existingEdgeIndex = newEdgeList.findIndex(edge => edge.from === from && edge.to === to);

    if (existingEdgeIndex !== -1) {
      newEdgeList.splice(existingEdgeIndex, 1);
    } else {
      newEdgeList.push({ from, to });
    }
    setEdgeList(newEdgeList);
    generateGraphFromEdgeList(newEdgeList);
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
      let graphData;
      if (graphType === "Adjacency Matrix") {
        graphData = matrix;
      } else if (graphType === "Adjacency List") {
        graphData = adjacencyList;
      } else if (graphType === "Edge List") {
        graphData = edgeList;
      }

      while (stack.length > 0) {
        let current = stack.pop();
        if (!visited[current]) {
          visited[current] = true;
          traversal.push(current);
          tempVisitedQueue.push(current);
          setVisitedQueue([...tempVisitedQueue]);
          animateNodeVisit(current, traversal.length * 2000);

          if (graphType === "Adjacency Matrix") {
            for (let i = vertices - 1; i >= 0; i--) {
              if (graphData[current][i] === 1 && !visited[i]) {
                highlightEdge(current, i, traversal.length * 2000);
                stack.push(i);
              }
            }
          } else if (graphType === "Adjacency List") {
            if (graphData[current]) {
              for (let i = graphData[current].length - 1; i >= 0; i--) {
                let neighbor = graphData[current][i];
                if (!visited[neighbor]) {
                  highlightEdge(current, neighbor, traversal.length * 2000);
                  stack.push(neighbor);
                }
              }
            }
          } else if (graphType === "Edge List") {
            let neighbors = graphData.filter(edge => edge.from === current).map(edge => edge.to);
            for (let i = neighbors.length - 1; i >= 0; i--) {
              let neighbor = neighbors[i];
              if (!visited[neighbor]) {
                highlightEdge(current, neighbor, traversal.length * 2000);
                stack.push(neighbor);
              }
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
        {graphType === "Adjacency Matrix" && (
          <div className="matrix-container">
            {matrix.map((row, i) => (
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
        )}
        {graphType === "Adjacency List" && (
          <div className="adj-list-container">
            {Object.keys(adjacencyList).map((node) => (
              <div key={node} className="adj-list-row">
                <label>{node}: </label>
                {[...Array(vertices).keys()].map((neighbor) => (
                  <button key={neighbor} onClick={() => handleAdjacencyListChange(parseInt(node), neighbor)}>
                    {adjacencyList[node].includes(neighbor) ? "Remove " : "Add "} {neighbor}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
        {graphType === "Edge List" && (
          <div className="edge-list-container">
            {[...Array(vertices).keys()].map((from) => (
              [...Array(vertices).keys()].map((to) => (
                [...Array(vertices).keys()].map((to) => (
                  <button key={`${from}-${to}`} onClick={() => handleEdgeListChange(from, to)}>
                    {edgeList.some((edge) => edge.from === from && edge.to === to)
                      ? "Remove "
                      : "Add "}{" "}
                    {from} &rarr; {to} {/* Use HTML entity for right arrow */}
                  </button>
                ))

              ))
            ))}
          </div>
        )}
        {graphType === "Random Graph Generator" && (
          <button onClick={generateGraphRepresentation} className="center-button">Generate Graph</button>
        )}
        <div className="input-container">
          <label>Start Node: </label>
          <input type="number" value={startNode} onChange={(e) => setStartNode(Number(e.target.value))} />
          <button onClick={runDFS} style={{ marginLeft: "10px" }}>Run DFS</button>
        </div>
        <div id="graph" className="graph-container"></div>
        <h3>DFS Traversal:</h3>
        <p>{dfsTraversal.length > 0 ? dfsTraversal.join(" → ") : "No traversal yet"}</p>
      </div>
    </div>
  );
};

export default Simulation5;
