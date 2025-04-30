import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
// import { Graph } from 'graph-data-structure';
import "./Simulation.css";

const Simulation6 = () => {
    const svgRef = useRef();
    const [graphType, setGraphType] = useState(null);
    const [numVertices, setNumVertices] = useState(null);
    const [graphData, setGraphData] = useState({});
    const [showGraph, setShowGraph] = useState(false);
    const [centralityResults, setCentralityResults] = useState(null);
    const [simulation, setSimulation] = useState(null);

    // Clean up simulation on unmount
    useEffect(() => {
        return () => {
            if (simulation) {
                simulation.stop();
            }
        };
    }, [simulation]);

    const handleGraphTypeChange = (type) => {
        setGraphType(type);
        setNumVertices(null);
        setGraphData({});
        setShowGraph(false);
        setCentralityResults(null);
    };

    const handleNumVerticesChange = (e) => {
        const value = Number(e.target.value);
        setNumVertices(value);
        setShowGraph(false);
        setCentralityResults(null);

        // Initialize matrix with 0s when vertices count is set
        if (value && graphType === "AdjacencyMatrix") {
            const newGraphData = {};
            for (let i = 0; i < value; i++) {
                newGraphData[i] = {};
                for (let j = 0; j < value; j++) {
                    if (i !== j) {
                        newGraphData[i][j] = 0;  // Initialize with 0
                    }
                }
            }
            setGraphData(newGraphData);
        } else {
            setGraphData({});
        }
    };

    const handleGraphInputChange = (e, i, j) => {
        const value = e.target.value === "" ? "" : Number(e.target.value);

        // Validate input: only allow 0 or 1
        if (value !== "" && value !== 0 && value !== 1) {
            return;
        }

        setGraphData((prev) => {
            const newGraph = { ...prev };
            if (!newGraph[i]) newGraph[i] = {};
            if (!newGraph[j]) newGraph[j] = {};

            // Set both (i,j) and (j,i) for undirected graph
            newGraph[i][j] = value;
            newGraph[j][i] = value;

            return newGraph;
        });
    };

    const renderGraphInput = () => {
        if (!graphType) return null;
        if (numVertices === null) return <p>Select the number of vertices.</p>;

        switch (graphType) {
            case "AdjacencyMatrix":
                return (
                    <div className="matrix-input-container">
                        <p className="matrix-instructions">
                            Fill the matrix with:
                            <br />
                            1 - if nodes are connected
                            <br />
                            0 - if nodes are not connected
                            <br />
                            Matrix will automatically be made symmetric.
                        </p>
                        <div className="matrix-scroll-container">
                            <div className="matrix-input">
                                {Array.from({ length: numVertices }).map((_, i) => (
                                    <div key={i} className="matrix-row">
                                        {Array.from({ length: numVertices }).map((_, j) => (
                                            <input
                                                key={`matrix-${i}-${j}`}
                                                type="number"
                                                min="0"
                                                max="1"
                                                value={graphData[i]?.[j] ?? (i === j ? "" : 0)}
                                                placeholder={i === j ? "-" : "0"}
                                                onChange={(e) => handleGraphInputChange(e, i, j)}
                                                disabled={i === j}
                                                className={`matrix-input-cell ${i === j ? 'diagonal' : ''}`}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case "RandomGraph":
                return (
                    <div>
                        <button onClick={generateRandomGraph} className="graph-button">
                            Generate Random Social Network
                        </button>
                    </div>
                );

            default:
                return null;
        }
    };

    const generateRandomGraph = () => {
        const n = numVertices;
        const p = 0.3; // Probability of edge creation for additional edges

        // Initialize the graph data structure
        const newGraphData = {};
        for (let i = 0; i < n; i++) {
            newGraphData[i] = {};
        }

        // Step 1: Create a spanning tree to ensure connectivity
        // Use a simple approach: connect each node to the next one in sequence
        for (let i = 0; i < n - 1; i++) {
            const j = i + 1;
            newGraphData[i][j] = 1;
            newGraphData[j][i] = 1;
        }

        // Step 2: Add additional random edges to create a more realistic social network
        // Use a higher probability for nodes that are closer in the spanning tree
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                // Skip edges that are already in the spanning tree
                if (j === i + 1) continue;

                // Calculate distance in the spanning tree
                const distance = j - i;

                // Adjust probability based on distance (closer nodes are more likely to connect)
                const adjustedProbability = p * (1 / Math.sqrt(distance));

                if (Math.random() < adjustedProbability) {
                    newGraphData[i][j] = 1;
                    newGraphData[j][i] = 1;
                }
            }
        }

        // Step 3: Add a few "hub" nodes with higher connectivity
        const numHubs = Math.max(1, Math.floor(n / 10)); // 10% of nodes are hubs
        const hubNodes = [];

        // Select random hub nodes
        for (let i = 0; i < numHubs; i++) {
            let hub;
            do {
                hub = Math.floor(Math.random() * n);
            } while (hubNodes.includes(hub));

            hubNodes.push(hub);

            // Connect hub to 50% of other nodes
            for (let j = 0; j < n; j++) {
                if (j !== hub && Math.random() < 0.5) {
                    newGraphData[hub][j] = 1;
                    newGraphData[j][hub] = 1;
                }
            }
        }

        console.log("Generated graph data:", newGraphData);
        setGraphData(newGraphData);
        setShowGraph(true);
    };

    const drawGraph = () => {
        if (!svgRef.current) return;

        // Clear previous visualization
        d3.select(svgRef.current).selectAll("*").remove();

        // Get the container dimensions
        const container = d3.select(svgRef.current);
        const width = container.node().getBoundingClientRect().width;
        const height = container.node().getBoundingClientRect().height;

        // Create nodes array
        const nodes = Array.from({ length: numVertices }, (_, i) => ({
            id: i,
            degree: Object.values(graphData[i] || {}).filter(val => val === 1).length
        }));

        // Create links array from adjacency matrix
        const links = [];
        for (let i = 0; i < numVertices; i++) {
            for (let j = i + 1; j < numVertices; j++) {  // Only check upper triangle due to symmetry
                if (graphData[i]?.[j] === 1) {
                    links.push({ source: i, target: j });
                }
            }
        }

        // Create SVG groups with proper ordering (edges below nodes)
        const svg = d3.select(svgRef.current);
        const edgeGroup = svg.append("g").attr("class", "edges");
        const nodeGroup = svg.append("g").attr("class", "nodes");
        const labelGroup = svg.append("g").attr("class", "labels");

        // Create force simulation with adjusted parameters
        const newSimulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id(d => d.id).distance(150))
            .force('charge', d3.forceManyBody().strength(-800))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('x', d3.forceX(width / 2).strength(0.1))
            .force('y', d3.forceY(height / 2).strength(0.1))
            .force('collision', d3.forceCollide().radius(35));

        setSimulation(newSimulation);

        // Create links with increased visibility
        const link = edgeGroup
            .selectAll('line')
            .data(links)
            .join('line')
            .attr('stroke', '#666')
            .attr('stroke-opacity', 1)
            .attr('stroke-width', 2);

        // Create nodes with smaller size
        const node = nodeGroup
            .selectAll('circle')
            .data(nodes)
            .join('circle')
            .attr('r', d => centralityResults?.influencers?.includes(d.id) ? 22 : 18)
            .attr('fill', d => centralityResults?.influencers?.includes(d.id) ? '#ff4444' : '#69b3a2')
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .call(drag(newSimulation));

        // Add labels with adjusted position
        const label = labelGroup
            .selectAll('text')
            .data(nodes)
            .join('text')
            .text(d => d.id)
            .attr('font-size', '14px')
            .attr('font-weight', 'bold')
            .attr('dx', 0)
            .attr('dy', 5)
            .attr('text-anchor', 'middle')
            .attr('fill', '#fff');

        // Add tooltips with degree information
        node.append('title')
            .text(d => `Node ${d.id}\nDegree: ${d.degree}`);

        // Enable node dragging
        function drag(simulation) {
            function dragstarted(event) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            }

            function dragged(event) {
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            }

            function dragended(event) {
                if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
            }

            return d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
        }

        // Update positions on each tick with adjusted padding
        newSimulation.on('tick', () => {
            const padding = 30;

            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node
                .attr('cx', d => Math.max(padding, Math.min(width - padding, d.x)))
                .attr('cy', d => Math.max(padding, Math.min(height - padding, d.y)));

            label
                .attr('x', d => Math.max(padding, Math.min(width - padding, d.x)))
                .attr('y', d => Math.max(padding, Math.min(height - padding, d.y)));
        });
    };

    // Draw graph when showGraph or graphData changes
    useEffect(() => {
        if (showGraph && numVertices) {
            drawGraph();
        }
    }, [showGraph, graphData, numVertices]);

    const calculateCentrality = () => {
        console.log("Calculating centrality with graph data:", graphData);

        // Calculate all centrality measures
        const centralities = {
            degree: {},
            closeness: {},
            betweenness: {},
            eigenvector: {}
        };

        // First: Calculate degree centrality for all nodes
        const degrees = {};
        let maxDegree = 0;
        for (let i = 0; i < numVertices; i++) {
            const degree = Object.values(graphData[i] || {}).filter(val => val === 1).length;
            degrees[i] = degree;
            maxDegree = Math.max(maxDegree, degree);
            centralities.degree[i] = degree / (numVertices - 1);
        }

        // Identify influencers (nodes with the highest degree centrality)
        const maxDegreeCentrality = Math.max(...Object.values(centralities.degree));
        const influencers = Object.entries(centralities.degree)
            .filter(([, centrality]) => Math.abs(centrality - maxDegreeCentrality) < 0.001) // Using small epsilon for float comparison
            .map(([node]) => parseInt(node))
            .sort((a, b) => a - b);

        console.log("Identified influencers:", influencers);
        console.log("Maximum degree centrality:", maxDegreeCentrality);

        // Calculate closeness centrality
        for (let i = 0; i < numVertices; i++) {
            let totalDistance = 0;
            let reachableNodes = 0;

            // Use BFS to find shortest paths
            const distances = {};
            const queue = [[i, 0]];
            distances[i] = 0;

            while (queue.length > 0) {
                const [node, distance] = queue.shift();

                if (graphData[node]) {
                    Object.entries(graphData[node]).forEach(([neighbor, value]) => {
                        const neighborId = parseInt(neighbor);
                        if (value === 1 && distances[neighborId] === undefined) {
                            distances[neighborId] = distance + 1;
                            totalDistance += distance + 1;
                            reachableNodes++;
                            queue.push([neighborId, distance + 1]);
                        }
                    });
                }
            }

            centralities.closeness[i] = reachableNodes > 0 ?
                reachableNodes / ((numVertices - 1) * Math.max(1, totalDistance)) : 0;
        }

        // Calculate betweenness centrality
        const calculateBetweenness = () => {
            const betweenness = {};
            for (let i = 0; i < numVertices; i++) {
                betweenness[i] = 0;
            }

            // For each pair of nodes
            for (let s = 0; s < numVertices; s++) {
                for (let t = s + 1; t < numVertices; t++) {
                    // Find shortest paths using BFS
                    const paths = [];
                    const queue = [[s, [s]]];
                    const visited = new Set();

                    while (queue.length > 0) {
                        const [node, path] = queue.shift();

                        if (node === t) {
                            paths.push(path);
                            continue;
                        }

                        if (graphData[node]) {
                            Object.entries(graphData[node]).forEach(([neighbor, value]) => {
                                const neighborId = parseInt(neighbor);
                                // Only consider edges where value is 1
                                if (value === 1 && !visited.has(neighborId)) {
                                    visited.add(neighborId);
                                    queue.push([neighborId, [...path, neighborId]]);
                                }
                            });
                        }
                    }

                    // Update betweenness values
                    if (paths.length > 0) {
                        paths.forEach(path => {
                            path.slice(1, -1).forEach(node => {
                                betweenness[node] += 1 / paths.length;
                            });
                        });
                    }
                }
            }

            // Normalize betweenness values
            const maxBetweenness = (numVertices - 1) * (numVertices - 2) / 2;
            for (let i = 0; i < numVertices; i++) {
                centralities.betweenness[i] = maxBetweenness > 0 ?
                    betweenness[i] / maxBetweenness : 0;
            }
        };

        // Calculate eigenvector centrality using power iteration
        const calculateEigenvector = () => {
            let eigenvector = {};
            let newEigenvector = {};

            // Initialize with equal values
            for (let i = 0; i < numVertices; i++) {
                eigenvector[i] = 1 / numVertices;
            }

            // Power iteration (20 iterations)
            for (let iter = 0; iter < 20; iter++) {
                let sum = 0;

                // Calculate new values
                for (let i = 0; i < numVertices; i++) {
                    newEigenvector[i] = 0;
                    if (graphData[i]) {
                        Object.entries(graphData[i]).forEach(([neighbor, value]) => {
                            const neighborId = parseInt(neighbor);
                            // Only consider edges where value is 1
                            if (value === 1) {
                                newEigenvector[i] += eigenvector[neighborId];
                            }
                        });
                    }
                    sum += newEigenvector[i] * newEigenvector[i];
                }

                // Normalize
                const norm = Math.sqrt(sum);
                for (let i = 0; i < numVertices; i++) {
                    eigenvector[i] = norm > 0 ? newEigenvector[i] / norm : 0;
                }
            }

            centralities.eigenvector = eigenvector;
        };

        // Calculate betweenness and eigenvector centrality
        calculateBetweenness();
        calculateEigenvector();

        // Set the results
        setCentralityResults({
            centralities,
            influencers,
            maxDegree: Math.max(...Object.values(degrees))
        });

        // Update node visualization
        if (svgRef.current) {
            d3.select(svgRef.current)
                .selectAll('circle')
                .attr('fill', d => influencers.includes(d.id) ? '#ff4444' : '#69b3a2')
                .attr('r', d => influencers.includes(d.id) ? 22 : 18);
        }
    };

    const handleGenerateGraph = () => {
        // Check if all matrix values are properly set (0 or 1)
        let isValid = true;

        // First, ensure graphData is properly initialized for all vertices
        for (let i = 0; i < numVertices; i++) {
            if (!graphData[i]) {
                isValid = false;
                break;
            }
            for (let j = 0; j < numVertices; j++) {
                if (i !== j) {  // Skip diagonal elements
                    // Check if the value is defined and is either 0 or 1
                    if (graphData[i][j] === undefined ||
                        (graphData[i][j] !== 0 && graphData[i][j] !== 1)) {
                        isValid = false;
                        break;
                    }
                }
            }
            if (!isValid) break;
        }

        if (!isValid) {
            alert("Please ensure all matrix values are either 0 or 1. Use 1 for connected nodes and 0 for unconnected nodes.");
            return;
        }

        setShowGraph(true);
    };

    const CentralityFormulas = () => (
        <div className="formulas-container">
            <h3>Centrality Measure Formulas</h3>
            <div className="formula-section">
                <h4>Degree Centrality</h4>
                <p>For node <i>i</i>:</p>
                <p className="formula">
                    C<sub>D</sub>(i) = deg(i) / (n - 1)
                </p>
                <p>Where:</p>
                <ul>
                    <li>deg(i) = number of edges connected to node i</li>
                    <li>n = total number of nodes in the network</li>
                </ul>
            </div>

            <div className="formula-section">
                <h4>Closeness Centrality</h4>
                <p>For node <i>i</i>:</p>
                <p className="formula">
                    C<sub>C</sub>(i) = (n - 1) / (∑<sub>j≠i</sub> d(i,j))
                </p>
                <p>Where:</p>
                <ul>
                    <li>d(i,j) = shortest path distance between nodes i and j</li>
                    <li>n = total number of nodes in the network</li>
                </ul>
            </div>

            <div className="formula-section">
                <h4>Betweenness Centrality</h4>
                <p>For node <i>v</i>:</p>
                <p className="formula">
                    C<sub>B</sub>(v) = ∑<sub>s≠v≠t</sub> (σ<sub>st</sub>(v) / σ<sub>st</sub>)
                </p>
                <p>Where:</p>
                <ul>
                    <li>σ<sub>st</sub> = total number of shortest paths from s to t</li>
                    <li>σ<sub>st</sub>(v) = number of those paths that pass through v</li>
                </ul>
            </div>

            <div className="formula-section">
                <h4>Eigenvector Centrality</h4>
                <p>For node <i>i</i>:</p>
                <p className="formula">
                    x<sub>i</sub> = (1/λ) ∑<sub>j∈N(i)</sub> x<sub>j</sub>
                </p>
                <p>Where:</p>
                <ul>
                    <li>N(i) = neighbors of node i</li>
                    <li>λ = largest eigenvalue of the adjacency matrix</li>
                    <li>x = eigenvector corresponding to λ</li>
                </ul>
            </div>
        </div>
    );

    return (
        <div className="simulation-container">
            <h2>Social Network Analysis</h2>

            <div className="controls">
                <h3>Network Configuration</h3>
                <div className="graph-type-buttons">
                    {["AdjacencyMatrix", "RandomGraph"].map((type) => (
                        <button
                            key={type}
                            onClick={() => handleGraphTypeChange(type)}
                            className={`graph-button ${graphType === type ? 'active' : ''}`}
                        >
                            {type.replace(/([A-Z])/g, " $1").trim()}
                        </button>
                    ))}
                </div>

                {graphType && (
                    <div className="input-section">
                        <label htmlFor="vertices">Number of Vertices:</label>
                        <input
                            id="vertices"
                            type="number"
                            placeholder="Enter V"
                            onChange={handleNumVerticesChange}
                            className="vertex-input"
                            min="2"
                            max="20"
                            value={numVertices || ''}
                        />
                    </div>
                )}

                <div className="graph-input-section">
                    {renderGraphInput()}
                </div>

                {graphType === "AdjacencyMatrix" && numVertices > 0 && (
                    <div className="generate-section">
                        <button
                            onClick={handleGenerateGraph}
                            className="graph-button full-width-btn"
                        >
                            Generate Graph
                        </button>
                    </div>
                )}
            </div>

            {showGraph && (
                <>
                    <div className="graph-section">
                        <h3>Network Visualization</h3>
                        <div className="graph-container">
                            <svg
                                ref={svgRef}
                                viewBox="-100 0 800 600"
                                preserveAspectRatio="xMidYMid meet"
                            >
                                <g className="graph-content"></g>
                            </svg>
                        </div>
                        <div className="analysis-controls">
                            <button onClick={calculateCentrality} className="graph-button">
                                Calculate Centrality Measures
                            </button>
                        </div>
                    </div>

                    {centralityResults && (
                        <div className="results-container">
                            <h3>Network Analysis Results</h3>
                            <div className="summary-section">
                                <div className="summary-item">
                                    <h4>Influencer Nodes</h4>
                                    <p>{centralityResults.influencers.sort((a, b) => a - b).map(node => `Node ${node}`).join(', ')}</p>
                                </div>
                                <div className="summary-item">
                                    <h4>Maximum Degree</h4>
                                    <p>{centralityResults.maxDegree}</p>
                                </div>
                            </div>
                            <div className="table-container">
                                <table className="centrality-table">
                                    <thead>
                                        <tr>
                                            <th>Node</th>
                                            <th>Connections</th>
                                            <th>Degree Centrality</th>
                                            <th>Closeness Centrality</th>
                                            <th>Betweenness Centrality</th>
                                            <th>Eigenvector Centrality</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.from({ length: numVertices }).map((_, i) => {
                                            // Get all connections where value is 1 in either direction
                                            const connections = [];
                                            for (let j = 0; j < numVertices; j++) {
                                                if (graphData[i]?.[j] === 1 || graphData[j]?.[i] === 1) {
                                                    connections.push(`Node ${j}`);
                                                }
                                            }
                                            const connectionsStr = connections.join(', ');

                                            return (
                                                <tr key={i} className={centralityResults.influencers.includes(i) ? 'influencer' : ''}>
                                                    <td><strong>Node {i}</strong></td>
                                                    <td>{connectionsStr || 'None'}</td>
                                                    <td>{centralityResults.centralities.degree[i]?.toFixed(3) || '0.000'}</td>
                                                    <td>{centralityResults.centralities.closeness[i]?.toFixed(3) || '0.000'}</td>
                                                    <td>{centralityResults.centralities.betweenness[i]?.toFixed(3) || '0.000'}</td>
                                                    <td>~{Math.abs(centralityResults.centralities.eigenvector[i])?.toFixed(2) || '0.00'}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <CentralityFormulas />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Simulation6;
