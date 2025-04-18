import React, { useState, useEffect, useRef } from "react";
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
  const [toVisitQueue, setToVisitQueue] = useState([]);
  const [showGraph, setShowGraph] = useState(false);
  const [randomGraphVertices, setRandomGraphVertices] = useState(null);
  const [graph, setGraph] = useState(null);
  const [dijkstraTraversal, setDijkstraTraversal] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const animationRef = useRef(null);
  const [dijkstraResult, setDijkstraResult] = useState("");

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

  const resetGraph = () => {
    setVisitedQueue([]);
    setToVisitQueue([]);
    setIsProcessing(false);
    if (graph) {
      const nodes = graph.body.nodes;
      const edges = graph.body.edges;
      Object.values(nodes).forEach(node => {
        node.setOptions({
          color: {
            background: "#C0C0C0",
            border: "#000000"
          },
          size: 30,
          font: {
            color: "#000000",
            size: 20
          }
        });
      });
      Object.values(edges).forEach(edge => {
        edge.setOptions({
          color: { color: "#000000" },
          width: 2,
          dashes: false
        });
      });
      graph.redraw();
    }
  };

  const animateNode = (node, color, size, delay) => {
    setTimeout(() => {
      if (graph && graph.body.nodes[node]) {
        graph.body.nodes[node].setOptions({
          color: {
            background: color,
            border: "#000000"
          },
          size: size,
          font: {
            color: "#ffffff",
            size: 20
          }
        });
        graph.redraw();
      }
    }, delay);
  };

  const animateEdge = (from, to, color, width, delay) => {
    setTimeout(() => {
      if (graph) {
        const edge = graph.body.edges[`${from}-${to}`] || graph.body.edges[`${to}-${from}`];
        if (edge) {
          edge.setOptions({
            color: { color: color, highlight: color },
            width: width,
            dashes: [5, 5],
            shadow: true,
            smooth: {
              type: "continuous",
              roundness: 0.5
            }
          });
          graph.redraw();
        }
      }
    }, delay);
  };

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
    const container = document.getElementById("graph-container");
    if (container) {
      container.style.display = "flex";
    }
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
    if (!graphType) return null;

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
                        weight: 1
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
          .filter((j) => graphData[i][j] !== "0" && graphData[i][j] !== "")
          .map((j) => ({
            from: Number(i),
            to: Number(j),
            label: graphData[i][j].toString(),
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
    } else if (graphType === "EdgeList") {
      edges = Object.values(graphData)
        .filter(({ from, to }) => from !== "" && to !== "")
        .map(({ from, to, weight }) => ({
          from: Number(from),
          to: Number(to),
          label: weight.toString(),
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
        }));
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
    const edgeProbability = 0.3;

    for (let i = 0; i < numVertices; i++) {
      if (!newGraphData[i]) newGraphData[i] = {};

      const unconnectedNodes = Array.from({ length: numVertices }, (_, j) => j)
        .filter(j => j !== i && !newGraphData[i][j] && !newGraphData[j]?.[i]);

      if (unconnectedNodes.length > 0) {
        const randomNode = unconnectedNodes[Math.floor(Math.random() * unconnectedNodes.length)];
        newGraphData[i][randomNode] = Math.floor(Math.random() * 10) + 1;
      }
    }

    for (let i = 0; i < numVertices; i++) {
      for (let j = 0; j < numVertices; j++) {
        if (i !== j && !newGraphData[i][j] && Math.random() < edgeProbability) {
          if (!newGraphData[i]) newGraphData[i] = {};
          newGraphData[i][j] = Math.floor(Math.random() * 10) + 1;
        }
      }
    }

    const isConnected = () => {
      const visited = new Set();
      const queue = [0];
      visited.add(0);

      while (queue.length > 0) {
        const current = queue.shift();
        const neighbors = Object.keys(newGraphData[current] || {})
          .map(Number)
          .filter(node => !visited.has(node));

        neighbors.forEach(node => {
          visited.add(node);
          queue.push(node);
        });
      }

      return visited.size === numVertices;
    };

    if (!isConnected()) {
      const visited = new Set();
      const unvisited = new Set(Array.from({ length: numVertices }, (_, i) => i));

      visited.add(0);
      unvisited.delete(0);

      while (unvisited.size > 0) {
        const current = Array.from(visited)[Math.floor(Math.random() * visited.size)];
        const next = Array.from(unvisited)[Math.floor(Math.random() * unvisited.size)];

        if (!newGraphData[current]) newGraphData[current] = {};
        newGraphData[current][next] = Math.floor(Math.random() * 10) + 1;

        visited.add(next);
        unvisited.delete(next);
      }
    }

    setNumVertices(numVertices);
    setGraphData(newGraphData);
    setShowGraph(true);
    drawGraph();
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

    const dfs = async (node) => {
      let stack = [node];
      while (stack.length > 0) {
        let current = stack.pop();
        if (!visited[current]) {
          visited[current] = true;
          traversal.push(current);
          tempVisitedQueue.push(current);
          setVisitedQueue([...tempVisitedQueue]);

          animateNode(current, "#4CAF50", 30, delay);
          delay += 1000;

          let neighbors = getNeighbors(current);
          neighbors.reverse().forEach((neighbor) => {
            animateEdge(current, neighbor, "#FFD700", 3, delay);
            stack.push(neighbor);
            tempToVisitQueue.add(neighbor);
          });

          setToVisitQueue(Array.from(tempToVisitQueue));
          await new Promise(resolve => setTimeout(resolve, 1000));
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

    // Initialize start node
    distances[startNode] = 0;
    animateNode(startNode, "#4CAF50", 30, delay); // Green for start node
    delay += 1000;

    for (let i = 0; i < numNodes - 1; i++) {
      // Find the node with minimum distance
      let minDistance = Infinity;
      let minIndex = -1;

      for (let v = 0; v < numNodes; v++) {
        if (!visited[v] && distances[v] <= minDistance) {
          minDistance = distances[v];
          minIndex = v;
        }
      }

      if (minIndex === -1) break;

      // Mark the current node as visited
      visited[minIndex] = true;
      animateNode(minIndex, "#FFA500", 30, delay); // Orange for processing node
      delay += 1000;

      // Update distances to neighbors
      const neighbors = getNeighbors(minIndex);
      for (const neighbor of neighbors) {
        const weight = getEdgeWeight(minIndex, neighbor);
        if (!visited[neighbor] && distances[minIndex] + weight < distances[neighbor]) {
          // Update distance and previous node
          distances[neighbor] = distances[minIndex] + weight;
          previous[neighbor] = minIndex;

          // Animate the edge being considered
          animateEdge(minIndex, neighbor, "#FFA500", 3, delay);
          delay += 500;

          // Animate the node being updated
          animateNode(neighbor, "#2196F3", 30, delay); // Blue for updated node
          delay += 1000;
        }
      }
    }

    // Color unreachable nodes
    for (let i = 0; i < numNodes; i++) {
      if (!visited[i] && i !== startNode) {
        animateNode(i, "#FF0000", 30, delay); // Red for unreachable nodes
        delay += 500;
      }
    }

    // Build result string
    let resultDisplay = `Dijkstra's Shortest Paths from Node ${startNode}:\n\n`;
    for (let i = 0; i < numNodes; i++) {
      resultDisplay += `Node ${i}: Distance = ${distances[i]}`;

      if (previous[i] !== null) {
        let path = [i];
        let current = previous[i];
        while (current !== null) {
          path.unshift(current);
          current = previous[current];
        }
        resultDisplay += ` Path: ${path.join(" → ")}`;
      } else if (i !== startNode) {
        resultDisplay += " (Unreachable)";
      }
      resultDisplay += "\n";
    }

    setDijkstraResult(resultDisplay);
    setIsProcessing(false);
  };

  return (
    <div className="graph-visualizer">
      <h2 className="title">Graph Visualizer</h2>

      <div className="button-container">
        {["AdjacencyMatrix", "EdgeList", "AdjacencyList", "RandomGraph"].map(
          (type) => (
            <button
              key={type}
              onClick={() => handleGraphTypeChange(type)}
              className={`graph-button ${graphType === type ? "active" : ""}`}
            >
              {type.replace(/([A-Z])/g, " $1").trim()}
            </button>
          )
        )}
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
          <div className="algorithm-buttons">
            <button
              onClick={runDFS}
              className="graph-button"
              disabled={isProcessing}
            >
              Run DFS
            </button>
            <button
              onClick={runBFS}
              className="graph-button"
              disabled={isProcessing}
            >
              Run BFS
            </button>
            <button
              onClick={runDijkstra}
              className="graph-button"
              disabled={isProcessing}
            >
              Run Dijkstra
            </button>
          </div>
          <div className="traversal-results">
            {dfsTraversal.length > 0 && (
              <div className="traversal-result">
                <h4>DFS Traversal:</h4>
                <p>{dfsTraversal.join(" → ")}</p>
              </div>
            )}
            {bfsTraversal.length > 0 && (
              <div className="traversal-result">
                <h4>BFS Traversal:</h4>
                <p>{bfsTraversal.join(" → ")}</p>
              </div>
            )}
            {dijkstraResult && (
              <div className="traversal-result">
                <h4>Dijkstra&apos;s Results:</h4>
                <pre>{dijkstraResult}</pre>
              </div>
            )}
          </div>
        </div>
      )}
      {showGraph && graphType === "AdjacencyMatrix" && ( // Only if is Adjacency Matrix
        <div>
          <button onClick={() => runDijkstra()} className="graph-button">
            Run Dijkstra
          </button>
        </div>
      )}
    </div>
  );
};

export default GraphVisualizer;
