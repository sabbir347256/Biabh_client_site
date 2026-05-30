import { Check, ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

const Search = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const { register, handleSubmit } = useForm({
        defaultValues: {
            religion: 'Muslim (Sunni)',
            district: 'Dhaka',
            education: ['Post Graduate'],
            occupation: 'Software Engineer',
            familyStatus: 'Middle Class'
        }
    });

    const onSubmit = (data) => {
        console.log(data);
        setIsFilterOpen(false);
    };

    const profiles = [
        {
            id: 1,
            name: 'Farzana Ahmed',
            age: 26,
            occupation: 'Software Engineer at Google',
            location: 'Dhaka, BD',
            subLocation: 'BDS, Dhaka Medical',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
            tags: ['Never Married', 'Sunni Muslim', '5\'4" (162 cm)'],
            isPremium: true,
            isVerified: true
        },
        {
            id: 2,
            name: 'Sajid Khan',
            age: 31,
            occupation: 'Senior Architect',
            location: 'Sylhet, BD',
            subLocation: 'M.Arch, BUET',
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
            tags: ['Never Married', 'Sunni Muslim', '5\'11" (180 cm)'],
            isPremium: false,
            isVerified: true
        },
        {
            id: 3,
            name: 'Nuzhat Tabassum',
            age: 24,
            occupation: 'Medical Student',
            location: 'Chittagong, BD',
            subLocation: 'Final Year, CMC',
            image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
            tags: ['Never Married', 'Sunni Muslim', '5\'2" (157 cm)'],
            isPremium: false,
            isVerified: true
        },
        {
            id: 4,
            name: 'Ifti Mahmud',
            age: 33,
            occupation: 'Project Manager at T-Mobile',
            location: 'New York, USA',
            subLocation: 'MBA, NYU',
            image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
            tags: ['Never Married', 'Sunni Muslim', '6\'0" (183 cm)'],
            isPremium: true,
            isVerified: true
        }
    ];
    return (
        <div className="min-h-screen bg-gray-50 py-4 px-4">
            <div className="app-container flex flex-col lg:flex-row gap-8">

                <div className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 lg:hidden ${isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsFilterOpen(false)} />

                <aside className={`fixed top-0 bottom-0 left-0 w-full max-w-sm bg-white z-50 p-6 overflow-y-auto transform transition-transform duration-300 shadow-xl lg:static lg:w-80 lg:shadow-sm lg:transform-none lg:z-0 lg:rounded-2xl lg:border lg:border-gray-100 ${isFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Refine Search</h2>
                            <button type="button" className="lg:hidden p-1 text-gray-500 hover:text-gray-800" onClick={() => setIsFilterOpen(false)}>
                                <X className="w-6 h-6" />
                            </button>
                            <SlidersHorizontal className="w-5 h-5 text-red-500 hidden lg:block" />
                        </div>

                        <div className="mb-5">
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Religion</label>
                            <select
                                {...register('religion')}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-red-500 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-[right_16px_center] bg-no-repeat"
                            >
                                <option value="Muslim (Sunni)">Muslim (Sunni)</option>
                                <option value="Muslim (Shia)">Muslim (Shia)</option>
                                <option value="Hindu">Hindu</option>
                                <option value="Christian">Christian</option>
                            </select>
                        </div>

                        <div className="mb-5">
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">District</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['Dhaka', 'Sylhet', 'Chittagong', 'Rajshahi'].map((dist) => (
                                    <label key={dist} className="cursor-pointer">
                                        <input
                                            type="radio"
                                            value={dist}
                                            {...register('district')}
                                            className="peer sr-only"
                                        />
                                        <div className="border border-gray-200 text-center py-2 text-xs font-medium rounded-xl transition-all peer-checked:bg-red-600 peer-checked:border-red-600 peer-checked:text-white text-gray-600 bg-white">
                                            {dist}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mb-5">
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Education</label>
                            <div className="space-y-3">
                                {['Post Graduate', 'Undergraduate', 'Doctorate / PhD'].map((edu) => (
                                    <label key={edu} className="flex items-center cursor-pointer group">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                value={edu}
                                                {...register('education')}
                                                className="peer sr-only"
                                            />
                                            <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:border-red-600 peer-checked:bg-red-600 flex items-center justify-center transition-all">
                                                <Check className="w-3 h-3 text-white scale-0 peer-checked:scale-100 transition-transform" />
                                            </div>
                                        </div>
                                        <span className="ml-3 text-sm text-gray-600 font-medium group-hover:text-gray-800 transition-colors">{edu}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mb-5">
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Occupation</label>
                            <select
                                {...register('occupation')}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-red-500 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-[right_16px_center] bg-no-repeat"
                            >
                                <option value="Software Engineer">Software Engineer</option>
                                <option value="Architect">Architect</option>
                                <option value="Doctor">Doctor</option>
                                <option value="Manager">Manager</option>
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Family Status</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['Upper Class', 'Middle Class'].map((status) => (
                                    <label key={status} className="cursor-pointer">
                                        <input
                                            type="radio"
                                            value={status}
                                            {...register('familyStatus')}
                                            className="peer sr-only"
                                        />
                                        <div className="border border-gray-200 text-center py-2 text-xs font-bold rounded-xl transition-all peer-checked:bg-red-600 peer-checked:border-red-600 peer-checked:text-white text-gray-600 bg-white uppercase tracking-wider">
                                            {status}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-red-600/20 transition-all active:scale-[0.98]"
                        >
                            Apply Filters
                        </button>
                    </form>
                </aside>

                <main className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Discover Your Match</h1>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">Showing 1,240 verified profiles matching your preferences</p>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0">
                            <button
                                onClick={() => setIsFilterOpen(true)}
                                className="lg:hidden flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 shadow-sm"
                            >
                                <SlidersHorizontal className="w-4 h-4 text-red-500" />
                                Filters
                            </button>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400 font-medium">Sort by:</span>
                                <select className="text-sm font-bold text-red-600 bg-transparent focus:outline-none cursor-pointer">
                                    <option>Most Relevant</option>
                                    <option>Newest</option>
                                    <option>Active Recently</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                        {profiles.map((profile) => (
                            <div key={profile.id} className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-row sm:flex-col h-auto sm:h-full">
                                <div className="relative w-28 h-auto shrink-0 sm:w-full sm:pt-[110%] bg-gray-100 overflow-hidden">
                                    <img
                                        src={profile.image}
                                        alt={profile.name}
                                        className="absolute inset-0 w-full h-full object-cover object-top"
                                    />
                                    <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex flex-col gap-1">
                                        {profile.isVerified && (
                                            <span className="bg-red-600 text-white text-[7px] sm:text-[9px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded flex items-center gap-1 w-fit">
                                                <span className="w-1 h-1 bg-white rounded-full"></span> <span className="hidden xs:inline">Verified</span>
                                            </span>
                                        )}
                                        {profile.isPremium && (
                                            <span className="bg-white/90 backdrop-blur-sm text-red-600 text-[7px] sm:text-[9px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded flex items-center gap-1 w-fit border border-gray-200 shadow-sm">
                                                ⭐ <span className="hidden xs:inline">Premium</span>
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="p-4 sm:p-6 flex flex-col flex-1 justify-between min-w-0">
                                    <div className="mb-3 sm:mb-4">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2">
                                            <div className="min-w-0">
                                                <h3 className="text-base sm:text-lg font-bold text-gray-800 truncate">
                                                    {profile.name}, {profile.age}
                                                </h3>
                                                <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5 truncate">{profile.occupation}</p>
                                            </div>
                                            <div className="text-left sm:text-right shrink-0 mt-1 sm:mt-0">
                                                <p className="text-xs font-bold text-red-600">{profile.location}</p>
                                                <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium mt-0.5">{profile.subLocation}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-1 sm:gap-1.5">
                                        {profile.tags.map((tag, idx) => (
                                            <span key={idx} className="bg-gray-50 text-gray-500 border border-gray-100 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8 sm:mt-12 mb-6">
                        <button className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-red-600 text-white font-bold text-xs sm:text-sm">
                            1
                        </button>
                        <button className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full text-gray-600 font-medium text-xs sm:text-sm hover:bg-gray-50 transition-colors">
                            2
                        </button>
                        <button className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full text-gray-600 font-medium text-xs sm:text-sm hover:bg-gray-50 transition-colors">
                            3
                        </button>
                        <span className="text-gray-400 text-xs sm:text-sm px-1">...</span>
                        <button className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full text-gray-600 font-medium text-xs sm:text-sm hover:bg-gray-50 transition-colors">
                            42
                        </button>
                        <button className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </main>

            </div>
        </div>
    );
};

export default Search;