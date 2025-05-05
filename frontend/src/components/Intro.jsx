import PropTypes from 'prop-types';
import ParticleBackground from './ParticleBackground';
import './styles/Intro.css';

const Intro = ({ user }) => {
    const formatName = (name) => {
        return name
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    return (
        <div className='container'>
            <div className='particles'>
                <ParticleBackground />
            </div>
            <div className='welcome'>
                <p className='w'>Welcome <span className='user'>{user?.name ? formatName(user.name) : ''}</span> to</p>
                <p className='vl'>Virtual Lab</p>
                <p className='of'>for</p>
                <p className='sma'>Social Media Analytics</p>
            </div>
        </div>
    );
};

Intro.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
    }).isRequired,
};

export default Intro;
