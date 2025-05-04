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
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	const [nameError, setNameError] = useState('');
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');

	const validateName = (value) => {
		setName(value);
		setNameError(value.length >= 3 ? '' : 'Name must be at least 3 characters');
	};

	const validateEmail = (value) => {
		setEmail(value);
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		setEmailError(emailPattern.test(value) ? '' : 'Invalid email format');
	};

	const validatePassword = (value) => {
		setPassword(value);
		const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
		setPasswordError(passwordPattern.test(value) ? '' : 'Password must be 8+ chars, 1 uppercase, 1 number, 1 special char');
	};

	const handleRegister = async (e) => {
		e.preventDefault();
		if (nameError || emailError || passwordError || !name || !email || !password) return;

		try {
			const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/signup`, { name, email, password });
			alert(response.data.message);
			navigate('/login');
		} catch (err) {
			alert(err.response?.data?.message || 'Registration failed');
		}
	};

	const googleAuth = () => {
		window.open(`${import.meta.env.VITE_BACKEND_URL}/auth/google/callback`, "_self");
	};

	const handleClickShowPassword = () => setShowPassword((show) => !show);

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
								label="Name"
								variant="outlined"
								value={name}
								onChange={(e) => validateName(e.target.value)}
								error={!!nameError}
								helperText={nameError}
								required
							/>
							<TextField
								size='small'
								className={styles.input}
								type="email"
								label="Email"
								variant="outlined"
								value={email}
								onChange={(e) => validateEmail(e.target.value)}
								error={!!emailError}
								helperText={emailError}
								required
							/>
							<FormControl size='small' variant="outlined" className={styles.input} required>
								<InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
								<OutlinedInput
									id="outlined-adornment-password"
									type={showPassword ? 'text' : 'password'}
									value={password}
									onChange={(e) => validatePassword(e.target.value)}
									error={!!passwordError}
									endAdornment={
										<InputAdornment position="end">
											<IconButton
												aria-label={showPassword ? 'hide password' : 'show password'}
												onClick={handleClickShowPassword}
												edge="end"
											>
												{showPassword ? <VisibilityOff /> : <Visibility />}
											</IconButton>
										</InputAdornment>
									}
									label="Password"
								/>
							</FormControl>
							{passwordError && <p className={styles.error}>{passwordError}</p>}
							<button type="submit" className={styles.btn} disabled={!!nameError || !!emailError || !!passwordError || !name || !email || !password}>
								Sign Up
							</button>
						</form>

						<p className={styles.text}>Or</p>
						<button className={styles.google_btn} onClick={googleAuth}>
							<img src="/google.webp" alt="google icon" />
							<span>Sign In With Google</span>
						</button>

						<p className={styles.textend}>
							Already have an account? <Link to="/login">Log In</Link>
						</p>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}

export default Signup;
