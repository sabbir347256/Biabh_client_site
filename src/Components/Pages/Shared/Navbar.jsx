import { useContext, useEffect, useRef, useState } from "react";
import logo from '../../../assets/images/logo.jpeg'
import { Menu, X } from "lucide-react";
import Button from "../utilies/Button";
import { NavLink, useLocation } from "react-router";
import { AuthProvider } from "../../AuthProvider/CreateContext";

const Navbar = () => {
    const { user } = useContext(AuthProvider);
    const [isOpen, setIsOpen] = useState(false);
    const [isWalletOpen, setIsWalletOpen] = useState(false);
    const menuRef = useRef(null);
    const walletRef = useRef(null);
    const mobileWalletRef = useRef(null);
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

            const clickedInsideDesktopWallet = walletRef.current && walletRef.current.contains(event.target);
            const clickedInsideMobileWallet = mobileWalletRef.current && mobileWalletRef.current.contains(event.target);

            if (!clickedInsideDesktopWallet && !clickedInsideMobileWallet) {
                setIsWalletOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const mainAmount = user?.wallet?.mainBalance || 0;
    const bonusAmount = user?.wallet?.bonusBalance || 0;
    const referralAmount = user?.wallet?.referralBalance || 0;
    const totalAmount = mainAmount + bonusAmount + referralAmount;
    return (
        <div className="border-b">
            <nav className="flex items-center justify-between app-container relative py-4 z-50">
                <div ref={menuRef} className="flex items-center space-x-3 select-none">
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
                                className={`relative py-2 font-medium transition-colors duration-300 focus:outline-none group ${isActive ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}`}
                            >
                                {link.name}
                                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-red-600 rounded-full transition-all duration-300 ${isActive ? 'w-11' : 'w-0 group-hover:w-8'}`} />
                            </NavLink>
                        );
                    })}
                </div>

                <div className="hidden md:flex items-center gap-4">
                    {user && (
                        <div className="relative" ref={walletRef}>
                            <button
                                onClick={() => setIsWalletOpen(!isWalletOpen)}
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-xl transition-all duration-200 active:scale-95 shadow-md shadow-amber-100"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                                <div className="text-left leading-tight">
                                    <span className="block text-[9px] uppercase tracking-wider opacity-90">Wallet</span>
                                    <span className="text-xs font-bold">৳ {totalAmount}</span>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 transition-transform duration-200 ${isWalletOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {isWalletOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-4 px-4 z-50">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Balance Details</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
                                            <span className="text-sm text-gray-600">Main Balance</span>
                                            <span className="font-semibold text-gray-900">৳ {mainAmount}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
                                            <span className="text-sm text-gray-600">Bonus Balance</span>
                                            <span className="font-semibold text-emerald-600">৳ {bonusAmount}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-1.5">
                                            <span className="text-sm text-gray-600">Referral Earn</span>
                                            <span className="font-semibold text-indigo-600">৳ {referralAmount}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {user ? (
                        <NavLink to='/user-profile' className="flex items-center gap-3 bg-gray-50 p-1.5 pr-4 rounded-xl border border-gray-100">
                            {user.image ? (
                                <img src={user.image} alt={user.name || "Profile"} className="h-9 w-9 rounded-lg object-cover" />
                            ) : (
                                <div className="h-9 w-9 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm uppercase">
                                    {user.name ? user.name.slice(0, 2) : "UI"}
                                </div>
                            )}
                            <div className="flex flex-col text-left">
                                <span className="text-[10px] text-gray-400 font-medium">Welcome back,</span>
                                <span className="text-sm font-semibold text-gray-800 leading-tight truncate max-w-[100px]">{user.name || "User"}</span>
                            </div>
                        </NavLink>
                    ) : (
                        <NavLink to='/login'>
                            <Button className="px-4" text={'Login / Sign Up'}></Button>
                        </NavLink>
                    )}
                </div>

                <div className="md:hidden flex items-center gap-3">
                    {user && (
                        <div className="relative" ref={mobileWalletRef}>
                            <button
                                onClick={() => setIsWalletOpen(!isWalletOpen)}
                                className="flex items-center gap-1.5 bg-amber-500 text-white font-medium p-2 rounded-xl active:scale-95 shadow-md"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                                <span className="text-xs font-bold pr-0.5">৳{totalAmount}</span>
                            </button>

                            {isWalletOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 px-4 z-50">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-xs py-1 border-b border-gray-50">
                                            <span className="text-gray-500">Main</span>
                                            <span className="font-semibold text-gray-900">৳{mainAmount}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs py-1 border-b border-gray-50">
                                            <span className="text-gray-500">Bonus</span>
                                            <span className="font-semibold text-emerald-600">৳{bonusAmount}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs py-1">
                                            <span className="text-gray-500">Refer</span>
                                            <span className="font-semibold text-indigo-600">৳{referralAmount}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-gray-700 hover:text-red-600 focus:outline-none transition-colors duration-200"
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                <div className={`absolute top-full left-0 w-full bg-white shadow-xl rounded-2xl p-6 mt-2 md:hidden flex flex-col space-y-4 origin-top transition-all duration-300 ease-in-out ${isOpen ? "opacity-100 scale-y-100 visible" : "opacity-0 scale-y-95 invisible pointer-events-none"}`}>
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`text-left py-2 font-medium text-lg transition-all duration-200 ${isActive ? 'text-red-600 pl-2 border-l-4 border-red-600' : 'text-gray-600 hover:text-red-600'}`}
                            >
                                {link.name}
                            </NavLink>
                        );
                    })}
                    <hr className="border-gray-100 my-2" />

                    {user ? (
                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                            {user.image ? (
                                <img src={user.image} alt={user.name || "Profile"} className="h-10 w-10 rounded-lg object-cover" />
                            ) : (
                                <div className="h-10 w-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold uppercase">
                                    {user.name ? user.name.slice(0, 2) : "UI"}
                                </div>
                            )}
                            <div className="flex flex-col text-left">
                                <span className="text-xs text-gray-400 font-medium">Welcome back,</span>
                                <span className="text-base font-semibold text-gray-800 leading-tight">{user.name || "User"}</span>
                            </div>
                        </div>
                    ) : (
                        <NavLink to='/login' onClick={() => setIsOpen(false)}>
                            <button className="bg-red-600 hover:bg-red-700 text-white font-medium w-full py-3 rounded-xl transition-all duration-200 active:scale-95 shadow-lg shadow-red-100">
                                Login / Sign Up
                            </button>
                        </NavLink>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default Navbar;