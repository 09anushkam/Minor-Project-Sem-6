import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Navbar.css";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        window.open(`http://localhost:8080/auth/logout`, "_self");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
        window.location.reload();
    };

    return (
        <header className="header">
            <div className="navbar">
                <a href="/" className="logo">
                    <img src="/kjsieit-logo.svg" alt="logo" />
                </a>
                <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>☰</div>
                <nav className={isOpen ? "nav-menu open" : "nav-menu"}>
                    <div className="close-btn" onClick={() => setIsOpen(false)}>✖</div>
                    <ul>
                        <li><a href="/" onClick={() => setIsOpen(false)}>Home</a></li>
                        <li><a href="/about" onClick={() => setIsOpen(false)}>About</a></li>
                        {user && <li><a href="/exp" onClick={() => setIsOpen(false)}>Experiments</a></li>}
                        {/* {user && <li><a href="/quiz-history" onClick={() => setIsOpen(false)}>Quiz History</a></li>} */}
                        {!user ? (
                            <li><a href="/login" className="btns" onClick={() => setIsOpen(false)}>Login</a></li>
                        ) : (
                            <li><a href="/" className="btns" onClick={handleLogout}>Logout</a></li>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
