import styles from "./styles.module.css";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

const Home = ({ user }) => {
    const logout = () => {
        window.open(`http://localhost:8080/auth/logout`, "_self");
    };
    return (
        <>
            <h1 className={styles.heading}>Home Page</h1>
            <p>Welcome, {user?.name}!</p>
            <Link
                to="/dashboard"
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
                Go to Dashboard
            </Link>
            <button className={styles.btn} onClick={logout}>Log Out</button>
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
