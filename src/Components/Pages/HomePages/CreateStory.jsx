import { NavLink } from "react-router";

const CreateStory = () => {
    return (
        <section className="py-16 w-full">
            <div className="app-container">
                <div className="bg-gradient-to-r from-[#990707] to-[#E62E2E] rounded-[2.5rem] p-8 md:p-16 text-center shadow-xl shadow-red-900/10 relative overflow-hidden">

                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
                    <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-black/10 rounded-full blur-2xl pointer-events-none"></div>

                    <div className="relative z-10 max-w-2xl mx-auto space-y-12 py-12">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                            Ready to write your own <br className="hidden sm:inline" /> success story?
                        </h2>

                        <p className="text-white/80 text-sm md:text-base font-medium">
                            Join thousands of verified members who have found their perfect partner on Bibah.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <NavLink to='/create-account' className="bg-white hover:bg-gray-50 text-[#C20E0E] font-bold px-8 py-3.5 rounded-xl shadow-md transition-all duration-200 active:scale-95 w-full sm:w-auto text-sm">
                                <button>
                                    Create Your Biodata
                                </button>
                            </NavLink>
                            {/* <button className="border-2 border-white/40 hover:border-white text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 active:scale-95 w-full sm:w-auto text-sm">
                                Learn More
                            </button> */}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default CreateStory;