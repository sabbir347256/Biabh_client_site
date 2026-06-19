import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import config from "../../utilies/envconfig";

const ForgotPass = () => {
    const [step, setStep] = useState(1);
    const [userEmail, setUserEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const onEmailSubmit = async (data) => {
        setIsLoading(true);
        try {
            await axios.post(`${config?.backendUrl}/user/forgot-password`, { email: data.email });
            toast.success("OTP sent successfully to your email!");
            setUserEmail(data.email);
            setStep(2);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong!");
        } finally {
            setIsLoading(false);
        }
    };

    const onOtpSubmit = (data) => {
        setOtp(data.otpCode);
        setStep(3);
    };

    const onResetSubmit = async (data) => {
        setIsLoading(true);
        try {
            await axios.post(`${config.backendUrl}/user/reset-password`, {
                email: userEmail,
                otpCode: otp,
                newPassword: data.newPassword,
            });
            toast.success("Password reset successful!");
            setTimeout(() => {
                window.location.href = "/login";
            }, 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to reset password.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 text-gray-800">
            <Toaster position="top-right" />

            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-[#b30000]">Bibah</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        {step === 1 && "Reset your premium matchmaking account password"}
                        {step === 2 && "Enter the 6-digit verification code sent to your email"}
                        {step === 3 && "Create a secure new password for your account"}
                    </p>
                </div>

                {step === 1 && (
                    <form onSubmit={handleSubmit(onEmailSubmit)} className="space-y-6">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                type="email"
                                {...register("email", { required: "Email is required" })}
                                placeholder="Enter your registered email"
                                className={`w-full rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} px-4 py-3 outline-none transition focus:border-[#b30000] focus:ring-1 focus:ring-[#b30000]`}
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-lg bg-[#b30000] py-3 text-sm font-semibold text-white transition hover:bg-[#990000] disabled:bg-gray-400"
                        >
                            {isLoading ? "Sending..." : "Send Verification Code"}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleSubmit(onOtpSubmit)} className="space-y-6">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">6-Digit OTP</label>
                            <input
                                type="text"
                                maxLength={6}
                                {...register("otpCode", {
                                    required: "OTP is required",
                                    minLength: { value: 6, message: "Must be exactly 6 digits" }
                                })}
                                placeholder="123456"
                                className={`w-full text-center tracking-widest text-lg font-bold rounded-lg border ${errors.otpCode ? 'border-red-500' : 'border-gray-300'} px-4 py-3 outline-none transition focus:border-[#b30000] focus:ring-1 focus:ring-[#b30000]`}
                            />
                            {errors.otpCode && <p className="mt-1 text-xs text-red-500">{errors.otpCode.message}</p>}
                        </div>
                        <button
                            type="submit"
                            className="w-full rounded-lg bg-[#b30000] py-3 text-sm font-semibold text-white transition hover:bg-[#990000]"
                        >
                            Verify Code
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleSubmit(onResetSubmit)} className="space-y-6">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">New Password</label>
                            <input
                                type="password"
                                {...register("newPassword", {
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Password must be at least 6 characters" }
                                })}
                                placeholder="••••••••"
                                className={`w-full rounded-lg border ${errors.newPassword ? 'border-red-500' : 'border-gray-300'} px-4 py-3 outline-none transition focus:border-[#b30000] focus:ring-1 focus:ring-[#b30000]`}
                            />
                            {errors.newPassword && <p className="mt-1 text-xs text-red-500">{errors.newPassword.message}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Confirm New Password</label>
                            <input
                                type="password"
                                {...register("confirmPassword", {
                                    required: "Please confirm your password",
                                    validate: (val) => {
                                        if (watch('newPassword') !== val) {
                                            return "Your passwords do not match";
                                        }
                                    }
                                })}
                                placeholder="••••••••"
                                className={`w-full rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} px-4 py-3 outline-none transition focus:border-[#b30000] focus:ring-1 focus:ring-[#b30000]`}
                            />
                            {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-lg bg-[#b30000] py-3 text-sm font-semibold text-white transition hover:bg-[#990000] disabled:bg-gray-400"
                        >
                            {isLoading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}

                <div className="text-center">
                    <a href="/login" className="text-sm font-medium text-[#b30000] hover:underline">
                        Back to Login
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ForgotPass;