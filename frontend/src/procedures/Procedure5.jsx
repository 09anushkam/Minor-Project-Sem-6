import "./styles/Procedure.css";

const Procedure5 = () => {
    return (
        <div className="procedure-container">
            <h2 className="procedure-heading">Procedure for Graph Traversal & Shortest Paths</h2>

            <div className="procedure-step">
                <h3>🔹 Select Graph Input Type</h3>
                <p>
                    Click one of the buttons: <strong>Adjacency Matrix</strong>, <strong>Edge List</strong>,
                    <strong> Adjacency List</strong> or <strong>Random Graph</strong>.
                </p>
            </div>

            <div className="procedure-step">
                <h3>🔹 Specify Number of Vertices</h3>
                <p>
                    If you chose Matrix, List or Edge List, enter the number of vertices.
                    If you chose Random Graph, enter the number of vertices in the “Generate Random Graph” box.
                </p>
            </div>

            <div className="procedure-step">
                <h3>🔹 Provide Graph Data</h3>
                <p>
                    Depending on your choice:
                    <ul>
                        <li>
                            <strong>Adjacency Matrix:</strong> Fill each cell {`{i, j}`} with a non‑zero weight or leave blank for no edge.
                        </li>
                        <li>
                            <strong>Edge List:</strong> For each row enter “From”, “To” and “Weight”.
                        </li>
                        <li>
                            <strong>Adjacency List:</strong> For each vertex list neighbors (comma‑separated) and optionally weights.
                        </li>
                        <li>
                            <strong>Random Graph:</strong> Click “Generate Random Graph” to auto‑build a connected weighted graph.
                        </li>
                    </ul>
                </p>
            </div>

            <div className="procedure-step">
                <h3>🔹 Render the Graph</h3>
                <p>
                    Click <strong>Generate Graph</strong> (or “Generate Random Graph”) to visualize your network
                    in the canvas.
                </p>
            </div>

            <div className="procedure-step">
                <h3>🔹 Choose a Start Node</h3>
                <p>
                    In the “Start Node” box, enter a vertex index between 0 and N‑1 to begin traversals.
                </p>
            </div>

            <div className="procedure-step">
                <h3>🔹 Run Traversal Algorithms</h3>
                <p>
                    Use the three buttons:
                    <ul>
                        <li><strong>Run DFS:</strong> Depth‑first search, animates node and edge visits.</li>
                        <li><strong>Run BFS:</strong> Breadth‑first search, animates level‑order visits.</li>
                        <li><strong>Run Dijkstra:</strong> Computes shortest paths from the start node and displays distances and paths.</li>
                    </ul>
                </p>
            </div>

            <div className="procedure-step">
                <h3>🔹 Monitor Queues & Results</h3>
                <p>
                    As the algorithms run, observe:
                    <ul>
                        <li><strong>To Visit Queue:</strong> Nodes scheduled next.</li>
                        <li><strong>Visited Queue:</strong> Nodes already processed.</li>
                        <li><strong>Traversal Results:</strong> Final DFS/BFS order and Dijkstra’s distance/path summary.</li>
                    </ul>
                </p>
            </div>

            <div className="note">
                <strong>Note:</strong> You must generate the graph before running any algorithm, and your start node must be valid (0 ≤ start &lt; number of vertices).
            </div>
        </div>
    );
};

export default Procedure5;
