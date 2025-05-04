import "./styles/Theory.css";

const Theory5 = () => {
    return (
        <div className="theory-container">
            <h1 className="theory-title">Graph Traversal</h1>

            <div className="section">
                <h2>What Is Graph Traversal?</h2>
                <p>
                    Graph traversal is the process of visiting all the nodes (vertices) and edges in a graph in a systematic manner. This is fundamental in computer science for analyzing relationships and structures represented by graphs. Traversal algorithms are essential for tasks such as searching, pathfinding, and network analysis.
                </p>
            </div>

            <div className="section">
                <h2>Types of Graph Traversal Algorithms</h2>

                <h3>1. Depth-First Search (DFS)</h3>
                <dl>
                    <dt>Description:</dt>
                    <dd>
                        DFS is a graph traversal technique that starts at a given node and explores as far as possible along each branch before backtracking.
                    </dd>

                    <dt>Working:</dt>
                    <dd>Start at the chosen node.</dd>
                    <dd>Visit the current node and mark it as visited.</dd>
                    <dd>Recursively or iteratively visit all unvisited adjacent vertices.</dd>
                    <dd>Backtrack when no unvisited adjacent vertex is left.</dd>

                    <dt>Implementation:</dt>
                    <dd>Recursive: Uses the system call stack.</dd>
                    <dd>Iterative: Uses an explicit stack data structure.</dd>

                    <dt>Time Complexity:</dt>
                    <dd>O(V + E) for a graph with V vertices and E edges.</dd>

                    <dt>Applications:</dt>
                    <dd>Detecting cycles in a graph.</dd>
                    <dd>Topological sorting of a DAG.</dd>
                    <dd>Solving puzzles like Sudoku and mazes.</dd>
                    <dd>Finding connected components in a graph.</dd>

                    <dt>Limitations:</dt>
                    <dd>May not find the shortest path in unweighted graphs.</dd>
                    <dd>Can lead to stack overflow in large graphs if not handled carefully.</dd>
                </dl>

                <h3>2. Breadth-First Search (BFS)</h3>
                <dl>
                    <dt>Description:</dt>
                    <dd>BFS explores all neighbors of a node before moving to the next level. It is effective for finding shortest paths in unweighted graphs.</dd>

                    <dt>Working:</dt>
                    <dd>Start at the chosen node.</dd>
                    <dd>Visit the current node and mark it as visited.</dd>
                    <dd>Use a queue to explore all immediate neighbors.</dd>
                    <dd>Repeat the process for each neighbor&apos;s neighbors.</dd>

                    <dt>Implementation:</dt>
                    <dd>Typically uses a queue.</dd>

                    <dt>Time Complexity:</dt>
                    <dd>O(V + E) for a graph with V vertices and E edges.</dd>

                    <dt>Applications:</dt>
                    <dd>Finding shortest paths in unweighted graphs.</dd>
                    <dd>Level-order traversal in trees.</dd>
                    <dd>Web crawlers and social networking sites.</dd>
                    <dd>Broadcasting algorithms in networks.</dd>

                    <dt>Limitations:</dt>
                    <dd>Consumes more memory than DFS.</dd>
                    <dd>Not suitable for weighted graphs (use Dijkstra&apos;s instead).</dd>
                </dl>

                <h3>3. Dijkstra&apos;s Algorithm</h3>
                <dl>
                    <dt>Description:</dt>
                    <dd>Computes the shortest path from a single source node to all other nodes in a weighted graph with non-negative weights.</dd>

                    <dt>Working:</dt>
                    <dd>Assign tentative distances: 0 for start node, ∞ for others.</dd>
                    <dd>Select the node with the smallest tentative distance.</dd>
                    <dd>Update distances of all unvisited neighbors.</dd>
                    <dd>Repeat until all nodes are visited or shortest path is found.</dd>

                    <dt>Implementation:</dt>
                    <dd>Uses a min-priority queue (min-heap) and adjacency list.</dd>

                    <dt>Time Complexity:</dt>
                    <dd>Using array: O(V²)</dd>
                    <dd>Using binary heap + adjacency list: O((V + E) log V)</dd>

                    <dt>Applications:</dt>
                    <dd>GPS Navigation Systems.</dd>
                    <dd>Network routing (e.g., OSPF).</dd>
                    <dd>Logistics and delivery optimization.</dd>
                    <dd>Games – pathfinding for AI.</dd>

                    <dt>Limitations:</dt>
                    <dd>Does not work with negative edge weights.</dd>
                    <dd>Use Bellman-Ford for graphs with negative weights.</dd>
                </dl>
            </div>

            <div className="section">
                <h2>Data Structures Used</h2>
                <ul className="list-disc">
                    <li><strong>Stack:</strong> Used in DFS.</li>
                    <li><strong>Queue:</strong> Used in BFS.</li>
                    <li><strong>Priority Queue (Min-Heap):</strong> Used in Dijkstra&apos;s Algorithm.</li>
                </ul>
            </div>

            <div className="section">
                <h2>Graph Representations</h2>
                <ul className="list-disc">
                    <li><strong>Adjacency Matrix:</strong> 2D array indicating presence/weight of edges.</li>
                    <li><strong>Edge List:</strong> List of all edges as pairs/triplets.</li>
                    <li><strong>Adjacency List:</strong> Array/list where each node has a list of its adjacent nodes.</li>
                    <li><strong>Random Graph:</strong> Graph generated with random vertices/edges for testing.</li>
                </ul>
            </div>

            <div className="section">
                <h2>Applications Summary</h2>
                <ul className="list-disc">
                    <li><strong>DFS:</strong> Topological sorting, cycle detection, puzzles.</li>
                    <li><strong>BFS:</strong> Shortest path in unweighted graphs, social networks.</li>
                    <li><strong>Dijkstra’s Algorithm:</strong> GPS, network routing, games.</li>
                </ul>
            </div>

            <div className="section">
                <h2>Diagrams</h2>
                <div className="diagram">
                    <h3>BFS vs DFS</h3>
                    <img src="/bfs-dfs.png" alt="BFS and DFS diagram" className="diagram-image" />
                    <p>
                        BFS, shown on the left, visits nodes level by level, exploring all immediate neighbors before moving deeper. This results in a traversal order of: A → B → C → D → E → F. It uses a queue data structure and is ideal for finding the shortest path in unweighted graphs.
                        On the right, DFS explores as far as possible along each branch before backtracking, leading to the traversal: A → B → C → E → F → D. It uses a stack (or recursion) and is useful for scenarios like topological sorting, cycle detection, and maze solving.
                    </p>
                </div>

                <div className="diagram">
                    <h3>Dijkstra&apos;s Algorithm</h3>
                    <img src="/dijkstras.png" alt="Dijkstra diagram" className="diagram-image" />
                    <p>
                        In the diagram, the red lines mark the edges that belong to the shortest path. You need to follow these edges to follow the shortest path to reach a given node in the graph starting from node 0.
                        For example, if you want to reach node 6 starting from node 0, you just need to follow the red edges and you will be following the shortest path 0 → 1 → 3 → 4 → 6 automatically.
                    </p>
                </div>
            </div>

            <p className="final-thoughts">
                Graph traversal techniques are the backbone of many critical algorithms and applications in computing.
            </p>
        </div>
    );
};

export default Theory5;
