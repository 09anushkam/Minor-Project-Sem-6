import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import './styles/Theory.css';

const Theory6 = () => {
    return (
        <div className="theory-container">
            <h1 className="theory-title">Social Network as a Graph</h1>

            <div className="section">
                <h2>Social Network as a Graph</h2>
                <p>In graph theory, a social network is modeled as a graph <InlineMath math="G = (V, E)" />, where:</p>
                <ul className="list-disc">
                    <li><strong>V</strong> is the set of vertices (nodes) representing individuals</li>
                    <li><strong>E</strong> is the set of edges representing interactions or relationships</li>
                </ul>
                <p>
                    These graphs can be directed (e.g., follower-following relationships on Twitter) or undirected
                    (e.g., Facebook friendships). Analyzing such networks reveals insights into group dynamics,
                    influence patterns, and information dissemination.
                </p>
            </div>

            <div className="section">
                <h2>Random Graphs in Social Networks</h2>
                <p>Random graphs simulate unpredictable human interactions by creating edges based on a fixed probability. Common models include:</p>
                <ul className="list-disc">
                    <li><strong>Erdős–Rényi model</strong>: Each possible edge exists with independent probability <InlineMath math="p" />.</li>
                    <li><strong>Barabási–Albert model</strong>: Generates scale-free networks with power-law degree distribution, matching real social networks where few nodes (influencers) have very high connectivity.</li>
                </ul>
                <p>These models allow for hypothesis testing and structural property analysis without real-world data.</p>
            </div>

            <div className="section">
                <h2>Influencer Node</h2>
                <p>An influencer node is a central entity with significant reach or control. Identification helps in:</p>
                <ul className="list-disc">
                    <li>Targeting users for viral marketing</li>
                    <li>Understanding opinion leaders</li>
                    <li>Blocking misinformation or disease transmission</li>
                </ul>
                <p>Influencer detection uses more than degree; it involves centrality measures and network positioning.</p>
            </div>

            <div className="section">
                <h2>Centrality Measures (Network Metrics)</h2>
                <dl>
                    <dt>Degree Centrality</dt>
                    <dd>
                        Defined as the number of edges connected to a node. Indicates socially active individuals.
                        <br />
                        <strong>Formula:</strong>
                        <BlockMath math="C_D(v) = \deg(v)" />
                        <BlockMath math="C_D(v) = \frac{\deg(v)}{n - 1}" />
                        where <InlineMath math="n" /> is the total number of nodes.
                    </dd>

                    <dt>Closeness Centrality</dt>
                    <dd>
                        Measures how easily a node can reach all others. Useful for finding efficient communicators.
                        <br />
                        <strong>Formula:</strong>
                        <BlockMath math="C_C(v) = \frac{n - 1}{\sum_{u \neq v} d(v, u)}" />
                        where <InlineMath math="d(v, u)" /> is the shortest distance between nodes <InlineMath math="v" /> and <InlineMath math="u" />.
                    </dd>

                    <dt>Betweenness Centrality</dt>
                    <dd>
                        Indicates nodes connecting parts of the graph. Shows information brokers or gatekeepers.
                        <br />
                        <strong>Formula:</strong>
                        <BlockMath math="C_B(v) = \sum_{s \neq v \neq t} \frac{\sigma_{st}(v)}{\sigma_{st}}" />
                        where <InlineMath math="\sigma_{st}" /> is the total number of shortest paths from <InlineMath math="s" /> to <InlineMath math="t" />, and <InlineMath math="\sigma_{st}(v)" /> is the number of those paths passing through <InlineMath math="v" />.
                    </dd>

                    <dt>Eigenvector Centrality</dt>
                    <dd>
                        Scores a node based on its neighbors&apos; importance. Used in Google’s PageRank algorithm.
                        <br />
                        <strong>Formula:</strong>
                        <BlockMath math="x_i = \frac{1}{\lambda} \sum_{j \in M(i)} x_j" />
                        where <InlineMath math="x_i" /> is the score of node <InlineMath math="i" />, <InlineMath math="M(i)" /> are its neighbors, and <InlineMath math="\lambda" /> is a constant.
                    </dd>
                </dl>
            </div>

            <div className="section">
                <h2>Other Network Properties</h2>
                <dl>
                    <dt>Density</dt>
                    <dd>Ratio of existing to possible edges. High density means tight connections; low may mean weak ties.</dd>

                    <dt>Diameter</dt>
                    <dd>Longest shortest path between nodes. Shows max communication delay.</dd>

                    <dt>Average Clustering Coefficient</dt>
                    <dd>Likelihood that a node’s neighbors are also connected. Indicates local communities.</dd>

                    <dt>Connected Components</dt>
                    <dd>Subgraphs where nodes can all reach each other. Helps detect isolated groups or fragmentation.</dd>
                </dl>
            </div>

            <div className="section">
                <h2>Relevance of Network Analysis</h2>
                <p>Network analysis bridges disciplines:</p>
                <ul className="list-disc">
                    <li>Social media recommends friends/followers</li>
                    <li>Healthcare models contagion or mental support</li>
                    <li>Businesses improve internal communication</li>
                    <li>Politics tracks influence and reach</li>
                </ul>
                <p>
                    In research, Social Network Analysis (SNA) is vital for understanding group behavior, innovation diffusion, and collaboration patterns.
                </p>
            </div>

            <p className="final-thoughts">Understanding social graphs opens up real-world applications across diverse fields.</p>
        </div>
    );
};

export default Theory6;
