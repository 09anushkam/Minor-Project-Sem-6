import { useContext } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './authContext';

function ProtectedRoute({ children, allowedRoles }) {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired, // React Node is required
    allowedRoles: PropTypes.arrayOf(PropTypes.string), // Array of strings
};

ProtectedRoute.defaultProps = {
    allowedRoles: null, // If no roles are specified, all logged-in users are allowed
};

export default ProtectedRoute;
