import { useEffect, useRef, useState } from "react";
import logo from '../../../assets/images/logo.jpeg'
import { Menu, X } from "lucide-react";
import Button from "../utilies/Button";
import { NavLink, useLocation } from "react-router";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const location = useLocation();

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Search', path: '/search' },
        { name: 'Membership', path: '/membership' },
        { name: 'Success Stories', path: '/success-stories' },
        { name: 'Blog', path: '/blog' },
        { name: 'Contact', path: '/contact' }
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="border-b">
            <nav ref={menuRef} className="flex items-center justify-between app-container relative py-4 z-50 ">
                <div className="flex items-center space-x-3 select-none">
                    <img className="size-14 object-contain rounded-xl" src={logo} alt="Logo" />
                    <div>
                        <div className="text-red-600 font-bold text-2xl leading-none tracking-tight">Bibah</div>
                        <div className="text-gray-500 text-xs mt-1 tracking-wide">A Perfect Partner</div>
                    </div>
                </div>

                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                className={`relative py-2 font-medium transition-colors duration-300 focus:outline-none group ${isActive ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                                    }`}
                            >
                                {link.name}
                                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-red-600 rounded-full transition-all duration-300 ${isActive ? 'w-11' : 'w-0 group-hover:w-8'
                                    }`} />
                            </NavLink>
                        );
                    })}
                </div>

                <div className="hidden md:block">
                    <NavLink to='/login'>
                        <Button className="px-4" text={'Login / Sign Up'}></Button>
                    </NavLink>
                </div>

                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-gray-700 hover:text-red-600 focus:outline-none transition-colors duration-200"
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                <div className={`absolute top-full left-0 w-full bg-white shadow-xl rounded-2xl p-6 mt-2 md:hidden flex flex-col space-y-4 origin-top transition-all duration-300 ease-in-out ${isOpen ? "opacity-100 scale-y-100 visible" : "opacity-0 scale-y-95 invisible pointer-events-none"
                    }`}>
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`text-left py-2 font-medium text-lg transition-all duration-200 ${isActive ? 'text-red-600 pl-2 border-l-4 border-red-600' : 'text-gray-600 hover:text-red-600'
                                    }`}
                            >
                                {link.name}
                            </NavLink>
                        );
                    })}
                    <hr className="border-gray-100 my-2" />
                    <NavLink to='/login' onClick={() => setIsOpen(false)}>
                        <button className="bg-red-600 hover:bg-red-700 text-white font-medium w-full py-3 rounded-xl transition-all duration-200 active:scale-95 shadow-lg shadow-red-100">
                            Login / Sign Up
                        </button>
                    </NavLink>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;