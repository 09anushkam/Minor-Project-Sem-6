import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const ParticleBackground = () => {
    const [init, setInit] = useState(false);
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

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
                        quantity: 4,
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
        [],
    );

    if (!init) return null;

    return (
        <Particles
            id="tsparticles"
            options={options}
        />
    );
};

export default ParticleBackground;
