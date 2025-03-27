import React, { useState } from 'react';
import { MinPriorityQueue } from '@datastructures-js/priority-queue';

const DijkstraVisualizer = () => {
    const [matrix, setMatrix] = useState([]);
    const [startNode, setStartNode] = useState(0);
    const [endNode, setEndNode] = useState(0);
    const [distances, setDistances] = useState({});
    const [previousNodes, setPreviousNodes] = useState({});
    const [path, setPath] = useState([]);

    const handleMatrixChange = (e, row, col) => {
        const value = parseInt(e.target.value) || 0;
        const newMatrix = [...matrix];
        if (!newMatrix[row]) newMatrix[row] = [];
        newMatrix[row][col] = value;
        setMatrix(newMatrix);
    };

    const dijkstra = (start) => {
        const V = matrix.length;
        const distances = Array(V).fill(Infinity);
        const previousNodes = Array(V).fill(null);
        distances[start] = 0;

        // Correct way to initialize MinPriorityQueue
        const priorityQueue = new MinPriorityQueue((entry) => entry.priority);
        priorityQueue.enqueue({ node: start, priority: 0 });

        while (!priorityQueue.isEmpty()) {
            const { node: currentNode, priority: currentDistance } = priorityQueue.dequeue();

            for (let neighbor = 0; neighbor < V; neighbor++) {
                const weight = matrix[currentNode]?.[neighbor] || 0;
                if (weight > 0) {
                    const distance = currentDistance + weight;
                    if (distance < distances[neighbor]) {
                        distances[neighbor] = distance;
                        previousNodes[neighbor] = currentNode;
                        priorityQueue.enqueue({ node: neighbor, priority: distance });
                    }
                }
            }
        }

        setDistances(distances);
        setPreviousNodes(previousNodes);
        return previousNodes;
    };

    const findPath = (previousNodes, end) => {
        const path = [];
        let current = end;
        while (current !== null) {
            path.unshift(current);
            current = previousNodes[current];
        }
        return path;
    };

    const handleRunDijkstra = () => {
        const prevNodes = dijkstra(startNode);
        const foundPath = findPath(prevNodes, endNode);
        setPath(foundPath);
    };

    return (
        <div className="visualizer">
            <h1>Dijkstra's Algorithm Visualizer</h1>
            <div>
                <h2>Input Adjacency Matrix</h2>
                {matrix.map((row, rowIndex) => (
                    <div key={rowIndex}>
                        {row.map((_, colIndex) => (
                            <input
                                key={colIndex}
                                type="number"
                                onChange={(e) => handleMatrixChange(e, rowIndex, colIndex)}
                                placeholder="0"
                                style={{ width: '50px', margin: '5px' }}
                            />
                        ))}
                    </div>
                ))}
                <button onClick={() => setMatrix([...matrix, Array(matrix.length).fill(0)])}>
                    Add Row
                </button>
                <button
                    onClick={() => setMatrix(matrix.map(row => [...row, 0]))}>
                    Add Column
                </button>
            </div>
            <div>
                <h2>Start Node</h2>
                <input
                    type="number"
                    value={startNode}
                    onChange={(e) => setStartNode(parseInt(e.target.value))}
                />
                <h2>End Node</h2>
                <input
                    type="number"
                    value={endNode}
                    onChange={(e) => setEndNode(parseInt(e.target.value))}
                />
                <button onClick={handleRunDijkstra}>Run Dijkstra</button>
            </div>
            <div>
                <h2>Shortest Distances</h2>
                <pre>{JSON.stringify(distances, null, 2)}</pre>
                <h2>Shortest Path</h2>
                <pre>{JSON.stringify(path, null, 2)}</pre>
            </div>
        </div>
    );
};

export default DijkstraVisualizer;
