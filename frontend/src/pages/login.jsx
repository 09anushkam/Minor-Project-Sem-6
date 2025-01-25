import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../utils/authContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/auth/login', { email, password });
            const userData = response.data.user;
            console.log('Email & password: ', email, password);
            login(userData);
            alert(response.data.message);
            navigate(userData.role === 'admin' ? '/admin' : '/dashboard');
        } catch (err) {
            alert(err.response?.data?.message || 'Login failed');
        }
    };

    const handleOAuthLogin = (provider) => {
        const baseURL = 'http://localhost:8080/auth';
        const providerURL = `${baseURL}/${provider}`;
        window.location.href = providerURL;
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            <hr />
            <h3>Or Login With</h3>
            <button onClick={() => handleOAuthLogin('google')} style={{ backgroundColor: '#DB4437', color: 'white' }}>
                Login with Google
            </button>
            <button onClick={() => handleOAuthLogin('facebook')} style={{ backgroundColor: '#4267B2', color: 'white' }}>
                Login with Facebook
            </button>
            <button onClick={() => handleOAuthLogin('twitter')} style={{ backgroundColor: '#1DA1F2', color: 'white' }}>
                Login with Twitter
            </button>
        </div>
    );
}

export default Login;
