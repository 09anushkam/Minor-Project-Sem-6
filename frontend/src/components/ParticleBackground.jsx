import { useEffect, useMemo, useState, useCallback } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const ParticleBackground = () => {
    const [init, setInit] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const MAX_CLICKS = 10; // Maximum allowed clicks

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const handleClick = useCallback(() => {
        if (clickCount < MAX_CLICKS) {
            setClickCount(prev => prev + 1);
            return true; // Allow particle generation
        }
        return false; // Block particle generation
    }, [clickCount]);

    const options = useMemo(
        () => ({
            background: {
                color: {
                    value: "transparent",
                },
            },
            fullscreen: {
                enable: true,
                zIndex: -1,
            },
            style: {
                position: "absolute",
            },
            fpsLimit: 120,
            interactivity: {
                events: {
                    onClick: {
                        enable: true,
                        mode: "push",
                    },
                    onHover: {
                        enable: true,
                        mode: "repulse",
                    },
                },
                modes: {
                    push: {
                        quantity: clickCount < MAX_CLICKS ? 4 : 0,
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4,
                    },
                },
            },
            particles: {
                color: {
                    value: ["#66f200", "#ff8700", "#fffd01", "#01ff07", "#00ffff", "#147df5", "#580aff", "#be0aff"],
                },
                links: {
                    color: "#000",
                    distance: 150,
                    enable: true,
                    opacity: 0.5,
                    width: 1,
                },
                move: {
                    direction: "none",
                    enable: true,
                    outModes: {
                        default: "bounce",
                    },
                    random: false,
                    speed: 6,
                    straight: false,
                },
                number: {
                    density: {
                        enable: true,
                        area: 800, // Adjust this value as needed
                    },
                    value: 80,
                },
                opacity: {
                    value: 1,
                },
                shape: {
                    type: "circle",
                },
                size: {
                    value: { min: 1, max: 8 },
                },
            },
            detectRetina: true,
        }),
        [handleClick, clickCount],
    );

    if (!init) return null;

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            pointerEvents: 'auto' // Ensure clicks are captured
        }}>
            <Particles
                id="tsparticles"
                options={options}
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                }}
            />
            <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                color: 'white',
                zIndex: 1,
                fontSize: '14px',
                pointerEvents: 'none' // Don't block clicks
            }}>
                Clicks remaining: {Math.max(0, MAX_CLICKS - clickCount)}
            </div>
        </div>
    );
};

export default ParticleBackground;
