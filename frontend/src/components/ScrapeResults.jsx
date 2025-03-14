import PropTypes from "prop-types";

const ScrapeResults = ({ results }) => {
    return (
        <div>
            <h3>Results:</h3>
            {Array.isArray(results) ? (
                results.map((item, index) => (
                    <p key={index}>{item}</p>
                ))
            ) : typeof results === "object" ? (
                Object.entries(results).map(([key, value]) => (
                    <div
                        key={key}
                        style={{
                            whiteSpace: "pre-wrap",
                            wordWrap: "break-word"
                        }}
                    >
                        <strong>{key}:</strong> <p>{value}</p>
                    </div>
                ))
            ) : (
                <p>{results}</p>
            )}
        </div>
    );
};

ScrapeResults.propTypes = {
    results: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.object
    ]).isRequired,
};

export default ScrapeResults;
