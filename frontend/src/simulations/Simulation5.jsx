import React, { useState, useEffect } from "react";
import { Network } from "vis-network/standalone";
import "vis-network/styles/vis-network.css";
import "./Simulation.css";

<<<<<<< HEAD
const GraphVisualizer = () => {
  const [graphType, setGraphType] = useState(null);
  const [numVertices, setNumVertices] = useState(null);
  const [graphData, setGraphData] = useState({});
=======
const Simulation5 = () => {
  const [vertices, setVertices] = useState(5);
  const [matrix, setMatrix] = useState([]);
  const [adjacencyList, setAdjacencyList] = useState({});
  const [edgeList, setEdgeList] = useState([]);
  const [graph, setGraph] = useState(null);
  const [startNode, setStartNode] = useState(0);
>>>>>>> 23773d9c9664065990767b461d1bdfb6d1b91256
  const [dfsTraversal, setDfsTraversal] = useState([]);
  const [bfsTraversal, setBfsTraversal] = useState([]);
  const [visitedQueue, setVisitedQueue] = useState([]);
  const [startNode, setStartNode] = useState(0);
  const [graph, setGraph] = useState(null);
  const [showGraph, setShowGraph] = useState(false);
  const [randomGraphVertices, setRandomGraphVertices] = useState(null);

  useEffect(() => {
    if (showGraph) {
      drawGraph();
    }
  }, [showGraph, graphData]);

<<<<<<< HEAD
  const handleGraphTypeChange = (type) => {
    setGraphType(type);
    setNumVertices(null);
    setGraphData({});
    setShowGraph(false);
    if (type === "RandomGraph") {
      setRandomGraphVertices(null);
    }
  };

  const handleNumVerticesChange = (e) => {
    setNumVertices(Number(e.target.value));
    setGraphData({});
    setShowGraph(false);
  };

  const handleGraphInputChange = (e, i, j) => {
    const value = e.target.value;
    setGraphData((prev) => {
      const newGraph = { ...prev };
      if (!newGraph[i]) newGraph[i] = {};
      newGraph[i][j] = value;
      return newGraph;
    });
  };

  const handleEdgeListChange = (e, index, type) => {
    const value = e.target.value;
    setGraphData((prev) => {
      const newEdges = { ...prev };
      if (!newEdges[index]) newEdges[index] = { from: "", to: "", weight: "" };
      newEdges[index][type] = value;
      return newEdges;
    });
  };

  const renderGraphInput = () => {
    if (!graphType) return <p>Please select a graph type first.</p>;
    if (numVertices === null) return <p>Now select the number of vertices.</p>;

    switch (graphType) {
      case "AdjacencyMatrix":
        return (
          <div>
            {Array.from({ length: numVertices }).map((_, i) => (
              <div key={i}>
                {Array.from({ length: numVertices }).map((_, j) => (
                  <input
                    key={`${i}-${j}`}
                    type="number"
                    min="0"
                    placeholder={`{${i}}, ${j}`}
                    onChange={(e) => handleGraphInputChange(e, i, j)}
                  />
                ))}
              </div>
            ))}
          </div>
        );

      case "EdgeList":
        return (
          <div>
            {Array.from({ length: numVertices }).map((_, i) => (
              <div key={i}>
                <input
                  type="number"
                  placeholder="From"
                  onChange={(e) => handleEdgeListChange(e, i, "from")}
                />
                <input
                  type="number"
                  placeholder="To"
                  onChange={(e) => handleEdgeListChange(e, i, "to")}
                />
                <input
                  type="number"
                  placeholder="Weight"
                  onChange={(e) => handleEdgeListChange(e, i, "weight")}
                />
              </div>
            ))}
          </div>
        );

      case "AdjacencyList":
        return (
          <div>
            {Array.from({ length: numVertices }).map((_, i) => (
              <div key={i}>
                <input
                  type="text"
                  placeholder={`Neighbors of ${i} (comma-separated)`}
                  onChange={(e) =>
                    setGraphData((prev) => ({
                      ...prev,
                      [i]: e.target.value.split(",").map((v) => v.trim()).filter(Boolean),
                    }))
                  }
                />
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const drawGraph = () => {
    const container = document.getElementById("graph-container");
    if (!container) return;

    const nodes = Array.from({ length: numVertices }, (_, i) => ({
      id: i,
      label: `${i}`,
      color: { background: "#C0C0C0" },
    }));

    let edges = [];

    if (graphType === "AdjacencyMatrix") {
      edges = Object.keys(graphData).flatMap((i) =>
        Object.keys(graphData[i])
          .filter((j) => graphData[i][j] !== "0")
          .map((j) => ({ from: Number(i), to: Number(j) }))
      );
    } else if (graphType === "EdgeList") {
      edges = Object.values(graphData)
        .filter(({ from, to }) => from !== "" && to !== "")
        .map(({ from, to }) => ({ from: Number(from), to: Number(to) }));
    } else if (graphType === "AdjacencyList") {
      edges = Object.keys(graphData).flatMap((i) =>
        graphData[i].map((j) => ({ from: Number(i), to: Number(j) }))
      );
=======
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
>>>>>>> 23773d9c9664065990767b461d1bdfb6d1b91256
    }

    const data = { nodes, edges };
    const options = {
      edges: { arrows: "to" },
      interaction: {
        zoomView: false,
      },
    };
<<<<<<< HEAD
    if (graph) {
      graph.setData(data);
    } else {
      setGraph(new Network(container, data, options));
    }
  };

  const generateRandomGraph = (numVertices) => {
    const newGraphData = {};
    const maxEdges = Math.floor(numVertices * (numVertices - 1) / 2); // Maximum number of edges in a simple graph
    const numEdges = Math.floor(Math.random() * maxEdges) + 1; // Random number of edges (at least 1)

    for (let i = 0; i < numEdges; i++) {
      const from = Math.floor(Math.random() * numVertices);
      const to = Math.floor(Math.random() * numVertices);
      if (from !== to) {
        if (!newGraphData[from]) newGraphData[from] = {};
        newGraphData[from][to] = 1; // Assuming weight of 1 for simplicity
      }
    }

    setGraphData(newGraphData);
    setShowGraph(true);
  };

  const handleRandomGraphGeneration = () => {
    if (randomGraphVertices) {
      generateRandomGraph(randomGraphVertices);
    }
=======
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
>>>>>>> 23773d9c9664065990767b461d1bdfb6d1b91256
  };

  const runDFS = () => {
    let visited = new Array(numVertices).fill(false);
    let traversal = [];
    let tempVisitedQueue = [];

    const animateNodeVisit = (node, delay) => {
      setTimeout(() => {
        if (graph && graph.body.nodes[node]) {
          graph.body.nodes[node].setOptions({
            color: { background: "#4CAF50" },
            size: 30,
            font: { color: "#ffffff" },
          });
          graph.redraw();
          setTimeout(() => {
            graph.body.nodes[node].setOptions({ size: 20, color: { background: "#4CAF50" } });
            graph.redraw();
          }, 1500);
        }
      }, delay);
    };

    const highlightEdge = (from, to, delay) => {
      setTimeout(() => {
        if (graph) {
          graph.body.data.edges.update({ id: `${from}-${to}`, color: "yellow", width: 3 });
          graph.redraw();
          setTimeout(() => {
            graph.body.data.edges.update({ id: `${from}-${to}`, color: "black", width: 1 });
            graph.redraw();
          }, 1500);
        }
      }, delay);
    };

    const getNeighbors = (node) => {
      if (graphType === "AdjacencyMatrix") {
        return Object.keys(graphData[node] || {})
          .filter((neighbor) => graphData[node][neighbor] !== "0")
          .map(Number);
      } else if (graphType === "AdjacencyList") {
        return graphData[node] ? graphData[node].map(Number) : [];
      } else if (graphType === "EdgeList") {
        return Object.values(graphData)
          .filter(({ from }) => Number(from) === node)
          .map(({ to }) => Number(to));
      }
      return [];
    };

    const dfs = (node) => {
      let stack = [node];
<<<<<<< HEAD
=======
      let graphData;
      if (graphType === "Adjacency Matrix") {
        graphData = matrix;
      } else if (graphType === "Adjacency List") {
        graphData = adjacencyList;
      } else if (graphType === "Edge List") {
        graphData = edgeList;
      }
>>>>>>> 23773d9c9664065990767b461d1bdfb6d1b91256

      while (stack.length > 0) {
        let current = stack.pop();
        if (!visited[current]) {
          visited[current] = true;
          traversal.push(current);
          tempVisitedQueue.push(current);
          setVisitedQueue([...tempVisitedQueue]);
<<<<<<< HEAD
          animateNodeVisit(current, traversal.length * 1000);

          let neighbors = getNeighbors(current);
          neighbors.reverse().forEach((neighbor) => {
            highlightEdge(current, neighbor, traversal.length * 1000);
            stack.push(neighbor);
          });
=======
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
>>>>>>> 23773d9c9664065990767b461d1bdfb6d1b91256
        }
      }
    };

    dfs(startNode);

    for (let i = 0; i < numVertices; i++) {
      if (!visited[i]) {
        dfs(i);
      }
    }

    setTimeout(() => {
      setDfsTraversal([...traversal]);
    }, traversal.length * 1000);
  };

  const runBFS = () => {
    let visited = new Array(numVertices).fill(false);
    let traversal = [];
    let tempVisitedQueue = [];

    const animateNodeVisit = (node, delay) => {
      setTimeout(() => {
        if (graph && graph.body.nodes[node]) {
          graph.body.nodes[node].setOptions({
            color: { background: "#2196F3" },
            size: 30,
            font: { color: "#ffffff" },
          });
          graph.redraw();
          setTimeout(() => {
            graph.body.nodes[node].setOptions({ size: 20, color: { background: "#2196F3" } });
            graph.redraw();
          }, 1500);
        }
      }, delay);
    };

    const highlightEdge = (from, to, delay) => {
      setTimeout(() => {
        if (graph) {
          graph.body.data.edges.update({ id: `${from}-${to}`, color: "orange", width: 3 });
          graph.redraw();
          setTimeout(() => {
            graph.body.data.edges.update({ id: `${from}-${to}`, color: "black", width: 1 });
            graph.redraw();
          }, 1500);
        }
      }, delay);
    };

    const getNeighbors = (node) => {
      if (graphType === "AdjacencyMatrix") {
        return Object.keys(graphData[node] || {})
          .filter((neighbor) => graphData[node][neighbor] !== "0")
          .map(Number);
      } else if (graphType === "AdjacencyList") {
        return graphData[node] ? graphData[node].map(Number) : [];
      } else if (graphType === "EdgeList") {
        return Object.values(graphData)
          .filter(({ from }) => Number(from) === node)
          .map(({ to }) => Number(to));
      }
      return [];
    };

    const bfs = (start) => {
      let queue = [start];
      visited[start] = true;

      while (queue.length > 0) {
        let current = queue.shift();
        traversal.push(current);
        tempVisitedQueue.push(current);
        setVisitedQueue([...tempVisitedQueue]);
        animateNodeVisit(current, traversal.length * 1000);

        let neighbors = getNeighbors(current);
        neighbors.forEach((neighbor) => {
          highlightEdge(current, neighbor, traversal.length * 1000);
          if (!visited[neighbor]) {
            visited[neighbor] = true;
            queue.push(neighbor);
          }
        });
      }
    };

    bfs(startNode);

    for (let i = 0; i < numVertices; i++) {
      if (!visited[i]) {
        bfs(i);
      }
    }

    setTimeout(() => {
      setBfsTraversal([...traversal]);
    }, traversal.length * 1000);
  };

  return (
<<<<<<< HEAD
    <div style={{ textAlign: "center" }}>
      <h2>Graph Visualizer</h2>
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center", gap: "10px" }}>
        {["AdjacencyMatrix", "EdgeList", "AdjacencyList", "RandomGraph"].map((type) => (
          <button
            key={type}
            onClick={() => {
              if (type === "RandomGraph") {
                setRandomGraphVertices(null);
                setShowGraph(false);
              } else {
                handleGraphTypeChange(type);
              }
            }}
            className="graph-button"
          >
            {type.replace(/([A-Z])/g, " $1").trim()}
          </button>
        ))}
      </div>
      {graphType === "RandomGraph" && (
        <div>
          <input
            type="number"
            placeholder="Number of vertices"
            onChange={(e) => setRandomGraphVertices(Number(e.target.value))}
            style={{ width: "130px" }}
          />
          <button onClick={handleRandomGraphGeneration} className="graph-button">Generate Random Graph</button>
        </div>
      )}
      {graphType && graphType !== "RandomGraph" && (
        <input
          type="number"
          placeholder="Number of vertices"
          onChange={handleNumVerticesChange}
          style={{ width: "130px" }}
        />
      )}
      <div>{renderGraphInput()}</div>
      {numVertices && (
        <button onClick={() => setShowGraph(true)} className="graph-button">Generate Graph</button>
      )}
      {showGraph && (
        <div id="graph-container" style={{ width: "600px", height: "400px", border: "1px solid lightgray", margin: "20px auto" }}></div>
      )}
      {showGraph && (
        <div>
          <input
            type="number"
            placeholder="Start Node"
            min="0"
            max={numVertices - 1}
            onChange={(e) => setStartNode(Number(e.target.value))}
            style={{ width: "120px" }}
          />
          <button onClick={runDFS} className="graph-button">Run DFS</button>
          <button onClick={runBFS} className="graph-button">Run BFS</button>
          <button className="graph-button">Run Dijkstra</button>
=======
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
>>>>>>> 23773d9c9664065990767b461d1bdfb6d1b91256
        </div>
      )}
      <div>
        {dfsTraversal.length > 0 && (
          <p>DFS Traversal: {dfsTraversal.join(" -> ")}</p>
        )}
        {bfsTraversal.length > 0 && (
          <p>BFS Traversal: {bfsTraversal.join(" -> ")}</p>
        )}
      </div>
    </div>
  );
};

export default GraphVisualizer;