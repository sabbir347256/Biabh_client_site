const Loading = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50 p-4">
            <div className="relative flex items-center justify-center mb-4">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin"></div>
                <div className="absolute w-10 h-10 border-4 border-transparent border-b-emerald-600 rounded-full animate-spin [animation-direction:reverse]"></div>
            </div>
        </div>
    );
};

export default Loading;