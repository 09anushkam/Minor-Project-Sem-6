import PropTypes from 'prop-types';
import Navbar from '../../components/Navbar';

const AdminPanel = ({ user }) => {
    return (
        <>
            <Navbar />
            <h2>Admin Panel</h2>
            <p>Welcome, {user?.name}! You have admin privileges.</p>
            <p>Email: {user.email}</p>
        </>
    );
}

AdminPanel.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
    }).isRequired,
};

export default AdminPanel;
