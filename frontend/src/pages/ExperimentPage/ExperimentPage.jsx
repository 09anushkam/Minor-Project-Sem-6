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
    const [menuOpen, setMenuOpen] = useState(false); // NEW

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/experiments/${no}`)
            .then(response => setExperiment(response.data))
            .catch(error => console.error("Error fetching experiment:", error));
    }, [no]);

    if (!experiment) {
        return <div className="loading">Loading...</div>;
    }

    const SimulationComponent = lazy(() => import(`../../simulations/Simulation${no}.jsx`));
    const QuizComponent = lazy(() => import(`../../components/Quiz/Quiz${no}.jsx`));
    const ProcedureComponent = lazy(() => import(`../../procedures/Procedure${no}.jsx`));
    const TheoryComponent = lazy(() => import(`../../theory/Theory${no}.jsx`));

    const renderContent = () => {
        switch (selectedSection) {
            case "Simulation":
                return <SimulationComponent />;
            case "Procedure":
                return <ProcedureComponent />;
            case "Theory":
                return <TheoryComponent />;
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
                <div className="exp-navbar-wrapper">
                    <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? '▲' : '▼'}
                    </div>
                    <nav className={`exp-navbar ${menuOpen ? "open" : ""}`}>
                        {["Aim", "Theory", "Procedure", "Simulation", "Quiz", "References", "Feedback"].map((section, index) => (
                            <button
                                key={section}
                                className={selectedSection === section ? "active" : ""}
                                style={{ animationDelay: `${index * 0.1}s` }}
                                onClick={() => {
                                    setSelectedSection(section);
                                    setMenuOpen(false);
                                }}
                            >
                                {section}
                            </button>
                        ))}
                    </nav>
                </div>

                <h2 className="exp-title">{experiment.title}</h2>

                <div className="exp-content">
                    <Suspense fallback={<div className="loading">Loading...</div>}>
                        {renderContent()}
                    </Suspense>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ExperimentPage;
