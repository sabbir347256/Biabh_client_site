import { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import {
    User, Briefcase, GraduationCap, Heart, Home,
    MapPin, Edit2, CheckCircle2,
    Upload, X, ShieldCheck, Lock, Camera, Unlock,
    Phone,
    Mail,
    Globe
} from 'lucide-react';
import { AuthProvider } from '../../../AuthProvider/CreateContext';
import config from '../../utilies/envconfig';
import toast, { Toaster } from 'react-hot-toast';

// const config?.backendUrl /user= 'https://api.example.com/user';

const UserProfile = () => {
    const { data: authContextData } = useContext(AuthProvider);
    const profileUser = authContextData?.data;

    console.log(profileUser)

    const [loading, setLoading] = useState(true);
    const [isProfileLocked, setIsProfileLocked] = useState(true);
    const [editSections, setEditSections] = useState({
        header: false,
        personal: false,
        professional: false,
        contact: false,
        family: false,
        expectations: false
    });

    const [images, setImages] = useState({
        cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400"
    });

    const [nidUploaded, setNidUploaded] = useState(false);

    const { register, handleSubmit, watch, reset, setValue } = useForm();
    const watchedValues = watch();

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                if (profileUser) {
                    reset(profileUser);
                    if (profileUser.coverImage) setImages(prev => ({ ...prev, cover: profileUser.coverImage }));
                    if (profileUser.profileImage) setImages(prev => ({ ...prev, avatar: profileUser.profileImage }));
                    if (profileUser.nidStatus) setNidUploaded(profileUser.nidStatus === 'verified' || profileUser.nidStatus === 'pending');
                    setIsProfileLocked(profileUser.isLocked !== undefined ? profileUser.isLocked : true);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching profile data:", error);

            }
        };

        fetchProfileData();
    }, [reset, profileUser]);

    const handleImageChange = async (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const localUrl = URL.createObjectURL(file);
            setImages(prev => ({ ...prev, [type]: localUrl }));

            const formData = new FormData();
            formData.append(type === 'cover' ? 'coverPhoto' : 'avatarPhoto', file);

            try {
                const response = await axios.post(`${config?.backendUrl}/user/upload-${type}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                if (response.data.imageUrl) {
                    setImages(prev => ({ ...prev, [type]: response.data.imageUrl }));
                }
            } catch (error) {
                console.error(`Error uploading ${type} image:`, error);
            }
        }
    };

    const handleNidUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setNidUploaded(true);
            const formData = new FormData();
            formData.append('nidDocument', file);

            try {
                await axios.post(`${config?.backendUrl}/user/upload-nid`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } catch (error) {
                console.error("Error uploading NID:", error);
                setNidUploaded(false);
            }
        }
    };

    const toggleSection = async (section, state) => {
        if (!state) {
            try {
                const response = await axios.get(`${config?.backendUrl}/user/profile`);
                reset(response.data);
            } catch (error) {
                if (profileUser) reset(profileUser);
                console.error("Error reverting changes:", error);
            }
        }
        setEditSections(prev => ({ ...prev, [section]: state }));
    };

    const onFormSubmit = async (formData, sectionName) => {
        const toastId = toast.loading(`Updating ${sectionName}...`);

        try {
            const response = await axios.put(`${config?.backendUrl}/user/update`, formData);

            if (response.data?.success) {
                toast.success(response.data?.message || `${sectionName} updated successfully!`, {
                    id: toastId,
                });

                setEditSections(prev => ({ ...prev, [sectionName]: false }));
            }
        } catch (error) {
            console.error(`Error updating data for section ${sectionName}:`, error);

            const errorMessage = error.response?.data?.message || `Failed to update ${sectionName}.`;

            toast.error(errorMessage, {
                id: toastId,
            });
        }
    };

    const handleUnlockProfile = async () => {
        try {
            const response = await axios.post(`${config?.backendUrl}/user/profile/unlock`);
            if (response.status === 200) {
                setIsProfileLocked(false);
            }
        } catch (error) {
            console.error("Error unlocking profile:", error);
        }
    };



    const [divisions, setDivisions] = useState([]);
    const [currentDistricts, setCurrentDistricts] = useState([]);
    const [currentUpazilas, setCurrentUpazilas] = useState([]);
    const [permanentDistricts, setPermanentDistricts] = useState([]);
    const [permanentUpazilas, setPermanentUpazilas] = useState([]);

    const watchedCurrentDivision = watch("currentDivision");
    const watchedCurrentDistrict = watch("currentDistrict");
    const watchedPermanentDivision = watch("permanentDivision");
    const watchedPermanentDistrict = watch("permanentDistrict");

    useEffect(() => {
        const fetchDivisions = async () => {
            try {
                const response = await axios.get(`${config.geoApiUrl}/divisions`);
                const divisionsData = response.data?.data || response.data;
                if (Array.isArray(divisionsData)) {
                    setDivisions(divisionsData);
                }
            } catch (error) {
                console.error("Error fetching divisions:", error);
            }
        };
        fetchDivisions();
    }, []);

    useEffect(() => {
        if (!watchedCurrentDivision) {
            setCurrentDistricts([]);
            setCurrentUpazilas([]);
            return;
        }
        const fetchCurrentDistricts = async () => {
            try {
                const response = await axios.get(`${config.geoApiUrl}/districts/${watchedCurrentDivision}`);
                const districtsData = response.data?.data || response.data;
                setCurrentDistricts(Array.isArray(districtsData) ? districtsData : []);
                setCurrentUpazilas([]);
                setValue("currentDistrict", "");
                setValue("currentThana", "");
            } catch (error) {
                console.error("Error fetching current districts:", error);
            }
        };
        fetchCurrentDistricts();
    }, [watchedCurrentDivision, setValue]);

    useEffect(() => {
        if (!watchedCurrentDistrict) {
            setCurrentUpazilas([]);
            return;
        }
        const fetchCurrentUpazilas = async () => {
            try {
                const response = await axios.get(`${config.geoApiUrl}/upazilas/${watchedCurrentDistrict}`);
                const upazilasData = response.data?.data || response.data;
                setCurrentUpazilas(Array.isArray(upazilasData) ? upazilasData : []);
                setValue("currentThana", "");
            } catch (error) {
                console.error("Error fetching current upazilas:", error);
            }
        };
        fetchCurrentUpazilas();
    }, [watchedCurrentDistrict, setValue]);

    useEffect(() => {
        if (!watchedPermanentDivision) {
            setPermanentDistricts([]);
            setPermanentUpazilas([]);
            return;
        }
        const fetchPermanentDistricts = async () => {
            try {
                const response = await axios.get(`${config.geoApiUrl}/districts/${watchedPermanentDivision}`);
                const districtsData = response.data?.data || response.data;
                setPermanentDistricts(Array.isArray(districtsData) ? districtsData : []);
                setPermanentUpazilas([]);
                setValue("permanentDistrict", "");
                setValue("permanentThana", "");
            } catch (error) {
                console.error("Error fetching permanent districts:", error);
            }
        };
        fetchPermanentDistricts();
    }, [watchedPermanentDivision, setValue]);

    useEffect(() => {
        if (!watchedPermanentDistrict) {
            setPermanentUpazilas([]);
            return;
        }
        const fetchPermanentUpazilas = async () => {
            try {
                const response = await axios.get(`${config.geoApiUrl}/upazilas/${watchedPermanentDistrict}`);
                const upazilasData = response.data?.data || response.data;
                setPermanentUpazilas(Array.isArray(upazilasData) ? upazilasData : []);
                setValue("permanentThana", "");
            } catch (error) {
                console.error("Error fetching permanent upazilas:", error);
            }
        };
        fetchPermanentUpazilas();
    }, [watchedPermanentDistrict, setValue]);




    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <span className="loading loading-spinner loading-lg text-emerald-600"></span>
            </div>
        );
    }
    return (
        <div className="app-container pb-8 min-h-screen">
            <Toaster position="top-right" reverseOrder={false} />

            <div className="relative mb-6">
                <div className="h-64 md:h-[32rem] w-full rounded-b-2xl overflow-hidden bg-emerald-950 relative">
                    <img src={images.cover} className="w-full h-full object-cover opacity-40" alt="Cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <label className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 cursor-pointer transition backdrop-blur-sm">
                        <Camera className="w-4 h-4" /> Edit Cover Photo
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, 'cover')} />
                    </label>
                </div>

                <div className="absolute -bottom-10 left-8 flex items-end space-x-4">
                    <div className="relative group">
                        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white overflow-hidden bg-gray-200 relative">
                            <img src={images.avatar} className="w-full h-full object-cover" alt="Avatar" />
                            <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition cursor-pointer">
                                <Camera className="w-5 h-5 mb-1" />
                                <span className="text-[10px] font-medium">Change Photo</span>
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, 'avatar')} />
                            </label>
                        </div>
                        {watchedValues?.nidStatus === 'verified' && (
                            <div className="absolute bottom-2 right-2 bg-emerald-600 border-2 border-white text-white p-1.5 rounded-full">
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        {editSections.header ? (
                            <form onSubmit={handleSubmit((data) => onFormSubmit(data, 'header'))} className="bg-black/70 p-3 rounded-xl space-y-2 backdrop-blur-sm min-w-[250px]">
                                <input {...register('fullName')} className="w-full p-1.5 text-sm bg-white text-gray-800 rounded border" placeholder="Name" />
                                {/* <input {...register('homeDistrict')} className="w-full p-1.5 text-sm bg-white text-gray-800 rounded border" placeholder="District" /> */}
                                <div className="flex gap-2">
                                    <button type="submit" className="bg-emerald-600 text-white px-2 py-1 text-xs rounded font-medium flex-1">Save</button>
                                    <button type="button" onClick={() => toggleSection('header', false)} className="bg-gray-500 text-white px-2 py-1 text-xs rounded font-medium flex-1">Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <div className="flex items-start gap-2 group">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">{watchedValues?.fullName || 'No Name Set'}</h1>
                                    <div className="flex flex-wrap gap-3 mt-1 text-black text-sm drop-shadow-sm">
                                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {watchedValues?.currentThana || 'Not Set'}, Bangladesh</span>
                                        <span className="flex items-center gap-1"><User className="w-4 h-4" /> ID: {watchedValues?.profileId || watchedValues?.userID || 'N/A'}</span>
                                        <span className="flex items-center gap-1"><User className="w-4 h-4" />Referral ID: {watchedValues?.ownRefarelID || 'N/A'}</span>
                                    </div>
                                </div>
                                <button type="button" onClick={() => toggleSection('header', true)} className="mt-1 p-1.5 bg-white/80 hover:bg-white text-gray-700 rounded-full shadow opacity-0 group-hover:opacity-100 transition">
                                    <Edit2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-12">
                <div className="lg:col-span-2 space-y-6">

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-red-600 border-l-4 relative group">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h2 className="text-lg font-bold text-red-600 flex items-center gap-2"><User className="w-5 h-5" /> Personal Information</h2>
                            {!editSections.personal && (
                                <button type="button" onClick={() => toggleSection('personal', true)} className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-full transition opacity-0 group-hover:opacity-100"><Edit2 className="w-4 h-4" /></button>
                            )}
                        </div>

                        {editSections.personal ? (
                            <form onSubmit={handleSubmit((data) => onFormSubmit(data, 'personal'))} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase">Height</label>
                                        <input {...register('Height')} className="w-full mt-1 p-2 border rounded-lg text-sm bg-white" />
                                    </div>
                                    {/* <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase">Home District</label>
                                        <input {...register('homeDistrict')} className="w-full mt-1 p-2 border rounded-lg text-sm bg-white" />
                                    </div> */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                                            Marital Status
                                        </label>
                                        <select
                                            {...register('maritalStatus')}
                                            className="w-full mt-1 p-2 border rounded-lg text-sm bg-white text-gray-700 outline-none cursor-pointer focus:border-[#C20E0E]"
                                        >
                                            <option value="">Select Status</option>
                                            <option value="Unmarried">Unmarried</option>
                                            <option value="Married">Married</option>
                                            <option value="Divorced">Divorced</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase">Religion</label>
                                        <input {...register('religion')} className="w-full mt-1 p-2 border rounded-lg text-sm bg-white" />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <button type="button" onClick={() => toggleSection('personal', false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-medium">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-medium">Save</button>
                                </div>
                            </form>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-400 uppercase">Age</label>
                                    <p className="text-gray-800 font-medium mt-0.5">{watchedValues?.age || 'Not Set'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-400 uppercase">Height</label>
                                    <p className="text-gray-800 font-medium mt-0.5">{watchedValues?.Height || 'Not Set'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-400 uppercase">Home District</label>
                                    <p className="text-gray-800 font-medium mt-0.5">{watchedValues?.currentDistrict || 'Not Set'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-400 uppercase">Marital Status</label>
                                    <p className="text-gray-800 font-medium mt-0.5">{watchedValues?.maritalStatus || 'Not Set'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-400 uppercase">Religion</label>
                                    <p className="text-gray-800 font-medium mt-0.5">{watchedValues?.religion || 'Not Set'}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-red-600 border-l-4 relative group">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h2 className="text-lg font-bold text-red-600 flex items-center gap-2"><Briefcase className="w-5 h-5" /> Professional & Education</h2>
                            {!editSections.professional && (
                                <button type="button" onClick={() => toggleSection('professional', true)} className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-full transition opacity-0 group-hover:opacity-100"><Edit2 className="w-4 h-4" /></button>
                            )}
                        </div>

                        {editSections.professional ? (
                            <form onSubmit={handleSubmit((data) => onFormSubmit(data, 'professional'))} className="space-y-4">
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase">Profession</label>
                                        <input {...register('profession')} className="w-full mt-1 p-2 border rounded-lg text-sm mb-2 bg-white" placeholder="Profession" />
                                        <input {...register('professionOrganization')} className="w-full p-2 border rounded-lg text-sm bg-white" placeholder="Organization" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase">Education</label>
                                        <input {...register('education')} className="w-full mt-1 p-2 border rounded-lg text-sm mb-2 bg-white" placeholder="Education" />
                                        <input {...register('institute')} className="w-full p-2 border rounded-lg text-sm bg-white" placeholder="Institution" />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <button type="button" onClick={() => toggleSection('professional', false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-medium">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-medium">Save</button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex gap-3 items-start">
                                    <div className="bg-red-50 p-2 rounded-xl text-red-600 mt-1"><Briefcase className="w-5 h-5" /></div>
                                    <div className="flex-1">
                                        <p className="text-gray-800 font-semibold">{watchedValues?.profession || 'Not Set'}</p>
                                        <p className="text-gray-500 text-sm">{watchedValues?.professionOrganization || 'No Organization'}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 items-start">
                                    <div className="bg-red-50 p-2 rounded-xl text-red-600 mt-1"><GraduationCap className="w-5 h-5" /></div>
                                    <div className="flex-1">
                                        <p className="text-gray-800 font-semibold">{watchedValues?.education || 'Not Set'}</p>
                                        <p className="text-gray-500 text-sm">{watchedValues?.institute || 'No Institution'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-red-600 border-l-4 relative group">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h2 className="text-lg font-bold text-red-600 flex items-center gap-2"><MapPin className="w-5 h-5" /> Contact & Address</h2>
                            {/* {!editSections.contact && (
                                <button type="button" onClick={() => toggleSection('contact', true)} className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-full transition opacity-0 group-hover:opacity-100"><Edit2 className="w-4 h-4" /></button>
                            )} */}
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="border border-gray-100 p-4 rounded-xl bg-gray-50/50">
                                    <span className="text-xs font-bold text-red-500 flex items-center gap-1 uppercase mb-1"><Phone className="w-3.5 h-3.5" /> Contact No</span>
                                    <p className="text-gray-700 text-sm font-medium">{watchedValues?.contactNo || 'Not Set'}</p>
                                </div>
                                <div className="border border-gray-100 p-4 rounded-xl bg-gray-50/50">
                                    <span className="text-xs font-bold text-red-500 flex items-center gap-1 uppercase mb-1"><Mail className="w-3.5 h-3.5" /> Email Address</span>
                                    <p className="text-gray-700 text-sm font-medium">{watchedValues?.email || 'Not Set'}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="border border-gray-100 p-4 rounded-xl bg-gray-50/50">
                                    <span className="text-xs font-bold text-red-500 flex items-center gap-1 uppercase mb-1"><MapPin className="w-3.5 h-3.5" /> Current Address</span>
                                    <p className="text-gray-700 text-sm font-medium">
                                        {
                                            (() => {
                                                const addressParts = [
                                                    profileUser?.currentThana,
                                                    profileUser?.currentDistrict,
                                                    profileUser?.currentDivision,
                                                    profileUser?.currentCountry
                                                ].filter(Boolean);

                                                return addressParts.length > 0
                                                    ? addressParts.join(", ")
                                                    : "No set text";
                                            })()
                                        }
                                    </p>
                                </div>
                                <div className="border border-gray-100 p-4 rounded-xl bg-gray-50/50">
                                    <span className="text-xs font-bold text-red-500 flex items-center gap-1 uppercase mb-1"><Globe className="w-3.5 h-3.5" /> Permanent Address</span>
                                    <p className="text-gray-700 text-sm font-medium">
                                        {
                                            (() => {
                                                const addressParts = [
                                                    profileUser?.permanentThana,
                                                    profileUser?.permanentDistrict,
                                                    profileUser?.permanentDivision,
                                                    profileUser?.permanentCountry
                                                ].filter(Boolean);

                                                return addressParts.length > 0
                                                    ? addressParts.join(", ")
                                                    : "No set text";
                                            })()
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* {editSections.contact ? (
                            <form onSubmit={handleSubmit((data) => onFormSubmit(data, 'contact'))} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase">Contact No</label>
                                        <input {...register('contactNo')} className="w-full mt-1 p-2 border rounded-lg text-sm bg-white" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase">Email</label>
                                        <input {...register('email')} className="w-full mt-1 p-2 border rounded-lg text-sm bg-white" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-gray-700">Current Address</h3>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-400 uppercase">Division</label>
                                            <select {...register('currentDivision')} className="w-full mt-1 p-2 border rounded-lg text-sm bg-white">
                                                <option value="">Select Division</option>
                                                {divisions.map((div) => (
                                                    <option key={div._id || div.id} value={div.id}>{div.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-400 uppercase">District</label>
                                            <select disabled={!watchedCurrentDivision} {...register('currentDistrict')} className="w-full mt-1 p-2 border rounded-lg text-sm bg-white disabled:opacity-50">
                                                <option value="">Select District</option>
                                                {currentDistricts.map((dist) => (
                                                    <option key={dist._id || dist.id} value={dist.id}>{dist.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-400 uppercase">Thana / Upazila</label>
                                            <select disabled={!watchedCurrentDistrict} {...register('currentThana')} className="w-full mt-1 p-2 border rounded-lg text-sm bg-white disabled:opacity-50">
                                                <option value="">Select Thana</option>
                                                {currentUpazilas.map((upz) => (
                                                    <option key={upz._id || upz.id} value={upz.name}>{upz.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-400 uppercase">Country</label>
                                            <select {...register('currentCountry')} className="w-full mt-1 p-2 border rounded-lg text-sm bg-white">
                                                <option value="Bangladesh">Bangladesh</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-gray-700">Permanent Address</h3>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-400 uppercase">Division</label>
                                            <select {...register('permanentDivision')} className="w-full mt-1 p-2 border rounded-lg text-sm bg-white">
                                                <option value="">Select Division</option>
                                                {divisions.map((div) => (
                                                    <option key={div._id || div.id} value={div.id}>{div.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-400 uppercase">District</label>
                                            <select disabled={!watchedPermanentDivision} {...register('permanentDistrict')} className="w-full mt-1 p-2 border rounded-lg text-sm bg-white disabled:opacity-50">
                                                <option value="">Select District</option>
                                                {permanentDistricts.map((dist) => (
                                                    <option key={dist._id || dist.id} value={dist.id}>{dist.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-400 uppercase">Thana / Upazila</label>
                                            <select disabled={!watchedPermanentDistrict} {...register('permanentThana')} className="w-full mt-1 p-2 border rounded-lg text-sm bg-white disabled:opacity-50">
                                                <option value="">Select Thana</option>
                                                {permanentUpazilas.map((upz) => (
                                                    <option key={upz._id || upz.id} value={upz.name}>{upz.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-400 uppercase">Country</label>
                                            <select {...register('permanentCountry')} className="w-full mt-1 p-2 border rounded-lg text-sm bg-white">
                                                <option value="Bangladesh">Bangladesh</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <button type="button" onClick={() => toggleSection('contact', false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-medium">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-medium">Save</button>
                                </div>
                            </form>
                        )
                            :
                            (
                               
                            )
                        } */}
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-red-600 border-l-4 relative group">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h2 className="text-lg font-bold text-red-600 flex items-center gap-2"><Home className="w-5 h-5" /> Family Background</h2>
                            {!editSections.family && (
                                <button type="button" onClick={() => toggleSection('family', true)} className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-full transition opacity-0 group-hover:opacity-100"><Edit2 className="w-4 h-4" /></button>
                            )}
                        </div>

                        {editSections.family ? (
                            <form onSubmit={handleSubmit((data) => onFormSubmit(data, 'family'))} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase">Father's Occupation</label>
                                        <input {...register('fatherOccupation')} className="w-full mt-1 p-2 border rounded-lg text-sm bg-white" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase">Mother's Occupation</label>
                                        <input {...register('motherOccupation')} className="w-full mt-1 p-2 border rounded-lg text-sm bg-white" />
                                    </div>
                                    {/* <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase">Siblings</label>
                                        <input {...register('siblings')} className="w-full mt-1 p-2 border rounded-lg text-sm bg-white" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase">Family Values</label>
                                        <input {...register('familyValues')} className="w-full mt-1 p-2 border rounded-lg text-sm bg-white" />
                                    </div> */}
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <button type="button" onClick={() => toggleSection('family', false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-medium">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-medium">Save</button>
                                </div>
                            </form>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-400 uppercase">Father's Occupation</label>
                                    <p className="text-gray-800 font-medium mt-0.5">{watchedValues?.fatherOccupation || 'Not Set'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-400 uppercase">Mother's Occupation</label>
                                    <p className="text-gray-800 font-medium mt-0.5">{watchedValues?.motherOccupation || 'Not Set'}</p>
                                </div>
                                {/* <div>
                                    <label className="text-xs font-semibold text-gray-400 uppercase">Siblings</label>
                                    <p className="text-gray-800 font-medium mt-0.5">{watchedValues?.siblings || 'Not Set'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-400 uppercase">Family Values</label>
                                    <p className="text-gray-800 font-medium mt-0.5">{watchedValues?.familyValues || 'Not Set'}</p>
                                </div> */}
                            </div>
                        )}
                    </div>

                    <div className="bg-red-600 text-white p-6 rounded-2xl shadow-sm relative group">
                        <div className="flex justify-between items-center mb-4 border-b border-white/20 pb-2">
                            <h2 className="text-lg font-bold flex items-center gap-2"><Heart className="w-5 h-5" /> Partner Expectations</h2>
                            {!editSections.expectations && (
                                <button type="button" onClick={() => toggleSection('expectations', true)} className="p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-full transition opacity-0 group-hover:opacity-100"><Edit2 className="w-4 h-4" /></button>
                            )}
                        </div>

                        {editSections.expectations ? (
                            <form onSubmit={handleSubmit((data) => onFormSubmit(data, 'expectations'))} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[1, 2, 3, 4].map((num) => (
                                        <div key={num} className="w-full">
                                            <label className="text-xs font-semibold opacity-80 uppercase">Expectation {num}</label>
                                            <textarea {...register(`expectation${num}`)} className="w-full mt-1 p-2 border rounded-lg text-sm bg-white text-gray-800" rows={2} />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <button type="button" onClick={() => toggleSection('expectations', false)} className="px-4 py-2 bg-white/20 text-white rounded-xl text-xs font-medium">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-medium">Save</button>
                                </div>
                            </form>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map((num) => (
                                    <div key={num} className="flex gap-2 items-start">
                                        <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-white/80" />
                                        <p className="text-sm font-medium leading-relaxed">{watchedValues?.[`expectation${num}`] || 'No expectations added yet.'}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                        <div className="mx-auto bg-red-50 text-red-600 w-12 h-12 rounded-full flex items-center justify-center mb-3"><Heart className="w-6 h-6" /></div>
                        <h3 className="font-bold text-gray-800 text-lg">Connect with {watchedValues?.name || 'User'}</h3>
                        <p className="text-gray-500 text-sm mt-1 mb-4 px-4">Take the first step toward a blessed journey together.</p>

                        <button type="button" className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold text-sm transition shadow-md shadow-red-100 mb-3 flex items-center justify-center gap-2">
                            <Heart className="w-4 h-4" /> Send Interest
                        </button>

                        {/* {isProfileLocked ? (
                            <button type="button" onClick={handleUnlockProfile} className="w-full border border-red-200 hover:bg-red-50 text-red-600 py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2">
                                <Lock className="w-4 h-4" /> Unlock Contact Details
                            </button>
                        ) : (
                            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl space-y-2 text-left">
                                <p className="text-xs font-bold flex items-center gap-1 text-emerald-600 uppercase"><Unlock className="w-3.5 h-3.5" /> Contact Unlocked</p>
                                <p className="text-sm"><strong>Phone:</strong> {watchedValues?.phone || 'N/A'}</p>
                                <p className="text-sm"><strong>Email:</strong> {watchedValues?.email || 'N/A'}</p>
                            </div>
                        )} */}
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Verification Status</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2.5 text-sm font-medium text-gray-700">
                                {watchedValues?.isActive === 'ACTIVE' ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-50" />
                                ) : (
                                    <X className="w-4 h-4 text-red-500" />
                                )}
                                <span>Profile Activation</span>
                            </div>
                            {/* <div className="flex items-center gap-2.5 text-sm font-medium text-gray-700">
                                {nidUploaded ? <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-50" /> : <X className="w-4 h-4 text-gray-300" />}
                                <span>Official ID Document Verified</span>
                            </div> */}
                        </div>
                    </div>

                    {/* <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
                        <h3 className="font-bold text-lg mb-1">Verify Your Identity</h3>
                        <p className="text-xs text-emerald-200/80 mb-4 leading-relaxed">Attach your National ID Card (NID) to unlock verified badge.</p>
                        {!nidUploaded ? (
                            <div className="border border-dashed border-emerald-500/50 rounded-xl p-4 bg-emerald-950/40 text-center hover:bg-emerald-950/60 transition cursor-pointer relative">
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleNidUpload} />
                                <Upload className="w-5 h-5 mx-auto text-emerald-400 mb-1" />
                                <p className="text-xs font-medium text-emerald-300">Upload NID Front & Back</p>
                            </div>
                        ) : (
                            <div className="bg-emerald-800/40 border border-emerald-500/30 p-3 rounded-xl flex items-center justify-between">
                                <span className="text-xs font-medium text-emerald-200">
                                    {watchedValues?.nidStatus === 'verified' ? 'NID Verified Successfully' : 'NID Uploaded (Pending Review)'}
                                </span>
                                {watchedValues?.nidStatus !== 'verified' && (
                                    <button type="button" onClick={() => setNidUploaded(false)} className="text-emerald-400 hover:text-emerald-200"><X className="w-4 h-4" /></button>
                                )}
                            </div>
                        )}
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;