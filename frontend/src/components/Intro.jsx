import ParticleBackground from './ParticleBackground';
import './styles/Intro.css';

const Intro = () => {
    return (
        <div className='container'>
            <div className='particles'>
                <ParticleBackground />
            </div>
            <div className='welcome'>
                <p className='w'>Welcome to</p>
                <p className='vl'>Virtual Lab</p>
                <p className='of'>of</p>
                <p className='sma'>Social Media Analytics</p>
            </div>
        </div>
    );
};

export default Intro;
