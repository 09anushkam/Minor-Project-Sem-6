import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import { AuthContext } from '../utils/authContext';

function Dashboard() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div>
            <h2>Dashboard</h2>
            <p>Welcome, {user?.name}!</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Dashboard;
