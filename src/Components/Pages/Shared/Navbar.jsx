import { useContext, useEffect, useRef, useState } from "react";
import logo from '../../../assets/images/logo.jpeg'
import { LogOut, Menu, UserIcon, X } from "lucide-react";
import Button from "../utilies/Button";
import { NavLink, useLocation, useNavigate } from "react-router";
import { AuthProvider } from "../../AuthProvider/CreateContext";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import config from "../utilies/envconfig";

const Navbar = () => {
    const { user, data } = useContext(AuthProvider);
    const [isOpen, setIsOpen] = useState(false);
    const [isWalletOpen, setIsWalletOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);

    const walletRef = useRef(null);
    const mobileWalletRef = useRef(null);
    const menuButtonRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const profileDropdownRef = useRef(null);

    const location = useLocation();
    const navigate = useNavigate();

    const [isRechargeOpen, setIsRechargeOpen] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        const token = localStorage.getItem("accessToken");
        try {
            await axios.post(
                `${config?.backendUrl}/transaction`,
                {
                    userObjectId: user?.userId,
                    userId: user?.userProfileId,
                    transactionId: data.transactionId,
                    phoneNumber: data.phoneNumber,
                    amount: data.amount,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Recharge request submitted successfully!");
            reset();
            setIsRechargeOpen(false);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to submit request");
        }
    };


    const [loadingPayment, setLoadingPayment] = useState(false);

    const onRechargeSubmit = async (formData) => {
        setLoadingPayment(true);
        const token = localStorage.getItem("accessToken");

        try {
            const paymentPayload = {
                userObjectId: user?.userId,
                userId: user?.userProfileId,
                amount: formData.amount,
                name: user?.name,
                email: user?.email,
                phone: user?.phone,
                originUrl: window.location.origin
            };

            const response = await axios.post(
                `${config?.backendUrl}/transaction/initiate-paystation`,
                paymentPayload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success && response.data.payment_url) {
                toast.success("Redirecting to PayStation...");
                window.location.assign(response.data.payment_url);
            } else {
                toast.error("Could not initiate payment");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Payment initialization failed");
        } finally {
            setLoadingPayment(false);
            setIsRechargeOpen(false);
            reset();
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        window.location.reload();
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Find Match', path: '/find-match' },
        // { name: 'Membership', path: '/membership' },
        { name: 'Success Stories', path: '/success-stories' },
        { name: 'Blog', path: '/blog' },
        { name: 'Contact', path: '/contact' }
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            const clickedInsideButton = menuButtonRef.current && menuButtonRef.current.contains(event.target);
            const clickedInsideMenu = mobileMenuRef.current && mobileMenuRef.current.contains(event.target);
            if (!clickedInsideButton && !clickedInsideMenu) {
                setIsOpen(false);
            }

            const clickedInsideDesktopWallet = walletRef.current && walletRef.current.contains(event.target);
            const clickedInsideMobileWallet = mobileWalletRef.current && mobileWalletRef.current.contains(event.target);
            if (!clickedInsideDesktopWallet && !clickedInsideMobileWallet) {
                setIsWalletOpen(false);
            }

            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    const mainAmount = data?.data?.mainWalletBalance || 0;
    const bonusAmount = data?.data?.isActive === 'INACTIVE' ? 0 : data?.data?.bonusWalletPoints;
    const referralAmount = user?.wallet?.referralBalance || 0;
    const totalAmount = user ? (mainAmount + bonusAmount + referralAmount) : 0;

    // const mainAmount = data?.data?.mainWalletBalance || 0;
    // const bonusAmount = data?.data?.isActive === 'INACTIVE' ? 0 : data?.data?.bonusWalletPoints;
    // const referralAmount = user?.wallet?.referralBalance || 0;
    // const totalAmount = user
    //     ? (mainAmount || 0) + (bonusAmount || 0) + (referralAmount || 0)
    //     : 0;


    return (
        <div className="border-b relative z-50 bg-white">
            <Toaster position="top-right" reverseOrder={false} />
            <nav className="flex items-center justify-between app-container relative py-4">
                <NavLink to='/' className="flex items-center space-x-3 select-none">
                    <img className="size-14 object-contain rounded-xl" src={logo} alt="Logo" />
                    <div>
                        <div className="text-red-600 font-bold text-2xl leading-none tracking-tight">Bibah</div>
                        <div className="text-gray-500 text-xs mt-1 tracking-wide">A Perfect Partner</div>
                    </div>
                </NavLink>

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
                    <div className="relative" ref={walletRef}>
                        <button
                            onClick={() => setIsWalletOpen(!isWalletOpen)}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-xl transition-all duration-200 active:scale-95 shadow-md shadow-amber-100"
                        >
                            {/* ওয়ানলেট আইকন ও ব্যালেন্স টেক্সট */}
                            <div className="text-left leading-tight">
                                <span className="block text-[9px] uppercase tracking-wider opacity-90">Wallet</span>
                                <span className="text-xs font-bold">৳ {totalAmount}</span>
                            </div>
                        </button>

                        {/* ওয়ালেট ড্রপডাউন */}
                        {user && isWalletOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-4 px-4 z-50">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Balance Details</h4>
                                <div className="space-y-2 text-neutral">
                                    <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
                                        <span className="text-sm text-gray-600">Main Balance</span>
                                        <span className="font-semibold">৳ {mainAmount}</span>
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
                                <button
                                    onClick={() => { setIsRechargeOpen(true); setIsWalletOpen(false); }}
                                    className="bg-red-600 text-white hover:bg-red-800 duration-100 p-2 rounded-xl w-full mt-4 font-semibold"
                                >
                                    Recharge Wallet
                                </button>
                            </div>
                        )}
                    </div>

                    {user ? (
                        <div className="relative" ref={profileDropdownRef}>
                            <button
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                className="flex items-center gap-3 bg-gray-50 p-1.5 pr-4 rounded-xl border border-gray-100 cursor-pointer select-none"
                            >
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
                            </button>

                            {isProfileDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                                    <button
                                        onClick={() => {
                                            setIsProfileDropdownOpen(false);
                                            navigate('/user-profile');
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors text-left"
                                    >
                                        <UserIcon size={16} className="text-gray-400" />
                                        My Profile
                                    </button>
                                    <hr className="border-gray-100 my-1" />
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <NavLink to='/login'>
                            <Button className="px-4" text={'Login / Sign Up'}></Button>
                        </NavLink>
                    )}
                </div>

                <div className="md:hidden flex items-center gap-3">
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
                                <button
                                    onClick={() => setIsRechargeOpen(true)}
                                    className="bg-red-600 text-white hover:bg-red-800 duration-100 p-2 rounded-xl w-full mt-2"
                                >
                                    Recharge
                                </button>
                            </div>

                        )}
                    </div>

                    <button
                        ref={menuButtonRef}
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-gray-700 hover:text-red-600 focus:outline-none transition-colors duration-200"
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                <div
                    ref={mobileMenuRef}
                    className={`absolute top-full left-0 w-full bg-white shadow-xl rounded-2xl p-6 md:hidden flex flex-col space-y-4 origin-top transition-all duration-300 ease-in-out z-50 ${isOpen ? "opacity-100 scale-y-100 visible" : "opacity-0 scale-y-95 invisible pointer-events-none"}`}
                >

                    {user ? (
                        <div className="flex flex-col space-y-2">
                            <button
                                onClick={() => setIsMobileProfileOpen(!isMobileProfileOpen)}
                                className="w-full flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100 text-left"
                            >
                                <div className="flex items-center gap-3">
                                    {user.image ? (
                                        <img src={user.image} alt={user.name || "Profile"} className="h-10 w-10 rounded-lg object-cover" />
                                    ) : (
                                        <div className="h-10 w-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold uppercase">
                                            {user.name ? user.name.slice(0, 2) : "UI"}
                                        </div>
                                    )}
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-400 font-medium">Welcome back,</span>
                                        <span className="text-base font-semibold text-gray-800 leading-tight">{user.name || "User"}</span>
                                    </div>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isMobileProfileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <div className={`transition-all duration-200 pl-2 flex flex-col space-y-1 overflow-hidden ${isMobileProfileOpen ? 'max-h-32 opacity-100 py-1' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        navigate('/user-profile');
                                    }}
                                    className="flex items-center gap-2.5 py-2.5 px-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-xl text-left"
                                >
                                    <UserIcon size={18} className="text-gray-400" />
                                    My Profile
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2.5 py-2.5 px-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-xl text-left"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <NavLink
                            to='/login'
                            onClick={() => setIsOpen(false)}
                            className="block w-full text-center bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-xl transition-all duration-200 active:scale-95 shadow-lg shadow-red-100"
                        >
                            Login / Sign Up
                        </NavLink>
                    )}
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`text-left py-2 font-medium text-lg transition-all duration-200 block ${isActive ? 'text-red-600 pl-2 border-l-4 border-red-600' : 'text-gray-600 hover:text-red-600'}`}
                            >
                                {link.name}
                            </NavLink>
                        );
                    })}

                    <hr className="border-gray-100 my-2" />

                </div>
            </nav>

            {isRechargeOpen && (
                <div className="modal modal-open fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="modal-box bg-white max-w-sm rounded-2xl p-6 relative border border-gray-100 shadow-2xl">
                        <button
                            onClick={() => setIsRechargeOpen(false)}
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-500"
                        >✕</button>

                        <h3 className="font-bold text-lg text-gray-800 text-center mb-4">Recharge Your Wallet</h3>

                        <form onSubmit={handleSubmit(onRechargeSubmit)} className="space-y-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium text-gray-600">Enter Amount (BDT)</span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="e.g. 500"
                                    className={`input input-bordered w-full bg-gray-50 text-gray-900 focus:outline-none focus:border-red-500 ${errors.amount ? 'input-error' : ''}`}
                                    {...register("amount", { required: "Amount is required", })}
                                />
                                {errors.amount && <span className="text-xs text-red-500 mt-1">{errors.amount.message}</span>}
                            </div>

                            <button
                                type="submit"
                                disabled={loadingPayment}
                                className={`btn bg-red-600 hover:bg-red-700 text-white w-full rounded-xl border-none mt-2 ${loadingPayment ? 'loading' : ''}`}
                            >
                                {loadingPayment ? "Processing..." : "Proceed to Payment"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;