import "./styles/Mentors.css";

const mentors = [
    {
        name: "Dr. Sarita Ambadekar",
        role: "Head of Department",
        description: "description",
        image: "/profile.jpg",
    },
    {
        name: "Prof. Pradnya Patil",
        role: "Project Coordinator",
        description: "description",
        image: "/profile.jpg",
    }
];

const Mentors = () => {
    return (
        <section className="mentor-section">
            <h2 className="mentor-title">Our Mentors</h2>
            <div className="mentor-container">
                {mentors.map((mentor, index) => (
                    <div className="mentor-card" key={index}>
                        <img src={mentor.image} alt={mentor.name} className="mentor-image" />
                        <h3 className="mentor-name">{mentor.name}</h3>
                        <p className="mentor-role">{mentor.role}</p>
                        <p className="mentor-description">{mentor.description}</p>
                        <div className="mentor-icons">
                            <a href=""><i className="fas fa-envelope"></i></a>
                            <a href=""><i className="fab fa-github"></i></a>
                            <a href=""><i className="fab fa-linkedin"></i></a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Mentors;
