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
                            className="flex items-center gap-3 bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600 text-white font-medium px-4 py-2 rounded-xl transition-all duration-300 active:scale-95 shadow-md shadow-red-100 border border-red-500/10"
                        >
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6A2.25 2.25 0 0 1 18.75 20H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
                                </svg>
                            </div>
                            <div className="text-left leading-tight pr-1">
                                <span className="block text-[10px] font-semibold uppercase tracking-wider text-red-100">Wallet</span>
                                <span className="text-sm font-extrabold tracking-wide">৳ {totalAmount}</span>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={`w-3 h-3 text-red-100 transition-transform duration-300 ${isWalletOpen ? 'rotate-180' : ''}`}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>

                        {user && isWalletOpen && (
                            <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100/80 p-5 z-50 transform origin-top-right transition-all duration-200 ease-out animate-in fade-in slide-in-from-top-2">
                                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Balance Details</h4>
                                    <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-100/50">Active Account</span>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-2.5 rounded-xl bg-gray-50/60 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                                            <span className="text-sm font-medium text-gray-600">Main Balance</span>
                                        </div>
                                        <span className="font-bold text-gray-900">৳ {mainAmount}</span>
                                    </div>

                                    <div className="flex justify-between items-center p-2.5 rounded-xl bg-emerald-50/40 hover:bg-emerald-50/70 transition-colors">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                            <span className="text-sm font-medium text-emerald-700">Bonus Balance</span>
                                        </div>
                                        <span className="font-bold text-emerald-600">৳ {bonusAmount}</span>
                                    </div>

                                    {/* <div className="flex justify-between items-center p-2.5 rounded-xl bg-indigo-50/40 hover:bg-indigo-50/70 transition-colors">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                            <span className="text-sm font-medium text-indigo-700">Referral Earn</span>
                                        </div>
                                        <span className="font-bold text-indigo-600">৳ {referralAmount}</span>
                                    </div> */}
                                </div>

                                <button
                                    onClick={() => { setIsRechargeOpen(true); setIsWalletOpen(false); }}
                                    className="group flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-500 text-white hover:from-red-700 hover:to-rose-600 active:scale-[0.98] transition-all duration-200 py-3 px-4 rounded-xl w-full mt-5 font-bold text-sm shadow-md shadow-red-100"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 transition-transform group-hover:translate-x-0.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
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
                <div className="modal modal-open fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300">
                    <div className="modal-box bg-white max-w-sm w-full rounded-2xl p-6 relative border border-gray-100 shadow-2xl transform transition-all scale-100 animate-in fade-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setIsRechargeOpen(false)}
                            className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            ✕
                        </button>

                        <div className="flex flex-col items-center mb-6">
                            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 mb-3 border border-red-100/50">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6A2.25 2.25 0 0 1 18.75 20H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
                                </svg>
                            </div>
                            <h3 className="font-extrabold text-xl text-gray-800 text-center">Recharge Wallet</h3>
                            <p className="text-xs text-gray-400 text-center mt-1">Add funds securely to your account</p>
                        </div>

                        <form onSubmit={handleSubmit(onRechargeSubmit)} className="space-y-5">
                            <div className="form-control w-full">
                                <label className="label py-1">
                                    <span className="label-text font-semibold text-gray-600 text-xs uppercase tracking-wider">Enter Amount (BDT)</span>
                                </label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-4 text-gray-400 font-bold text-lg select-none">৳</span>
                                    <input
                                        type="number"
                                        placeholder="e.g. 500"
                                        className={`input w-full pl-9 pr-4 py-6 bg-gray-50/80 text-gray-900 font-bold text-lg rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:bg-white transition-all duration-200 ${errors.amount ? 'border-red-500 bg-red-50/10 focus:border-red-500' : ''}`}
                                        {...register("amount", {
                                            required: "Amount is required",
                                            // min: { value: 10, message: "Minimum recharge amount is ৳10" }
                                        })}
                                    />
                                </div>
                                {errors.amount && (
                                    <div className="flex items-center gap-1 mt-1.5 text-red-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-xs font-medium">{errors.amount.message}</span>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loadingPayment}
                                className={`group flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-500 text-white hover:from-red-700 hover:to-rose-600 active:scale-[0.98] transition-all duration-200 py-3.5 px-4 rounded-xl w-full font-bold text-sm shadow-md shadow-red-100 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none`}
                            >
                                {loadingPayment ? (
                                    <div className="flex items-center gap-2">
                                        <span className="loading loading-spinner loading-sm"></span>
                                        <span>Processing Payment...</span>
                                    </div>
                                ) : (
                                    <>
                                        <span>Proceed to Payment</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 transition-transform group-hover:translate-x-0.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;