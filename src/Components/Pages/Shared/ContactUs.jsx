import { Clock, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";

const ContactUs = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-4xl w-full mx-auto">
                <div className="text-left mb-12">
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-red-600 tracking-tight flex items-center justify-start gap-2">
                        Bibah.App
                    </h1>
                    <p className="mt-3 text-base sm:text-lg text-gray-500 ">
                        Find your perfect match with trust and safety. Feel free to connect or visit our corporate center.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 border-b-4 border-b-red-600 flex flex-col sm:flex-row items-start gap-5">
                        <div className="p-4 bg-red-50 text-red-600 rounded-2xl shrink-0">
                            <MapPin className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Corporate Office</h3>
                            <p className="mt-2 text-lg font-bold text-gray-800 leading-snug">
                                Suvastu Nazar Valley Shopping Complex
                            </p>
                            <p className="mt-1 text-sm font-medium text-gray-600 leading-relaxed">
                                Flat -7F1, Tower-7, Progoti Shoroni, Gulshan, Dhaka-1212. <span className="font-bold">Phone</span> : +88 01711994474
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Qatar Office</h3>
                            <p className="mt-2 text-md font-semibold text-gray-800 leading-snug">
                                Building No -262, State-23, Zone-57, Doha Industrial Area,  Doha, Qatar. <span className="font-bold">Mobile/Whatsapp</span> : +974 3367 4088
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-red-600 flex items-start gap-4">
                        <div className="p-3 bg-red-50 text-red-600 rounded-xl shrink-0">
                            <Phone className="w-6 h-6" />
                        </div>
                        <div className="w-full">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">For any Support </h3>
                            <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-100">
                                <span className="text-xs text-gray-600 block uppercase font-bold">Call Centre 24/7</span>
                                <p className="text-xl font-semibold text-gray-800 tracking-wide mt-0.5">+88 096 1700 1700</p>
                                <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded">Extension: 111</span>
                            </div>
                            <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-100">
                                <span className="text-xs font-semibold text-gray-400 block uppercase">Corporate Contact</span>
                                <p className="text-xl font-semibold text-gray-800 tracking-wide mt-0.5">+88 09644 840 940</p>
                                <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded">Extension: 111</span>
                            </div>
                            {/* <div className="mt-3 px-3">
                                <span className="text-xs font-semibold text-gray-400 block uppercase">Direct Mobile</span>
                                <p className="text-base font-bold text-gray-700 mt-0.5">+88 01711994474</p>
                            </div> */}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-red-600 flex items-start gap-4">
                            <div className="p-3 bg-red-50 text-red-600 rounded-xl shrink-0">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Email Address</h3>
                                <a href="mailto:bibahdotapp@gmail.com" className="mt-2 block text-base font-bold text-red-600 hover:text-red-700 hover:underline transition">
                                    bibahdotapp@gmail.com
                                </a>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-red-600 flex items-start gap-4">
                            <div className="p-3 bg-red-50 text-red-600 rounded-xl shrink-0">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Office Hours</h3>
                                <p className="mt-2 text-sm font-bold text-gray-800">
                                    Saturday - Thursday
                                </p>
                                <p className="text-xs font-medium text-gray-500 mt-0.5">
                                    10:00 AM - 07:00 PM
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center flex items-center justify-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" /> Government Registered Matrimony Platform
                </div>
            </div>
        </div>
    );
};

export default ContactUs;