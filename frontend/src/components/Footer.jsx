import "./styles/Footer.css";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section ql">
                    <h2>Quick Links</h2>
                    <ul>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">About</a></li>
                        <li><a href="#">Contact</a></li>
                        <li><a href="#">Feedback</a></li>
                    </ul>
                </div>
                <div className="footer-divider"></div>
                <div className="footer-section">
                    <h2>Get In Touch With Us</h2>
                    <ul>
                        <li><b>Email: </b><a href="mailto:vivek.masuna@somaiya.edu">vivek.masuna@somaiya.edu</a></li>
                        <li><b>Phone: </b><a href="tel:+919172816249">+91 9172816249</a></li>
                        <li><b>Address: </b>Somaiya Ayurvihar Complex, Eastern Express Highway, Near Everard Nagar, Sion East, Mumbai, Maharashtra - 400022</li>
                    </ul>
                </div>
                <div className="footer-divider"></div>
                <div className="footer-map">
                    <iframe title="Google Map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4481.757223686767!2d72.86761480336813!3d19.045897527635557!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7cf21727f6e19%3A0x473006136ad440dc!2sK.%20J.%20Somaiya%20Institute%20of%20Technology!5e0!3m2!1sen!2sin!4v1739191501256!5m2!1sen!2sin" allowfullscreen loading="lazy"></iframe>
                </div>
            </div>
            <div className="footer-title">
                <h3>© 2025 Department of Computer Engineering</h3>
            </div>
        </footer>
    );
}
