import "./styles/Team.css";

const teamMembers = [
    {
        name: "Saniya Patil",
        role: "Project Member",
        description: "A budding ethical hacker with a passion for painting and a curious mind always eager to explore new ideas.",
        image: "/saniya.jpg",
        email: "mailto:saniya.patil@somaiya.edu",
        github: "https://github.com/SaniyaPatil13",
        linkedin: "https://www.linkedin.com/in/saniya-patil-847b70287/",
    },
    {
        name: "Kinjal Patel",
        role: "Project Member",
        description: "Aspiring data analysts and passionate Kathak learner, driven by curiosity and creativity.",
        image: "/kinjal.jpg",
        email: "mailto:kinjal.patel@somaiya.edu",
        github: "https://github.com/kinjal5104",
        linkedin: "https://www.linkedin.com/in/kinjal-patel-bb441a279/",
    },
    {
        name: "Vivek Masuna",
        role: "Project Member",
        description: "Full-stack web developer with a passion for chess, cricket, and solving real-world problems.",
        image: "/vivek.jpg",
        email: "mailto:vivekmasuna999@gmail.com",
        github: "https://github.com/VivekMasuna/",
        linkedin: "https://www.linkedin.com/in/vivekmasuna999/",
    },
    {
        name: "Anushka Murade",
        role: "Project Member",
        description: "CSE student skilled in web development and preparing for competitive exams.",
        image: "/anushka.jpg",
        email: "mailto:anushka.murade@somaiya.edu",
        github: "https://github.com/09anushkam",
        linkedin: "https://in.linkedin.com/in/anushka-murade",
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
