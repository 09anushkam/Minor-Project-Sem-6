import PropTypes from 'prop-types';
import ExperimentCards from './ExperimentCards';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Experiments.css'

const Experiments = () => {
    return (
        <>
            <Navbar />
            <h1 className="experiments-title">List of Experiments</h1>
            <ExperimentCards />
            <Footer />
        </>
    );
}

Experiments.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
    }).isRequired,
};

export default Experiments;
