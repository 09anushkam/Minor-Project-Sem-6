import { useEffect, useMemo, useState, useCallback } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const ParticleBackground = () => {
    const [init, setInit] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const MAX_CLICKS = 10;

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const options = useMemo(() => ({
        background: {
            color: {
                value: "transparent",
            },
        },
        fullscreen: {
            enable: true,
            zIndex: -1,
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
                speed: 8,
            },
            number: {
                density: {
                    enable: true,
                    area: 800,
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
    }), [clickCount]);

    // This is the key part that actually increments click count
    const handleParticlesLoaded = useCallback(async (container) => {
        const canvas = container.canvas.element;
        if (!canvas) return;

        const clickListener = () => {
            setClickCount(prev => {
                if (prev < MAX_CLICKS) {
                    return prev + 1;
                }
                return prev;
            });
        };

        canvas.addEventListener("click", clickListener);

        return () => {
            canvas.removeEventListener("click", clickListener);
        };
    }, []);

    if (!init) return null;

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            pointerEvents: 'auto'
        }}>
            <Particles
                id="tsparticles"
                options={options}
                particlesLoaded={handleParticlesLoaded}
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
                pointerEvents: 'none'
            }}>
                Clicks remaining: {Math.max(0, MAX_CLICKS - clickCount)}
            </div>
        </div>
    );
};

export default ParticleBackground;
