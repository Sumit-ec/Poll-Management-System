import { signOut } from "firebase/auth";
import { auth } from "../Services/firebase";
import { useNavigate } from "react-router-dom";

export default function LogOut() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            // localStorage.removeItem("user"); // Optional: clear user data
            navigate("/login"); // Redirect to login page
        } catch (error) {
            console.error("Logout failed:", error);
            alert("Logout failed. Please try again.");
        }
    };

    return (
        <button onClick={handleLogout} className="logout-button">
            Logout
        </button>
    );
}
