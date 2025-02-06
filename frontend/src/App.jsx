import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Home from "./pages/Home/index";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Experiments from './pages/Experiments/Experiments';
import AdminPanel from './pages/AdminPanel/AdminPanel';
import { AuthProvider } from './utils/authContext';
import Navbar from './components/Navbar';
import './App.css';

function App() {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const getUser = async () => {
        try {
            const url = `http://localhost:8080/auth/login/success`;
            const { data } = await axios.get(url, { withCredentials: true });
            if (data && data.user) {
                setUser(data.user);
                localStorage.setItem("user", JSON.stringify(data.user));
                window.location.reload();
            } else {
                console.log("User data is not available.");
                setUser(null);
                localStorage.removeItem("user");
            }
        } catch (err) {
            console.error("Error fetching user data:", err.message || err);
            setUser(null);
            localStorage.removeItem("user");
        }
    };

    useEffect(() => {
        if (!user) {
            getUser();
        }
    }, [user]);

    return (
        <AuthProvider>
            <Navbar />
            <Routes>
                <Route
                    exact
                    path="/"
                    // element={user ? <Home user={user} /> : <Navigate to="/login" />}
                    element={ <Home user={user} /> }
                />
                <Route
                    exact
                    path="/login"
                    element={user ? <Navigate to="/" /> : <Login />}
                />
                <Route
                    exact
                    path="/signup"
                    element={user ? <Navigate to="/" /> : <Signup />}
                />
                <Route
                    exact
                    path="/exp"
                    element={user ? <Experiments user={user}/> : <Navigate to="/login" />}
                />
                <Route
                    exact
                    path="/admin"
                    element={user && user.role === 'admin'
                        ? <AdminPanel user={user} />
                        : <Navigate to="/login" />
                    }
                />
            </Routes>
        </AuthProvider>
    );
}

export default App;
