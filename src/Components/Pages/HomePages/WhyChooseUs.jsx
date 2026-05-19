import { ShieldCheck, Search, Lock, Heart, Users, ArrowRight } from "lucide-react";

const WhyChooseUs = () => {
    const features = [
        {
            icon: <ShieldCheck className="text-red-600" size={24} />,
            title: "Trusted Platform",
            desc: "Verified profiles and secure environment to ensure your safety and trust."
        },
        {
            icon: <Search className="text-red-600" size={24} />,
            title: "Smart Matchmaking",
            desc: "Advanced search and match algorithms to find your ideal life partner."
        },
        {
            icon: <Lock className="text-red-600" size={24} />,
            title: "Privacy Protection",
            desc: "Your privacy is our priority. We never share your data without permission."
        },
        {
            icon: <Heart className="text-red-600" size={24} fill="currentColor" />,
            title: "Meaningful Connections",
            desc: "We focus on creating genuine connections for a happy future."
        }
    ];

    const stats = [
        {
            icon: <Heart className="text-red-600" size={20} fill="currentColor" />,
            count: "50K+",
            label: "Successful Matches"
        },
        {
            icon: <Users className="text-red-600" size={20} />,
            count: "200K+",
            label: "Registered Members"
        },
        {
            icon: <ShieldCheck className="text-red-600" size={20} />,
            count: "100%",
            label: "Verified Profiles"
        }
    ];
    return (
        <section className="py-16  w-full">
            <div className="app-container">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Why Choose <span className="text-red-600">Bibah</span>?
                    </h2>
                    <div className="w-10 h-1 bg-red-600 rounded-full mx-auto mt-3 relative">
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-600 rounded-full"></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {features.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white border border-gray-100 rounded-2xl p-8 text-center flex flex-col items-center shadow-sm hover:shadow-md transition-shadow duration-300"
                        >
                            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-5">
                                {item.icon}
                            </div>
                            <h3 className="text-gray-900 font-bold text-lg mb-3">
                                {item.title}
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="bg-red-50/50 rounded-3xl p-8 md:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 border border-red-50">
                    <div className="max-w-md text-center lg:text-left flex flex-col items-center lg:items-start">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-6">
                            Thousands of people have found their perfect partner on <span className="text-red-600">Bibah</span>
                        </h3>
                        <button className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 active:scale-95 shadow-lg shadow-red-600/20">
                            Join Now <ArrowRight size={18} />
                        </button>
                    </div>

                    <div className="w-full lg:w-auto h-px lg:h-24 bg-gray-200 lg:w-px hidden sm:block"></div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-16 w-full lg:w-auto">
                        {stats.map((stat, index) => (
                            <div key={index} className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                                    {stat.icon}
                                </div>
                                <span className="text-3xl font-extrabold text-red-600 tracking-tight">
                                    {stat.count}
                                </span>
                                <span className="text-gray-600 text-xs font-medium mt-1">
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default WhyChooseUs;