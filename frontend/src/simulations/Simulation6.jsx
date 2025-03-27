import React, { useState, useEffect, useRef } from 'react';

function Dijkstra() {
  const [graph, setGraph] = useState([]);
  const [numNodes, setNumNodes] = useState(0);
  const [startNode, setStartNode] = useState(0);
  const [result, setResult] = useState(null);
  const canvasRef = useRef(null);
  const [nodePositions, setNodePositions] = useState([]);

  useEffect(() => {
    if (graph && graph.length > 0) {
      const numNodes = graph.length;
      const positions = [];
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const radius = 20;

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      for (let i = 0; i < numNodes; i++) {
        const angle = (2 * Math.PI * i) / numNodes;
        const x = canvasWidth / 2 + Math.cos(angle) * (canvasWidth / 3);
        const y = canvasHeight / 2 + Math.sin(angle) * (canvasHeight / 3);
        positions.push({ x, y });
      }

      setNodePositions(positions);

      const drawGraph = () => {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        for (let i = 0; i < numNodes; i++) {
          for (let j = 0; j < numNodes; j++) {
            if (graph[i][j] !== 0) {
              ctx.beginPath();
              ctx.moveTo(positions[i].x, positions[i].y);
              ctx.lineTo(positions[j].x, positions[j].y);
              ctx.strokeStyle = 'black';
              ctx.lineWidth = 2;
              ctx.stroke();

              const midX = (positions[i].x + positions[j].x) / 2;
              const midY = (positions[i].y + positions[j].y) / 2;
              ctx.fillStyle = 'red';
              ctx.font = '12px Arial';
              ctx.fillText(graph[i][j], midX, midY);
            }
          }
        }

        for (let i = 0; i < numNodes; i++) {
          ctx.beginPath();
          ctx.arc(positions[i].x, positions[i].y, radius, 0, 2 * Math.PI);
          ctx.fillStyle = 'lightblue';
          ctx.fill();
          ctx.strokeStyle = 'black';
          ctx.stroke();

          ctx.fillStyle = 'black';
          ctx.font = '14px Arial';
          ctx.fillText(i, positions[i].x - 5, positions[i].y + 5);
        }
      };

      drawGraph();
    }
  }, [graph]);

  const handleNumNodesChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setNumNodes(value);
    setGraph(Array(value).fill(null).map(() => Array(value).fill(0)));
  };

  const handleWeightChange = (row, col, value) => {
    const newGraph = [...graph];
    newGraph[row][col] = parseInt(value, 10) || 0;
    setGraph(newGraph);
  };

  const dijkstra = (graph, startNode) => {
    const numNodes = graph.length;
    const distances = Array(numNodes).fill(Infinity);
    const visited = Array(numNodes).fill(false);
    const previous = Array(numNodes).fill(null);

    distances[startNode] = 0;

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
        if (!visited[v] && graph[minIndex][v] !== 0 && distances[minIndex] + graph[minIndex][v] < distances[v]) {
          distances[v] = distances[minIndex] + graph[minIndex][v];
          previous[v] = minIndex;
        }
      }
    }

    return { distances, previous };
  };

  const displayDijkstraResult = (distances, previous, startNode) => {
    let resultDisplay = `Dijkstra's Shortest Paths from Node ${startNode}:\n`;
    for (let i = 0; i < distances.length; i++) {
      resultDisplay += `Node ${i}: Distance = ${distances[i]}`;

      if (previous[i] !== null) {
        let path = ` Path: ${i}`;
        let current = previous[i];
        let pathArray = [i];

        while (current !== null) {
          pathArray.unshift(current);
          current = previous[current];
        }

        path = ` Path: ${pathArray.join(' -> ')}`;

        resultDisplay += path;
      }
      resultDisplay += '\n';
    }
    setResult(resultDisplay);
  };

  const runDijkstra = () => {
    if (graph.length > 0) {
      const { distances, previous } = dijkstra(graph, startNode);
      displayDijkstraResult(distances, previous, startNode);
    }
  };

  return (
    <div>
      <h2>Dijkstra's Algorithm</h2>
      <div>
        <label>Number of Nodes:</label>
        <input type="number" value={numNodes} onChange={handleNumNodesChange} />
      </div>

      {numNodes > 0 && (
        <div>
          <h3>Enter Graph (Adjacency Matrix):</h3>
          <table>
            <tbody>
              {graph.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((col, colIndex) => (
                    <td key={colIndex}>
                      <input
                        type="number"
                        value={graph[rowIndex][colIndex]}
                        onChange={(e) => handleWeightChange(rowIndex, colIndex, e.target.value)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <label>Start Node:</label>
            <input type="number" value={startNode} onChange={(e) => setStartNode(parseInt(e.target.value, 10))} />
          </div>
          <button onClick={runDijkstra}>Run Dijkstra</button>
          <canvas ref={canvasRef} width={600} height={400} />
        </div>
      )}

      {result && (
        <div>
          <h3>Results:</h3>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}

export default Dijkstra;