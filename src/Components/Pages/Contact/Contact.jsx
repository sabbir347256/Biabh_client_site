import { HelpCircle, Mail, MapPin, MessageSquare, Phone, Send } from "lucide-react";
import { useForm } from "react-hook-form";

const Contact = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            email: '',
            subject: 'Premium Membership Inquiry',
            message: ''
        }
    });

    const onSubmit = (data) => {
        console.log(data);
    };
    return (
        <div className=" min-h-screen text-[#2d3748]  py-10">
            <section className="app-container mb-16 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="flex-1 min-w-[300px]">
                    <span className="text-[#d90429] text-xs font-bold tracking-wider">CONTACT OUR TEAM</span>
                    <h1 className="text-4xl md:text-5xl text-[#004d40] font-bold mt-2 mb-5">Get in Touch</h1>
                    <p className="text-base text-[#4a5568] leading-relaxed mb-8">
                        Your journey to finding a soulmate is personal, and we are here to support every step.
                        Whether you have questions about our premium services or need guidance on your profile,
                        our dedicated consultants are ready to assist.
                    </p>
                    <div className="flex gap-4">
                        <button className="bg-[#d90429] text-white px-6 py-3 rounded-lg text-sm font-semibold flex items-center hover:bg-[#b80322] transition-colors">
                            <MessageSquare size={18} className="mr-2" /> Message Us Now
                        </button>
                        <button className="bg-white text-[#4a5568] border border-[#e2e8f0] px-6 py-3 rounded-lg text-sm font-semibold flex items-center hover:bg-gray-50 transition-colors">
                            <HelpCircle size={18} className="mr-2" /> View Help Center
                        </button>
                    </div>
                </div>

                <div className="flex-1 min-w-[300px] relative flex justify-end">
                    <img
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600"
                        alt="Consultant"
                        className="w-full max-w-[400px] h-[450px] object-cover rounded-[24px] shadow-xl"
                    />
                    <div className="absolute bottom-5 left-5 bg-white/90 backdrop-blur-md p-3 px-5 rounded-xl flex items-center gap-3 shadow-lg">
                        <div className="bg-[#d90429] text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">✓</div>
                        <div>
                            <div className="font-bold text-sm text-[#004d40]">Trusted Support</div>
                            <div className="text-[10px] text-[#718096] font-medium mt-0.5">AVERAGE RESPONSE TIME: 2 HOURS</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="app-container flex flex-col lg:flex-row gap-12 bg-white p-10 rounded-[24px] shadow-sm">
                <div className="flex-1 min-w-[300px]">
                    <h2 className="text-3xl text-[#004d40] font-bold mb-4">Reach Out to Bibah</h2>
                    <p className="text-sm text-[#718096] leading-relaxed mb-10">
                        Our headquarters is located in the heart of Dhaka, serving members across the globe
                        with traditional values and modern matchmaking technology.
                    </p>

                    <div className="flex flex-col gap-6 mb-10">
                        <div className="flex items-start gap-4">
                            <div className="bg-[#fff5f5] p-2.5 rounded-lg flex items-center justify-center">
                                <MapPin size={20} className="text-[#d90429]" />
                            </div>
                            <div>
                                <h4 className="text-base font-bold text-[#004d40] mb-1">Office Address</h4>
                                <p className="text-sm text-[#4a5568]">Gulshan 2, Dhaka 1212, Bangladesh</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-[#fff5f5] p-2.5 rounded-lg flex items-center justify-center">
                                <Mail size={20} className="text-[#d90429]" />
                            </div>
                            <div>
                                <h4 className="text-base font-bold text-[#004d40] mb-1">Support Email</h4>
                                <p className="text-sm text-[#4a5568]">support@bibah.com</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-[#fff5f5] p-2.5 rounded-lg flex items-center justify-center">
                                <Phone size={20} className="text-[#d90429]" />
                            </div>
                            <div>
                                <h4 className="text-base font-bold text-[#004d40] mb-1">Phone Number</h4>
                                <p className="text-sm text-[#4a5568]">+880 1XXX XXXXXX</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-[#edf2f7] pt-6">
                        <span className="text-[11px] font-bold text-[#a0aec0] tracking-wider block mb-4">FOLLOW OUR JOURNEY</span>
                        <div className="flex gap-3">
                            <a href="#" className="w-9 h-9 rounded-full border border-[#e2e8f0] flex items-center justify-center text-[#718096] text-sm font-medium hover:bg-gray-50">fb</a>
                            <a href="#" className="w-9 h-9 rounded-full border border-[#e2e8f0] flex items-center justify-center text-[#718096] text-sm font-medium hover:bg-gray-50">in</a>
                            <a href="#" className="w-9 h-9 rounded-full border border-[#e2e8f0] flex items-center justify-center text-[#718096] text-sm font-medium hover:bg-gray-50">li</a>
                        </div>
                    </div>
                </div>

                <div className="flex-[1.2] min-w-[320px]">
                    <form onSubmit={handleSubmit(onSubmit)} className="bg-[#fbf9f6] p-8 rounded-[20px] flex flex-col gap-5">
                        <div className="flex flex-col sm:flex-row gap-5">
                            <div className="flex flex-col flex-1 gap-2">
                                <label className="text-[11px] font-bold text-[#718096] tracking-wider">YOUR NAME</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Adnan Rahman"
                                    className={`p-3.5 rounded-lg border bg-white text-sm outline-none text-[#2d3748] ${errors.name ? 'border-[#d90429]' : 'border-[#e0e0e0]'}`}
                                    {...register('name', { required: true })}
                                />
                            </div>
                            <div className="flex flex-col flex-1 gap-2">
                                <label className="text-[11px] font-bold text-[#718096] tracking-wider">EMAIL ADDRESS</label>
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    className={`p-3.5 rounded-lg border bg-white text-sm outline-none text-[#2d3748] ${errors.email ? 'border-[#d90429]' : 'border-[#e0e0e0]'}`}
                                    {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-[#718096] tracking-wider">SUBJECT</label>
                            <select
                                className="p-3.5 rounded-lg border border-[#e0e0e0] bg-white text-sm outline-none text-[#2d3748] appearance-none bg-no-repeat bg-[right_14px_center] bg-[length:16px] pr-10"
                                style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23718096' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")` }}
                                {...register('subject')}
                            >
                                {/* <option value="Premium Membership Inquiry">Premium Membership Inquiry</option> */}
                                <option value="Profile Assistance">Profile Assistance</option>
                                <option value="Technical Support">Technical Support</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-[#718096] tracking-wider">YOUR MESSAGE</label>
                            <textarea
                                placeholder="How can we help you today?"
                                className={`p-3.5 rounded-lg border bg-white text-sm outline-none min-h-[120px] resize-y text-[#2d3748] ${errors.message ? 'border-[#d90429]' : 'border-[#e0e0e0]'}`}
                                {...register('message', { required: true })}
                            />
                        </div>

                        <button type="submit" className="bg-[#d90429] text-white border-none p-4 rounded-lg font-bold text-sm flex items-center justify-center mt-2 hover:bg-[#b80322] transition-colors cursor-pointer">
                            Send Message <Send size={16} className="ml-2" />
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Contact;