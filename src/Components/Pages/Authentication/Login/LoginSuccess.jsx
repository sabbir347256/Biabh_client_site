import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router';

const LoginSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            localStorage.setItem("accessToken", token);
            toast.success("Login Successful via Google!");

            setTimeout(() => {
                navigate("/user-profile");
                window.location.reload();
            }, 1000);
        } else {
            toast.error("Google Authentication Failed");
            navigate("/login");
        }
    }, [searchParams, navigate]);
    return (
        <div className="flex h-screen items-center justify-center">
            <p className="text-lg font-semibold text-gray-600 animate-pulse">
                Verifying Google Account... Please wait.
            </p>
        </div>
    );
};

export default LoginSuccess;