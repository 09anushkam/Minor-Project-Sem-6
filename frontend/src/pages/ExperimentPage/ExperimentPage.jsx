import { useState, useEffect, lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ExperimentPage.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import FeedbackForm from "../../components/Feedback/FeedbackForm";

const ExperimentPage = () => {
    const { no } = useParams();
    const [experiment, setExperiment] = useState(null);
    const [selectedSection, setSelectedSection] = useState("Aim");

    useEffect(() => {
        axios.get(`http://localhost:8080/api/experiments/${no}`)
            .then(response => setExperiment(response.data))
            .catch(error => console.error("Error fetching experiment:", error));
    }, [no]);

    if (!experiment) {
        return <div className="loading">Loading...</div>;
    }

    const SimulationComponent = lazy(() => import(`../../simulations/Simulation${no}.jsx`));
    const QuizComponent = lazy(() => import(`../../components/Quiz/Quiz${no}.jsx`));
    const ProcedureComponent = lazy(() => import(`../../procedures/Procedure${no}.jsx`));

    const renderContent = () => {
        switch (selectedSection) {
            case "Simulation":
                return <SimulationComponent />;
            case "Procedure":
                return <ProcedureComponent />;
            case "Quiz":
                return <QuizComponent />;
            case "Feedback":
                return <FeedbackForm experimentNo={parseInt(no)} />;
            default:
                return (
                    <div
                        dangerouslySetInnerHTML={{
                            __html: experiment[selectedSection.toLowerCase()]
                        }}
                    />
                );
        }
    };

    return (
        <>
            <Navbar />
            <div className="experiment-container">
                <nav className="exp-navbar">
                    {["Aim", "Theory", "Procedure", "Simulation", "Quiz", "References", "Feedback"].map((section) => (
                        <button
                            key={section}
                            className={selectedSection === section ? "active" : ""}
                            onClick={() => setSelectedSection(section)}
                        >
                            {section}
                        </button>
                    ))}
                </nav>

                <h2 className="exp-title">{experiment.title}</h2>

                <div className="exp-content">
                    <Suspense fallback={<div>Loading...</div>}>
                        {renderContent()}
                    </Suspense>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ExperimentPage;
