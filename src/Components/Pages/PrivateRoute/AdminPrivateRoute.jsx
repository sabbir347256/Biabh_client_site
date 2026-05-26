import React, { useContext } from 'react';
import { AuthProvider } from '../../AuthProvider/CreateContext';
import { Loader2 } from 'lucide-react';
import { Navigate, useLocation } from 'react-router';

const AdminPrivateRoute = ({children}) => {
    const { user, loading } = useContext(AuthProvider);
    const location = useLocation();

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
            </div>
        );
    }

    if (user && user.role === 'ADMIN') {
        return children;
    }

    return <Navigate to="/" state={{ from: location }} replace />;
};

export default AdminPrivateRoute;