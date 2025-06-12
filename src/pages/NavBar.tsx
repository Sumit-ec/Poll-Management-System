import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Services/firebase";
import LogOut from "../Component/LogOut";

export default function NavBar() {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const data = userSnap.data();
                    setIsAdmin(data.role === "admin");
                }
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <div>
            <nav className="navbar">
                <div className="nav-left">
                    <ul className="nav-links">
                        <li>
                            <NavLink to="/home">
                                Home
                            </NavLink>
                        </li>

                        {isAdmin && (
                            <>
                                <li>
                                    <NavLink to="/admin-dashboard">
                                        Admin Dashboard
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/admin-dashboard/create-poll">
                                        Create Poll
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/admin-dashboard/results">
                                        View Result
                                    </NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                </div>

                <div className="nav-right">
                    <LogOut />
                </div>
            </nav>
        </div>
    );
}
