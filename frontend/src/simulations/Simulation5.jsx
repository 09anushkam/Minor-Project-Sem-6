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
  const [errorMessage, setErrorMessage] = useState("");
  const animationRef = useRef(null);
  const [dijkstraResult, setDijkstraResult] = useState("");
  const [showQueues, setShowQueues] = useState(false);
  const [currentAlgorithm, setCurrentAlgorithm] = useState(null);
  const [edgeList, setEdgeList] = useState([{ from: "", to: "", weight: "" }]);
  const [numEdgeFields, setNumEdgeFields] = useState(4); // Default number of edge input fields
  const [algorithmLock, setAlgorithmLock] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [stack, setStack] = useState([]);
  const [queue, setQueue] = useState([]);

  const MAX_NODES = 15;

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
    setCurrentAlgorithm(null);
    setShowQueues(false);
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

  const validateNodeCount = (count) => {
    if (count < 2) {
        setErrorMessage("Number of vertices must be at least 2");
        return false;
    }
    if (count > MAX_NODES) {
        setErrorMessage(`Please enter a number less than or equal to ${MAX_NODES}`);
        return false;
    }
    setErrorMessage("");
    return true;
  };

  const handleNumVerticesChange = (e) => {
    const value = e.target.value;
    if (value === "") {
        setErrorMessage("");
        setNumVertices(null);
        return;
    }
    const newNumVertices = Number(value);
    if (!validateNodeCount(newNumVertices)) {
        setNumVertices(null);
        return;
    }
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
    const numValue = Number(value);
    
    // Validate node range for 'from' and 'to' fields
    if ((type === 'from' || type === 'to') && value !== '') {
        if (numValue < 0 || numValue >= numVertices) {
            setErrorMessage(`Please enter a node number between 0 and ${numVertices - 1}`);
            e.target.value = '';
            return;
        }
    }
    
    // Validate weight value
    if (type === 'weight' && value !== '') {
        if (numValue > 100) {
            setErrorMessage("Weight value cannot be greater than 100");
            e.target.value = '';
            return;
        }
    }
    
    setErrorMessage("");
    setEdgeList(prev => {
        const newEdges = [...prev];
        if (!newEdges[index]) {
            newEdges[index] = { from: "", to: "", weight: "" };
        }
      newEdges[index][type] = value;
      return newEdges;
    });
  };

  const addMoreEdges = () => {
    setNumEdgeFields(prev => prev + 1);
    setEdgeList(prev => [...prev, { from: "", to: "", weight: "" }]);
  };

  const deleteEdge = (index) => {
    if (index >= 4) {
        setNumEdgeFields(prev => prev - 1);
        setEdgeList(prev => {
            const newEdges = [...prev];
            newEdges.splice(index, 1);
            return newEdges;
        });
    }
  };

  const renderEdgeListInput = () => {
    return (
        <div className="edge-list-container">
            <div className="edge-list-header">
                <h4>Edge List Input</h4>
                <p>Enter edges in the format: From Node (0-{numVertices - 1}) → To Node (0-{numVertices - 1}) (Weight)</p>
            </div>
            <div className="edge-list-fields">
                {Array.from({ length: numEdgeFields }).map((_, index) => (
                    <div key={index} className="edge-input-row">
                        <input
                            type="number"
                            placeholder={`From Node (0-${numVertices - 1})`}
                            onChange={(e) => handleEdgeListChange(e, index, "from")}
                            className="edge-input"
                            min="0"
                            max={numVertices - 1}
                        />
                        <span className="edge-arrow">→</span>
                        <input
                            type="number"
                            placeholder={`To Node (0-${numVertices - 1})`}
                            onChange={(e) => handleEdgeListChange(e, index, "to")}
                            className="edge-input"
                            min="0"
                            max={numVertices - 1}
                        />
                        <input
                            type="number"
                            placeholder="Weight"
                            onChange={(e) => handleEdgeListChange(e, index, "weight")}
                            className="edge-input weight-input"
                            min="1"
                        />
                        {index >= 4 && (
                            <button 
                                onClick={() => deleteEdge(index)} 
                                className="delete-edge-button"
                                title="Delete Edge"
                            >
                                ×
                            </button>
                        )}
                    </div>
                ))}
            </div>
            <button onClick={addMoreEdges} className="add-more-button">
                Add More Edges
            </button>
        </div>
    );
  };

  const renderGraphInput = () => {
    if (!graphType) return null;

    if (numVertices === null && graphType !== "RandomGraph") return null;

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
                    max="100"
                    placeholder={`{${i}, ${j}}`}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value !== "" && Number(value) > 100) {
                        alert("Weight value cannot be greater than 100");
                        e.target.value = "";
                        return;
                      }
                      handleGraphInputChange(e, i, j);
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        );

      case "EdgeList":
        return renderEdgeListInput();

      case "AdjacencyList":
        return (
          <div>
            {Array.from({ length: numVertices }).map((_, i) => (
              <div key={i} className="adjacency-list-row">
                <div className="adjacency-list-input-container">
                <input
                  type="text"
                  placeholder={`Neighbors of ${i} (comma-separated)`}
                  onChange={(e) => {
                      const input = e.target.value;
                      const neighbors = input.split(",").map(v => v.trim()).filter(Boolean);
                      
                      // Filter out invalid nodes
                      const validNeighbors = neighbors.filter(node => {
                        const num = Number(node);
                        return !isNaN(num) && num >= 0 && num < numVertices;
                      });

                      // If there are invalid nodes, update the input value
                      if (validNeighbors.length !== neighbors.length) {
                        e.target.value = validNeighbors.join(", ");
                        setErrorMessage(`Node ${i}: Invalid node numbers were removed. Please use numbers between 0 and ${numVertices - 1}`);
                      } else {
                        setErrorMessage("");
                      }
                      
                    setGraphData(prev => ({
                      ...prev,
                        [i]: validNeighbors.map(neighbor => ({
                        node: Number(neighbor),
                        weight: 1
                      }))
                    }));
                  }}
                    className="adjacency-list-input"
                />
                </div>
                <div className="adjacency-list-input-container">
                <input
                  type="text"
                  placeholder={`Weights for neighbors of ${i} (comma-separated)`}
                  onChange={(e) => {
                    const weights = e.target.value.split(",").map(v => v.trim()).filter(Boolean);
                      
                      // Validate weights
                      const invalidWeights = weights.filter(weight => {
                        const num = Number(weight);
                        return isNaN(num) || num <= 0 || num > 100;
                      });

                      if (invalidWeights.length > 0) {
                        setErrorMessage("Weight values must be between 1 and 100");
                        e.target.value = weights.filter(weight => {
                          const num = Number(weight);
                          return !isNaN(num) && num > 0 && num <= 100;
                        }).join(", ");
                        return;
                      }

                      setErrorMessage("");
                    setGraphData(prev => ({
                      ...prev,
                      [i]: prev[i]?.map((neighbor, idx) => ({
                        ...neighbor,
                        weight: weights[idx] ? Number(weights[idx]) : 1
                      })) || []
                    }));
                  }}
                    className="adjacency-list-input"
                />
                </div>
              </div>
            ))}
            {errorMessage && (
                <div className="error-message">
                    {errorMessage}
                </div>
            )}
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
      size: 40,
      font: {
        color: "#333333",
        size: 24,
        face: "Arial",
        strokeWidth: 2,
        strokeColor: "#ffffff"
      },
      borderWidth: 2,
      borderWidthSelected: 3,
      shadow: true
    }));

    let edges = [];

    if (graphType === "EdgeList") {
      edges = edgeList
        .filter(edge => edge.from !== "" && edge.to !== "" && edge.weight !== "")
        .map(edge => ({
          from: Number(edge.from),
          to: Number(edge.to),
          label: edge.weight.toString(),
            width: 2,
            color: {
            color: "#000000",
              highlight: "#ffd700",
            hover: "#000000"
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
    } else if (graphType === "AdjacencyMatrix") {
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
    }

    const data = { nodes, edges };
    const options = {
      edges: {
        arrows: "to",
        font: {
          size: 20,
          align: "middle",
          strokeWidth: 2,
          strokeColor: "#ffffff"
        },
        smooth: {
          type: "continuous",
          roundness: 0.5
        },
        color: {
          color: "#000000",
          highlight: "#ffd700",
          hover: "#000000"
        },
        width: 2
      },
      nodes: {
        shape: "circle",
        font: {
          size: 24,
          face: "Arial",
          strokeWidth: 2,
          strokeColor: "#ffffff"
        },
        size: 40
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
        },
        zoomSpeed: 1,
        minZoom: 1,
        maxZoom: 1
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
        if (!validateNodeCount(randomGraphVertices)) {
            return;
        }
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
    setStatusMessage("DFS button clicked");
    if (isProcessing || algorithmLock) {
      setStatusMessage("⚠️ Cannot run DFS - Another algorithm is currently running");
      return;
    }
    setStatusMessage("Starting DFS execution...");
    setAlgorithmLock(true);
    setIsProcessing(true);
    setCurrentAlgorithm('dfs');
    setShowQueues(true);
    resetGraph();
    setToVisitQueue([]);
    setStack([]);

    let visited = new Array(numVertices).fill(false);
    let traversal = [];
    let tempVisitedQueue = [];
    let tempToVisitQueue = new Set();
    let delay = 0;

    const dfs = async (node) => {
      let stack = [node];
      setStack([node]);
      while (stack.length > 0) {
        let current = stack.pop();
        setStack([...stack]);
        if (!visited[current]) {
          visited[current] = true;
          traversal.push(current);
          tempVisitedQueue.push(current);
          tempToVisitQueue.delete(current);

          await new Promise(resolve => {
            setTimeout(() => {
              setVisitedQueue([...tempVisitedQueue]);
              setToVisitQueue(Array.from(tempToVisitQueue));
              if (graph && graph.body.nodes[current]) {
                graph.body.nodes[current].setOptions({
                  color: {
                    background: "#4CAF50",
                    border: "#000000"
                  },
                  size: 30,
                  font: {
                    color: "#ffffff",
                    size: 20
                  }
                });
                graph.redraw();
              }
              resolve();
            }, delay);
          });

          let neighbors = getNeighbors(current);
          neighbors.reverse().forEach((neighbor) => {
            setTimeout(() => {
              if (graph) {
                const edge = graph.body.edges[`${current}-${neighbor}`] || graph.body.edges[`${neighbor}-${current}`];
                if (edge) {
                  edge.setOptions({
                    color: { color: "#FFD700", highlight: "#FFD700" },
                    width: 3,
                    dashes: [5, 5],
                    shadow: true
                  });
                  graph.redraw();
                }
              }
            }, delay);
            if (!visited[neighbor]) {
              stack.push(neighbor);
              setStack([...stack]);
              tempToVisitQueue.add(neighbor);
            }
          });

          delay += 1000;
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    };

    try {
      await dfs(startNode);
      for (let i = 0; i < numVertices; i++) {
        if (!visited[i]) {
          await dfs(i);
        }
      }
    } finally {
      setStatusMessage("DFS execution completed!");
      setDfsTraversal([...traversal]);
      setToVisitQueue([]);
      setStack([]);
      setIsProcessing(false);
      setCurrentAlgorithm(null);
      setAlgorithmLock(false);
    }
  };

  const runBFS = async () => {
    setStatusMessage("BFS button clicked");
    if (isProcessing || algorithmLock) {
      setStatusMessage("⚠️ Cannot run BFS - Another algorithm is currently running");
      return;
    }
    setStatusMessage("Starting BFS execution...");
    setAlgorithmLock(true);
    setIsProcessing(true);
    setCurrentAlgorithm('bfs');
    setShowQueues(true);
    resetGraph();
    setToVisitQueue([]);
    setQueue([]);

    let visited = new Array(numVertices).fill(false);
    let traversal = [];
    let tempVisitedQueue = [];
    let tempToVisitQueue = new Set();
    let delay = 0;

    const bfs = async (start) => {
      let queue = [start];
      setQueue([start]);
      visited[start] = true;

      while (queue.length > 0) {
        let current = queue.shift();
        setQueue([...queue]);
        traversal.push(current);
        tempVisitedQueue.push(current);
        tempToVisitQueue.delete(current);

        await new Promise(resolve => {
          setTimeout(() => {
            setVisitedQueue([...tempVisitedQueue]);
            setToVisitQueue(Array.from(tempToVisitQueue));
            if (graph && graph.body.nodes[current]) {
              graph.body.nodes[current].setOptions({
                color: {
                  background: "#2196F3",
                  border: "#000000"
                },
                size: 30,
                font: {
                  color: "#ffffff",
                  size: 20
                }
              });
              graph.redraw();
            }
            resolve();
          }, delay);
        });

        let neighbors = getNeighbors(current);
        neighbors.forEach((neighbor) => {
          setTimeout(() => {
            if (graph) {
              const edge = graph.body.edges[`${current}-${neighbor}`] || graph.body.edges[`${neighbor}-${current}`];
              if (edge) {
                edge.setOptions({
                  color: { color: "#FFA500", highlight: "#FFA500" },
                  width: 3,
                  dashes: [5, 5],
                  shadow: true
                });
                graph.redraw();
              }
            }
          }, delay);
          if (!visited[neighbor]) {
            visited[neighbor] = true;
            queue.push(neighbor);
            setQueue([...queue]);
            tempToVisitQueue.add(neighbor);
          }
        });

        delay += 1000;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    };

    try {
      await bfs(startNode);
      for (let i = 0; i < numVertices; i++) {
        if (!visited[i]) {
          await bfs(i);
        }
      }
    } finally {
      setStatusMessage("BFS execution completed!");
      setBfsTraversal([...traversal]);
      setToVisitQueue([]);
      setQueue([]);
      setIsProcessing(false);
      setCurrentAlgorithm(null);
      setAlgorithmLock(false);
    }
  };

  const runDijkstra = async () => {
    setStatusMessage("Dijkstra button clicked");
    if (isProcessing || algorithmLock) {
      setStatusMessage("⚠️ Cannot run Dijkstra - Another algorithm is currently running");
      return;
    }
    setStatusMessage("Starting Dijkstra execution...");
    setAlgorithmLock(true);
    setIsProcessing(true);
    setCurrentAlgorithm('dijkstra');
    setShowQueues(false);
    resetGraph();

    const numNodes = numVertices;
    const distances = Array(numNodes).fill(Infinity);
    const visited = Array(numNodes).fill(false);
    const previous = Array(numNodes).fill(null);
    let delay = 0;

    distances[startNode] = 0;
    await new Promise(resolve => {
      setTimeout(() => {
        if (graph && graph.body.nodes[startNode]) {
          graph.body.nodes[startNode].setOptions({
            color: {
              background: "#4CAF50",
              border: "#000000"
            },
            size: 30,
            font: {
              color: "#ffffff",
              size: 20
            }
          });
          graph.redraw();
        }
        resolve();
      }, delay);
    });

    const priorityQueue = [];
    priorityQueue.push({ node: startNode, distance: 0 });

    try {
      while (priorityQueue.length > 0) {
        priorityQueue.sort((a, b) => a.distance - b.distance);
        const { node: current, distance: currentDistance } = priorityQueue.shift();
        
        if (visited[current]) continue;
        visited[current] = true;

        await new Promise(resolve => {
          setTimeout(() => {
            if (graph && graph.body.nodes[current]) {
              graph.body.nodes[current].setOptions({
                color: {
                  background: "#FFA500",
                  border: "#000000"
                },
                size: 30,
                font: {
                  color: "#ffffff",
                  size: 20
                }
              });
              graph.redraw();
            }
            resolve();
          }, delay);
        });

        const neighbors = getNeighbors(current);
        for (const neighbor of neighbors) {
          if (visited[neighbor]) continue;

          const weight = getEdgeWeight(current, neighbor);
          const newDistance = currentDistance + weight;

          setTimeout(() => {
            if (graph) {
              const edge = graph.body.edges[`${current}-${neighbor}`] || graph.body.edges[`${neighbor}-${current}`];
              if (edge) {
                edge.setOptions({
                  color: { 
                    color: "#FF0000",
                    highlight: "#FF0000",
                    opacity: 1.0
                  },
                  width: 4,
                  dashes: false,
                  shadow: {
                    enabled: true,
                    color: 'rgba(255,0,0,0.5)',
                    size: 10,
                    x: 0,
                    y: 0
                  }
                });
                graph.redraw();
              }
            }
          }, delay);

          if (newDistance < distances[neighbor]) {
            distances[neighbor] = newDistance;
            previous[neighbor] = current;
            priorityQueue.push({ node: neighbor, distance: newDistance });

            setTimeout(() => {
              if (graph && graph.body.nodes[neighbor]) {
                graph.body.nodes[neighbor].setOptions({
                  color: {
                    background: "#2196F3",
                    border: "#000000"
                  },
                  size: 30,
                  font: {
                    color: "#ffffff",
                    size: 20
                  }
                });
                graph.redraw();
              }
            }, delay + 500);
          }
        }

        setTimeout(() => {
          if (graph) {
            const edges = graph.body.edges;
            Object.values(edges).forEach(edge => {
              edge.setOptions({
                color: { 
                  color: "#000000",
                  highlight: "#000000",
                  opacity: 1.0
                },
                width: 2,
                dashes: false,
                shadow: false
              });
            });
            graph.redraw();
          }
        }, delay + 500);

        delay += 1000;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } finally {
      setStatusMessage("Dijkstra execution completed!");
      let resultDisplay = `Dijkstra's Shortest Paths from Node ${startNode}:\n\n`;
      for (let i = 0; i < numNodes; i++) {
        if (i === startNode) {
          resultDisplay += `Node ${i}: Start Node (Distance = 0)\n`;
          continue;
        }

        if (distances[i] === Infinity) {
          resultDisplay += `Node ${i}: Unreachable\n`;
          continue;
        }

        let path = [i];
        let current = previous[i];
        while (current !== null) {
          path.unshift(current);
          current = previous[current];
        }

        resultDisplay += `Node ${i}:\n`;
        resultDisplay += `  Distance: ${distances[i]}\n`;
        resultDisplay += `  Path: ${path.join(" → ")}\n\n`;
      }

      setDijkstraResult(resultDisplay);
      setIsProcessing(false);
      setCurrentAlgorithm(null);
      setAlgorithmLock(false);
    }
  };

  const validateAdjacencyList = () => {
    let isValid = true;
    let errorMessage = "";

    for (let i = 0; i < numVertices; i++) {
        const neighborsInput = document.querySelector(`input[placeholder="Neighbors of ${i} (comma-separated)"]`);
        const weightsInput = document.querySelector(`input[placeholder="Weights for neighbors of ${i} (comma-separated)"]`);
        
        if (!neighborsInput || !weightsInput) continue;

        const neighbors = neighborsInput.value.split(",").map(v => v.trim()).filter(Boolean);
        const weights = weightsInput.value.split(",").map(v => v.trim()).filter(Boolean);

        // Only validate if there's actual input
        if (neighbors.length > 0 || weights.length > 0) {
            // Check weights count
            if (weights.length > 0 && weights.length !== neighbors.length) {
                isValid = false;
                errorMessage = `Node ${i}: Number of weights (${weights.length}) doesn't match number of neighbors (${neighbors.length})`;
                break;
            }

            // Check weights are positive numbers
            const invalidWeights = weights.filter(weight => {
                const num = Number(weight);
                return isNaN(num) || num <= 0;
            });

            if (invalidWeights.length > 0) {
                isValid = false;
                errorMessage = `Node ${i}: Please enter valid positive numbers for weights`;
                break;
            }
        }
    }

    if (!isValid) {
        setErrorMessage(errorMessage);
        return false;
    }

    setErrorMessage("");
    return true;
  };

  const handleGenerateGraph = () => {
    if (graphType === "AdjacencyList" && !validateAdjacencyList()) {
        return;
    }
    setShowGraph(true);
  };

  const showCustomAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  return (
    <div className="graph-visualizer">
      {showAlert && (
        <div className="custom-alert">
          {alertMessage}
        </div>
      )}
      <h2 className="title">Graph Visualizer</h2>

      <div className="button-container">
        {["AdjacencyMatrix", "EdgeList", "AdjacencyList", "RandomGraph"].map(
          (type) => (
            <button
              key={type}
              onClick={() => handleGraphTypeChange(type)}
              className={`graph-button ${graphType === type ? "active" : ""}`}
              disabled={isProcessing}
            >
              {type.replace(/([A-Z])/g, " $1").trim()}
            </button>
          )
        )}
      </div>

      {graphType && (
        <div className="input-section">
          <div className="input-label">Number of Vertices (min: 2)</div>
          {graphType === "RandomGraph" ? (
            <div className="random-graph-container">
              <input
                type="number"
                placeholder="Number of vertices"
                onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                        setErrorMessage("");
                        setRandomGraphVertices(null);
                        return;
                    }
                    const numValue = Number(value);
                    if (numValue < 2) {
                        setErrorMessage("Number of vertices must be at least 2");
                        setRandomGraphVertices(null);
                    } else {
                        setErrorMessage("");
                        setRandomGraphVertices(numValue);
                    }
                }}
                className="input-box"
                min="2"
                max={MAX_NODES}
                disabled={isProcessing}
              />
              {errorMessage && <div className="error-message">{errorMessage}</div>}
              <button
                onClick={handleRandomGraphGeneration}
                className="graph-button"
                disabled={isProcessing || !randomGraphVertices || randomGraphVertices < 2}
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
                min="2"
                max={MAX_NODES}
                disabled={isProcessing}
              />
              {errorMessage && <div className="error-message">{errorMessage}</div>}
              <div className="graph-input-container">
                {renderGraphInput()}
              </div>
              <button 
                onClick={handleGenerateGraph} 
                className="graph-button"
                disabled={isProcessing || !numVertices || numVertices < 2}
              >
                  Generate Graph
                </button>
            </>
          )}
        </div>
      )}

      {showGraph && (
        <>
          <div className="graph-and-queues">
            <div id="graph-container" className="graph-container"></div>
            {currentAlgorithm === 'dijkstra' && (
                <div className="dijkstra-info">
                    <div className="info-container">
                        <h4>Dijkstra's Visualization</h4>
                        <div className="status-content">
                            <div className="status-item">
                                <div className="status-color" style={{ backgroundColor: "#4CAF50" }}></div>
                                <span>Start Node (0)</span>
                            </div>
                            <div className="status-item">
                                <div className="status-color" style={{ backgroundColor: "#FFA500" }}></div>
                                <span>Processing Node</span>
                            </div>
                            <div className="status-item">
                                <div className="status-color" style={{ backgroundColor: "#2196F3" }}></div>
                                <span>Updated Distance</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {currentAlgorithm !== 'dijkstra' && showQueues && (
              <div className="queue-display">
                {currentAlgorithm === 'dfs' && (
                  <div className="queue-container">
                    <h4>Stack</h4>
                    <div className="queue-content" style={{
                      display: 'flex',
                      flexDirection: 'column-reverse',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '10px'
                    }}>
                      {stack.length > 0 ? (
                        stack.map((node, index) => (
                          <div key={index} style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            padding: '8px 15px',
                            borderRadius: '5px',
                            width: '40px',
                            textAlign: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            border: '2px solid #2E7D32'
                          }}>
                            {node}
                          </div>
                        ))
                      ) : (
                        <div style={{ color: '#666', fontStyle: 'italic' }}>Empty</div>
                      )}
                    </div>
                  </div>
                )}
                {currentAlgorithm === 'bfs' && (
                  <div className="queue-container">
                    <h4>Queue</h4>
                    <div className="queue-content" style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '10px',
                      justifyContent: 'center',
                      flexWrap: 'wrap'
                    }}>
                      {queue.length > 0 ? (
                        queue.map((node, index) => (
                          <div key={index} style={{
                            backgroundColor: '#2196F3',
                            color: 'white',
                            padding: '8px 15px',
                            borderRadius: '5px',
                            width: '40px',
                            textAlign: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            border: '2px solid #1565C0',
                            position: 'relative'
                          }}>
                            {node}
                            {index === 0 && (
                              <div style={{
                                position: 'absolute',
                                top: '-20px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                fontSize: '0.8rem',
                                color: '#1565C0',
                                fontWeight: 'bold'
                              }}>
                                Front
                              </div>
                            )}
                            {index === queue.length - 1 && (
                              <div style={{
                                position: 'absolute',
                                bottom: '-20px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                fontSize: '0.8rem',
                                color: '#1565C0',
                                fontWeight: 'bold'
                              }}>
                                Rear
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div style={{ color: '#666', fontStyle: 'italic' }}>Empty</div>
                      )}
                    </div>
                  </div>
                )}
                <div className="queue-container">
                  <h4>Visited Nodes</h4>
                  <div className="queue-content">{visitedQueue.join(", ")}</div>
                </div>
              </div>
            )}
          </div>

          <div className="traversal-container">
            <div className="algorithm-controls">
              <div className="start-node-container">
                <span className="input-label">Start Node</span>
                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  max={numVertices - 1}
                  onChange={(e) => setStartNode(Number(e.target.value))}
                  className="input-box"
                  disabled={isProcessing}
                />
              </div>
              {statusMessage && (
                <div className="status-message" style={{
                  backgroundColor: isProcessing ? '#ff4444' : '#4CAF50',
                  color: 'white',
                  padding: '10px 20px',
                  margin: '10px 0',
                  borderRadius: '5px',
                  textAlign: 'center',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}>
                  {statusMessage}
                </div>
              )}
              <div className="algorithm-buttons">
                <button
                  onClick={runDFS}
                  className="graph-button"
                  disabled={isProcessing && currentAlgorithm !== 'dfs'}
                >
                  {isProcessing && currentAlgorithm === 'dfs' ? 'Running DFS...' : 'Run DFS'}
                </button>
                <button
                  onClick={runBFS}
                  className="graph-button"
                  disabled={isProcessing && currentAlgorithm !== 'bfs'}
                >
                  {isProcessing && currentAlgorithm === 'bfs' ? 'Running BFS...' : 'Run BFS'}
                </button>
                <button
                  onClick={runDijkstra}
                  className="graph-button"
                  disabled={isProcessing && currentAlgorithm !== 'dijkstra'}
                >
                  {isProcessing && currentAlgorithm === 'dijkstra' ? 'Running Dijkstra...' : 'Run Dijkstra'}
                </button>
              </div>
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
                  <h4>Dijkstra's Results:</h4>
                <pre>{dijkstraResult}</pre>
              </div>
            )}
          </div>
        </div>
        </>
      )}
    </div>
  );
};

export default GraphVisualizer;
