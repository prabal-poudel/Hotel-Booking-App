import React from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.svg";
import { useState } from "react";
import { useEffect } from "react";

const navLinks = [
    { name: "Home", path: "/" },
    { name: "Hotel Search", path: "/hotelsearch",},
    // { name: "My Trips", path: "/mytrips" },
    // { name: "Dashboard", path: "/dashboard" },
];

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="7" x2="20" y2="7" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="6" y1="6" x2="18" y2="18" />
        <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
);

const Navbar = () => {
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);

    // navbar load check localstorage
    useEffect(() => {
        const storeduser = localStorage.getItem('user');
        setUser(storeduser ? JSON.parse(storeduser) : null);
    }, [location]);

    // logout function 
    const handlelogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        alert('You are loged out!');
        navigate('/login');
    };

    // to handle if the user checks my trips without login
    const handlemytripclick = (e) => {
        if (!user) {
            e.preventDefault();
            alert('please login first to  view your trips!');
            navigate('/login');
        }
    };

    // Track scroll position
    React.useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Lock body scroll while the mobile menu is open
    React.useEffect(() => {
        document.body.style.overflow = isMenuOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMenuOpen]);

    return (
        <>
            <nav
                className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between
                px-4 md:px-16 lg:px-24 xl:px-32 text-black transition-all duration-500 ${
                    isScrolled
                        ? "py-3 bg-white/90 backdrop-blur-md shadow-md"
                        : "py-5 md:py-6 bg-white border-b border-gray-200"
                }`}
            >
                {/* Logo (brightness-0 turns it solid black) */}
                <Link to="/" className="flex items-center">
                    <img src={logo} alt="logo" className="h-9 w-auto brightness-0" />
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-6 lg:gap-8">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            end={link.path === "/"}
                            className={({ isActive }) =>
                                `group flex flex-col gap-0.5 text-sm font-medium transition-colors ${
                                    isActive ? "text-black" : "text-gray-600 hover:text-black"
                                }`
                            }>

                            {({ isActive }) => (
                                <>
                                    {link.name}
                                    <span
                                        className={`h-0.5 bg-black transition-all duration-300 ${
                                            isActive ? "w-full" : "w-0 group-hover:w-full"
                                        }`}
                                    />
                                </>
                            )}
                        </NavLink>
                    ))}
                    {(!user || user.role === 'client') && (
                        <Link to='/mytrips' onClick={handlemytripclick}>My Trips</Link>
                    )}

                    {(user && user.role === 'owner') && (
                        <Link to='/dashboard'>Dashboard</Link>
                    )}
                </div>

                {/* Desktop Right */}
                <div className="hidden md:flex items-center gap-3">
                    <button
                        aria-label="Search"
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                        {/* <SearchIcon /> */}
                    </button>

                    {/* log in button for desktop */}
                    {user ? (
                        <button onClick={() => { handlelogout(); navigate("/login"); }}>
                            Log out
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                window.location.reload();
                                navigate("/login");
                            }}
                            className="bg-black text-white px-8 py-2.5 rounded-full text-base cursor-pointer"
                        >
                            Log in
                        </button>
                    )}
                </div>

                {/* Mobile Buttons */}
                <div className="flex items-center gap-2 md:hidden">
                    <button
                        aria-label="Search"
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        {/* <SearchIcon /> */}
                    </button>
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        aria-label="Open menu"
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <MenuIcon />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu (outside <nav> so backdrop-blur doesn't break position: fixed) */}
            <div
                className={`fixed top-0 left-0 w-full h-screen bg-white text-black flex flex-col
                md:hidden items-center justify-center gap-6 text-lg font-medium z-[60]
                transition-transform duration-500 ${
                    isMenuOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <button
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Close menu"
                >
                    <CloseIcon />
                </button>

                <img src={logo} alt="logo" className="h-10 w-auto brightness-0 mb-4" />

                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        to={link.path}
                        onClick={() => setIsMenuOpen(false)}
                        className="hover:text-gray-500 transition-colors"
                    >
                        {link.name}
                    </Link>
                ))}

                {/* <button
                    onClick={() => {
                        setIsMenuOpen(false);
                        navigate("/my-bookings");
                    }}
                    className="bg-black text-white px-8 py-2.5 rounded-full text-base"
                >
                    My Bookings
                </button> */}
            </div>
        </>
    );
};

export default Navbar;