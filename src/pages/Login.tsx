import { useState } from "react";
import InputPassword from "../Component/InputPassword";
import InputEmail from "../Component/InputEmail";
import { NavLink, useNavigate } from "react-router-dom";
import Buttons from "../Component/Buttons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../Services/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                localStorage.setItem("user", JSON.stringify(userData));

                alert(`Login successful! Role: ${userData.role}`);
                if (userData.role === "admin") {
                    navigate("/dashboard");
                } else {
                    navigate("/home");
                }
            } else {
                throw new Error("User data not found in Firestore.");
            }
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <div className="signup-container">
            <div>
                <h1 className="auth-container">Log In</h1>
                <InputEmail value={email} onChange={(e) => setEmail(e.target.value)} />
                <InputPassword value={password} onChange={(e) => setPassword(e.target.value)} />
                {/* {error && <p style={{ color: "red" }}>{error}</p>} */}
            </div>

            <div className="bottom-signup">
                <p>Don’t have an account?</p>
                <NavLink to="/">Sign-Up</NavLink>
            </div>

            <div className="button-submit">
                <Buttons title="Log In" onClick={handleLogin} />
            </div>
        </div>
    );
}
