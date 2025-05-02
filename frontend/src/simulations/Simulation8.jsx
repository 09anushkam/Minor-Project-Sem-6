import React, { useState } from "react";
import "./styles/Simulation8.css";

const Simulation8 = () => {
  // State for network data
  const [numUsers, setNumUsers] = useState(5);
  const [userNames, setUserNames] = useState([]);
  const [followMatrix, setFollowMatrix] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Initialize user names and follow matrix when number of users changes
  React.useEffect(() => {
    if (numUsers > 0) {
      const newUserNames = Array(numUsers).fill("").map((_, i) => `User ${i + 1}`);
      setUserNames(newUserNames);
      const newFollowMatrix = Array(numUsers).fill().map(() => Array(numUsers).fill(false));
      setFollowMatrix(newFollowMatrix);
    }
  }, [numUsers]);

  // Handle user name change
  const handleUserNameChange = (index, name) => {
    const newUserNames = [...userNames];
    newUserNames[index] = name;
    setUserNames(newUserNames);
  };

  // Handle follow relationship toggle
  const handleFollowToggle = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    const newFollowMatrix = [...followMatrix];
    newFollowMatrix[fromIndex][toIndex] = !newFollowMatrix[fromIndex][toIndex];
    setFollowMatrix(newFollowMatrix);
  };

  // Calculate all centrality metrics
  const calculateMetrics = () => {
    setLoading(true);
    setError("");

    try {
      // Create nodes and edges
      const nodes = userNames.map((name, index) => ({
        id: index.toString(),
        label: name
      }));

      const edges = [];
      followMatrix.forEach((row, fromIndex) => {
        row.forEach((follows, toIndex) => {
          if (follows) {
            edges.push({
              from: fromIndex.toString(),
              to: toIndex.toString()
            });
          }
        });
      });

      if (nodes.length === 0 || edges.length === 0) {
        throw new Error("Please define some relationships before analyzing");
      }

      // Calculate metrics for each user
      const n = nodes.length;
      const newMetrics = {};

      nodes.forEach(node => {
        // Initialize metrics object for each user
        newMetrics[node.id] = {
          inDegree: 0,
          outDegree: 0,
          betweenness: 0,
          closeness: 0,
          eigenvector: 0,
          pagerank: 0
        };
      });

      // Calculate in-degree and out-degree
      edges.forEach(edge => {
        newMetrics[edge.to].inDegree++;
        newMetrics[edge.from].outDegree++;
      });

      // Normalize metrics
      nodes.forEach(node => {
        const normalizedMetrics = {
          popularity: newMetrics[node.id].inDegree / (n - 1),
          infoBroker: calculateBetweenness(node.id, edges, nodes),
          networkReach: calculateCloseness(node.id, edges, nodes),
          powerScore: calculateEigenvector(node.id, edges, nodes),
          authority: calculatePageRank(node.id, edges, nodes)
        };

        // Calculate overall influence score using weighted formula
        const overallInfluence =
          (0.3 * normalizedMetrics.powerScore) +
          (0.3 * normalizedMetrics.authority) +
          (0.2 * normalizedMetrics.infoBroker) +
          (0.1 * normalizedMetrics.popularity) +
          (0.1 * normalizedMetrics.networkReach);

        newMetrics[node.id] = {
          ...normalizedMetrics,
          overallInfluence
        };
      });

      setMetrics(newMetrics);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Helper function for finding all shortest paths
  const findAllShortestPaths = (start, end, adjacencyList) => {
    const paths = [];
    const visited = new Set();

    const dfs = (current, target, path) => {
      if (current === target) {
        paths.push([...path]);
        return;
      }

      visited.add(current);
      adjacencyList[current].forEach(neighbor => {
        if (!visited.has(neighbor)) {
          path.push(neighbor);
          dfs(neighbor, target, path);
          path.pop();
        }
      });
      visited.delete(current);
    };

    dfs(start, end, [start]);

    // Filter to keep only shortest paths
    const minLength = Math.min(...paths.map(p => p.length));
    return paths.filter(p => p.length === minLength);
  };

  // Helper functions for metric calculations
  const calculateBetweenness = (nodeId, edges, nodes) => {
    // Implementation for betweenness centrality
    const n = nodes.length;
    let betweenness = 0;

    // Create undirected adjacency list for shortest paths
    const undirectedAdjList = {};
    nodes.forEach(node => {
      undirectedAdjList[node.id] = [];
    });
    edges.forEach(edge => {
      undirectedAdjList[edge.from].push(edge.to);
      undirectedAdjList[edge.to].push(edge.from);
    });

    nodes.forEach(source => {
      if (source.id !== nodeId) {
        nodes.forEach(target => {
          if (target.id !== nodeId && target.id !== source.id) {
            const paths = findAllShortestPaths(source.id, target.id, undirectedAdjList);
            if (paths.length > 0) {
              const pathsThroughNode = paths.filter(path => path.includes(nodeId));
              betweenness += pathsThroughNode.length / paths.length;
            }
          }
        });
      }
    });

    return betweenness / ((n - 1) * (n - 2) / 2);
  };

  const calculateCloseness = (nodeId, edges, nodes) => {
    // Implementation for closeness centrality
    const distances = {};
    nodes.forEach(n => distances[n.id] = Infinity);
    distances[nodeId] = 0;

    const queue = [nodeId];
    const visited = new Set([nodeId]);

    // Create directed adjacency list
    const directedAdjList = {};
    nodes.forEach(node => {
      directedAdjList[node.id] = [];
    });
    edges.forEach(edge => {
      directedAdjList[edge.from].push(edge.to);
    });

    while (queue.length > 0) {
      const current = queue.shift();
      // Consider both incoming and outgoing edges for closeness
      directedAdjList[current].forEach(neighbor => {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          distances[neighbor] = distances[current] + 1;
          queue.push(neighbor);
        }
      });

      edges.filter(e => e.to === current).forEach(edge => {
        const neighbor = edge.from;
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          distances[neighbor] = distances[current] + 1;
          queue.push(neighbor);
        }
      });
    }

    // Check if all nodes are reachable
    const reachableNodes = Object.values(distances).filter(d => d !== Infinity).length;
    if (reachableNodes < nodes.length) {
      return 0; // If not all nodes are reachable
    }

    const sumDistances = Object.values(distances).reduce((a, b) => a + b, 0);
    return (reachableNodes - 1) / sumDistances;
  };

  const calculateEigenvector = (nodeId, edges, nodes) => {
    // Implementation for eigenvector centrality
    const adjacencyMatrix = {};
    nodes.forEach(node => {
      adjacencyMatrix[node.id] = {};
      nodes.forEach(n => {
        adjacencyMatrix[node.id][n.id] = 0;
      });
    });

    edges.forEach(edge => {
      adjacencyMatrix[edge.from][edge.to] = 1;
    });

    let eigenvector = {};
    nodes.forEach(node => {
      eigenvector[node.id] = 1;
    });

    // Power iteration method
    for (let i = 0; i < 50; i++) {
      const newEigenvector = {};
      let sum = 0;

      nodes.forEach(node => {
        let value = 0;
        nodes.forEach(n => {
          value += adjacencyMatrix[n.id][node.id] * eigenvector[n.id];
        });
        newEigenvector[node.id] = value;
        sum += value * value;
      });

      // Normalize
      const magnitude = Math.sqrt(sum);
      if (magnitude === 0) return 0;

      nodes.forEach(node => {
        eigenvector[node.id] = newEigenvector[node.id] / magnitude;
      });
    }

    return eigenvector[nodeId];
  };

  const calculatePageRank = (nodeId, edges, nodes) => {
    // Implementation for PageRank
    const d = 0.85; // Damping factor
    const adjacencyMatrix = {};
    const outDegrees = {};

    // Initialize
    nodes.forEach(node => {
      adjacencyMatrix[node.id] = {};
      outDegrees[node.id] = 0;
      nodes.forEach(n => {
        adjacencyMatrix[node.id][n.id] = 0;
      });
    });

    // Build adjacency matrix and count out-degrees
    edges.forEach(edge => {
      adjacencyMatrix[edge.from][edge.to] = 1;
      outDegrees[edge.from]++;
    });

    let pagerank = {};
    nodes.forEach(node => {
      pagerank[node.id] = 1 / nodes.length;
    });

    // Power iteration for PageRank
    for (let i = 0; i < 50; i++) {
      const newPagerank = {};
      nodes.forEach(node => {
        let sum = 0;
        nodes.forEach(n => {
          if (adjacencyMatrix[n.id][node.id] === 1) {
            sum += pagerank[n.id] / outDegrees[n.id];
          }
        });
        newPagerank[node.id] = (1 - d) / nodes.length + d * sum;
      });
      pagerank = { ...newPagerank };
    }

    return pagerank[nodeId];
  };

  // Helper function to determine primary role
  const getPrimaryRole = (metrics) => {
    const { popularity, infoBroker, networkReach, powerScore, authority } = metrics;
    const roles = [
      { value: popularity, role: "Popular User (high direct connections)" },
      { value: infoBroker, role: "Information Broker (connects different groups)" },
      { value: networkReach, role: "Network Hub (high reach)" },
      { value: powerScore, role: "Power User (connected to important users)" },
      { value: authority, role: "Authority (trusted by network)" }
    ];

    return roles.reduce((max, curr) => curr.value > max.value ? curr : max).role;
  };

  // Render the follow matrix
  const renderFollowMatrix = () => {
    return (
      <div className="follow-matrix">
        <h3>Who follows whom?</h3>
        <p>Click on cells to toggle follow relationships</p>
        <div className="matrix-container">
          <div className="matrix-header">
            <div className="matrix-cell header-cell"></div>
            {userNames.map((name, index) => (
              <div key={index} className="matrix-cell header-cell">
                {name}
              </div>
            ))}
          </div>
          {userNames.map((name, fromIndex) => (
            <div key={fromIndex} className="matrix-row">
              <div className="matrix-cell header-cell">{name}</div>
              {userNames.map((_, toIndex) => (
                <div
                  key={toIndex}
                  className={`matrix-cell ${fromIndex === toIndex ? 'self-cell' : ''} ${followMatrix[fromIndex][toIndex] ? 'follows' : ''}`}
                  onClick={() => handleFollowToggle(fromIndex, toIndex)}
                >
                  {fromIndex === toIndex ? '—' : followMatrix[fromIndex][toIndex] ? '✓' : ''}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render influencer analysis
  const renderInfluencerAnalysis = (metrics) => {
    if (!metrics || Object.keys(metrics).length === 0) return null;

    // Sort users by overall influence
    const sortedUsers = Object.entries(metrics)
      .sort(([, a], [, b]) => (b.overallInfluence || 0) - (a.overallInfluence || 0));

    return (
      <div className="influencers-section">
        <h3>Top Influencers Analysis</h3>
        <div className="influencers-list">
          {sortedUsers.map(([userId, userMetrics]) => {
            if (!userMetrics) return null;

            return (
              <div key={userId} className="influencer-card">
                <h4>{userNames[parseInt(userId)] || `User ${parseInt(userId) + 1}`}</h4>
                <div className="primary-role">
                  {getPrimaryRole(userMetrics)}
                </div>
                <div className="metrics-breakdown">
                  <h5>Influence Metrics:</h5>
                  <ul>
                    <li>
                      <span>Popularity:</span>
                      <span>{(userMetrics.popularity || 0).toFixed(4)}</span>
                    </li>
                    <li>
                      <span>Information Broker:</span>
                      <span>{(userMetrics.infoBroker || 0).toFixed(4)}</span>
                    </li>
                    <li>
                      <span>Network Reach:</span>
                      <span>{(userMetrics.networkReach || 0).toFixed(4)}</span>
                    </li>
                    <li>
                      <span>Power Score:</span>
                      <span>{(userMetrics.powerScore || 0).toFixed(4)}</span>
                    </li>
                    <li>
                      <span>Authority:</span>
                      <span>{(userMetrics.authority || 0).toFixed(4)}</span>
                    </li>
                  </ul>
                </div>
                <div className="overall-score">
                  Overall Influence: {(userMetrics.overallInfluence || 0).toFixed(4)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="simulation8-container">
      <div className="num-users-section">
        <label htmlFor="numUsers">Number of Users:</label>
        <input
          type="number"
          id="numUsers"
          value={numUsers}
          onChange={(e) => setNumUsers(Math.max(1, Math.min(10, parseInt(e.target.value) || 0)))}
          min="1"
          max="10"
        />
      </div>

      <div className="user-input-section">
        <h2>User Names</h2>
        <div className="user-names-grid">
          {userNames.map((name, index) => (
            <div key={index} className="user-name-input">
              <label htmlFor={`user-${index}`}>{`User ${index + 1}:`}</label>
              <input
                type="text"
                id={`user-${index}`}
                value={name}
                onChange={(e) => handleUserNameChange(index, e.target.value)}
                placeholder={`User ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="follow-matrix">
        {renderFollowMatrix()}
      </div>

      <button
        className="analyze-button"
        onClick={calculateMetrics}
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Analyze Network"}
      </button>

      {Object.keys(metrics).length > 0 && (
        <>
          {renderInfluencerAnalysis(metrics)}

          <div className="metrics-summary">
            <h3>Detailed Network Analysis</h3>
            <div className="metrics-summary-table-container">
              <table className="metrics-summary-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Popularity</th>
                    <th>Info Broker</th>
                    <th>Network Reach</th>
                    <th>Power Score</th>
                    <th>Authority</th>
                  </tr>
                </thead>
                <tbody>
                  {userNames.map((name, index) => {
                    const userMetrics = metrics[index.toString()] || {};
                    return (
                      <tr key={index}>
                        <td>{name}</td>
                        <td>{(userMetrics.popularity || 0).toFixed(4)}</td>
                        <td>{(userMetrics.infoBroker || 0).toFixed(4)}</td>
                        <td>{(userMetrics.networkReach || 0).toFixed(4)}</td>
                        <td>{(userMetrics.powerScore || 0).toFixed(4)}</td>
                        <td>{(userMetrics.authority || 0).toFixed(4)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Simulation8;
