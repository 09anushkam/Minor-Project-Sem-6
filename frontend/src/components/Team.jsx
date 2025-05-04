import "./styles/Team.css";

const teamMembers = [
    {
        name: "Saniya Patil",
        role: "Project Member",
        description: "description",
        image: "/profile.jpg",
        email: "mailto:",
        github: "",
        linkedin: "",
    },
    {
        name: "Kinjal Patel",
        role: "Project Member",
        description: "description",
        image: "/profile.jpg",
        email: "mailto:",
        github: "",
        linkedin: "",
    },
    {
        name: "Vivek Masuna",
        role: "Project Member",
        description: "Full-stack web developer with a passion for chess, cricket, and solving real-world problems.",
        image: "/profile.jpg",
        email: "mailto:vivekmasuna999@gmail.com",
        github: "https://github.com/VivekMasuna/",
        linkedin: "https://www.linkedin.com/in/vivekmasuna999/",
    },
    {
        name: "Anushka Murade",
        role: "Project Member",
        description: "description",
        image: "/profile.jpg",
        email: "mailto:",
        github: "",
        linkedin: "",
    }
];

const Team = () => {
    return (
        <section className="team-section">
            <h2 className="team-title">Meet Our Team</h2>
            <div className="team-container">
                {teamMembers.map((member, index) => (
                    <div className="team-card" key={index}>
                        <img src={member.image} alt={member.name} className="team-image" />
                        <h3 className="team-name">{member.name}</h3>
                        <p className="team-role">{member.role}</p>
                        <p className="team-description">{member.description}</p>
                        <div className="team-icons">
                            <a href={member.email} target="_blank" rel="noopener noreferrer"><i className="fas fa-envelope"></i></a>
                            <a href={member.github} target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i></a>
                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin"></i></a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Team;
