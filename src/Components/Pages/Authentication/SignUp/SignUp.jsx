import { useForm } from "react-hook-form";

const SignUp = () => {
    const { register, handleSubmit } = useForm();

    const onSubmit = (data) => {
        console.log(data);
    };
    return (
        <div className="min-h-screen globalBg py-12 px-4 sm:px-6 lg:px-8 ">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                <div className="lg:sticky lg:top-12">
                    <p className="text-[#b30000] font-bold text-xs tracking-widest uppercase mb-4">Start Your Journey</p>
                    <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
                        Find your perfect partner with Bibah.
                    </h1>
                    <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-md">
                        Join Bangladesh's most premium matchmaking community. We blend traditional values with modern technology to find your soulmate.
                    </p>

                    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1974&auto=format&fit=crop"
                            alt="Premium Couple"
                            className="w-full h-[500px] object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        <div className="absolute bottom-8 left-8 text-white">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-yellow-400">★</span>
                                <span className="text-sm font-medium">Trusted by 50,000+ Profiles</span>
                            </div>
                            <p className="italic text-sm opacity-90 italic">
                                "The most secure and premium platform for finding life partners in Bangladesh."
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 border border-gray-100">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">

                        <section>
                            <div className="flex items-center gap-4 mb-6">
                                <span className="bg-[#b30000] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                                <h2 className="text-xl font-bold text-gray-800">Personal Identity</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Full Legal Name</label>
                                    <input {...register("fullName")} placeholder="e.g. Arifa Rahman" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#b30000]/20 focus:border-[#b30000] outline-none transition" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Date of Birth</label>
                                    <input type="date" {...register("dob")} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#b30000]/20 focus:border-[#b30000] outline-none transition" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Gender</label>
                                    <div className="flex gap-2">
                                        {['Male', 'Female', 'Other'].map((g) => (
                                            <label key={g} className="flex-1">
                                                <input type="radio" {...register("gender")} value={g} className="hidden peer" />
                                                <div className="text-center py-2.5 border border-gray-200 rounded-lg cursor-pointer peer-checked:bg-[#fdf2f2] peer-checked:border-[#b30000] peer-checked:text-[#b30000] text-sm font-medium transition">
                                                    {g}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Profession</label>
                                    <select {...register("profession")} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#b30000]/20 focus:border-[#b30000] outline-none transition appearance-none bg-white">
                                        <option>Doctor</option>
                                        <option>Engineer</option>
                                        <option>Business</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-4 mb-6">
                                <span className="bg-[#b30000] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                                <h2 className="text-xl font-bold text-gray-800">Contact Details</h2>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Phone Number</label>
                                <div className="flex">
                                    <select className="px-3 py-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-sm outline-none">
                                        <option>+880 (BD)</option>
                                    </select>
                                    <input {...register("phone")} placeholder="01XXX XXXXXX" className="flex-1 px-4 py-3 rounded-r-xl border border-gray-200 focus:ring-2 focus:ring-[#b30000]/20 focus:border-[#b30000] outline-none transition" />
                                </div>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-4 mb-6">
                                <span className="bg-[#b30000] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                                <h2 className="text-xl font-bold text-gray-800">Profile Presence</h2>
                            </div>
                            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                                <div className="text-gray-400 mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium text-gray-600">Click to upload profile picture</p>
                                <p className="text-[10px] text-gray-400 mt-1">JPG, PNG up to 5MB</p>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-4 mb-6">
                                <span className="bg-[#b30000] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                                <h2 className="text-xl font-bold text-gray-800">Current Residence</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {['Country', 'Division / State', 'District', 'Thana'].map((label) => (
                                    <div key={label}>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">{label}</label>
                                        <select className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none">
                                            <option>Select {label}</option>
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-4 mb-6">
                                <span className="bg-[#b30000] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">5</span>
                                <h2 className="text-xl font-bold text-gray-800">Permanent Address</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {['Country', 'Division', 'District', 'Thana'].map((label) => (
                                    <div key={label}>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">{label}</label>
                                        <select className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none bg-gray-50">
                                            <option>Select {label}</option>
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="space-y-6 pt-4">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300 text-[#b30000] focus:ring-[#b30000]" />
                                <span className="text-xs text-gray-500 leading-normal">
                                    I agree to the <span className="text-[#b30000] font-semibold">Terms of Use</span> and <span className="text-[#b30000] font-semibold">Privacy Policy</span> of Bibah Matrimony.
                                </span>
                            </label>

                            <button type="submit" className="w-full bg-[#b30000] text-white py-4 rounded-xl font-bold text-lg hover:bg-red-800 transition-colors shadow-lg shadow-red-900/20">
                                Create Account
                            </button>

                            <p className="text-center text-sm text-gray-500">
                                Already have an account? <a href="/login" className="text-[#b30000] font-bold hover:underline">Login here</a>
                            </p>
                        </div>

                    </form>
                </div>

            </div>
        </div>
    );
};

export default SignUp;