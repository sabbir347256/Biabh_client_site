import axios from "axios";
import { X } from "lucide-react";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { AuthProvider } from "../../../AuthProvider/CreateContext";
import config from "../../utilies/envconfig";

const MeetupModal = ({ isOpen, onClose }) => {
    const { user } = useContext(AuthProvider);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            targetUserId: "",
            mobileNumber: ""
        }
    });

    if (!isOpen) return null;

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await axios.post(`${config?.backendUrl}/meetup/postMeetup`, {
                userId: user?.userId,
                targetUserId: data.targetUserId,
                mobileNumber: data.mobileNumber
            });
            toast.success("Meetup request submitted successfully!");
            reset();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4">
            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-950 to-slate-950 text-white p-6 shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-rose-300 hover:text-white transition">
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-rose-400 mb-2">Fill Up Meet Up Form</h2>
                <p className="text-xs text-rose-200/70 mb-6">Provide information to initiate your meetup request safely.</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-rose-200 mb-1">User ID</label>
                        <input
                            type="text"
                            placeholder="Enter the ID of the person you want to meet"
                            className="w-full rounded-xl border border-rose-500/30 bg-rose-950/40 px-4 py-2.5 text-sm text-white placeholder-rose-300/40 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                            {...register("targetUserId", { required: true })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-rose-200 mb-1">Your Mobile Number</label>
                        <input
                            type="tel"
                            placeholder="Enter your contact number"
                            className="w-full rounded-xl border border-rose-500/30 bg-rose-950/40 px-4 py-2.5 text-sm text-white placeholder-rose-300/40 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                            {...register("mobileNumber", { required: true })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-rose-600 py-2.5 text-sm font-bold text-white hover:bg-rose-500 transition disabled:opacity-50 mt-2"
                    >
                        {loading ? "Submitting..." : "Submit Meetup Request"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MeetupModal;