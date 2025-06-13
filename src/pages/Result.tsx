// import React from 'react'
import AdminNavBar from "./NavBar"
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../Services/firebase";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import NavBar from "./NavBar";

interface Poll {
    id: string;
    name: string;
    options: string[];
    votes: Record<string, number>;
    voters: string[];
}

function LinearProgressWithLabel({ value }: { value: number }) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <LinearProgress
                variant="determinate"
                value={value}
                sx={{ flexGrow: 1, height: 10, borderRadius: 5 }}
            />
            <Typography variant="body2">{`${Math.round(value)}%`}</Typography>
        </Box>
    );
}
export default function Result() {
    const [polls, setPolls] = useState<Poll[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserId(user.uid);

                // check role
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const role = userSnap.data().role;
                    setIsAdmin(role === "admin");
                }

                const snap = await getDocs(collection(db, "polls"));
                const allPolls: Poll[] = snap.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        name: data.name,
                        options: data.options,
                        votes: data.votes || {},
                        voters: data.voters || [],
                    };
                });

                // filter for guest user
                setPolls(isAdmin ? allPolls : allPolls.filter(p => p.voters.includes(user.uid)));
            }
        });

        return () => unsubscribe();
    }, [isAdmin]);
    return (
        <>
            <NavBar />
            <div className="result-container">
                <h2>Poll Results</h2>
                {polls.map((poll) => {
                    const totalVotes = Object.values(poll.votes).reduce((a, b) => a + b, 0) || 1;

                    return (
                        <div key={poll.id} className="poll-card">
                            <h3>{poll.name}</h3>
                            {poll.options.map((opt) => {
                                const count = poll.votes[opt] || 0;
                                const percent = (count / totalVotes) * 100;

                                return (
                                    <Box key={opt} sx={{ my: 1 }}>
                                        <Typography variant="subtitle1">{opt} - {count} vote(s)</Typography>
                                        <LinearProgressWithLabel value={percent} />
                                    </Box>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </>
    );
}
