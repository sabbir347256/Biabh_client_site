import { Play } from "lucide-react";
import logo from '../../../assets/images/logo.jpeg'

const HeroSection = () => {
    return (
        <section className="w-full min-h-[calc(90vh-88px)] flex items-center relative overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none select-none">
                <svg
                    className="absolute right-0 bottom-0 w-full h-full object-cover md:w-[65%] md:h-full lg:w-[55%]"
                    viewBox="0 0 800 700"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMax slice"
                >
                    <circle cx="500" cy="350" r="280" fill="#FFEAEA" opacity="0.5" />
                    <circle cx="500" cy="350" r="220" fill="#FFD1D1" opacity="0.3" />
                    <path
                        d="M250 700C350 620 400 480 550 450C700 420 750 250 900 150V700H250Z"
                        fill="url(#red-gradient)"
                    />
                    <path
                        d="M380 700C450 640 520 550 680 540C800 530 850 420 950 350V700H380Z"
                        fill="#D61C1C"
                        opacity="0.15"
                    />
                    <defs>
                        <linearGradient id="red-gradient" x1="400" y1="200" x2="800" y2="700" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#E62E2E" />
                            <stop offset="100%" stopColor="#B30E0E" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            <div className="app-container grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10  w-full">
                <div className="flex flex-col items-start space-y-6 max-w-xl">
                    <span className="bg-red-50 text-red-600 text-xs md:text-sm font-semibold px-4 py-2 rounded-full tracking-wide">
                        A Perfect Partner for a Perfect Life
                    </span>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.15]">
                        Find Your <br />
                        <span className="text-gray-900">Perfect Partner</span> <br />
                        with <span className="text-red-600">Bibah</span>
                    </h1>

                    <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-md">
                        Bibah is a trusted matrimonial platform dedicated to helping you find a life partner who matches your values and dreams.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
                        <button className="bg-red-600 hover:bg-red-700 text-white font-medium px-8 py-3.5 rounded-xl transition-all duration-200 active:scale-95 shadow-lg shadow-red-600/20 w-full sm:w-auto">
                            Get Started
                        </button>
                        <button className="border-2 border-red-600 text-red-600 hover:bg-red-50 font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 w-full sm:w-auto">
                            <span className="bg-red-600 text-white rounded-full p-1 flex items-center justify-center">
                                <Play size={12} fill="currentColor" className="ml-0.5" />
                            </span>
                            How It Works
                        </button>
                    </div>
                </div>

                <div className="flex justify-center md:justify-end lg:pr-12">
                    <div className="relative group">
                        <div className="bg-gradient-to-br from-red-500 to-red-600 w-64 h-64 sm:w-80 sm:h-80 lg:w-[26rem] lg:h-[26rem] rounded-[2.5rem] md:rounded-[3.5rem] flex flex-col items-center justify-center shadow-2xl relative z-10 border-4 border-white/10">
                            <div className="text-white text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight select-none">
                               <img className="rounded-[2.5rem] md:rounded-[3.5rem]" src={logo} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;