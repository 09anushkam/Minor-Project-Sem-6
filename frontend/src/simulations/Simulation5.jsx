
import React, { useState, useEffect } from "react";
import { Network } from "vis-network/standalone";
import "vis-network/styles/vis-network.css";
import { MinPriorityQueue } from '@datastructures-js/priority-queue';
import "./styles/Simulation5.css";

const GraphVisualizer = () => {
  const [graphType, setGraphType] = useState(null);
  const [numVertices, setNumVertices] = useState(null);
  const [graphData, setGraphData] = useState({});
  const [startNode, setStartNode] = useState(0);
  const [dfsTraversal, setDfsTraversal] = useState([]);
  const [bfsTraversal, setBfsTraversal] = useState([]);
  const [visitedQueue, setVisitedQueue] = useState([]);
  const [showGraph, setShowGraph] = useState(false);
  const [randomGraphVertices, setRandomGraphVertices] = useState(null);
  const [graph, setGraph] = useState(null);
  const [dijkstraResult, setDijkstraResult] = useState(null);

  useEffect(() => {
    if (showGraph) {
      drawGraph();
    }
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [showGraph, graphData]);

  const handleGraphTypeChange = (type) => {
    setGraphType(type);
    setNumVertices(null);
    setGraphData({});
    setShowGraph(false);
    setDfsTraversal([]);
    setBfsTraversal([]);
    setDijkstraResult("");
    resetGraph();
    if (type === "RandomGraph") {
      setRandomGraphVertices(null);
    }
    // Force graph container to be visible
    const container = document.getElementById("graph-container");
    if (container) {
      container.style.display = "flex";
    }
    // Reset the input fields
    const inputs = document.querySelectorAll('input[type="number"], input[type="text"]');
    inputs.forEach(input => input.value = '');
  };

  const handleNumVerticesChange = (e) => {
    const newNumVertices = Number(e.target.value);
    setNumVertices(newNumVertices);
    setGraphData({});
    setShowGraph(false);
    setDfsTraversal([]);
    setBfsTraversal([]);
    setDijkstraResult("");
    resetGraph();

    // Force re-render of graph input
    if (graphType) {
      setGraphType(graphType);
    }
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
    if (!graphType) return null; // No message shown if graph type is not selected

    if (numVertices === null && graphType !== "RandomGraph") return <p>Now select the number of vertices.</p>;

    switch (graphType) {
      case "AdjacencyMatrix":
        return (
          <div>
            {Array.from({ length: numVertices }).map((_, i) => (
              <div key={i}>
                {Array.from({ length: numVertices }).map((_, j) => (
                  <input
                    key={`matrix-${i}-${j}`}
                    type="number"
                    min="0"
                    placeholder={`{${i}, ${j}}`}
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
                  onChange={(e) => {
                    const neighbors = e.target.value.split(",").map(v => v.trim()).filter(Boolean);
                    setGraphData(prev => ({
                      ...prev,
                      [i]: neighbors.map(neighbor => ({
                        node: Number(neighbor),
                        weight: 1 // Default weight
                      }))
                    }));
                  }}
                />
                <input
                  type="text"
                  placeholder={`Weights for neighbors of ${i} (comma-separated)`}
                  onChange={(e) => {
                    const weights = e.target.value.split(",").map(v => v.trim()).filter(Boolean);
                    setGraphData(prev => ({
                      ...prev,
                      [i]: prev[i]?.map((neighbor, idx) => ({
                        ...neighbor,
                        weight: weights[idx] ? Number(weights[idx]) : 1
                      })) || []
                    }));
                  }}
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
      color: {
        background: "#ffffff",
        border: "#4a90e2",
        highlight: { background: "#ffd700", border: "#ffd700" },
        hover: { background: "#e6f2ff", border: "#4a90e2" }
      },
      size: 30,
      font: {
        color: "#333333",
        size: 20,
        face: "Arial",
        strokeWidth: 2,
        strokeColor: "#ffffff"
      },
      borderWidth: 2,
      borderWidthSelected: 3,
      shadow: true
    }));

    let edges = [];

    // Place the code block here:
    if (graphType === "AdjacencyMatrix") {
      edges = Object.keys(graphData).flatMap((i) =>
        Object.keys(graphData[i])
          .filter((j) => graphData[i][j] !== "0")
          .map((j) => ({ from: Number(i), to: Number(j), label: graphData[i][j] }))
      );
    } else if (graphType === "EdgeList") {
      edges = Object.values(graphData)
        .filter(({ from, to }) => from !== "" && to !== "")
        .map(({ from, to, weight }) => ({ from: Number(from), to: Number(to), label: weight }));
    } else if (graphType === "AdjacencyList") {
      edges = Object.keys(graphData).flatMap((i) =>
        graphData[i].map((j) => ({
          from: Number(i),
          to: Number(j.node),
          label: j.weight.toString(),
          width: 2,
          color: {
            color: "#4a90e2",
            highlight: "#ffd700",
            hover: "#4a90e2"
          },
          font: {
            size: 16,
            align: "middle",
            strokeWidth: 2,
            strokeColor: "#ffffff"
          },
          smooth: {
            type: "continuous",
            roundness: 0.5
          }
        }))
      );
    } else if (graphType === "RandomGraph") {
      edges = Object.keys(graphData).flatMap((from) =>
        Object.keys(graphData[from]).map((to) => ({
          from: Number(from),
          to: Number(to),
          label: graphData[from][to].toString(),
          width: 2,
          color: {
            color: "#4a90e2",
            highlight: "#ffd700",
            hover: "#4a90e2"
          },
          font: {
            size: 16,
            align: "middle",
            strokeWidth: 2,
            strokeColor: "#ffffff"
          },
          smooth: {
            type: "continuous",
            roundness: 0.5
          }
        }))
      );
    } else if (graphType === "RandomGraph") {
      edges = Object.keys(graphData).flatMap((from) =>
        Object.keys(graphData[from]).map((to) => ({ from: Number(from), to: Number(to) }))
      );
    }

    const data = { nodes, edges };
    const options = {
      edges: {
        arrows: "to",
        font: {
          size: 16,
          align: "middle",
          strokeWidth: 2,
          strokeColor: "#ffffff"
        },
        smooth: {
          type: "continuous",
          roundness: 0.5
        },
        color: {
          color: "#4a90e2",
          highlight: "#ffd700",
          hover: "#4a90e2"
        }
      },
      nodes: {
        shape: "circle",
        font: {
          size: 20,
          face: "Arial",
          strokeWidth: 2,
          strokeColor: "#ffffff"
        }
      },
      physics: {
        stabilization: {
          enabled: true,
          iterations: 1000,
          updateInterval: 25
        },
        barnesHut: {
          gravitationalConstant: -2000,
          centralGravity: 0.3,
          springLength: 200,
          springConstant: 0.04,
          damping: 0.09,
          avoidOverlap: 1
        }
      },
      interaction: {
        zoomView: false,
        dragView: true,
        hover: true,
        keyboard: {
          enabled: false
        }
      },
      layout: {
        improvedLayout: true
      }
    };

    if (graph) {
      graph.destroy();
    }

    const newGraph = new Network(container, data, options);
    setGraph(newGraph);
    setShowGraph(true);

    setTimeout(() => {
      newGraph.redraw();
      newGraph.fit();
    }, 100);
  };

  const generateRandomGraph = (numVertices) => {
    const newGraphData = {};
    // Create a complete graph
    for (let i = 0; i < numVertices; i++) {
      for (let j = 0; j < numVertices; j++) {
        if (i !== j) {
          if (!newGraphData[i]) newGraphData[i] = {};
          newGraphData[i][j] = 1; // Add edge between every pair of vertices
        }
      }
    }

    setNumVertices(numVertices);
    setGraphData(newGraphData);
    setShowGraph(true);
  };

  const handleRandomGraphGeneration = () => {
    if (randomGraphVertices) {
      generateRandomGraph(randomGraphVertices);
    }
  };

  const getNeighbors = (node) => {
    if (graphType === "AdjacencyMatrix") {
      return Object.keys(graphData[node] || {})
        .filter((neighbor) => graphData[node][neighbor] !== "0" && graphData[node][neighbor] !== "")
        .map(Number);
    } else if (graphType === "AdjacencyList") {
      return graphData[node] ? graphData[node].map(n => n.node) : [];
    } else if (graphType === "EdgeList") {
      return Object.values(graphData)
        .filter(({ from }) => Number(from) === node)
        .map(({ to }) => Number(to));
    } else if (graphType === "RandomGraph") {
      return Object.keys(graphData[node] || {}).map(Number);
    }
    return [];
  };

  const getEdgeWeight = (from, to) => {
    if (graphType === "AdjacencyMatrix") {
      return graphData[from] && graphData[from][to] ? Number(graphData[from][to]) : Infinity;
    } else if (graphType === "EdgeList") {
      const edge = Object.values(graphData).find(
        ({ from: f, to: t }) => Number(f) === from && Number(t) === to
      );
      return edge ? Number(edge.weight) : Infinity;
    } else if (graphType === "AdjacencyList") {
      const neighbors = graphData[from] || [];
      const neighbor = neighbors.find(n => n.node === to);
      return neighbor ? neighbor.weight : Infinity;
    } else if (graphType === "RandomGraph") {
      return graphData[from] && graphData[from][to] ? Number(graphData[from][to]) : Infinity;
    }
    return Infinity;
  };

  const runDFS = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    resetGraph();

    let visited = new Array(numVertices).fill(false);
    let traversal = [];
    let tempVisitedQueue = [];
    let tempToVisitQueue = new Set();
    let delay = 0;

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
      } else if (graphType === "RandomGraph") {
        return Object.keys(graphData[node] || {}).map(Number);
      }
      return [];
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
          animateNodeVisit(current, traversal.length * 1000);

          let neighbors = getNeighbors(current);
          neighbors.reverse().forEach((neighbor) => {
            animateEdge(current, neighbor, "#FFD700", 3, delay);
            stack.push(neighbor);
            tempToVisitQueue.add(neighbor);
          });

          animateNodeVisit(current, traversal.length * 2000);
        }
      }
    };

    await dfs(startNode);
    for (let i = 0; i < numVertices; i++) {
      if (!visited[i]) {
        await dfs(i);
      }
    }

    setDfsTraversal([...traversal]);
    setIsProcessing(false);
  };

  const runBFS = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    resetGraph();

    let visited = new Array(numVertices).fill(false);
    let traversal = [];
    let tempVisitedQueue = [];
    let tempToVisitQueue = new Set();
    let delay = 0;

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
      } else if (graphType === "RandomGraph") {
        return Object.keys(graphData[node] || {}).map(Number);
      }
      return [];
    };

    const bfs = async (start) => {
      let queue = [start];
      visited[start] = true;

      while (queue.length > 0) {
        let current = queue.shift();
        traversal.push(current);
        tempVisitedQueue.push(current);
        setVisitedQueue([...tempVisitedQueue]);

        animateNode(current, "#2196F3", 30, delay);
        delay += 1000;

        let neighbors = getNeighbors(current);
        neighbors.forEach((neighbor) => {
          animateEdge(current, neighbor, "#FFA500", 3, delay);
          if (!visited[neighbor]) {
            visited[neighbor] = true;
            queue.push(neighbor);
            tempToVisitQueue.add(neighbor);
          }
        });

        setToVisitQueue(Array.from(tempToVisitQueue));
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    };

    await bfs(startNode);
    for (let i = 0; i < numVertices; i++) {
      if (!visited[i]) {
        await bfs(i);
      }
    }

    setBfsTraversal([...traversal]);
    setIsProcessing(false);
  };

  const runDijkstra = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    resetGraph();

    const numNodes = numVertices;
    const distances = Array(numNodes).fill(Infinity);
    const visited = Array(numNodes).fill(false);
    const previous = Array(numNodes).fill(null);
    let delay = 0;

    distances[startNode] = 0;
    animateNode(startNode, "#4CAF50", 30, delay); // Green for start node
    delay += 1000;

    for (let i = 0; i < numNodes - 1; i++) {
      let minDistance = Infinity;
      let minIndex = -1;

      for (let v = 0; v < numNodes; v++) {
        if (!visited[v] && distances[v] <= minDistance) {
          minDistance = distances[v];
          minIndex = v;
        }
      }

      if (minIndex === -1) {
        break;
      }

      visited[minIndex] = true;
      animateNode(minIndex, "#FFA500", 30, delay); // Orange for processing node
      delay += 1000;

      const neighbors = getNeighbors(minIndex);
      for (const neighbor of neighbors) {
        const weight = getEdgeWeight(minIndex, neighbor);
        if (!visited[neighbor] && distances[minIndex] + weight < distances[neighbor]) {
          distances[neighbor] = distances[minIndex] + weight;
          previous[neighbor] = minIndex;
          highlightEdge(minIndex, neighbor, "#FFA500", 3, delay);
          animateEdge(minIndex, neighbor, "#9C27B0", 3, delay + 500);
          delay += 1000;
        }
      }
    }

    // Color all remaining unvisited nodes
    for (let i = 0; i < numNodes; i++) {
      if (!visited[i]) {
        animateNode(i, "#FF0000", 30, delay); // Red for unreachable nodes
        delay += 500;
      }
    }

    let resultDisplay = `Dijkstra's Shortest Paths from Node ${startNode}:\n\n`;
    for (let i = 0; i < numNodes; i++) {
      resultDisplay += `Node ${i}: Distance = ${distances[i]}`;

      if (previous[i] !== null) {
        let path = ` Path: ${i}`;
        let current = previous[i];
        let pathArray = [i];

        while (current !== null) {
          pathArray.unshift(current);
          current = previous[current];
        }

        path = ` Path: ${pathArray.join(" → ")}`;
        resultDisplay += path;
      } else if (i !== startNode) {
        resultDisplay += " (Unreachable)";
      }
      resultDisplay += "\n";
    }
    setDijkstraResult(resultDisplay);
    setIsProcessing(false);
  };

  const dijkstra = (start) => {
    if (graphType !== "AdjacencyMatrix") {
      alert("Dijkstra's algorithm only works with Adjacency Matrix.");
      return;
    }

    const numNodes = numVertices;
    const distances = Array(numNodes).fill(Infinity);
    const visited = Array(numNodes).fill(false);
    const previous = Array(numNodes).fill(null);

    distances[start] = 0;

    for (let i = 0; i < numNodes - 1; i++) {
      let minDistance = Infinity;
      let minIndex = -1;

      for (let v = 0; v < numNodes; v++) {
        if (!visited[v] && distances[v] <= minDistance) {
          minDistance = distances[v];
          minIndex = v;
        }
      }

      if (minIndex === -1) {
        break;
      }

      visited[minIndex] = true;

      for (let v = 0; v < numNodes; v++) {
        if (!visited[v] && graphData[minIndex][v] && distances[minIndex] + Number(graphData[minIndex][v]) < distances[v]) {
          distances[v] = distances[minIndex] + Number(graphData[minIndex][v]);
          previous[v] = minIndex;
        }
      }
    }

    let resultDisplay = `Dijkstra's Shortest Paths from Node ${start}:\n`;
    for (let i = 0; i < numNodes; i++) {
      resultDisplay += `Node ${i}: Distance = ${distances[i]}`;

      if (previous[i] !== null) {
        let path = ` Path: ${i}`;
        let current = previous[i];
        let pathArray = [i];

        while (current !== null) {
          pathArray.unshift(current);
          current = previous[current];
        }

        path = ` Path: ${pathArray.join(" -> ")}`;
        resultDisplay += path;
      }
      resultDisplay += "\n";
    }
    setDijkstraResult(resultDisplay);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Graph Visualizer</h2>
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center", gap: "10px" }}>
        {["AdjacencyMatrix", "EdgeList", "AdjacencyList", "RandomGraph"].map((type) => (
          <button
            key={type}
            onClick={() => {
              if (type === "RandomGraph") {
                setGraphType(type);
                setRandomGraphVertices(null); // Reset random graph vertices
                setShowGraph(false); // Hide graph initially
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

      {graphType && (
        <div className="input-section">
          {graphType === "RandomGraph" ? (
            <div className="random-graph-container">
              <input
                type="number"
                placeholder="Number of vertices"
                onChange={(e) => setRandomGraphVertices(Number(e.target.value))}
                className="input-box"
              />
              <button
                onClick={() => generateRandomGraph(randomGraphVertices)}
                className="graph-button"
              >
                Generate Random Graph
              </button>
            </div>
          ) : (
            <>
              <input
                type="number"
                placeholder="Number of vertices"
                onChange={handleNumVerticesChange}
                className="input-box"
              />
              <div className="graph-input-container">
                {renderGraphInput()}
              </div>
              {numVertices && (
                <button onClick={() => setShowGraph(true)} className="graph-button">
                  Generate Graph
                </button>
              )}
            </>
          )}
        </div>
      )}

      {showGraph && (
        <div id="graph-container" className="graph-container"></div>
      )}

      {showGraph && (
        <div className="traversal-container">
          <div className="queue-display">
            <h4>To Visit Queue: {toVisitQueue.join(", ")}</h4>
            <h4>Visited Queue: {visitedQueue.join(", ")}</h4>
          </div>
          <input
            type="number"
            placeholder="Start Node"
            min="0"
            max={numVertices - 1}
            onChange={(e) => setStartNode(Number(e.target.value))}
            className="input-box"
          />
          <button onClick={runDFS} className="graph-button">Run DFS</button>
          <button onClick={runBFS} className="graph-button">Run BFS</button>
          <div>
            {dfsTraversal.length > 0 && (
              <p>DFS Traversal: {dfsTraversal.join(" -> ")}</p>
            )}
            {bfsTraversal.length > 0 && (
              <p>BFS Traversal: {bfsTraversal.join(" -> ")}</p>
            )}
          </div>
        </div>
      )}
      {showGraph && graphType === "AdjacencyMatrix" && ( // Only if is Adjacency Matrix
        <div>
          <button onClick={() => dijkstra(startNode)} className="graph-button">
            Run Dijkstra
          </button>
        </div>
      )}
      {dijkstraResult && ( // Add it here!
        <div>
          <h3>Dijkstra Results:</h3>
          <pre>{dijkstraResult}</pre>
        </div>
      )}
    </div>

  );
};

export default GraphVisualizer;
