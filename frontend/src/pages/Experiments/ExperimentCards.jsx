import PropTypes from "prop-types";
import "./FlipCard.css";

const experiments = [
    {
        title: "Social Media Data Extraction",
        img: "/2.png",
        aim: "Acquire social media data through Web Scrapping, & APIs.",
        link: "/exp/2",
    },
    {
        title: "Sentiment Analysis on User Data",
        img: "/3.webp",
        aim: "Determine user sentiments using NLP techniques.",
        link: "/exp/3",
    },
    {
        title: "Social Media Topic Modeling",
        img: "/4.jpg",
        aim: "Identify topics from social media conversations.",
        link: "/exp/4",
    },
    {
        title: "Graph Traversal Algorithms",
        img: "/5.webp",
        aim: "Simulate graph traversal algorithms.",
        link: "/exp/5",
    },
    {
        title: "Social Network Analysis with NetworkX",
        img: "/6.jpg",
        aim: "Analyze social graphs using NetworkX library.",
        link: "/exp/6",
    },
    {
        title: "Social Media Insights via TF-IDF",
        img: "/7.jpg",
        aim: "Extract insights from social media posts using TF-IDF technique.",
        link: "/exp/7",
    },
    {
        title: "Analyze Structure of Social Media Data",
        img: "/8.webp",
        aim: "Analyze the structure of social media data using graph theory, identify influential users, & explore network interactions",
        link: "/exp/8",
    },
    {
        title: "Social Media Analysis",
        img: "/1.jpg",
        aim: "Explore social media tools like Google Analytics, Lexatics, Similarweb, etc. <br/><br/> Coming Soon...",
        link: "/exp/1",
    },
];

const FlipCard = ({ title, img, aim, link }) => {
    return (
        <div className="flip-card">
            <div className="flip-card-inner">
                <div className="flip-card-front">
                    <img src={img} alt={title} className="flip-card-img" />
                    <p className="flip-card-title">{title}</p>
                </div>

                <div className="flip-card-back">
                    <p className="aim" dangerouslySetInnerHTML={{ __html: aim }} />
                    <a href={link} className="flip-card-link">
                        🚀 Dive In
                    </a>
                </div>
            </div>
        </div>
    );
};

FlipCard.propTypes = {
    title: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    aim: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
};

const ExperimentCards = () => {
    return (
        <div className="flip-cards-container">
            {experiments.map((exp, index) => (
                <FlipCard key={index} {...exp} />
            ))}
        </div>
    );
};

export default ExperimentCards;
