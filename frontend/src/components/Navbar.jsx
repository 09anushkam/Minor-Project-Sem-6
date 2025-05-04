import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sling as Hamburger } from "hamburger-react";
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
        window.open(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, "_self");
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

                <div className="hamburger-container">
                    <Hamburger size={24} toggled={isOpen} toggle={setIsOpen} direction="left" />
                </div>

                <nav className={isOpen ? "nav-menu open" : "nav-menu"}>
                    <ul onClick={() => setIsOpen(false)}>
                        <li><a href="/">Home</a></li>
                        <li><a href="/about">About</a></li>
                        {user && <li><a href="/exp">Experiments</a></li>}
                        {!user ? (
                            <li><a href="/login" className="btns">Login</a></li>
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
