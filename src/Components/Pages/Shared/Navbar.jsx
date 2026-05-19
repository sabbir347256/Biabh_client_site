import { useEffect, useRef, useState } from "react";
import logo from '../../../assets/images/logo.jpeg'
import { Menu, X } from "lucide-react";

const Navbar = () => {
    const [activeTab, setActiveTab] = useState('Home');
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    const navLinks = ['Home', 'Search', 'Membership', 'Success Stories', 'Blog', 'Contact'];

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
        <nav ref={menuRef} className="flex items-center justify-between app-container relative py-4 z-50">
            <div className="flex items-center space-x-3 select-none">
                <img className="size-14 object-contain rounded-xl" src={logo} alt="Logo" />
                <div>
                    <div className="text-red-600 font-bold text-2xl leading-none tracking-tight">Bibah</div>
                    <div className="text-gray-500 text-xs mt-1 tracking-wide">A Perfect Partner</div>
                </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
                {navLinks.map((link) => {
                    const isActive = activeTab === link;
                    return (
                        <button
                            key={link}
                            onClick={() => setActiveTab(link)}
                            className={`relative py-2 font-medium transition-colors duration-300 focus:outline-none ${isActive ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                                }`}
                        >
                            {link}
                            <span
                                className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-red-600 rounded-full transition-all duration-300 ${isActive ? 'w-8' : 'w-0'
                                    }`}
                            />
                        </button>
                    );
                })}
            </div>

            <div className="hidden md:block">
                <button className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-2xl transition-all duration-200 active:scale-95 shadow-lg shadow-red-100">
                    Login / Sign Up
                </button>
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
                    const isActive = activeTab === link;
                    return (
                        <button
                            key={link}
                            onClick={() => {
                                setActiveTab(link);
                                setIsOpen(false);
                            }}
                            className={`text-left py-2 font-medium text-lg transition-colors duration-200 ${isActive ? 'text-red-600 pl-2 border-l-4 border-red-600' : 'text-gray-600 hover:text-red-600'
                                }`}
                        >
                            {link}
                        </button>
                    );
                })}
                <hr className="border-gray-100 my-2" />
                <button className="bg-red-600 hover:bg-red-700 text-white font-medium w-full py-3 rounded-xl transition-all duration-200 active:scale-95 shadow-lg shadow-red-100">
                    Login / Sign Up
                </button>
            </div>
        </nav>
    );
};

export default Navbar;