import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Home from "./pages/Home/index";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Dashboard from './pages/Dashboard/Dashboard';
import AdminPanel from './pages/AdminPanel/AdminPanel';
import { AuthProvider } from './utils/authContext';
import './App.css';

function App() {
    const [user, setUser] = useState(null);

    const getUser = async () => {
        try {
            const url = `http://localhost:8080/auth/login/success`;
            const { data } = await axios.get(url, { withCredentials: true });
            console.log(data);
            if (data && data.user) {
                setUser(data.user);
            } else {
                console.log("User data is not available.");
                setUser(null);
            }
        } catch (err) {
            console.error("Error fetching user data:", err.message || err);
            setUser(null);
        }
    };

    useEffect(() => {
        getUser();
        console.log("User data in App:", user);
    }, []);
    useEffect(() => {
        console.log("User data updated in App:", user);
    }, [user]);

    return (
        <AuthProvider>
            <Routes>
                <Route
                    exact
                    path="/"
                    element={user ? <Home user={user} /> : <Navigate to="/login" />}
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
                    path="/dashboard"
                    element={user ? <Dashboard user={user}/> : <Navigate to="/login" />}
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
