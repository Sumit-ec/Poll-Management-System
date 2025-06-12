import { useState } from "react";
import InputName from "../Component/InputName";
import InputPassword from "../Component/InputPassword";
import InputEmail from "../Component/InputEmail";
import { NavLink, useNavigate } from "react-router-dom";
import Buttons from "../Component/Buttons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../Services/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function SignUp() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSignup = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                name,
                email,
                role: "guest",
                createdAt: new Date()
            });

            alert("Signup successful");
            navigate("/login");
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <div className="contain-outer">
            <div className="signup-container">
                <div>
                    <h1 className="auth-container">Create an Account</h1>
                    <InputName value={name} onChange={(e) => setName(e.target.value)} />
                    <InputEmail value={email} onChange={(e) => setEmail(e.target.value)} />
                    <InputPassword value={password} onChange={(e) => setPassword(e.target.value)} />
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </div>

                <div className="bottom-signup">
                    <p>Already have an account?</p>
                    <NavLink to="/login" style={{ margin: "auto" }}>Sign-in</NavLink>
                </div>

                <div className="button-submit">
                    <Buttons title="Sign Up" onClick={handleSignup} />
                </div>
            </div>
        </div>
    );
}
