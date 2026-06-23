import { Heart, Share2 } from "lucide-react";
import logo from '../../../assets/images/logo.jpeg'

const Footer = () => {
    return (
        <footer className="bg-[#3A0303] text-white/80 py-24 w-full border-t border-white/5">
            <div className="app-container">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10">
                    <div className="md:col-span-6 space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded-md flex items-center justify-center">
                                <img className="rounded-md" src={logo} alt="" />
                            </div>
                            <span className="font-bold text-xl tracking-wider text-white uppercase">
                                Bibah
                            </span>
                        </div>
                        <p className="text-sm text-white/60 leading-relaxed max-w-sm">
                            The world&apos;s most trusted Bangladeshi matchmaking service. Combining heritage with modern technology to help you find your lifelong partner.
                        </p>
                    </div>

                    <div className="md:col-span-3 space-y-4">
                        <h4 className="text-xs font-bold text-white tracking-widest uppercase">
                            Quick Links
                        </h4>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <a href="#" className="text-white/60 hover:text-white transition-colors duration-200">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-white/60 hover:text-white transition-colors duration-200">
                                    Terms of Service
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-white/60 hover:text-white transition-colors duration-200">
                                    Safety Tips
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-white/60 hover:text-white transition-colors duration-200">
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="md:col-span-3 space-y-4">
                        <h4 className="text-xs font-bold text-white tracking-widest uppercase">
                            Social
                        </h4>
                        <div className="flex items-center gap-3">
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-200"
                            >
                                <Share2 size={16} />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-200"
                            >
                                <Heart size={16} />
                            </a>
                        </div>
                    </div>

                </div>

                <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40 font-medium">
                    <p>
                        &copy; 2026 Bibah Matrimony. Premium Bangladeshi Matchmaking. Developed by HUMTECH
                    </p>
                </div>

            </div>
        </footer>
    );
};

export default Footer;