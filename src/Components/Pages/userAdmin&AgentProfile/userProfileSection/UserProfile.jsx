import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import {
    User, Briefcase, GraduationCap, Moon, Heart, Home,
    MapPin, Edit2, CheckCircle2,
    Upload, X, ShieldCheck, Lock, HeartHandshake, Camera
} from 'lucide-react';


const API_BASE_URL = 'https://api.example.com/user';

const UserProfile = () => {
const [loading, setLoading] = useState(true);
    const [editSections, setEditSections] = useState({
        header: false,
        personal: false,
        professional: false,
        religious: false,
        family: false,
        expectations: false
    });

    const [images, setImages] = useState({
        cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400"
    });

    const [nidUploaded, setNidUploaded] = useState(false);

    const { register, handleSubmit, watch, reset } = useForm();
    const watchedValues = watch();

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/profile`);
                const data = response.data;
                
                reset(data);
                if (data.coverImage) setImages(prev => ({ ...prev, cover: data.coverImage }));
                if (data.avatarImage) setImages(prev => ({ ...prev, avatar: data.avatarImage }));
                if (data.nidStatus) setNidUploaded(data.nidStatus === 'verified' || data.nidStatus === 'pending');
                
                setLoading(false);
            } catch (error) {
                console.error("Error fetching profile data:", error);
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [reset]);

    const handleImageChange = async (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const localUrl = URL.createObjectURL(file);
            setImages(prev => ({ ...prev, [type]: localUrl }));

            const formData = new FormData();
            formData.append(type === 'cover' ? 'coverPhoto' : 'avatarPhoto', file);

            try {
                const response = await axios.post(`${API_BASE_URL}/upload-${type}`, formData, {
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
                await axios.post(`${API_BASE_URL}/upload-nid`, formData, {
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
                const response = await axios.get(`${API_BASE_URL}/profile`);
                reset(response.data);
            } catch (error) {
                console.error("Error reverting changes:", error);
            }
        }
        setEditSections(prev => ({ ...prev, [section]: state }));
    };

    const onFormSubmit = async (data, sectionName) => {
        try {
            await axios.put(`${API_BASE_URL}/update`, data);
            setEditSections(prev => ({ ...prev, [sectionName]: false }));
        } catch (error) {
            console.error(`Error updating data for section ${sectionName}:`, error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <span className="loading loading-spinner loading-lg text-emerald-600"></span>
            </div>
        );
    }
    return (
      <div className="app-container pb-8 min-h-screen">
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
                        <div className="absolute bottom-2 right-2 bg-red-600 border-2 border-white text-white p-1.5 rounded-full">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        {editSections.header ? (
                            <form onSubmit={handleSubmit((data) => onFormSubmit(data, 'header'))} className="bg-black/70 p-3 rounded-xl space-y-2 backdrop-blur-sm min-w-[250px]">
                                <input {...register('name')} className="w-full p-1.5 text-sm bg-white text-gray-800 rounded border" placeholder="Name" />
                                <input {...register('homeDistrict')} className="w-full p-1.5 text-sm bg-white text-gray-800 rounded border" placeholder="District" />
                                <div className="flex gap-2">
                                    <button type="submit" className="bg-emerald-600 text-white px-2 py-1 text-xs rounded font-medium flex-1">Save</button>
                                    <button type="button" onClick={() => toggleSection('header', false)} className="bg-gray-500 text-white px-2 py-1 text-xs rounded font-medium flex-1">Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <div className="flex items-start gap-2 group">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">{watchedValues?.name}</h1>
                                    <div className="flex flex-wrap gap-3 mt-1 text-black text-sm">
                                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {watchedValues?.homeDistrict}, Bangladesh</span>
                                        <span className="flex items-center gap-1"><User className="w-4 h-4" /> ID: RM 48920</span>
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
                                        <label className="text-xs font-semibold text-gray-400 uppercase">Age</label>
                                        <input {...register('age')} className="w-full mt-1 p-2 border rounded-lg text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase">Height</label>
                                        <input {...register('height')} className="w-full mt-1 p-2 border rounded-lg text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase">Home District</label>
                                        <input {...register('homeDistrict')} className="w-full mt-1 p-2 border rounded-lg text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase">Marital Status</label>
                                        <input {...register('maritalStatus')} className="w-full mt-1 p-2 border rounded-lg text-sm" />
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
                                    <p className="text-gray-800 font-medium mt-0.5">{watchedValues?.age}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-400 uppercase">Height</label>
                                    <p className="text-gray-800 font-medium mt-0.5">{watchedValues?.height}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-400 uppercase">Home District</label>
                                    <p className="text-gray-800 font-medium mt-0.5">{watchedValues?.homeDistrict}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-400 uppercase">Marital Status</label>
                                    <p className="text-gray-800 font-medium mt-0.5">{watchedValues?.maritalStatus}</p>
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
                                        <input {...register('profession')} className="w-full mt-1 p-2 border rounded-lg text-sm mb-2" placeholder="Profession" />
                                        <input {...register('organization')} className="w-full p-2 border rounded-lg text-sm" placeholder="Organization" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase">Education</label>
                                        <input {...register('education')} className="w-full mt-1 p-2 border rounded-lg text-sm mb-2" placeholder="Education" />
                                        <input {...register('institution')} className="w-full p-2 border rounded-lg text-sm" placeholder="Institution" />
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
                                        <p className="text-gray-800 font-semibold">{watchedValues?.profession}</p>
                                        <p className="text-gray-500 text-sm">{watchedValues?.organization}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 items-start">
                                    <div className="bg-red-50 p-2 rounded-xl text-red-600 mt-1"><GraduationCap className="w-5 h-5" /></div>
                                    <div className="flex-1">
                                        <p className="text-gray-800 font-semibold">{watchedValues?.education}</p>
                                        <p className="text-gray-500 text-sm">{watchedValues?.institution}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-red-600 border-l-4 relative group">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h2 className="text-lg font-bold text-red-600 flex items-center gap-2"><Moon className="w-5 h-5" /> Religious Practice</h2>
                            {!editSections.religious && (
                                <button type="button" onClick={() => toggleSection('religious', true)} className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-full transition opacity-0 group-hover:opacity-100"><Edit2 className="w-4 h-4" /></button>
                            )}
                        </div>

                        {editSections.religious ? (
                            <form onSubmit={handleSubmit((data) => onFormSubmit(data, 'religious'))} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase">Daily Prayers</label>
                                        <input {...register('prayers')} className="w-full mt-1 p-2 border rounded-lg text-sm bg-white" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase">Intentions</label>
                                        <input {...register('intentions')} className="w-full mt-1 p-2 border rounded-lg text-sm bg-white" />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <button type="button" onClick={() => toggleSection('religious', false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-medium">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-medium">Save</button>
                                </div>
                            </form>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="border border-gray-100 p-4 rounded-xl bg-gray-50/50">
                                    <span className="text-xs font-bold text-red-500 flex items-center gap-1 uppercase mb-1"><CheckCircle2 className="w-3.5 h-3.5" /> Daily Prayers</span>
                                    <p className="text-gray-700 text-sm font-medium">{watchedValues?.prayers}</p>
                                </div>
                                <div className="border border-gray-100 p-4 rounded-xl bg-gray-50/50">
                                    <span className="text-xs font-bold text-red-500 flex items-center gap-1 uppercase mb-1"><HeartHandshake className="w-3.5 h-3.5" /> Intentions</span>
                                    <p className="text-gray-700 text-sm font-medium">{watchedValues?.intentions}</p>
                                </div>
                            </div>
                        )}
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
                                        <input {...register('fatherOccupation')} className="w-full mt-1 p-2 border rounded-lg text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase">Mother's Occupation</label>
                                        <input {...register('motherOccupation')} className="w-full mt-1 p-2 border rounded-lg text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase">Siblings</label>
                                        <input {...register('siblings')} className="w-full mt-1 p-2 border rounded-lg text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-400 uppercase">Family Values</label>
                                        <input {...register('familyValues')} className="w-full mt-1 p-2 border rounded-lg text-sm" />
                                    </div>
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
                                    <p className="text-gray-800 font-medium mt-0.5">{watchedValues?.fatherOccupation}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-400 uppercase">Mother's Occupation</label>
                                    <p className="text-gray-800 font-medium mt-0.5">{watchedValues?.motherOccupation}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-400 uppercase">Siblings</label>
                                    <p className="text-gray-800 font-medium mt-0.5">{watchedValues?.siblings}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-400 uppercase">Family Values</label>
                                    <p className="text-gray-800 font-medium mt-0.5">{watchedValues?.familyValues}</p>
                                </div>
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
                                        <p className="text-sm font-medium leading-relaxed">{watchedValues?.[`expectation${num}`]}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                        <div className="mx-auto bg-red-50 text-red-600 w-12 h-12 rounded-full flex items-center justify-center mb-3"><Heart className="w-6 h-6" /></div>
                        <h3 className="font-bold text-gray-800 text-lg">Connect with Rahat</h3>
                        <p className="text-gray-500 text-sm mt-1 mb-4 px-4">Take the first step toward a blessed journey together.</p>
                        <button type="button" className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold text-sm transition shadow-md shadow-red-100 mb-3 flex items-center justify-center gap-2">
                            <Heart className="w-4 h-4" /> Send Interest
                        </button>
                        <button type="button" className="w-full border border-red-200 hover:bg-red-50 text-red-600 py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2">
                            <Lock className="w-4 h-4" /> Unlock Contact Details
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Verification Status</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2.5 text-sm font-medium text-gray-700">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-50" />
                                <span>Phone Number Verified</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-sm font-medium text-gray-700">
                                {nidUploaded ? <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-50" /> : <X className="w-4 h-4 text-gray-300" />}
                                <span>Official ID Document Verified</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
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
                                <span className="text-xs font-medium text-emerald-200">NID Uploaded (Pending Review)</span>
                                <button type="button" onClick={() => setNidUploaded(false)} className="text-emerald-400 hover:text-emerald-200"><X className="w-4 h-4" /></button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;