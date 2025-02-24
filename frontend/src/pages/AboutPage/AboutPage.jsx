import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import "./AboutPage.css";
import VisionMission from "./VisionMission";

const AboutPage = () => {
    return (
        <>
            <Navbar />
            <div className="about-container">
                <div className="top-section">
                    <div className="about-kjsit">
                        <h2>About KJSIT</h2>
                        <p>
                            K J Somaiya Institute of Technology (KJSIT) is an engineering college established in 2001 by the Somaiya Trust at Ayurvihar campus, Sion. It has four branches: Computer Engineering, Electronics and Telecommunication Engineering, Information Technology, & Artificial Intelligence and Data Science. The Electronics Department was established in 2004 and the institute has been recognized by the All India Council for Technical Education (AICTE) and the Govt. of Maharashtra. KJSIT is accredited by the National Assessment and Accreditation Council (NAAC) and has received awards such as the &quot;Best College Award&quot; by the University of Mumbai and &quot;Best Engineering College Award&quot; by CSI local chapter and ISTE Maharashtra and Goa Section. The institute has introduced a Post Graduate engineering program in Artificial Intelligence and an undergraduate engineering program in Artificial Intelligence and Data Science. The University Grants Commission has conferred Autonomous Status to KJSIT for 10 years from 2021-22 to 2030-31.
                        </p>
                    </div>
                    <div className="college-image">
                        <img src="/college-building.png" alt="College Building" />
                    </div>
                </div>

                <div className="bottom-section">
                    <div className="lab-image">
                        <img src="/lab-setup.png" alt="Lab Setup" />
                    </div>
                    <div className="about-computer">
                        <h2>About Computer Engineering</h2>
                        <p>
                            The Computer Engineering department was established in the year 2001 to impart quality education. The department has well qualified and motivated faculty members and support staff. The laboratories are adequately equipped with state-of-the-art facilities. The students are members of various professional bodies like IET, CSI, IEEE, NSS etc. Various platforms are available for students, like project competition, technical & cultural festivals, international conference, etc. to showcase their talent. It is a regular practice of the department to organize industrial visits, expert talks, workshops and internship in addition to the latest certification courses for students in the field of Computer engineering. Student have won prizes in various national and international level paper presentation, competitions, project exhibition etc. As the department has good industry interaction and alumni support, students get several opportunities of internship, project guidance, placement and many more.
                            <br /><br />
                            The department is accredited by NBA in 2018 and intake has doubled to 120 from academic year 2019-20. Besides offering undergraduate (B. Tech) in Computer Engineering it also offers Post Graduation (M.Tech) in Artificial Intelligence. As the autonomous status is awarded by UGC from academic year 2021-22, curricula have revised for UG and PG programs by Board of Studies. Exposure courses like Skill based, Activity based and Technology based courses are added to motivate students to participate in various activities. Under Project Based Learning (PBL) mini, minor and major projects are introduced from sem III to Sem VIII which help students to work in a team and develop projects using latest technologies. The department has to its credits of maximum number of placements of the students in Infosys, TCS, Accenture, Cognizant, L&T Infotech, CSC, Tech Mahindra, Mastek, ICON, Majesco, MuSigma, BNP Paribas. Every year, few students opt for pursuing higher studies at prestigious universities in India and abroad.
                        </p>
                    </div>
                </div>
            </div>
            <VisionMission />
            <Footer />
        </>
    );
};

export default AboutPage;
