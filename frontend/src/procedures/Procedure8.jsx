import "./styles/Procedure.css";

const Procedure8 = () => {
    return (
        <div className="procedure-container">
            <h2 className="procedure-heading">Procedure for Social Network Analysis</h2>

            <div className="procedure-step">
                <h3>🔹 Set Number of Users</h3>
                <p>
                    Enter how many users you want to analyze (between 1 and 10). This
                    initializes the user list and the follow‑relationship grid.
                </p>
            </div>

            <div className="procedure-step">
                <h3>🔹 Name Your Users</h3>
                <p>
                    For each user slot, type a custom name (e.g., “Alice”, “Bob”). If you
                    leave it blank, defaults like “User 1” will apply.
                </p>
            </div>

            <div className="procedure-step">
                <h3>🔹 Define Follow Relationships</h3>
                <p>
                    In the grid labeled “Who follows whom?”, click on a cell to toggle a
                    follow (✓). Rows are followers; columns are followees. You cannot
                    follow yourself.
                </p>
            </div>

            <div className="procedure-step">
                <h3>🔹 Analyze the Network</h3>
                <p>
                    Click the <strong>Analyze Network</strong> button. The app computes:
                    <ul>
                        <li>Popularity (in‑degree)</li>
                        <li>Information Broker (betweenness)</li>
                        <li>Network Reach (closeness)</li>
                        <li>Power Score (eigenvector)</li>
                        <li>Authority (PageRank)</li>
                        <li>Overall Influence (weighted mix of the above)</li>
                    </ul>
                </p>
            </div>

            <div className="procedure-step">
                <h3>🔹 View Top Influencers</h3>
                <p>
                    Scroll to “Top Influencers Analysis” to see cards ranking users by
                    overall influence and their primary role in the network.
                </p>
            </div>

            <div className="procedure-step">
                <h3>🔹 Review Detailed Metrics</h3>
                <p>
                    At the bottom, the “Detailed Network Analysis” table lists each user
                    with their individual metric scores for side‑by‑side comparison.
                </p>
            </div>

            <div className="procedure-step">
                <h3>🔹 Record or Export Results</h3>
                <p>
                    Copy the cards or table into your report. To automate, you can extend
                    the code to export the <code>metrics</code> object as CSV or JSON.
                </p>
            </div>

            <div className="note">
                <strong>Note:</strong> You must define at least one follow relationship before clicking “Analyze Network,” or you’ll see an error message.
            </div>
        </div>
    );
};

export default Procedure8;
