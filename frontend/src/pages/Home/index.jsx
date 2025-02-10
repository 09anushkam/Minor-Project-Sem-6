import styles from "./styles.module.css";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import Navbar from "../../components/Navbar";
import Intro from "../../components/Intro";

const Home = ({ user }) => {
    return (
        <>
            <Navbar />
            <Intro />
            <div className={styles.container}>
                <h1 className={styles.heading}>Home Page</h1>
                <p>Welcome, {user?.name}!</p>
                <Link
                    to="/exp"
                    style={{
                        display: "inline-block",
                        padding: "10px 20px",
                        backgroundColor: "#007BFF",
                        color: "#fff",
                        textDecoration: "none",
                        borderRadius: "5px",
                        marginTop: "10px"
                    }}
                >
                    Go to Experiments
                </Link>
            </div>
        </>
    );
}

Home.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
    }).isRequired,
};

export default Home;
