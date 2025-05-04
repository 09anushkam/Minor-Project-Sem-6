import './styles/Theory.css';

const Theory8 = () => {
    return (
        <div className="theory-container">
            {/* <h1 className="theory-title">Social Network Analysis using Graph Theory</h1> */}

            <div className="section">
                <h2>Introduction to Social Network Analysis</h2>
                <p>
                    Social Network Analysis (SNA) is a powerful method used to study how individuals or groups interact within a network. With platforms like Facebook, Twitter, and Instagram dominating communication, SNA provides critical insights into influence, popularity, and community dynamics. Using graph theory, we represent users as nodes and their interactions as edges, allowing both visual and mathematical analysis of social structures.
                </p>
            </div>

            <div className="section">
                <h2>Setting the Network – Users and Relationships</h2>
                <p>
                    In SNA, users are nodes and directed edges represent one-way interactions like “follows.” An adjacency matrix is used to represent these connections. In our system, toggling checkboxes adds a directional edge, ensuring no self-follows. This interactive setup enables users to construct a meaningful graph for analysis.
                </p>
            </div>

            <div className="section">
                <h2>Graph Theory Foundations</h2>
                <p>
                    Social networks are modeled as directed graphs where:
                </p>
                <ul className="list-disc">
                    <li><strong>In-degree:</strong> Number of followers (incoming edges).</li>
                    <li><strong>Out-degree:</strong> Number of users a person follows (outgoing edges).</li>
                    <li><strong>Path:</strong> A sequence connecting two users via edges.</li>
                    <li><strong>Shortest Path:</strong> The path with the fewest steps between two users.</li>
                </ul>
                <p>
                    These concepts help evaluate popularity, reachability, and influence within the network.
                </p>
            </div>

            <div className="section">
                <h2>Centrality Metrics and Their Roles</h2>
                <p>Different centrality metrics help interpret a user’s role in the network:</p>
                <ul className="list-disc">
                    <li><strong>In-degree Centrality:</strong> Measures popularity by counting followers.</li>
                    <li><strong>Betweenness Centrality:</strong> Identifies users acting as bridges between groups.</li>
                    <li><strong>Closeness Centrality:</strong> Measures how quickly a user can reach others.</li>
                    <li><strong>Eigenvector Centrality:</strong> Considers the influence of one’s followers.</li>
                    <li><strong>PageRank:</strong> Gives importance to who follows you, not just how many.</li>
                </ul>
            </div>

            <div className="section">
                <h2>Overall Influence Score</h2>
                <p>
                    An aggregated influence score combines all centrality metrics with weights. A sample distribution could be:
                </p>
                <ul className="list-decimal">
                    <li>25% In-degree</li>
                    <li>25% PageRank</li>
                    <li>20% Eigenvector</li>
                    <li>15% Closeness</li>
                    <li>15% Betweenness</li>
                </ul>
                <p>
                    This composite helps identify users who are both popular and strategically influential. Results are visualized using user cards, showing a well-rounded view of each top influencer.
                </p>
            </div>

            <div className="section">
                <h2>Network Visualization and Interaction</h2>
                <p>
                    A visual graph helps bring the network to life. Nodes (users) and edges (follows) are laid out using force-directed algorithms. Node size or color can reflect influence, helping quickly identify:
                </p>
                <ul className="list-disc">
                    <li>Large nodes: Highly influential users</li>
                    <li>Central nodes: High closeness centrality</li>
                    <li>Bridges: High betweenness centrality</li>
                </ul>
            </div>

            <div className="section">
                <h2>Exporting and Reporting</h2>
                <p>
                    After analysis, metrics can be exported in CSV or JSON format. This allows further integration into reports, presentations, or analytical tools for applications like:
                </p>
                <ul className="list-disc">
                    <li>Marketing campaign targeting</li>
                    <li>Crisis communication strategy</li>
                    <li>Trend detection</li>
                    <li>Community engagement optimization</li>
                </ul>
            </div>

            <div className="section">
                <h2>Final Thoughts</h2>
                <p className="final-thoughts">
                    Social Network Analysis reveals hidden patterns in user behavior, identifies true influencers, and brings structure to chaotic online spaces — all through the lens of graph theory.
                </p>
            </div>
        </div>
    );
};

export default Theory8;
