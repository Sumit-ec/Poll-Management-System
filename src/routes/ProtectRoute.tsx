import { useEffect, useState, type JSX } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
    children: JSX.Element;
}

export default function ProtectRoute({ children }: PrivateRouteProps) {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) return <div>Loading...</div>;

    return isAuthenticated ? children : <Navigate to="/login" />;
}
