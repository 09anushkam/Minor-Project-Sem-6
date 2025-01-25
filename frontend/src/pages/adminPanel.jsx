import { useContext } from 'react';
import { AuthContext } from '../utils/authContext';

function AdminPanel() {
    const { user } = useContext(AuthContext);

    return (
        <div>
            <h2>Admin Panel</h2>
            <p>Welcome, {user?.name}! You have admin privileges.</p>
        </div>
    );
}

export default AdminPanel;
