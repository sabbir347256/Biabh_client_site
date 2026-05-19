const Button = ({ text, type, className = "" }) => {
    return (
        <button
            type={type} 
            className={`w-full rounded-lg bg-red-600 py-3 font-semibold text-white transition hover:bg-red-800 ${className}`}
        >
            {text}
        </button>
    );
};

export default Button;