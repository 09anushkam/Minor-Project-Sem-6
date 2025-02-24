import "./VisionMission.css";

const VisionMission = () => {
    return (
        <div className="vision-mission-container">
            <section className="vision">
                <h2>VISION</h2>
                <p>
                    The Vision emphasizes establishing a reputation as a benchmark of quality, excellence, and commitment in engineering education. It aspires to create an environment where students are nurtured with the right knowledge, skills, and ethical values, ensuring they evolve into competent, future-ready engineers.
                </p>
                <p>
                    By nurturing talent, the goal is to provide an education system that fosters innovation, critical thinking, and problem-solving abilities. This is achieved through a holistic curriculum, hands-on experience, and industry exposure, equipping students to meet real-world challenges.
                </p>
                <p>
                    Transforming young minds signifies a commitment to mentorship, research, and cutting-edge technology, enabling students to realize their full potential. The institution strives to develop engineers who are not only technically proficient but also leaders, innovators, and responsible professionals.
                </p>
                <p>
                    Ultimately, this vision reflects a dedication to continuous improvement, ensuring that graduates excel globally and contribute meaningfully to society through engineering solutions.
                </p>
            </section>
            <section className="mission">
                <h2>MISSION</h2>
                <div className="mission-grid">
                    <div className="mission-card mission-1">
                        <p>
                            To provide students with a thorough knowledge of engineering to refine their professional skills.
                        </p>
                    </div>
                    <div className="mission-card mission-2">
                        <p>
                            To nurture creativity and innovation while encouraging multidisciplinary interaction.
                        </p>
                    </div>
                    <div className="mission-card mission-3">
                        <p>
                            To train students to be industry-ready and capable of working effectively as an individual and in a team.
                        </p>
                    </div>
                    <div className="mission-card mission-4">
                        <p>
                            To inculcate ethical behavior, responsibility, and commitment among students.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default VisionMission;
