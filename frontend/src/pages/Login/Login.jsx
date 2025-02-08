import { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../../utils/authContext';
import styles from "./styles.module.css";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/auth/login', { email, password }, { withCredentials: true });
            const userData = response.data.user;
            await login(userData);
            alert(response.data.message);
            navigate('/');
            window.location.reload();
        } catch (err) {
            alert(err.response?.data?.message || 'Login failed');
        }
    };

    const googleAuth = () => {
        window.open(
            `http://localhost:8080/auth/google/callback`,
            "_self"
        );
    };
    return (
        <>
            <div className={styles.container}>
                {/* <h1 className={styles.heading}>Welcome back</h1> */}
                <div className={styles.form_container}>
                    <div className={styles.left}>
                        <img className={styles.img} src="/login.jpg" alt="login" />
                    </div>
                    <div className={styles.right}>
                        <form onSubmit={handleLogin}>
                            <h2 className={styles.from_heading}>Login to your account</h2>
                            <input
                                type="email"
                                className={styles.input}
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                className={styles.input}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button type='submit' className={styles.btn}>Login</button>
                        </form>
                        <p className={styles.text}>Or continue with</p>
                        <button className={styles.google_btn} onClick={googleAuth}>
                            <img src="/google.png" alt="google icon" />
                            <span>Google</span>
                        </button>
                        <p className={styles.text}>
                            Don&apos;t have an account?{" "} <Link to="/signup">Sign Up</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;
