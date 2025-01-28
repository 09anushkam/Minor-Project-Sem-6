import styles from "./styles.module.css";
import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
	const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/auth/signup', { name, email, password });
            alert(response.data.message);
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.message || 'Registration failed');
        }
    };

	const googleAuth = () => {
		window.open(
			`http://localhost:8080/auth/google/callback`,
			"_self"
		);
	};
	return (
		<div className={styles.container}>
			<h1 className={styles.heading}>Signup</h1>
			<div className={styles.form_container}>
				<div className={styles.left}>
					<img className={styles.img} src="/signup.jpg" alt="signup" />
				</div>
				<div className={styles.right}>
					<h2 className={styles.from_heading}>Create your account</h2>
					<form onSubmit={handleRegister}>
						<input
							type="text"
							placeholder="Name"
							className={styles.input}
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
						<input
							type="email"
							placeholder="Email"
							className={styles.input}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
						<input
							type="password"
							placeholder="Password"
							className={styles.input}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
						<button type="submit" className={styles.btn}>Signup</button>
					</form>
					<p className={styles.text}>Or Continue With</p>
					<button className={styles.google_btn} onClick={googleAuth}>
						<img src="/google.png" alt="google icon" />
						<span>Google</span>
					</button>
					<p className={styles.text}>
						Already have an account ? <Link to="/login">Log In</Link>
					</p>
				</div>
			</div>
		</div>
	);
}

export default Signup;