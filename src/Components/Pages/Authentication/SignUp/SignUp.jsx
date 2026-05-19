import { useForm } from "react-hook-form";
// import Button from "../../utilies/Button";
import { Camera, CheckCircle, Globe, MapPin, Phone, Star, User } from "lucide-react";
import { useState } from "react";

const SignUp = () => {
    const { register, handleSubmit } = useForm();
    const [previewImage, setPreviewImage] = useState(null);

    const onSubmit = (data) => {
        console.log(data);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FFEAEA] via-[#FFF5F5] to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                <div className="lg:sticky lg:top-12 space-y-8">
                    <div>
                        <p className="text-[#C20E0E] font-bold text-xs tracking-widest uppercase mb-4 bg-[#FFEAEA] w-fit py-1.5 rounded-md">
                            Start Your Journey
                        </p>
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-950 mb-6">
                            Find your perfect partner with <span className="text-[#C20E0E] relative inline-block">Bibah<span className="absolute bottom-1 left-0 w-full h-2 bg-[#FFEAEA] -z-10"></span></span>.
                        </h1>
                        <p className="text-gray-700 text-lg leading-relaxed max-w-md">
                            Join Bangladesh&apos;s most premium matchmaking community. We blend traditional values with modern technology to find your soulmate.
                        </p>
                    </div>

                    <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-red-950/10 group border-4 border-white">
                        <img
                            src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1974&auto=format&fit=crop"
                            alt="Premium Couple"
                            className="w-full h-[520px] object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#240101]/95 via-[#3A0303]/40 to-transparent"></div>

                        <div className="absolute top-6 right-6 bg-[#C20E0E] text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-md">
                            Premium Platform
                        </div>

                        <div className="absolute bottom-8 left-8 right-8 text-white space-y-3">
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md w-fit px-4 py-2 rounded-xl border border-white/10">
                                <Star size={16} className="text-yellow-400 fill-yellow-400 animate-pulse" />
                                <span className="text-sm font-semibold tracking-wide">Trusted by 50,000+ Profiles</span>
                            </div>
                            <p className="italic text-base opacity-95 leading-relaxed font-medium">
                                &ldquo;The most secure and premium platform for finding life partners in Bangladesh.&rdquo;
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-red-900/5 p-6 sm:p-8 lg:p-12 border border-red-50/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#FFEAEA]/40 to-transparent rounded-bl-full pointer-events-none"></div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 relative z-10">

                        <section className="space-y-6">
                            <div className="flex items-center gap-4 pb-3 border-b border-red-50">
                                <div className="flex items-center gap-2">
                                    <User size={18} className="text-[#C20E0E]" />
                                    <h2 className="text-xl font-bold text-gray-900">Personal Identity</h2>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Full Legal Name</label>
                                    <input
                                        {...register("fullName")}
                                        placeholder="e.g. Arifa Rahman"
                                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-[#C20E0E]/10 focus:border-[#C20E0E] outline-none transition-all duration-200 text-sm font-medium bg-gray-50/50 focus:bg-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Date of Birth</label>
                                    <input
                                        type="date"
                                        {...register("dob")}
                                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-[#C20E0E]/10 focus:border-[#C20E0E] outline-none transition-all duration-200 text-sm font-medium bg-gray-50/50 focus:bg-white text-gray-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Gender</label>
                                    <div className="flex gap-2.5">
                                        {['Male', 'Female'].map((g) => (
                                            <label key={g} className="flex-1">
                                                <input type="radio" {...register("gender")} value={g} className="hidden peer" />
                                                <div className="text-center py-3 border border-gray-200 rounded-xl cursor-pointer peer-checked:bg-[#FFEAEA] peer-checked:border-[#C20E0E] peer-checked:text-[#C20E0E] text-sm font-bold transition-all duration-200 text-gray-600 hover:bg-gray-50">
                                                    {g}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Profession</label>
                                    <select
                                        {...register("profession")}
                                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-[#C20E0E]/10 focus:border-[#C20E0E] outline-none transition-all duration-200 text-sm font-medium bg-gray-50/50 focus:bg-white text-gray-700 appearance-none cursor-pointer"
                                    >
                                        <option>Doctor</option>
                                        <option>Engineer</option>
                                        <option>Business</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <div className="flex items-center gap-4 pb-3 border-b border-red-50">
                                <div className="flex items-center gap-2">
                                    <Phone size={18} className="text-[#C20E0E]" />
                                    <h2 className="text-xl font-bold text-gray-900">Contact Details</h2>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
                                <div className="flex shadow-sm rounded-xl overflow-hidden">
                                    <select className="px-4 py-3.5 border border-r-0 border-gray-200 bg-[#FFF5F5] text-sm font-bold text-[#C20E0E] outline-none cursor-pointer">
                                        <option>+880 (BD)</option>
                                    </select>
                                    <input
                                        {...register("phone")}
                                        placeholder="01XXX XXXXXX"
                                        className="flex-1 px-4 py-3.5 border border-gray-200 focus:ring-4 focus:ring-[#C20E0E]/10 focus:border-[#C20E0E] outline-none transition-all duration-200 text-sm font-medium bg-gray-50/50 focus:bg-white rounded-r-xl"
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <div className="flex items-center gap-4 pb-3 border-b border-red-50">
                                <div className="flex items-center gap-2">
                                    <Camera size={18} className="text-[#C20E0E]" />
                                    <h2 className="text-xl font-bold text-gray-900">Profile Presence</h2>
                                </div>
                            </div>
                            <label className="border-2 border-dashed border-red-200 hover:border-[#C20E0E] rounded-2xl p-8 flex flex-col items-center justify-center bg-[#FFF5F5]/30 hover:bg-[#FFEAEA]/20 transition-all duration-300 cursor-pointer group">
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                {previewImage ? (
                                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-red-400 group-hover:text-[#C20E0E] transition-colors duration-200 mb-2">
                                            <Camera size={36} strokeWidth={1.5} />
                                        </div>
                                        <p className="text-sm font-bold text-gray-700 group-hover:text-[#C20E0E] transition-colors duration-200">Click to upload profile picture</p>
                                        <p className="text-[11px] font-medium text-gray-400 mt-1">JPG, PNG up to 5MB</p>
                                    </>
                                )}
                            </label>
                        </section>

                        <section className="space-y-6">
                            <div className="flex items-center gap-4 pb-3 border-b border-red-50">
                               
                                <div className="flex items-center gap-2">
                                    <MapPin size={18} className="text-[#C20E0E]" />
                                    <h2 className="text-xl font-bold text-gray-900">Current Residence</h2>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {['Country', 'Division / State', 'District', 'Thana'].map((label) => (
                                    <div key={label} className="space-y-1.5">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</label>
                                        <select className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 outline-none bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-[#C20E0E]/10 focus:border-[#C20E0E] transition-all duration-200 cursor-pointer appearance-none">
                                            <option>Select {label}</option>
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-6">
                            <div className="flex items-center gap-4 pb-3 border-b border-red-50">
                               
                                <div className="flex items-center gap-2">
                                    <Globe size={18} className="text-[#C20E0E]" />
                                    <h2 className="text-xl font-bold text-gray-900">Permanent Address</h2>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {['Country', 'Division', 'District', 'Thana'].map((label) => (
                                    <div key={label} className="space-y-1.5">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</label>
                                        <select className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 outline-none bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-[#C20E0E]/10 focus:border-[#C20E0E] transition-all duration-200 cursor-pointer appearance-none">
                                            <option>Select {label}</option>
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="space-y-6 pt-4">
                            <label className="flex items-start gap-3 cursor-pointer group select-none">
                                <input type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300 text-[#C20E0E] focus:ring-[#C20E0E] accent-[#C20E0E]" />
                                <span className="text-xs text-gray-500 font-medium leading-normal group-hover:text-gray-700 transition-colors">
                                    I agree to the <span className="text-[#C20E0E] font-bold hover:underline">Terms of Use</span> and <span className="text-[#C20E0E] font-bold hover:underline">Privacy Policy</span> of Bibah Matrimony.
                                </span>
                            </label>

                            <button type="submit" className="w-full bg-[#C20E0E] hover:bg-[#A30B0B] text-white py-4 rounded-xl font-bold text-lg transition-all duration-200 active:scale-[0.99] shadow-xl shadow-red-600/20 flex items-center justify-center gap-2">
                                <CheckCircle size={20} /> Create Account
                            </button>

                            <p className="text-center text-sm font-semibold text-gray-500">
                                Already have an account? <a href="/login" className="text-[#C20E0E] font-bold hover:underline">Login here</a>
                            </p>
                        </div>

                    </form>
                </div>

            </div>
        </div>
    );
};

export default SignUp;