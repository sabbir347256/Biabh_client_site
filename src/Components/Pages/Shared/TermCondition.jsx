import { FileText, HelpCircle, Info, RefreshCw, ShieldCheck } from "lucide-react";

const TermCondition = () => {
    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                <div className="bg-gradient-to-r from-red-800 to-emerald-950 p-8 text-white text-center sm:text-left relative">
                    <div className="absolute top-4 right-4 opacity-10">
                        <FileText className="w-32 h-32" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                        রিফান্ড এবং ক্যানসেলেশন পলিসি
                    </h1>
                    <p className="mt-2 text-emerald-100 text-sm font-medium">
                        কার্যকরী তারিখ: ৯ জুন, ২০২৬
                    </p>
                </div>

                <div className="p-6 sm:p-10 space-y-8 text-gray-700 leading-relaxed">

                    <p className="text-gray-600 bg-emerald-50/40 p-4 rounded-xl border border-emerald-100/50 text-sm sm:text-base">
                        Bibah.app-এ আমাদের সেবার প্রতি আস্থা রাখার জন্য ধন্যবাদ। আমাদের প্ল্যাটফর্মে আইডি খোলার পর থেকে সাবস্ক্রিপশন বা পেমেন্ট সম্পন্ন করার আগ পর্যন্ত ব্যবহারকারীদের যথেষ্ট সময় ও সুযোগ দেওয়া হয় সেবার শর্তাবলী যাচাই করার জন্য। এই স্বচ্ছতার বিষয়টি মাথায় রেখে, আমাদের রিফান্ড ও ক্যানসেলেশন নীতিমালা নিচে বিস্তারিত উল্লেখ করা হলো।
                    </p>

                    <hr className="border-gray-100" />

                    <div className="flex gap-4 items-start">
                        <div className="p-2.5 bg-red-50 text-red-600 rounded-xl flex-shrink-0 mt-1">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 mb-2">
                                ১. রিফান্ড সংক্রান্ত নীতি (No Refund Policy)
                            </h2>
                            <p className="text-sm sm:text-base text-gray-600">
                                একবার পেমেন্ট সম্পন্ন হওয়ার পর কোনো ধরনের রিফান্ড বা অর্থ ফেরত প্রদান করা হবে না। ব্যবহারকারী সেবাটি কেনার আগেই সম্পূর্ণ নিশ্চিত হয়ে পেমেন্ট সম্পন্ন করবেন বলে আমরা আশা করি।
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 items-start">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl flex-shrink-0 mt-1">
                            <Info className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 mb-2">
                                ২. সেবা গ্রহণের সিদ্ধান্ত
                            </h2>
                            <p className="text-sm sm:text-base text-gray-600">
                                ব্যবহারকারী পেমেন্ট সম্পন্ন করার আগে আমাদের প্ল্যাটফর্মের শর্তাবলী (Terms of Service) ও ফিচারগুলো ভালোভাবে যাচাই করে নেওয়ার জন্য যথেষ্ট সময় পান। পেমেন্ট করার মাধ্যমে আপনি নিশ্চিত করেছেন যে, আপনি সেবার শর্তাবলীর সাথে একমত এবং আপনি সম্পূর্ণ সচেতন হয়েই এই লেনদেন করেছেন।
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 items-start">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl flex-shrink-0 mt-1">
                            <HelpCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 mb-2">
                                ৩. কারিগরি সহায়তা
                            </h2>
                            <p className="text-sm sm:text-base text-gray-600">
                                যদি আমাদের কারিগরি ত্রুটির কারণে আপনার পেমেন্ট সম্পন্ন হওয়ার পরও সেবা সক্রিয় না হয়, তবে অনুগ্রহ করে আমাদের সাপোর্ট টিমের সাথে ২৪ ঘণ্টার মধ্যে যোগাযোগ করুন। আমরা বিষয়টি যাচাই করে প্রয়োজনীয় পদক্ষেপ নেব এবং আপনার প্রাপ্য সেবাটি সক্রিয় করে দেব।
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 items-start">
                        <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl flex-shrink-0 mt-1">
                            <RefreshCw className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 mb-2">
                                ৪. নীতিමালার সংশোধন
                            </h2>
                            <p className="text-sm sm:text-base text-gray-600">
                                Bibah.app যেকোনো সময় এই নীতি পরিবর্তন বা পরিমার্জন করার অধিকার সংরক্ষণ করে। পরিবর্তনের পর তা ওয়েবসাইটে প্রদর্শিত হওয়ার সাথে সাথেই কার্যকর বলে গণ্য হবে।
                            </p>
                        </div>
                    </div>

                </div>

                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 text-center text-xs sm:text-sm font-medium text-gray-500">
                    © ২০২৬ Bibah.app। সর্বস্বত্ব সংরক্ষিত।
                </div>

            </div>
        </div>
    );
};

export default TermCondition;