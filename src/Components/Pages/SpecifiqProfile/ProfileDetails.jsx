import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
    User, Briefcase,
    MapPin, CheckCircle2, X, ShieldCheck, Lock,
    Phone,
    Mail,
    Globe,
    Sparkles,
    FileText,
    ImageIcon,
    CheckCircle,
    Send,
    Clock
} from 'lucide-react';
import config from '../utilies/envconfig';
import { useParams } from 'react-router';
import toast, { Toaster } from 'react-hot-toast';
import { AuthProvider } from './../../AuthProvider/CreateContext';
import SpecifiqGallary from './SpecifiqGallary';
import Loading from '../Shared/Loading';


const ProfileDetails = () => {
    const { data } = useContext(AuthProvider);
    const { id } = useParams();
    const [profileUser, setProfileUser] = useState(null);
    const [isProfileLocked, setIsProfileLocked] = useState(true);
    const [isPhoneLocked, setIsPhoneLocked] = useState(true);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [activeTab, setActiveTab] = useState('details');
    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("accessToken");

                const configHeaders = {};
                if (token) {
                    configHeaders.Authorization = `Bearer ${token}`;
                }

                const response = await axios.get(`${config.backendUrl}/user/details/${id}`, {
                    headers: configHeaders
                });

                if (response.data.success) {
                    setProfileUser(response.data.data.profile);
                    setIsProfileLocked(response.data.data.isProfileLocked);
                    setIsPhoneLocked(response.data.data.isPhoneLocked !== undefined ? response.data.data.isPhoneLocked : true);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProfileData();
        }
    }, [id]);

    const [connectionData, setConnectionData] = useState({ status: "LOADING", isSender: false, requestId: null });


    const fetchConnectionStatus = async () => {
        if (!token) return;
        try {
            const response = await axios.get(`${config.backendUrl}/connection/status/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setConnectionData(response.data.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchConnectionStatus();
    }, [id]);


    const handleSendRequest = async () => {
        if (data?.data?.gender === profileUser?.gender) {
            toast.error("You can only send requests to the opposite gender!");
            return;
        }
        try {
            const response = await axios.post(`${config.backendUrl}/connection/send`, { receiverId: id }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                toast.success(response.data.message);
                fetchConnectionStatus();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    const handleUnlockPhonePaystation = async () => {
        try {
            const response = await axios.post(`${config.backendUrl}/phoneunlock/initiate-payment`, {
                buyerUserObjectId: data?.data?._id,
                targetUserObjectId: id,
                name: data?.data?.fullName,
                email: data?.data?.email,
                phone: data?.data?.contactNo,
                originUrl: window.location.href
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success && response.data.payment_url) {
                window.location.href = response.data.payment_url;
            } else {
                toast.error("Failed to load gateway.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to initiate payment");
        }
    };

    // if (connectionData.status === "LOADING") {
    //     return <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">Loading Content...</div>;
    // }


    // const handleUnlockProfile = async () => {
    //     const token = localStorage.getItem("accessToken");
    //     if (!token) {
    //         toast.error('প্রোফাইল আনলক করতে প্রথমে লগইন করুন।');
    //         return;
    //     }

    //     try {
    //         setMessage({ type: '', text: '' });
    //         const response = await axios.post(
    //             `${config.backendUrl}/user/unlock`,
    //             { targetUserId: id },
    //             { headers: { Authorization: `Bearer ${token}` } }
    //         );

    //         if (response.data.success) {
    //             setIsProfileLocked(false);
    //             setProfileUser(prev => ({
    //                 ...prev,
    //                 email: response.data.data.email,
    //                 currentThana: response.data.data.currentThana,
    //                 currentDistrict: response.data.data.currentDistrict,
    //                 currentDivision: response.data.data.currentDivision,
    //                 currentCountry: response.data.data.currentCountry,
    //                 permanentThana: response.data.data.permanentThana,
    //                 permanentDistrict: response.data.data.permanentDistrict,
    //                 permanentDivision: response.data.data.permanentDivision,
    //                 permanentCountry: response.data.data.permanentCountry,
    //             }));
    //             toast.success(response.data.message);
    //         }
    //     } catch (error) {
    //         toast.error(error.response?.data?.message);
    //     }
    // };

    // const handleUnlockPhone = async () => {
    //     const token = localStorage.getItem("accessToken");
    //     if (!token) {
    //         toast.error('ফোন নাম্বার আনলক করতে প্রথমে লগইন করুন।');
    //         return;
    //     }

    //     try {
    //         const response = await axios.post(
    //             `${config.backendUrl}/phoneunlock/initiate-payment`,
    //             {
    //                 buyerUserObjectId: data?.data?._id,
    //                 targetUserObjectId: id,
    //                 name: data?.data?.fullName,
    //                 email: data?.data?.email,
    //                 phone: data?.data?.contactNo,
    //                 originUrl: window.location.href
    //             },
    //             { headers: { Authorization: `Bearer ${token}` } }
    //         );

    //         if (response.data.success && response.data.payment_url) {
    //             window.location.href = response.data.payment_url;
    //         } else {
    //             toast.error("পেমেন্ট গেটওয়ে চালু করা যায়নি।");
    //         }
    //     } catch (error) {
    //         toast.error(error.response?.data?.message || "Failed to initiate payment");
    //     }
    // };

    // const handleSendInterest = () => {
    //     toast.error("This feature is currently under development. Please check back later!");
    // };



    if (loading) {
    return <Loading></Loading>
}

    return (
        <div className="app-container pb-8 min-h-screen bg-gray-50/50">
            <Toaster position="top-right" reverseOrder={false} />
            {message.text && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl text-sm font-medium shadow-md transition-all ${message.type === 'success' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                    {message.text}
                </div>
            )}

            <div className="relative mb-6">
                <div className={`h-64 md:h-[24rem] w-full rounded-b-2xl overflow-hidden relative ${profileUser?.role === 'PREMIUM' ? 'bg-gradient-to-br from-neutral-950 via-red-950 to-neutral-950 ring-4 ring-red-600 ring-offset-4 ring-offset-neutral-950 shadow-2xl shadow-red-600/30' : 'bg-emerald-950'}`}>
                    <img src={profileUser?.coverImage} className={`w-full h-full object-cover`} alt="Cover" />
                    <div className={`absolute inset-0 ${profileUser?.role === 'PREMIUM' ? 'bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent' : 'bg-gradient-to-t from-black/60 via-transparent to-transparent'}`} />
                    {profileUser?.role === 'PREMIUM' && (
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-rose-500 text-white font-black text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-lg shadow-red-600/40 flex items-center gap-1.5 border border-red-500/30 z-10">
                            <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" /> Premium Member
                        </div>
                    )}
                </div>

                <div className="absolute -bottom-12 left-8 flex items-end space-x-4 z-20 w-[calc(100%-4rem)]">
                    <div className="relative group flex-shrink-0">
                        <div className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-neutral-800 relative shadow-xl ${profileUser?.role === 'PREMIUM' ? 'border-4 border-red-600 ring-4 ring-rose-500/40 ring-offset-2' : 'border-4 border-white'}`}>
                            <img src={profileUser?.profileImage} className="w-full h-full object-cover" alt="Avatar" />
                        </div>
                        {profileUser?.isVerified && (
                            <div className={`absolute bottom-2 right-2 border-2 text-white p-1.5 rounded-full shadow-lg ${profileUser?.role === 'PREMIUM' ? 'bg-red-600 border-neutral-950' : 'bg-emerald-600 border-white'}`}>
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                        )}
                    </div>

                    <div className="mb-4 flex-1 min-w-0 bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-lg max-w-xl">
                        <div className="min-w-0">
                            <h1 className={`text-2xl sm:text-3xl font-extrabold truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${profileUser?.role === 'PREMIUM' ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-orange-400' : 'text-white'}`}>
                                {profileUser?.fullName || 'No Name Set'}
                            </h1>
                            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2 text-xs sm:text-sm font-medium text-gray-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                <span className="flex items-center gap-1.5"><MapPin className={`w-4 h-4 ${profileUser?.role === 'PREMIUM' ? 'text-red-500' : 'text-emerald-500'}`} /> {profileUser?.currentThana || 'Not Set'}, Bangladesh</span>
                                <span className="flex items-center gap-1.5"><User className={`w-4 h-4 ${profileUser?.role === 'PREMIUM' ? 'text-red-500' : 'text-emerald-500'}`} /> <span className="text-gray-400">ID:</span> {profileUser?.userID || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-14 px-8 border-b border-gray-200 bg-white shadow-sm rounded-t-xl mt-2 mx-auto max-w-7xl">
                <div className="flex space-x-6">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${activeTab === 'details'
                            ? (profileUser?.role === 'PREMIUM' ? 'border-red-600 text-red-600' : 'border-emerald-600 text-emerald-600')
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <FileText className="w-4 h-4" /> Details
                    </button>
                    <button
                        onClick={() => setActiveTab('photos')}
                        className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${activeTab === 'photos'
                            ? (profileUser?.role === 'PREMIUM' ? 'border-red-600 text-red-600' : 'border-emerald-600 text-emerald-600')
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <ImageIcon className="w-4 h-4" /> Photos
                    </button>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
                {activeTab === 'details' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
                        <div className="lg:col-span-2 space-y-6">
                            {/* Personal Info */}
                            <div className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 ${profileUser?.role === 'PREMIUM' ? 'border-l-red-600' : 'border-l-emerald-600'}`}>
                                <div className="flex justify-between items-center mb-4 border-b pb-2">
                                    <h2 className={`text-lg font-bold flex items-center gap-2 ${profileUser?.role === 'PREMIUM' ? 'text-red-600' : 'text-emerald-600'}`}>
                                        <User className="w-5 h-5" /> Personal Information
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase">Age</label>
                                        <p className="text-gray-800 font-medium mt-0.5">{profileUser?.age || 'Not Set'} Years</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase">Birth Date</label>
                                        <p className="text-gray-800 font-medium mt-0.5">{profileUser?.birth || 'Not Set'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase">Home District</label>
                                        <p className="text-gray-800 font-medium mt-0.5">{profileUser?.homeDistrict || 'Not Set'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase">Gender</label>
                                        <p className="text-gray-800 font-medium mt-0.5">{profileUser?.gender || 'Not Set'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 ${profileUser?.role === 'PREMIUM' ? 'border-l-red-600' : 'border-l-emerald-600'}`}>
                                <div className="flex justify-between items-center mb-4 border-b pb-2">
                                    <h2 className={`text-lg font-bold flex items-center gap-2 ${profileUser?.role === 'PREMIUM' ? 'text-red-600' : 'text-emerald-600'}`}>
                                        <Briefcase className="w-5 h-5" /> Professional & Education
                                    </h2>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex gap-3 items-start">
                                        <div className={`p-2 rounded-xl mt-1 ${profileUser?.role === 'PREMIUM' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                            <Briefcase className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-800 font-semibold">{profileUser?.profession || 'Not Set'}</p>
                                            <p className="text-gray-500 text-sm">Working Status</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* <div className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 ${profileUser?.role === 'PREMIUM' ? 'border-l-red-600' : 'border-l-emerald-600'}`}>
                                <div className="flex justify-between items-center mb-4 border-b pb-2">
                                    <h2 className={`text-lg font-bold flex items-center gap-2 ${profileUser?.role === 'PREMIUM' ? 'text-red-600' : 'text-emerald-600'}`}>
                                        <Phone className="w-5 h-5" /> Contact Information
                                    </h2>
                                </div>
                                {isProfileLocked ? (
                                    <div className="flex flex-col items-center justify-center py-6 border border-dashed border-gray-200 rounded-xl bg-gray-50/50 px-4 text-center">
                                        <Lock className={`w-8 h-8 mb-2 ${profileUser?.role === 'PREMIUM' ? 'text-red-400' : 'text-emerald-400'}`} />
                                        <p className="text-sm font-semibold text-gray-700 mb-1">Contact Details are Locked</p>
                                        <p className="text-xs text-gray-500 mb-4">Please unlock to view Phone, Email, Current and Permanent address.</p>
                                        <button
                                            type="button"
                                            onClick={handleUnlockProfile}
                                            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm transition shadow-md flex items-center justify-center gap-2 ${profileUser?.role === 'PREMIUM' ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-100' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100'}`}
                                        >
                                            <Lock className="w-4 h-4" /> Unlock Contact Details <br /> (Paid 7 TK)
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4 animate-fadeIn">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className={`border p-4 rounded-xl flex flex-col justify-between min-h-[95px] ${profileUser?.role === 'PREMIUM' ? 'border-red-100 bg-red-50/10' : 'border-emerald-100 bg-emerald-50/20'}`}>
                                                <div>
                                                    <span className={`text-xs font-bold flex items-center gap-1 uppercase mb-1 ${profileUser?.role === 'PREMIUM' ? 'text-red-600' : 'text-emerald-600'}`}>
                                                        <Phone className="w-3.5 h-3.5" /> Phone Number
                                                    </span>
                                                    {!isPhoneLocked && (
                                                        <p className="text-gray-800 text-sm font-semibold animate-fadeIn">{profileUser?.contactNo || 'Not Set'}</p>
                                                    )}
                                                </div>
                                                {isPhoneLocked && (
                                                    <button
                                                        type="button"
                                                        onClick={handleUnlockPhone}
                                                        className={`mt-2 w-full text-center text-white py-2 px-4 rounded-xl font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-sm ${profileUser?.role === 'PREMIUM' ? 'bg-red-500 hover:bg-red-600 shadow-red-100' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100'}`}
                                                    >
                                                        <Lock className="w-3 h-3" /> Pay 77 TK to Unlock Phone Number
                                                    </button>
                                                )}
                                            </div>

                                            <div className={`border p-4 rounded-xl ${profileUser?.role === 'PREMIUM' ? 'border-red-100 bg-red-50/10' : 'border-emerald-100 bg-emerald-50/20'}`}>
                                                <span className={`text-xs font-bold flex items-center gap-1 uppercase mb-1 ${profileUser?.role === 'PREMIUM' ? 'text-red-600' : 'text-emerald-600'}`}>
                                                    <Mail className="w-3.5 h-3.5" /> Email Address
                                                </span>
                                                <p className="text-gray-800 text-sm font-semibold">{profileUser?.email || 'Not Set'}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                            <div className="border border-gray-100 p-4 rounded-xl bg-gray-50/50">
                                                <span className={`text-xs font-bold flex items-center gap-1 uppercase mb-1 ${profileUser?.role === 'PREMIUM' ? 'text-red-500' : 'text-emerald-600'}`}>
                                                    <MapPin className="w-3.5 h-3.5" /> Current Address
                                                </span>
                                                <p className="text-gray-700 text-sm font-medium">
                                                    {profileUser?.currentThana ? `${profileUser.currentThana}, ${profileUser.currentDistrict}, ${profileUser.currentDivision}, ${profileUser.currentCountry}` : 'Not Set'}
                                                </p>
                                            </div>
                                            <div className="border border-gray-100 p-4 rounded-xl bg-gray-50/50">
                                                <span className={`text-xs font-bold flex items-center gap-1 uppercase mb-1 ${profileUser?.role === 'PREMIUM' ? 'text-red-500' : 'text-emerald-600'}`}>
                                                    <Globe className="w-3.5 h-3.5" /> Permanent Address
                                                </span>
                                                <p className="text-gray-700 text-sm font-medium">
                                                    {profileUser?.permanentThana ? `${profileUser.permanentThana}, ${profileUser.permanentDistrict}, ${profileUser.permanentDivision}, ${profileUser.permanentCountry}` : 'Not Set'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div> */}

                            <div className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 ${profileUser?.role === 'PREMIUM' ? 'border-l-red-600' : 'border-l-emerald-600'}`}>
                                <div className="flex justify-between items-center mb-4 border-b pb-2">
                                    <h2 className={`text-lg font-bold flex items-center gap-2 ${profileUser?.role === 'PREMIUM' ? 'text-red-600' : 'text-emerald-600'}`}>
                                        <Phone className="w-5 h-5" /> Contact Information
                                    </h2>
                                </div>

                                {connectionData.status === "NONE" && (
                                    <div className="flex flex-col items-center justify-center py-6 border border-dashed border-gray-200 rounded-xl bg-gray-50/50 px-4 text-center">
                                        <Lock className={`w-8 h-8 mb-2 ${profileUser?.role === 'PREMIUM' ? 'text-red-400' : 'text-emerald-400'}`} />
                                        <p className="text-sm font-semibold text-gray-700 mb-1">Contact Details are Locked</p>
                                        <p className="text-xs text-gray-500 mb-4">Send a request to gain connection access.</p>
                                        <button
                                            type="button"
                                            onClick={handleSendRequest}
                                            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm transition shadow-md flex items-center justify-center gap-2 ${profileUser?.role === 'PREMIUM' ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-100' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100'}`}
                                        >
                                            <Send className="w-4 h-4" /> Request Contact Details (Paid 7 TK)
                                        </button>
                                    </div>
                                )}

                                {connectionData.status === "PENDING" && (
                                    <div className="flex flex-col items-center justify-center py-6 border border-dashed border-gray-200 rounded-xl bg-gray-50/50 px-4 text-center">
                                        <Clock className="w-8 h-8 mb-2 text-amber-500 animate-pulse" />
                                        <p className="text-sm font-semibold text-gray-700 mb-1">
                                            {connectionData.isSender ? "Request is Pending Approval" : "This user sent you a request"}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {connectionData.isSender
                                                ? "Please wait until they accept your request to unlock payment options."
                                                : "Check your dropdown requests in the navbar to accept."
                                            }
                                        </p>
                                    </div>
                                )}

                                {connectionData.status === "REJECTED" && (
                                    <div className="flex flex-col items-center justify-center py-6 border border-dashed border-gray-200 rounded-xl bg-gray-50/50 px-4 text-center">
                                        <X className="w-8 h-8 mb-2 text-red-500" />
                                        <p className="text-sm font-semibold text-gray-700 mb-1">Request Declined</p>
                                        <p className="text-xs text-gray-500">The connection request between you two was rejected.</p>
                                    </div>
                                )}

                                {connectionData.status === "ACCEPTED" && (
                                    <div className="flex flex-col items-center justify-center py-6 border border-dashed border-gray-200 rounded-xl bg-gray-50/50 px-4 text-center">
                                        <CheckCircle className="w-8 h-8 mb-2 text-emerald-500" />
                                        <p className="text-sm font-semibold text-gray-700 mb-1">Request Accepted!</p>
                                        <p className="text-xs text-gray-500 mb-4">Pay 77 TK now to instantly view full profile credentials.</p>
                                        <button
                                            type="button"
                                            onClick={handleUnlockPhonePaystation}
                                            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm transition shadow-md flex items-center justify-center gap-2 ${profileUser?.role === 'PREMIUM' ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-100' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100'}`}
                                        >
                                            <Lock className="w-4 h-4" /> Pay 77 TK to Unlock Full Profile Information
                                        </button>
                                    </div>
                                )}

                                {connectionData.status === "FULL_ACCESS" && (
                                    <div className="space-y-4 animate-fadeIn">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className={`border p-4 rounded-xl flex flex-col justify-between min-h-[95px] ${profileUser?.role === 'PREMIUM' ? 'border-red-100 bg-red-50/10' : 'border-emerald-100 bg-emerald-50/20'}`}>
                                                <div>
                                                    <span className={`text-xs font-bold flex items-center gap-1 uppercase mb-1 ${profileUser?.role === 'PREMIUM' ? 'text-red-600' : 'text-emerald-600'}`}>
                                                        <Phone className="w-3.5 h-3.5" /> Phone Number
                                                    </span>
                                                    <p className="text-gray-800 text-sm font-semibold animate-fadeIn">{connectionData?.contactNo || 'Not Set'}</p>
                                                </div>
                                            </div>

                                            <div className={`border p-4 rounded-xl ${profileUser?.role === 'PREMIUM' ? 'border-red-100 bg-red-50/10' : 'border-emerald-100 bg-emerald-50/20'}`}>
                                                <span className={`text-xs font-bold flex items-center gap-1 uppercase mb-1 ${profileUser?.role === 'PREMIUM' ? 'text-red-600' : 'text-emerald-600'}`}>
                                                    <Mail className="w-3.5 h-3.5" /> Email Address
                                                </span>
                                                <p className="text-gray-800 text-sm font-semibold">{connectionData?.email || 'Not Set'}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                            <div className="border border-gray-100 p-4 rounded-xl bg-gray-50/50">
                                                <span className={`text-xs font-bold flex items-center gap-1 uppercase mb-1 ${profileUser?.role === 'PREMIUM' ? 'text-red-500' : 'text-emerald-600'}`}>
                                                    <MapPin className="w-3.5 h-3.5" /> Current Address
                                                </span>
                                                <p className="text-gray-700 text-sm font-medium">
                                                    {connectionData?.currentThana ? `${connectionData.currentThana}, ${connectionData.currentDistrict}, ${connectionData.currentDivision}, ${connectionData.currentCountry}` : 'Not Set'}
                                                </p>
                                            </div>
                                            <div className="border border-gray-100 p-4 rounded-xl bg-gray-50/50">
                                                <span className={`text-xs font-bold flex items-center gap-1 uppercase mb-1 ${profileUser?.role === 'PREMIUM' ? 'text-red-500' : 'text-emerald-600'}`}>
                                                    <Globe className="w-3.5 h-3.5" /> Permanent Address
                                                </span>
                                                <p className="text-gray-700 text-sm font-medium">
                                                    {connectionData?.permanentThana ? `${connectionData.permanentThana}, ${connectionData.permanentDistrict}, ${connectionData.permanentDivision}, ${connectionData.permanentCountry}` : 'Not Set'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Verification Status</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2.5 text-sm font-medium text-gray-700">
                                        {profileUser?.isActive === 'ACTIVE' ? (
                                            <CheckCircle2 className={`w-4 h-4 ${profileUser?.role === 'PREMIUM' ? 'text-red-600 fill-red-50' : 'text-emerald-600 fill-emerald-50'}`} />
                                        ) : (
                                            <X className="w-4 h-4 text-red-500" />
                                        )}
                                        <span>Profile Verified</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-sm font-medium text-gray-700">
                                        {profileUser?.isDocumentVerification === true ? (
                                            <CheckCircle2 className={`w-4 h-4 ${profileUser?.role === 'PREMIUM' ? 'text-red-600 fill-red-50' : 'text-emerald-600 fill-emerald-50'}`} />
                                        ) : (
                                            <X className="w-4 h-4 text-red-500" />
                                        )}
                                        <span>Document Verified</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-sm font-medium text-gray-700">
                                        {profileUser?.isFieldVerification === true ? (
                                            <CheckCircle2 className={`w-4 h-4 ${profileUser?.role === 'PREMIUM' ? 'text-red-600 fill-red-50' : 'text-emerald-600 fill-emerald-50'}`} />
                                        ) : (
                                            <X className="w-4 h-4 text-red-500" />
                                        )}
                                        <span>Field Verified</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[300px] animate-fadeIn">
                        <SpecifiqGallary profileUser={profileUser} token={token} config={config} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileDetails;