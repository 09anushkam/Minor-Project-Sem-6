import "./styles/Team.css";

const teamMembers = [
    {
        name: "Prof. Pradnya Patil",
        role: "Project Guide",
        description: "description",
        image: "/profile.jpg",
    },
    {
        name: "Saniya Patil",
        role: "Project Member",
        description: "description",
        image: "/profile.jpg",
    },
    {
        name: "Kinjal Patel",
        role: "Project Member",
        description: "description",
        image: "/profile.jpg",
    },
    {
        name: "Anushka Murade",
        role: "Project Member",
        description: "description",
        image: "/profile.jpg",
    },
    {
        name: "Vivek Masuna",
        role: "Project Member",
        description: "description",
        image: "/profile.jpg",
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

export default Team;
