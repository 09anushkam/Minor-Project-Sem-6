import './styles/Procedure.css';

const Procedure6 = () => {
    return (
        <div className="procedure-container">
            <h2 className="procedure-heading">Procedure for Social Network Analysis</h2>

            <div className="procedure-step">
                <h3>🔹 Choose Graph Type</h3>
                <p>
                    Decide how you want to build your network:
                    <ul>
                        <li><strong>Adjacency Matrix:</strong> Manually enter a 0/1 matrix to define connections.</li>
                        <li><strong>Random Graph:</strong> Let the system generate a connected “social network” automatically.</li>
                    </ul>
                </p>
            </div>

            <div className="procedure-step">
                <h3>🔹 Specify Number of Vertices</h3>
                <p>
                    Enter how many nodes (people) your network should have (minimum 2, maximum 50). This determines the size of the matrix or the random graph.
                </p>
            </div>

            <div className="procedure-step">
                <h3>🔹 Input or Generate Connections</h3>
                <p>
                    Depending on your choice:
                    <ul>
                        <li><strong>Adjacency Matrix:</strong> Fill each cell with 1 (connected) or 0 (not connected). Diagonal entries are disabled since a node can’t connect to itself.</li>
                        <li><strong>Random Graph:</strong> Click “Generate Random Social Network” to auto‑create a connected graph with extra random and hub‑like connections.</li>
                    </ul>
                </p>
            </div>

            <div className="procedure-step">
                <h3>🔹 Render the Network</h3>
                <p>
                    If using the matrix, click <strong>Generate Graph</strong>. The network will appear in the SVG canvas, with nodes positioned by a force‑directed layout.
                </p>
            </div>

            <div className="procedure-step">
                <h3>🔹 Calculate Centrality Measures</h3>
                <p>
                    Click <strong>Calculate Centrality Measures</strong> to compute:
                    <ul>
                        <li><strong>Degree Centrality:</strong> How many direct connections each node has.</li>
                        <li><strong>Closeness Centrality:</strong> How close a node is to all others via shortest paths.</li>
                        <li><strong>Betweenness Centrality:</strong> How often a node sits on shortest paths between others.</li>
                        <li><strong>Eigenvector Centrality:</strong> Influence based on being connected to other influential nodes.</li>
                    </ul>
                </p>
            </div>

            <div className="procedure-step">
                <h3>🔹 Review Analysis Results</h3>
                <p>
                    Once computed, view:
                    <ul>
                        <li><strong>Influencer Nodes:</strong> Nodes with highest degree centrality, highlighted in red.</li>
                        <li><strong>Maximum Degree:</strong> The largest number of connections any node has.</li>
                        <li><strong>Centrality Table:</strong> A breakdown of all centrality scores per node.</li>
                    </ul>
                </p>
            </div>

            <div className="procedure-step">
                <h3>🔹 Save or Export Findings</h3>
                <p>
                    Copy the table or take a screenshot for your report. You can also extend the code to export the results to CSV for further analysis.
                </p>
            </div>

            <div className="note">
                <strong>Note:</strong> When using the adjacency matrix, ensure every off‑diagonal cell is filled (0 or 1). For reproducibility, record your random seed or graph parameters.
            </div>
        </div>
    );
};

export default Procedure6;
