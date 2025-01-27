import PropTypes from 'prop-types';

const Dashboard = ({ user }) => {
    return (
        <>
            <h2>Dashboard</h2>
            <p>Welcome, {user?.name}!</p>
        </>
    );
}

Dashboard.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
    }).isRequired,
};

export default Dashboard;
