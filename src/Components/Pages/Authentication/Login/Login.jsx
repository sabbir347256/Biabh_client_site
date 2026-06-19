import { useForm } from 'react-hook-form';
import loginImage from '../../../../assets/images/loginPageImage.jpg';
import Button from '../../utilies/Button';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import toast, { Toaster } from 'react-hot-toast';
import config from '../../utilies/envconfig';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [apiError, setApiError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setApiError('');
        setIsLoading(true);
        try {
            const response = await fetch(`${config?.backendUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                }),
            });

            const result = await response.json();
            console.log(result)

            if (response.ok && result?.data?.accessToken) {
                localStorage.setItem('accessToken', result.data.accessToken);
                toast.success(`${result.message}`);
                setTimeout(() => {
                    navigate('/user-profile');
                    window.location.reload();
                }, 1000);
            } else {
                setApiError(result?.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login API Error:', error);
            setApiError('Something went wrong. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen text-gray-800 ">
            <Toaster position="top-right" reverseOrder={false} />
            <div className="relative hidden w-2/3 lg:block">
                <img
                    src={loginImage}
                    alt="Couple in traditional Bangladeshi attire"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#b30000]/90 via-[#C44545]/40 to-transparent"></div>
                <div className="absolute bottom-20 left-12 right-12 text-white">
                    <h1 className="mb-6 text-5xl font-bold leading-tight">
                        Find your soulmate within the heritage of Bibah.
                    </h1>
                    <p className="max-w-md text-lg font-light opacity-90">
                        Experience the most exclusive and trusted matchmaking service for the Bangladeshi community worldwide.
                    </p>
                </div>
            </div>

            <div className="flex w-full mx-auto max-w-2xl flex-col justify-between bg-white px-8 py-12 lg:w-1/2 lg:px-24">
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-[#b30000]">Bibah</h2>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Premium Matchmaking</p>
                </div>

                <div className="">
                    <h3 className="mb-2 text-3xl font-semibold text-gray-900">Welcome Back</h3>
                    <p className="mb-8 text-gray-500">Enter your credentials to access your account.</p>

                    {apiError && (
                        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                            {apiError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Email or Phone Number</label>
                            <input
                                type="text"
                                {...register("email", {
                                    required: "Email or Phone is required"
                                })}
                                placeholder="Enter email or phone"
                                className={`w-full rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} px-4 py-3 outline-none transition focus:border-[#b30000] focus:ring-1 focus:ring-[#b30000]`}
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-gray-700">Password</label>
                                <NavLink
                                    to="/forgot-password"
                                    className="text-xs font-semibold text-[#b30000] hover:underline"
                                >
                                    Forgot Password?
                                </NavLink>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: { value: 6, message: "Password must be at least 6 characters" }
                                    })}
                                    placeholder="........"
                                    className={`w-full rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} px-4 py-3 outline-none transition focus:border-[#b30000] focus:ring-1 focus:ring-[#b30000]`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        <Button text={isLoading ? 'Signing in...' : 'Sign in'} type={'submit'} disabled={isLoading}></Button>
                    </form>

                    <div className="relative my-8 text-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <span className="relative bg-white px-4 text-xs font-bold uppercase tracking-wider text-gray-400">Or continue with</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5" alt="Google" />
                            <span className="text-sm font-semibold">Google</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50">
                            <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="h-5 w-5" alt="Facebook" />
                            <span className="text-sm font-semibold">Facebook</span>
                        </button>
                    </div>

                    <p className="mt-8 text-center text-sm text-gray-600">
                        Don't have an account? <a href="/create-account" className="font-bold text-[#b30000] hover:underline">Registration Now</a>
                    </p>
                </div>

                <div className="mt-12 flex flex-wrap items-center justify-between text-[10px] text-gray-500">
                    <p>© 2026 Bibah. Premium Bangladeshi Matchmaking.</p>
                    <div className="flex gap-4">
                        <a href="#" className="hover:underline">Privacy</a>
                        <a href="#" className="hover:underline">Terms</a>
                        <a href="#" className="hover:underline">Safety</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;