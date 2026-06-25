import { useContext, useEffect, useRef, useState } from "react";
import logo from '../../../assets/images/logo.jpeg'
import { Bell, Check, LogOut, Menu, ShieldCheck, Sparkles, UserIcon, X } from "lucide-react";
import Button from "../utilies/Button";
import { NavLink, useLocation, useNavigate } from "react-router";
import { AuthProvider } from "../../AuthProvider/CreateContext";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import config from "../utilies/envconfig";

const Navbar = () => {
    const { user, data, token } = useContext(AuthProvider);
    const userProfile = data?.data;
    console.log(userProfile);
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
        // { name: 'Blog', path: '/blog' },
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


    console.log(data?.data)

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


    const [premiumon, setpremiumon] = useState(false);
    const [loading, setLoading] = useState(false);

    const handlePremiumPayment = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            toast.error("প্রিমিয়াম ফিচার কিনতে প্রথমে লগইন করুন।");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                `${config.backendUrl}/premiumPayment/initiate-payment`,
                {
                    userObjectId: data?.data?._id,
                    name: data?.data?.fullName,
                    email: data?.data?.email,
                    phone: data?.data?.contactNo,
                    originUrl: window.location.origin
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success && response.data.payment_url) {
                window.location.href = response.data.payment_url;
            } else {
                toast.error("পেমেন্ট গেটওয়ে লোড করা সম্ভব হয়নি।");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    const [requestopen, setrequestopen] = useState(false);
    const [requests, setRequests] = useState([]);
    const dropdownRef = useRef(null);

    const fetchRequests = async () => {
        if (!token) return;
        try {
            const response = await axios.get(`${config.backendUrl}/connection/pending`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setRequests(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching requests", error);
        }
    };

    useEffect(() => {
        fetchRequests();
        const interval = setInterval(fetchRequests, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setrequestopen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const handleAction = async (requestId, action) => {
        try {
            const response = await axios.post(`${config.backendUrl}/connection/action`, {
                requestId,
                action
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                toast.success(response.data.message);
                setRequests(prev => prev.filter(req => req._id !== requestId));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        }
    };


    return (
        <div className="border-b relative z-50 bg-white">
            <Toaster position="top-right" reverseOrder={false} />
            <div className="flex items-center justify-between app-container relative py-4">
                <NavLink to='/' className="flex items-center space-x-3 select-none">
                    <img className="size-14 object-contain rounded-xl" src={logo} alt="Logo" />
                    <div className="md:flex flex-col hidden">
                        <div className="text-red-600 font-bold text-2xl leading-none tracking-tight">Bibah</div>
                        <div className="text-gray-500 text-xs mt-1 tracking-wide">A Perfect Partner</div>
                    </div>
                </NavLink>

                <div className="relative static sm:relative" >
                    <button
                        onClick={() => setrequestopen(!requestopen)}
                        className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold text-gray-300 hover:text-white bg-neutral-900 border border-white/5 rounded-xl transition-all duration-200"
                    >
                        <Bell className="w-4 h-4 text-red-500" />
                        <span className="hidden xs:inline">Connection Requests</span>
                        <span className="xs:hidden">Requests</span>
                        {requests.length > 0 && (
                            <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                                {requests.length}
                            </span>
                        )}
                    </button>


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
                {
                    userProfile?.role !== 'PREMIUM' && (
                        <button
                            type="button"
                            onClick={() => setpremiumon(true)}
                            className="bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600 text-white font-bold text-sm py-2.5 px-2 mr-2 rounded-xl transition all duration-300 hidden  md:flex items-center gap-2 shadow-md shadow-red-100"
                        >
                            <Sparkles className="w-4 h-4 hidden md:flex" /> Get Premium Feature
                        </button>
                    )
                }
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


                {premiumon && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
                        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-rose-50 animate-scaleUp">

                            <button
                                type="button"
                                onClick={() => setpremiumon(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="text-center mt-2">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ShieldCheck className="w-6 h-6 text-red-600" />
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    প্রিমিয়াম মেম্বারশিপ আপগ্রেড
                                </h3>

                                <p className="text-gray-600 text-sm leading-relaxed px-2 bg-rose-50/50 py-3 rounded-xl border border-rose-100/50 font-medium">
                                    এই ফিচারটি একবার নিলে পরবর্তীতে প্রোফাইল ভেরিফিকেশন বা ফোন নাম্বার আনলক করার জন্য কোনো রকম আর কোনো চার্জ প্রদান করতে হবে না। সবকিছু আজীবন আনলিমিটেড উপভোগ করুন!
                                </p>
                            </div>

                            <div className="mt-6 border-t border-gray-100 pt-4 text-center">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                                    Total Payable Amount
                                </span>
                                <div className="text-3xl font-black text-gray-900 mb-4">
                                    9,999 <span className="text-lg font-bold text-red-600">TK</span>
                                </div>

                                <button
                                    type="button"
                                    onClick={handlePremiumPayment}
                                    disabled={loading}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-red-200 text-sm tracking-wide disabled:opacity-50"
                                >
                                    {loading ? "Processing..." : "PAY NOW"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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
                                    {/* <div className="flex justify-between items-center text-xs py-1">
                                        <span className="text-gray-500">Refer</span>
                                        <span className="font-semibold text-indigo-600">৳{referralAmount}</span>
                                    </div> */}
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
                    {
                        userProfile?.role !== 'PREMIUM' && (
                            <button
                                type="button"
                                onClick={() => {
                                    setpremiumon(true);
                                    setIsOpen(false);
                                }}
                                className="bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600 text-white font-bold text-sm py-2.5 px-2 mr-2 rounded-xl transition all duration-300 md:hidden flex items-center gap-2 shadow-md shadow-red-100"
                            >
                                <Sparkles className="w-4 h-4 hidden md:flex" /> Get Premium Feature
                            </button>
                        )
                    }
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
            </div>

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
                                            validate: {
                                                positive: (val) => Number(val) > 0 || "Amount must be greater than 0",
                                                firstRecharge: (val) => {
                                                    if (totalAmount === 0 && Number(val) < 130) {
                                                        return "প্রথম রিচার্জ সর্বনিম্ন ১৩০ টাকা হতে হবে";
                                                    }
                                                    if (Number(val) < 1) {
                                                        return "Minimum recharge amount is ৳1";
                                                    }
                                                    return true;
                                                }
                                            }
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
            
            {requestopen && (
                <div className="absolute top-20 right-0 sm:right-0 md:left-8  mt-2 w-[calc(100vw-2rem)] sm:w-96 bg-neutral-900 border border-white/10 shadow-2xl p-4 transform origin-top transition-all duration-200 overflow-hidden z-50 mx-4 sm:mx-0">
                    <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
                        <h4 className="font-bold text-gray-200 text-sm">Pending Connections</h4>
                        <span className="text-xs text-gray-500">{requests.length} total</span>
                    </div>

                    {requests.length === 0 ? (
                        <div className="text-center py-6 text-sm text-gray-500">
                            No pending requests found
                        </div>
                    ) : (
                        <div className="max-h-64 sm:max-h-72 overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-neutral-800">
                            {requests.map((req) => (
                                <div key={req._id} className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors gap-2 sm:gap-3">
                                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                        <img
                                            src={req.senderId?.profileImage || 'https://via.placeholder.com/150'}
                                            alt={req.senderId?.fullName}
                                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-white/10 flex-shrink-0"
                                        />
                                        <div className="min-w-0">
                                            <p className="font-bold text-xs sm:text-sm text-white truncate">{req.senderId?.fullName}</p>
                                            <p className="text-[9px] sm:text-[10px] text-gray-500 mt-0.5">{req.senderId?.gender} • {req.senderId?.birth ? new Date().getFullYear() - new Date(req.senderId.birth).getFullYear() : 'N/A'} Yrs</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                        <button
                                            onClick={() => handleAction(req._id, "ACCEPTED")}
                                            className="p-1.5 sm:p-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-lg transition-all duration-150"
                                        >
                                            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleAction(req._id, "REJECTED")}
                                            className="p-1.5 sm:p-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-all duration-150"
                                        >
                                            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

        </div>
    );
};

export default Navbar;