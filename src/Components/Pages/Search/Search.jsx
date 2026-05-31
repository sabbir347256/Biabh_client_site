import axios from "axios";
import {  ChevronLeft, ChevronRight, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import config from "../utilies/envconfig";

const Search = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [profiles, setProfiles] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [showCustomDivision, setShowCustomDivision] = useState(false);
    const [meta, setMeta] = useState({ page: 1, limit: 12, total: 0, totalPage: 1 });
    const [loading, setLoading] = useState(false);

    const defaultFormValues = {
        religion: '',
        currentDivision: '',
        customDivision: '',
        occupation: '',
        familyStatus: '',
        sort: 'Most Relevant',
        page: 1
    };

    const { register, handleSubmit, watch, setValue, reset } = useForm({
        defaultValues: defaultFormValues
    });

    const watchedDivision = watch("currentDivision");

    // প্রোফাইল থেকে ডাইনামিক এবং ইউনিক Profession লিস্ট বের করার জন্য useMemo
    const occupationOptions = useMemo(() => {
        if (!profiles || profiles.length === 0) return [];
        const professions = profiles
            .map(profile => profile.profession)
            .filter(prof => prof && prof.trim() !== ""); // খালি ভ্যালু বাদ দেওয়ার জন্য
        return [...new Set(professions)]; // ইউনিক ভ্যালু রাখার জন্য Set ব্যবহার
    }, [profiles]);

    const fetchProfiles = useCallback(async (filters) => {
        setLoading(true);
        try {
            const params = {};

            if (filters.religion) params.religion = filters.religion;
            if (filters.occupation) params.profession = filters.occupation;
            if (filters.familyStatus) params.familyStatus = filters.familyStatus;

            // Division ফিল্টারিং লজিক
            if (filters.currentDivision === "Other") {
                if (filters.customDivision) {
                    params.currentDivision = filters.customDivision;
                }
            } else if (filters.currentDivision) {
                params.currentDivision = filters.currentDivision;
            }

            if (filters.sort) {
                if (filters.sort === "Newest") params.sort = "-createdAt";
                else if (filters.sort === "Active Recently") params.sort = "-updatedAt";
                else params.sort = "-createdAt";
            }

            params.page = filters.page || 1;
            params.limit = 8;

            const response = await axios.get(`${config.backendUrl}/user/search-profiles`, { params });
            console.log(response)
            if (response.data?.success) {
                setProfiles(response.data.data);
                setMeta({
                    page: Number(response.data.meta?.page) || 1,
                    limit: Number(response.data.meta?.limit) || 12,
                    total: Number(response.data.meta?.total) || 0,
                    totalPage: Number(response.data.meta?.totalPage) || 1
                });
            }
        } catch (error) {
            console.error("Error fetching profiles:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfiles(defaultFormValues);

        const fetchDivisions = async () => {
            try {
                const response = await axios.get(`${config.geoApiUrl}/divisions`);
                const divisionsData = response.data?.data || response.data;
                setDivisions(Array.isArray(divisionsData) ? divisionsData : []);
            } catch (error) {
                console.error("Error fetching divisions:", error);
            }
        };
        fetchDivisions();
    }, [fetchProfiles]);

    // Division "Other" সিলেক্ট হলে কাস্টম ইনপুট ফিল্ড দেখানোর জন্য
    useEffect(() => {
        if (watchedDivision === "Other") {
            setShowCustomDivision(true);
        } else {
            setShowCustomDivision(false);
            setValue("customDivision", "");
        }
    }, [watchedDivision, setValue]);

    const onSubmit = (data) => {
        data.page = 1;
        setValue("page", 1);
        fetchProfiles(data);
        setIsFilterOpen(false);
    };

    const handleResetAll = () => {
        reset(defaultFormValues);
        fetchProfiles(defaultFormValues);
    };

    const handlePageChange = (newPage) => {
        setValue("page", newPage);
        handleSubmit((data) => {
            data.page = newPage;
            fetchProfiles(data);
        })();
    };

    const handleSortChange = (e) => {
        const sortValue = e.target.value;
        setValue("sort", sortValue);
        setValue("page", 1);
        handleSubmit((data) => {
            data.page = 1;
            fetchProfiles(data);
        })();
    };

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

                        {/* Religion Filter */}
                        <div className="mb-5">
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Religion</label>
                            <select
                                {...register('religion')}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-red-500"
                            >
                                <option value="">All Religions</option>
                                <option value="Islam">Islam</option>
                                <option value="Hindu">Hindu</option>
                                <option value="Buddhism">Buddhism</option>
                                <option value="Christian">Christian</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>

                        {/* Division Filter */}
                        <div className="mb-5">
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Division</label>
                            <select
                                {...register('currentDivision')}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-red-500"
                            >
                                <option value="">All Divisions</option>
                                {divisions.map((div) => (
                                    <option key={div._id || div.division} value={div.division}>
                                        {div.name || div.division}
                                    </option>
                                ))}
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Custom Division Text Input */}
                        {showCustomDivision && (
                            <div className="mb-5">
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Type Division Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter your division"
                                    {...register('customDivision')}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-red-500"
                                />
                            </div>
                        )}

                        {/* Dynamic Occupation Filter */}
                        <div className="mb-5">
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Occupation</label>
                            <select
                                {...register('occupation')}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-red-500"
                            >
                                <option value="">All Occupations</option>
                                {occupationOptions.map((occ, idx) => (
                                    <option key={idx} value={occ}>{occ}</option>
                                ))}
                            </select>
                        </div>

                        {/* Family Status Filter */}
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

                        <div className="flex flex-col gap-2">
                            <button
                                type="submit"
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-red-600/20 transition-all active:scale-[0.98]"
                            >
                                Apply Filters
                            </button>
                            <button
                                type="button"
                                onClick={handleResetAll}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                            >
                                <RotateCcw className="w-4 h-4" /> Reset All
                            </button>
                        </div>
                    </form>
                </aside>

                <main className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Discover Your Match</h1>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">Showing {meta.total} verified profiles matching your preferences</p>
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
                                <select
                                    value={watch('sort')}
                                    onChange={handleSortChange}
                                    className="text-sm font-bold text-red-600 bg-transparent focus:outline-none cursor-pointer"
                                >
                                    <option value="Most Relevant">Most Relevant</option>
                                    <option value="Newest">Newest</option>
                                    <option value="Active Recently">Active Recently</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
                        </div>
                    ) : (
                        <>
                            {profiles.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-8">
                                    <p className="text-gray-500 font-medium">No profiles found matching your filters.</p>
                                    <button
                                        onClick={handleResetAll}
                                        className="mt-4 text-sm font-bold text-red-600 hover:underline"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                                    {profiles.map((profile) => (
                                        <div key={profile._id} className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-row sm:flex-col h-auto sm:h-full">
                                            <div className="relative w-28 h-auto shrink-0 sm:w-full sm:pt-[110%] bg-gray-100 overflow-hidden">
                                                <img
                                                    src={profile.profileImage || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'}
                                                    alt={profile.fullName}
                                                    className="absolute inset-0 w-full h-full object-cover object-top"
                                                />
                                                <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex flex-col gap-1">
                                                    {profile.isVerified && (
                                                        <span className="bg-red-600 text-white text-[7px] sm:text-[9px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded flex items-center gap-1 w-fit">
                                                            <span className="w-1 h-1 bg-white rounded-full"></span> <span>Verified</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="p-4 sm:p-6 flex flex-col flex-1 justify-between min-w-0">
                                                <div className="mb-3 sm:mb-4">
                                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2">
                                                        <div className="min-w-0">
                                                            <h3 className="text-base sm:text-lg font-bold text-gray-800 truncate">
                                                                {profile.fullName}, {profile.age}
                                                            </h3>
                                                            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5 truncate">{profile.profession}</p>
                                                        </div>
                                                        <div className="text-left sm:text-right shrink-0 mt-1 sm:mt-0">
                                                            <p className="text-xs font-bold text-red-600">{profile.currentDivision}</p>
                                                            <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium mt-0.5 truncate max-w-[120px]">{profile.institute}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-1 sm:gap-1.5">
                                                    <span className="bg-gray-50 text-gray-500 border border-gray-100 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap">
                                                        {profile.maritalStatus || 'Never Married'}
                                                    </span>
                                                    <span className="bg-gray-50 text-gray-500 border border-gray-100 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap">
                                                        {profile.religion}
                                                    </span>
                                                    <span className="bg-gray-50 text-gray-500 border border-gray-100 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap">
                                                        {profile.Height || "5'4\""}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {meta.totalPage > 1 && (
                        <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8 sm:mt-12 mb-6">
                            <button
                                disabled={meta.page <= 1}
                                onClick={() => handlePageChange(meta.page - 1)}
                                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            {Array.from({ length: meta.totalPage }, (_, index) => index + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full text-xs sm:text-sm font-bold transition-all ${meta.page === page
                                        ? "bg-red-600 text-white"
                                        : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                disabled={meta.page >= meta.totalPage}
                                onClick={() => handlePageChange(meta.page + 1)}
                                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Search;