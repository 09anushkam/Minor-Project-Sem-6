import { useState, useEffect, lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ExperimentPage.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

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

    // const SimulationComponent = lazy(() => import(`../../components/Simulation${no}`));
    // const QuizComponent = lazy(() => import(`../../components/Quiz${no}`));

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
                        {selectedSection === "Simulation" ? (
                            // <SimulationComponent />
                            <></>
                        ) : selectedSection === "Quiz" ? (
                            // <QuizComponent />
                            <></>
                        ) : (
                            <p>{experiment[selectedSection.toLowerCase()]}</p>
                        )}
                    </Suspense>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ExperimentPage;
