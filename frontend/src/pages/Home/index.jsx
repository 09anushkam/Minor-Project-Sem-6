import styles from "./styles.module.css";
// import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import Navbar from "../../components/Navbar";
import Intro from "../../components/Intro";
import Footer from "../../components/Footer";
import Features from "../../components/Features";
import Team from "../../components/Team";
import Mentors from "../../components/Mentors";

const Home = ({ user }) => {
    return (
        <>
            <Navbar />
            <Intro user={user} />
            <div className={styles.container}>
                <h1>Social Media Analytics</h1>
                <div className={styles.sma}>
                    <p>
                        Social Media Analytics (SMA) is the process of collecting, analyzing, and interpreting social media data to gain insights into audience behavior, brand perception, and campaign impact. It leverages data mining, NLP, machine learning, and statistical analysis to measure engagement, track brand mentions, analyze sentiment, and identify trends.
                        <br /><br />
                        SMA is categorized into Descriptive Analytics (summarizing past data), Predictive Analytics (forecasting trends), and Prescriptive Analytics (suggesting actions). Its applications extend beyond marketing to politics, crisis management, and healthcare. Despite challenges like data privacy and misinformation, SMA helps organizations make informed, data-driven decisions to optimize strategies and improve user engagement.
                        <br /><br />
                        The Social Media Analytics Virtual Lab (SMA-VL) is an interactive, web-based platform designed to provide hands-on experience in SMA. It allows users to explore key techniques such as sentiment analysis, network analysis, and trend detection using real-world data. This lab enables students to practically apply theoretical concepts, enhancing their understanding of social media analytics methodologies in an interactive environment.
                    </p>
                    <img src="/intro-img.webp" alt="img" />
                </div>
            </div>
            <Features />
            <Team />
            <Mentors />
            <Footer />
        </>
    );
}

Home.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string,
        role: PropTypes.string,
    })
};

Home.defaultProps = {
    user: null
};

export default Home;
