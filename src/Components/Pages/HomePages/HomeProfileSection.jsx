import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";
import Button from "../utilies/Button";
import { useQuery } from "@tanstack/react-query";
import config from "../utilies/envconfig";
import { NavLink } from "react-router";

const HomeProfileSection = () => {

    const sliderRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const token = localStorage.getItem("accessToken");

    const { data: profileData, isLoading, refetch } = useQuery({
        queryKey: ['allUserData'],
        queryFn: async () => {
            const headers = {
                "Content-Type": "application/json",
            };

            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const response = await fetch(`http://72.61.225.177:5000/api/v1/user`, {
                method: "GET",
                headers: headers,
            });

            if (!response.ok) throw new Error("Status check failed");
            const result = await response.json();
            return result;
        },
    });

    const allProfileData = profileData?.data;
    console.log(profileData)

    const profiles = [
        {
            id: 1,
            name: "Ahmed",
            age: 29,
            role: "SOFTWARE ARCHITECT",
            location: "DHAKA",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
            isPremium: true
        },
        {
            id: 2,
            name: "Farhana",
            age: 26,
            role: "PEDIATRICIAN",
            location: "CHITTAGONG",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
            isPremium: false
        },
        {
            id: 3,
            name: "Zakir",
            age: 32,
            role: "FINANCIAL ANALYST",
            location: "LONDON",
            image: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=400&q=80",
            isPremium: false
        },
        {
            id: 4,
            name: "Raisa",
            age: 24,
            role: "INTERIOR DESIGNER",
            location: "SYLHET",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
            isPremium: true
        },
        {
            id: 5,
            name: "Imran",
            age: 30,
            role: "CIVIL ENGINEER",
            location: "KHULNA",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
            isPremium: false
        },
        {
            id: 6,
            name: "Nabila",
            age: 27,
            role: "CHARTERED ACCOUNTANT",
            location: "DHAKA",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
            isPremium: true
        }
    ];

    const checkScrollBounds = () => {
        if (sliderRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
            setCanScrollLeft(scrollLeft > 5);
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
        }
    };

    const scroll = (direction) => {
        if (sliderRef.current) {
            const { clientWidth } = sliderRef.current;
            const scrollAmount = direction === "left" ? -clientWidth / 1.5 : clientWidth / 1.5;
            sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };
    return (
        <section className="bg-[#3A0303] py-16 w-full overflow-hidden select-none">
            <div className="app-container">
                <div className="flex items-end justify-between mb-8">
                    <div className="space-y-1">
                        <span className="text-[10px] md:text-xs font-bold text-red-500 uppercase tracking-widest block">
                            New Members
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                            Recent Profiles
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                            <button
                                onClick={() => scroll("left")}
                                disabled={!canScrollLeft}
                                className={`w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white transition-all ${canScrollLeft ? "opacity-100 hover:bg-white/10 active:scale-95" : "opacity-30 cursor-not-allowed"
                                    }`}
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={() => scroll("right")}
                                disabled={!canScrollRight}
                                className={`w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white transition-all ${canScrollRight ? "opacity-100 hover:bg-white/10 active:scale-95" : "opacity-30 cursor-not-allowed"
                                    }`}
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        <button className="border border-white/30 hover:border-white/60 text-white font-semibold text-xs px-5 py-2.5 rounded-full flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap">
                            VIEW ALL <ArrowRight size={14} />
                        </button>
                    </div>
                </div>

                <div
                    ref={sliderRef}
                    onScroll={checkScrollBounds}
                    className="flex gap-5 overflow-x-auto no-scrollbar pb-6 scroll-smooth snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {allProfileData?.map((profile) => (
                        <NavLink to={`/${profile?.fullName}/${profile?._id}`}
                            key={profile.id}
                            className="bg-[#240101] border border-white/5 rounded-3xl p-4 min-w-[260px] sm:min-w-[280px] max-w-[280px] snap-start flex flex-col justify-between shadow-xl"
                        >
                            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden mb-4 bg-[#140000]">
                                <img
                                    src={profile?.profileImage}
                                    alt={profile?.fullName}
                                    className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-500 hover:scale-105"
                                />
                                {profile.isPremium && (
                                    <span className="absolute top-3 right-3 bg-red-600 text-[9px] font-extrabold text-white px-2 py-1 rounded-md tracking-wider uppercase shadow-md">
                                        Premium
                                    </span>
                                )}
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <h3 className="text-white font-bold text-lg leading-tight">
                                        {profile?.fullName} <br></br> Age :  {profile?.age}
                                    </h3>
                                    <p className="text-white/40 text-[10px] font-medium tracking-wide uppercase mt-1 truncate">
                                        {profile?.role} • {profile?.location}
                                    </p>
                                </div>

                                <Button text={'View Profile'}></Button>
                            </div>
                        </NavLink>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default HomeProfileSection;