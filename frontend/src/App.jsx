import { useContext, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import './App.css';
import { AuthContext } from './utils/authContext';

// Import your components
import Home from './pages/Home/index';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Experiments from './pages/Experiments/Experiments';
import AboutPage from './pages/AboutPage/AboutPage';
// import QuizHistory from './components/Quiz/QuizHistory';
import NotFound from './components/NotFound';
import ExperimentPage from './pages/ExperimentPage/ExperimentPage';

function App() {
    const { user, login } = useContext(AuthContext);

    useEffect(() => {
        const getUser = async () => {
            try {
                const url = `${import.meta.env.VITE_BACKEND_URL}/auth/login/success`;
                const { data } = await axios.get(url, { withCredentials: true });
                if (data && data.user) {
                    await login(data.user);
                }
            } catch (err) {
                console.error('Error fetching user data:', err.message || err);
            }
        };

        getUser();
    }, []); // Only run once on mount

    // Add a loading state while checking authentication
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const url = `${import.meta.env.VITE_BACKEND_URL}/auth/login/success`;
                await axios.get(url, { withCredentials: true });
            } catch (err) {
                console.error('Auth check failed:', err.message || err);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="app">
            <Navbar />
            <div className="main-content">
                <Routes>
                    <Route path="/" element={<Home user={user} />} />
                    <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
                    <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
                    <Route path="/exp" element={user ? <Experiments user={user} /> : <Navigate to="/login" />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/exp/:no" element={user ? <ExperimentPage /> : <Navigate to="/login" />} />
                    {/* <Route path="/quiz-history" element={user ? <QuizHistory /> : <Navigate to="/login" />} /> */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
