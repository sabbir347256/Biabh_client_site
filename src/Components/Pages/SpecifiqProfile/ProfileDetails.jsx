import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    User, Briefcase, Heart,
    MapPin, CheckCircle2, X, ShieldCheck, Lock, 
    Phone,
    Mail,
    Globe
} from 'lucide-react';
import config from '../utilies/envconfig';
import { useNavigate, useParams } from 'react-router';
import toast, { Toaster } from 'react-hot-toast';


const ProfileDetails = () => {
    const { id } = useParams();
    const [profileUser, setProfileUser] = useState(null);
    const [isProfileLocked, setIsProfileLocked] = useState(true);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

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

    const navigate = useNavigate();

    const handleUnlockProfile = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setMessage({ type: 'error', text: 'প্রোফাইল আনলক করতে প্রথমে লগইন করুন।' });
            navigate("/login");
            return;
        }

        try {
            setMessage({ type: '', text: '' });
            const response = await axios.post(
                `${config.backendUrl}/user/unlock`,
                { targetUserId: id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                setIsProfileLocked(false);
                setProfileUser(prev => ({
                    ...prev,
                    contactNo: response.data.data.contactNo,
                    email: response.data.data.email
                }));
                toast.success(response.data.message)
                // setMessage({ type: 'success', text: response.data.message });
            }
        } catch (error) {
           toast.error(error.response?.data?.message)
        }
    };

    const handleSendInterest = () => {
        toast.error("This feature is currently under development. Please check back later!");
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-lg font-semibold">Loading Profile Details...</div>;
    }

    return (
        <div className="app-container pb-8 min-h-screen bg-gray-50/50">
            <Toaster position="top-right" reverseOrder={false} />
            {message.text && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl text-sm font-medium shadow-md transition-all ${message.type === 'success' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                    {message.text}
                </div>
            )}

            <div className="relative mb-6">
                <div className="h-64 md:h-[24rem] w-full rounded-b-2xl overflow-hidden bg-emerald-950 relative">
                    <img src={profileUser?.coverImage} className="w-full h-full object-cover opacity-40" alt="Cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                <div className="absolute -bottom-10 left-8 flex items-end space-x-4">
                    <div className="relative group">
                        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white overflow-hidden bg-gray-200 relative shadow-md">
                            <img src={profileUser?.profileImage} className="w-full h-full object-cover" alt="Avatar" />
                        </div>
                        {profileUser?.isVerified && (
                            <div className="absolute bottom-2 right-2 bg-emerald-600 border-2 border-white text-white p-1.5 rounded-full shadow">
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">{profileUser?.fullName || 'No Name Set'}</h1>
                        <div className="flex flex-wrap gap-3 mt-1 text-black text-sm drop-shadow-sm opacity-90">
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profileUser?.currentThana || 'Not Set'}, Bangladesh</span>
                            <span className="flex items-center gap-1"><User className="w-4 h-4" /> ID: {profileUser?.userID || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-16">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-red-600 border-l-4">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h2 className="text-lg font-bold text-red-600 flex items-center gap-2">
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
                                <p className="text-gray-800 font-medium mt-0.5">{profileUser?.currentDistrict || 'Not Set'}</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase">Gender</label>
                                <p className="text-gray-800 font-medium mt-0.5">{profileUser?.gender || 'Not Set'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-red-600 border-l-4">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h2 className="text-lg font-bold text-red-600 flex items-center gap-2">
                                <Briefcase className="w-5 h-5" /> Professional & Education
                            </h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex gap-3 items-start">
                                <div className="bg-red-50 p-2 rounded-xl text-red-600 mt-1">
                                    <Briefcase className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-800 font-semibold">{profileUser?.profession || 'Not Set'}</p>
                                    <p className="text-gray-500 text-sm">Working Status</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-red-600 border-l-4">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h2 className="text-lg font-bold text-red-600 flex items-center gap-2">
                                <Phone className="w-5 h-5" /> Contact Information
                            </h2>
                        </div>
                        {isProfileLocked ? (
                            <div className="flex flex-col items-center justify-center py-6 border border-dashed border-gray-200 rounded-xl bg-gray-50/50 px-4 text-center">
                                <Lock className="w-8 h-8 text-red-400 mb-2" />
                                <p className="text-sm font-semibold text-gray-700 mb-1">Contact Details are Locked</p>
                                <p className="text-xs text-gray-500 mb-4">Please unlock to view Phone, Email, Current and Permanent address.</p>
                                <button
                                    type="button"
                                    onClick={handleUnlockProfile}
                                    className="w-full sm:w-auto px-6 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-semibold text-sm transition shadow-md shadow-red-100 flex items-center justify-center gap-2"
                                >
                                    <Lock className="w-4 h-4" /> Unlock Contact Details (Paid 7 TK)
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-fadeIn">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="border border-emerald-100 p-4 rounded-xl bg-emerald-50/20">
                                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 uppercase mb-1">
                                            <Phone className="w-3.5 h-3.5" /> Phone Number
                                        </span>
                                        <p className="text-gray-800 text-sm font-semibold">{profileUser?.contactNo || 'Not Set'}</p>
                                    </div>
                                    <div className="border border-emerald-100 p-4 rounded-xl bg-emerald-50/20">
                                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 uppercase mb-1">
                                            <Mail className="w-3.5 h-3.5" /> Email Address
                                        </span>
                                        <p className="text-gray-800 text-sm font-semibold">{profileUser?.email || 'Not Set'}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                    <div className="border border-gray-100 p-4 rounded-xl bg-gray-50/50">
                                        <span className="text-xs font-bold text-red-500 flex items-center gap-1 uppercase mb-1">
                                            <MapPin className="w-3.5 h-3.5" /> Current Address
                                        </span>
                                        <p className="text-gray-700 text-sm font-medium">
                                            {profileUser?.currentThana ? `${profileUser.currentThana}, ${profileUser.currentDistrict}, ${profileUser.currentDivision}, ${profileUser.currentCountry}` : 'Not Set'}
                                        </p>
                                    </div>
                                    <div className="border border-gray-100 p-4 rounded-xl bg-gray-50/50">
                                        <span className="text-xs font-bold text-red-500 flex items-center gap-1 uppercase mb-1">
                                            <Globe className="w-3.5 h-3.5" /> Permanent Address
                                        </span>
                                        <p className="text-gray-700 text-sm font-medium">
                                            {profileUser?.permanentThana ? `${profileUser.permanentThana}, ${profileUser.permanentDistrict}, ${profileUser.permanentDivision}, ${profileUser.permanentCountry}` : 'Not Set'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    {/* <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                        <div className="mx-auto bg-red-50 text-red-600 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                            <Heart className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg">Connect with {profileUser?.fullName || 'User'}</h3>
                        <p className="text-gray-500 text-sm mt-1 mb-4 px-4">Take the first step toward a blessed journey together.</p>

                        <button
                            type="button"
                            onClick={handleSendInterest}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold text-sm transition shadow-md shadow-red-100 mb-3 flex items-center justify-center gap-2"
                        >
                            <Heart className="w-4 h-4" /> Send Interest
                        </button>

                        {isProfileLocked ? (
                            <button
                                type="button"
                                onClick={handleUnlockProfile}
                                className="w-full border border-red-200 hover:bg-red-50 text-red-600 py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 bg-red-50/30"
                            >
                                <Lock className="w-4 h-4" /> Unlock Contact Details (7 TK)
                            </button>
                        ) : (
                            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-center animate-fadeIn font-semibold text-sm flex items-center justify-center gap-1.5">
                                <Unlock className="w-4 h-4 text-emerald-600" /> Contact Details Unlocked
                            </div>
                        )}
                    </div> */}

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Verification Status</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2.5 text-sm font-medium text-gray-700">
                                {profileUser?.isActive === 'ACTIVE' ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-50" />
                                ) : (
                                    <X className="w-4 h-4 text-red-500" />
                                )}
                                <span>Profile Verified</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileDetails;