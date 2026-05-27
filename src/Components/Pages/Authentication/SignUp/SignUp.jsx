import { useForm } from "react-hook-form";
// import Button from "../../utilies/Button";
import { Camera, CheckCircle, Eye, EyeOff, Globe, MapPin, Phone, Star, User } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import config from "../../utilies/envconfig";
import { useNavigate } from "react-router";

const SignUp = () => {

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [registeredEmail, setRegisteredEmail] = useState("");
    const [previewImage, setPreviewImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [divisions, setDivisions] = useState([]);
    const [currentDistricts, setCurrentDistricts] = useState([]);
    const [currentUpazilas, setCurrentUpazilas] = useState([]);
    const [permanentDistricts, setPermanentDistricts] = useState([]);
    const [permanentUpazilas, setPermanentUpazilas] = useState([]);

    const [showOtpModal, setShowOtpModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [otpCode, setOtpCode] = useState("");

    const watchedCurrentDivision = watch("currentDivision");
    const watchedCurrentDistrict = watch("currentDistrict");
    const watchedPermanentDivision = watch("permanentDivision");
    const watchedPermanentDistrict = watch("permanentDistrict");
    const watchedProfession = watch("profession");
    const password = watch("password");

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const submissionData = { ...data };

            if (submissionData.birth && submissionData.birth.includes("/")) {
                const [day, month, year] = submissionData.birth.split("/");
                submissionData.birth = `${year}-${month}-${day}`;
            }

            if (!submissionData.bonusRefarelID || submissionData.bonusRefarelID.trim() === "") {
                delete submissionData.bonusRefarelID;
            }
            if (submissionData.profession === "Other") {
                submissionData.profession = data.customProfession || "Other";
            }
            delete submissionData.customProfession;

            const currentDivObj = divisions.find(d => d.id === submissionData.currentDivision || d._id === submissionData.currentDivision);
            const currentDistObj = currentDistricts.find(d => d.id === submissionData.currentDistrict || d._id === submissionData.currentDistrict);
            if (currentDivObj) submissionData.currentDivision = currentDivObj.name;
            if (currentDistObj) submissionData.currentDistrict = currentDistObj.name;

            const permDivObj = divisions.find(d => d.id === submissionData.permanentDivision || d._id === submissionData.permanentDivision);
            const permDistObj = permanentDistricts.find(d => d.id === submissionData.permanentDistrict || d._id === submissionData.permanentDistrict);
            if (permDivObj) submissionData.permanentDivision = permDivObj.name;
            if (permDistObj) submissionData.permanentDistrict = permDistObj.name;

            const formData = new FormData();
            Object.keys(submissionData).forEach((key) => {
                formData.append(key, submissionData[key]);
            });

            if (imageFile) {
                formData.append("image", imageFile);
            }

            const response = await axios.post(`${config.backendUrl}/user/register`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.status === 200 || response.status === 201) {
                setRegisteredEmail(submissionData.email);
                toast.success(response.data?.message || "OTP sent to your mobile phone!");
                setShowOtpModal(true);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration initialization failed.");
        } finally {
            setLoading(false);
        }
    };
    const navigate = useNavigate();
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otpCode) {
            toast.error("Please enter the OTP code.");
            return;
        }
        setLoading(true);
        try {
            const payload = {
                code: otpCode,
                email: registeredEmail
            };

            const response = await axios.post(`${config.backendUrl}/user/verify-email`, payload);

            if (response.status === 200 || response.status === 201) {
                toast.success("Account created successfully! Please Login");
                setShowOtpModal(false);
                setOtpCode("");
                setTimeout(() => {
                    navigate('/login')
                }, 1000);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid OTP code.");
        } finally {
            setLoading(false);
        }
    };




    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FFEAEA] via-[#FFF5F5] to-white py-12 px-4 sm:px-6 lg:px-8">
            <Toaster position="top-right" reverseOrder={false} />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div className="lg:sticky lg:top-12 space-y-8 order-2 lg:order-1">
                    <div>
                        <p className="text-[#C20E0E] font-bold text-xs tracking-widest uppercase mb-4 bg-[#FFEAEA] w-fit px-3 py-1.5 rounded-md">
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

                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-red-900/5 p-6 sm:p-8 lg:p-12 border border-red-50/50 relative overflow-hidden order-1 lg:order-2">
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
                                        required
                                        {...register("fullName")}
                                        placeholder="e.g. Arifa Rahman"
                                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-[#C20E0E]/10 focus:border-[#C20E0E] outline-none transition-all duration-200 text-sm font-medium bg-gray-50/50 focus:bg-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Date of Birth</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="DD/MM/YYYY"
                                        maxLength={10}
                                        {...register("birth", {
                                            required: "Date of birth is required",
                                            validate: value => value.length === 10 || "Please enter valid date (DD/MM/YYYY)"
                                        })}
                                        onChange={(e) => {
                                            let val = e.target.value.replace(/\D/g, "");
                                            let formatted = "";

                                            if (val.length > 0) {
                                                formatted = val.substring(0, 2);
                                                if (val.length > 2) formatted += "/" + val.substring(2, 4);
                                                if (val.length > 4) formatted += "/" + val.substring(4, 8);
                                            }
                                            e.target.value = formatted;
                                        }}
                                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-[#C20E0E]/10 focus:border-[#C20E0E] outline-none transition-all duration-200 text-sm font-medium bg-gray-50/50 focus:bg-white text-gray-700"
                                    />
                                </div>
                                <div className="space-y-2 hidden">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Age</label>
                                    <input
                                        type="number"
                                        {...register("age")}
                                        className="w-full  px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-[#C20E0E]/10 focus:border-[#C20E0E] outline-none transition-all duration-200 text-sm font-medium bg-gray-50/50 focus:bg-white text-gray-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Gender</label>
                                    <div className="flex gap-2.5">
                                        {['Male', 'Female'].map((g) => (
                                            <label key={g} className="flex-1">
                                                <input type="radio" required {...register("gender")} value={g} className="hidden peer" />
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
                                        <option value="Doctor">Doctor</option>
                                        <option value="Engineer">Engineer</option>
                                        <option value="Business">Business</option>
                                        <option value="Business">NRB (Probashi)</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                {watchedProfession === "Other" && (
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Specify Profession</label>
                                        <input
                                            required
                                            {...register("customProfession")}
                                            placeholder="Please write your profession"
                                            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-[#C20E0E]/10 focus:border-[#C20E0E] outline-none transition-all duration-200 text-sm font-medium bg-gray-50/50 focus:bg-white"
                                        />
                                    </div>
                                )}

                                <div className="space-y-2 md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Referral ID</label>
                                    <input
                                        type="number"
                                        {...register("bonusRefarelID")}
                                        placeholder="e.g. REF123456"
                                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-4 focus:ring-[#C20E0E]/10 focus:border-[#C20E0E] outline-none transition-all duration-200 text-sm font-medium bg-gray-50/50 focus:bg-white"
                                    />
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
                                        required
                                        {...register("contactNo")}
                                        placeholder="01XXX XXXXXX"
                                        className="flex-1 px-4 py-3.5 border border-gray-200 focus:ring-4 focus:ring-[#C20E0E]/10 focus:border-[#C20E0E] outline-none transition-all duration-200 text-sm font-medium bg-gray-50/50 focus:bg-white rounded-r-xl"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Email</label>
                                <input
                                    required
                                    {...register("email")}
                                    type="email"
                                    placeholder="example@mail.com"
                                    className="w-full px-4 py-3.5 border border-gray-200 focus:border-[#C20E0E] outline-none transition-all duration-200 text-sm font-medium bg-gray-50/50 focus:bg-white rounded-xl"
                                />
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
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Country</label>
                                    <select {...register("currentCountry")} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 outline-none bg-gray-50/50">
                                        <option value="Bangladesh">Bangladesh</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Division</label>
                                    <select required {...register("currentDivision")} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 outline-none bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-[#C20E0E]/10 focus:border-[#C20E0E] cursor-pointer">
                                        <option value="">Select Division</option>
                                        {divisions.map((div) => (
                                            <option key={div._id || div.id} value={div.id}>{div.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">District</label>
                                    <select required disabled={!watchedCurrentDivision} {...register("currentDistrict")} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 outline-none bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-[#C20E0E]/10 focus:border-[#C20E0E] cursor-pointer disabled:opacity-50">
                                        <option value="">Select District</option>
                                        {currentDistricts.map((dist) => (
                                            <option key={dist._id || dist.id} value={dist.id}>{dist.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Thana / Upazila</label>
                                    <select required disabled={!watchedCurrentDistrict} {...register("currentThana")} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 outline-none bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-[#C20E0E]/10 focus:border-[#C20E0E] cursor-pointer disabled:opacity-50">
                                        <option value="">Select Thana</option>
                                        {currentUpazilas.map((upz) => (
                                            <option key={upz._id || upz.id} value={upz.name}>{upz.name}</option>
                                        ))}
                                    </select>
                                </div>
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
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Country</label>
                                    <select {...register("permanentCountry")} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 outline-none bg-gray-50/50">
                                        <option value="Bangladesh">Bangladesh</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Division</label>
                                    <select required {...register("permanentDivision")} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 outline-none bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-[#C20E0E]/10 focus:border-[#C20E0E] cursor-pointer">
                                        <option value="">Select Division</option>
                                        {divisions.map((div) => (
                                            <option key={div._id || div.id} value={div.id}>{div.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">District</label>
                                    <select required disabled={!watchedPermanentDivision} {...register("permanentDistrict")} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 outline-none bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-[#C20E0E]/10 focus:border-[#C20E0E] cursor-pointer disabled:opacity-50">
                                        <option value="">Select District</option>
                                        {permanentDistricts.map((dist) => (
                                            <option key={dist._id || dist.id} value={dist.id}>{dist.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Thana / Upazila</label>
                                    <select required disabled={!watchedPermanentDistrict} {...register("permanentThana")} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 outline-none bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-[#C20E0E]/10 focus:border-[#C20E0E] cursor-pointer disabled:opacity-50">
                                        <option value="">Select Thana</option>
                                        {permanentUpazilas.map((upz) => (
                                            <option key={upz._id || upz.id} value={upz.name}>{upz.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
                                <div className="relative">
                                    <input
                                        required
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: { value: 6, message: "Password must be at least 6 characters" }
                                        })}
                                        placeholder="****"
                                        type={showPassword ? "text" : "password"}
                                        className={`w-full px-4 py-3.5 pr-12 rounded-xl border ${errors.password ? 'border-red-500' : 'border-gray-200'} focus:ring-4 focus:ring-[#C20E0E]/10 focus:border-[#C20E0E] outline-none transition-all duration-200 text-sm font-medium bg-gray-50/50 focus:bg-white`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-600 text-xs font-medium pl-1">{errors.password.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        required
                                        {...register("confirmPassword", {
                                            required: "Please confirm your password",
                                            validate: (value) => value === password || "Passwords do not match"
                                        })}
                                        placeholder="****"
                                        type={showConfirmPassword ? "text" : "password"}
                                        className={`w-full px-4 py-3.5 pr-12 rounded-xl border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'} focus:ring-4 focus:ring-[#C20E0E]/10 focus:border-[#C20E0E] outline-none transition-all duration-200 text-sm font-medium bg-gray-50/50 focus:bg-white`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-red-600 text-xs font-medium pl-1">{errors.confirmPassword.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Nid NO</label>
                                <input
                                    required
                                    {...register("nidNo", { required: "NID number is required" })}
                                    type="text"
                                    className={`w-full px-4 py-3.5 rounded-xl border ${errors.nidNo ? 'border-red-500' : 'border-gray-200'} focus:ring-4 focus:ring-[#C20E0E]/10 focus:border-[#C20E0E] outline-none transition-all duration-200 text-sm font-medium bg-gray-50/50 focus:bg-white`}
                                />
                                {errors.nidNo && <p className="text-red-600 text-xs font-medium pl-1">{errors.nidNo.message}</p>}
                            </div>
                        </section>

                        <div className="space-y-6 pt-4">
                            <label className="flex items-start gap-3 cursor-pointer group select-none">
                                <input type="checkbox" required className="mt-1 h-4 w-4 rounded border-gray-300 text-[#C20E0E] focus:ring-[#C20E0E] accent-[#C20E0E]" />
                                <span className="text-xs text-gray-500 font-medium leading-normal group-hover:text-gray-700 transition-colors">
                                    I agree to the <span className="text-[#C20E0E] font-bold hover:underline">Terms of Use</span> and <span className="text-[#C20E0E] font-bold hover:underline">Privacy Policy</span> of Bibah Matrimony.
                                </span>
                            </label>

                            <button type="submit" disabled={loading} className="w-full bg-[#C20E0E] hover:bg-[#A30B0B] text-white py-4 rounded-xl font-bold text-lg transition-all duration-200 active:scale-[0.99] shadow-xl shadow-red-600/20 flex items-center justify-center gap-2 disabled:opacity-50">
                                <CheckCircle size={20} /> {loading ? "Processing..." : "Create Account"}
                            </button>

                            <p className="text-center text-sm font-semibold text-gray-500">
                                Already have an account? <a href="/login" className="text-[#C20E0E] font-bold hover:underline">Login here</a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            {showOtpModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl border border-red-50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#FFEAEA] to-transparent rounded-bl-full pointer-events-none"></div>

                        <div className="relative z-10 text-center space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Verify Email OTP</h3>
                                <p className="text-sm text-gray-500 font-medium">We have sent a verification code to your phone number.</p>
                            </div>

                            <form onSubmit={handleVerifyOtp} className="space-y-5">
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value)}
                                    placeholder="Enter 6-digit OTP"
                                    className="w-full text-center tracking-widest text-xl font-bold px-4 py-3.5 rounded-xl border border-gray-200 focus:border-[#C20E0E] focus:ring-4 focus:ring-[#C20E0E]/10 outline-none bg-gray-50/50"
                                />

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowOtpModal(false)}
                                        className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 py-3 bg-[#C20E0E] hover:bg-[#A30B0B] text-white rounded-xl font-bold transition-all shadow-lg shadow-red-600/10 disabled:opacity-50"
                                    >
                                        {loading ? "Verifying..." : "Verify & Register"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SignUp;