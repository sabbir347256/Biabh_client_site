import { ChevronLeft, ChevronRight } from "lucide-react";

const SuccessStory = () => {
    const stories = [
        {
            id: 1,
            couple: "Anika & Tanvir",
            location: "Dhaka",
            date: "December 14, 2023",
            image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600",
            isFeatured: true
        },
        {
            id: 2,
            couple: "Nabila & Arif",
            location: "Sylhet",
            date: "January 05, 2024",
            image: "https://images.unsplash.com/photo-1611106211090-8f3c79eb8552?auto=format&fit=crop&q=80&w=400",
            isFeatured: false
        },
        {
            id: 3,
            couple: "Sultana & Rayhan",
            location: "Chittagong",
            date: "November 22, 2023",
            image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=400",
            isFeatured: false
        },
        {
            id: 4,
            couple: "Kamal & Riya",
            location: "Khulna",
            date: "March 18, 2024",
            image: "https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&q=80&w=400",
            isFeatured: false
        },
        {
            id: 5,
            couple: "Sajid & Mim",
            location: "Barisal",
            date: "April 02, 2024",
            image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=400",
            isFeatured: false
        },
        {
            id: 6,
            couple: "Mariam & Zeeshan",
            location: "Rajshahi",
            date: "October 2023",
            image: "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&q=80&w=400",
            isFeatured: false
        },
        {
            id: 7,
            couple: "Farhana & Imran",
            location: "Dhaka",
            date: "February 2024",
            image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=400",
            isFeatured: false
        },
        {
            id: 8,
            couple: "Zoya & Faisal",
            location: "Comilla",
            date: "December 2023",
            image: "https://images.unsplash.com/photo-1615216390161-0bdf6fe40222?auto=format&fit=crop&q=80&w=400",
            isFeatured: false
        },
        {
            id: 9,
            couple: "Asif & Tanha",
            location: "Rangpur",
            date: "May 12, 2024",
            image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400",
            isFeatured: false
        }
    ];

    const featuredStory = stories.find(story => story.isFeatured);
    const sideStories = stories.slice(1, 5);
    const bottomStories = stories.slice(5, 9);
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="app-container bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">

                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
                        Featured Marriages of the Season
                    </h2>
                    <div className="flex gap-1.5">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
                    {featuredStory && (
                        <div className="md:col-span-1 lg:col-span-2 relative aspect-[4/3] md:aspect-auto md:h-[550px] rounded-2xl overflow-hidden group shadow-sm">
                            <img
                                src={featuredStory.image}
                                alt={featuredStory.couple}
                                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <span className="bg-red-600 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded mb-3 inline-block">
                                    Featured Story
                                </span>
                                <h3 className="text-2xl sm:text-4xl font-serif font-bold mb-1.5">
                                    {featuredStory.couple}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-300 font-medium uppercase tracking-wider">
                                    {featuredStory.location} • {featuredStory.date}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 md:h-[450px]">
                        {sideStories.map((story) => (
                            <div key={story.id} className="relative min-h-[263px] md:h-auto rounded-2xl overflow-hidden group shadow-sm">
                                <img
                                    src={story.image}
                                    alt={story.couple}
                                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4 text-white">
                                    <h3 className="text-xl font-serif font-bold mb-1">
                                        {story.couple}
                                    </h3>
                                    <p className="text-[11px] text-gray-300 font-medium uppercase tracking-wider">
                                        {story.location} • {story.date}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {bottomStories.map((story) => (
                        <div key={story.id} className="relative aspect-square sm:aspect-[4/3] md:aspect-square rounded-2xl overflow-hidden group shadow-sm">
                            <img
                                src={story.image}
                                alt={story.couple}
                                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl p-4 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-lg font-serif font-bold text-slate-900 mb-0.5">
                                    {story.couple}
                                </h3>
                                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                                    {story.location} • {story.date}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default SuccessStory;