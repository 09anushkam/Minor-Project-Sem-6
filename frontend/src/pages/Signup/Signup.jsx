import * as React from 'react';
import styles from "./styles.module.css";
import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from "../../components/Navbar";
import Footer from '../../components/Footer';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function Signup() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = React.useState(false);
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

	const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

	return (
		<>
			<Navbar />
			<div className={styles.container}>
				<div className={styles.form_container}>
					<div className={styles.left}>
						<img className={styles.img} src="/signup.jpg" alt="signup" />
					</div>
					<div className={styles.right}>
						<h2 className={styles.from_heading}>Create your Account</h2>
						<form onSubmit={handleRegister}>
							<TextField
								size='small'
								className={styles.input}
								type="text"
								id="outlined-basic"
								label="Name"
								variant="outlined"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
							<TextField
								size='small'
								className={styles.input}
								type="email"
								id="outlined-basic"
								label="Email"
								variant="outlined"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
							<FormControl size='small' variant="outlined" type="password" className={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} required>
								<InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
								<OutlinedInput
									id="outlined-adornment-password"
									type={showPassword ? 'text' : 'password'}
									endAdornment={
										<InputAdornment position="end">
											<IconButton
												aria-label={
													showPassword ? 'hide the password' : 'display the password'
												}
												onClick={handleClickShowPassword}
												onMouseDown={handleMouseDownPassword}
												onMouseUp={handleMouseUpPassword}
												edge="end"
											>
												{showPassword ? <VisibilityOff /> : <Visibility />}
											</IconButton>
										</InputAdornment>
									}
									label="Password"
								/>
							</FormControl>
							<button type="submit" className={styles.btn}>Sign Up</button>
						</form>
						<p className={styles.text}>Or</p>
						<button className={styles.google_btn} onClick={googleAuth}>
							<img src="/google.webp" alt="google icon" />
							<span>Sign In With Google</span>
						</button>
						<p className={styles.textend}>
							Already have an account ? <Link to="/login">Log In</Link>
						</p>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}

export default Signup;
