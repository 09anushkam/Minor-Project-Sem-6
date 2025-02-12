import "./styles/Features.css";

const featuresData = [
    {
        title: "Improve Problem Solving",
        description: "Develop analytical skills by solving real-world social media challenges through hands-on exercises and case studies.",
        icon: "💡",
        color: "#9B2928",
    },
    {
        title: "Interactive Simulator",
        description: "Experiment with real-time social media data using hands-on simulations for sentiment analysis, trend detection, and engagement tracking.",
        icon: "🔗",
        color: "#01438D",
    },
    {
        title: "Data Visualization",
        description: "Analyze insights effectively through interactive charts, graphs, and word clouds for better trend interpretation.",
        icon: "📊",
        color: "#9B2928",
    },
    {
        title: "Quiz & Assessment Module",
        description: "Test your knowledge with interactive quizzes and assessments, receiving instant feedback for continuous learning.",
        icon: "📝",
        color: "#01438D",
    }
];

const Features = () => {
    return (
        <section className="features-section">
            <h1 className="features-title">Features of SMA Virtual Lab</h1>
            <div className="features-container">
                {featuresData.map((feature, index) => (
                    <div className="feature-card" key={index} style={{ borderColor: feature.color }}>
                        <div className="icon" style={{ backgroundColor: feature.color }}>
                            {feature.icon}
                        </div>
                        <h3 className="feature-title" style={{ color: feature.color }}>
                            {feature.title}
                        </h3>
                        <p className="feature-description">{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Features;
