import { useState } from "react";
import "./styles/Simulation2.css";
import BeautifulSoup from "./methods/BeautifulSoup";
import Requests from "./methods/Requests";
import TwitterAPI from "./methods/TwitterAPI";
import FacebookAPI from "./methods/FacebookAPI";
import InstagramAPI from "./methods/InstagramAPI";
import YouTubeAPI from "./methods/YouTubeAPI";
import IEEEXplore from "./methods/IEEEXplore";

const Simulation2 = () => {
    const [selectedMethod, setSelectedMethod] = useState(null);

    const renderComponent = () => {
        switch (selectedMethod) {
            case "BeautifulSoup":
                return <BeautifulSoup />;
            case "Requests":
                return <Requests />;
            case "TwitterAPI":
                return <TwitterAPI />;
            case "FacebookAPI":
                return <FacebookAPI />;
            case "InstagramAPI":
                return <InstagramAPI />;
            case "YouTubeAPI":
                return <YouTubeAPI />;
            case "IEEEXplore":
                return <IEEEXplore />;
            default:
                return <p className="center-karo">Please select a method for data extraction.</p>;
        }
    };

    return (
        <div className="simulation2-container">
            <h1 className="header2">Select a method for Data Extraction</h1>
            <div className="button2-container">
                {[
                    "BeautifulSoup",
                    "Requests",
                    "TwitterAPI",
                    // "FacebookAPI",
                    // "InstagramAPI",
                    // "YouTubeAPI",
                    // "IEEEXplore",
                ].map((method) => (
                    <button
                        key={method}
                        onClick={() => setSelectedMethod(method)}
                        className={selectedMethod === method ? "active" : ""}
                    >
                        {method}
                    </button>
                ))}
            </div>
            <div className="component2-container">{renderComponent()}</div>
        </div>
    );
};

export default Simulation2;
