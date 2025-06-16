import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Services/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBar from "./NavBar";

interface Poll {
    id: string;
    name: string;
    options: string[];
    votes: Record<string, number>;
    voters: string[];
}

export default function Result() {
    const [polls, setPolls] = useState<Poll[]>([]);

    useEffect(() => {
        const fetchResults = async () => {
            const auth = getAuth();
            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const pollSnap = await getDocs(collection(db, "polls"));
                    const allPolls: Poll[] = pollSnap.docs.map((doc) => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            name: data.name,
                            options: data.options,
                            votes: data.votes || {},
                            voters: data.voters || [],
                        };
                    });

                    const filteredPolls = allPolls.filter(
                        (poll) => Object.values(poll.votes).some((v) => v > 0)
                    );

                    setPolls(filteredPolls);
                }
            });

            return () => unsubscribe();
        };

        fetchResults();
    }, []);

    const getResult = (votes: Record<string, number>) => {
        const entries = Object.entries(votes);
        if (entries.length === 0) return { status: "No votes yet", isDraw: false };

        const maxVotes = Math.max(...entries.map(([, v]) => v));
        const topOptions = entries.filter(([, v]) => v === maxVotes);

        if (topOptions.length > 1) {
            return { status: "It's a Draw", isDraw: true };
        }

        return { status: topOptions[0][0], isDraw: false };
    };

    return (
        <div>
            <NavBar />
            <div className="timeline-container">
                <h2 className="timeline-heading">Poll Timeline Summary</h2>
                <div className="timeline">
                    {polls.map((poll) => {
                        const result = getResult(poll.votes);

                        return (
                            <div className="timeline-item" key={poll.id}>
                                <div className="timeline-content">
                                    <h3>{poll.name}</h3>
                                    <ul>
                                        {poll.options.map((opt, idx) => {
                                            const voteCount = poll.votes[opt] || 0;
                                            const isWinner = opt === result.status && !result.isDraw;

                                            return (
                                                <li key={idx}>
                                                    <span
                                                        style={{
                                                            fontWeight: isWinner ? "bold" : "normal",
                                                            color: isWinner ? "green" : "black",
                                                        }}
                                                    >
                                                        {isWinner ? `${opt} — ${voteCount} votes` : `${opt} — ${voteCount} vote${voteCount !== 1 ? "s" : ""}`}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                    <div className="highlight-winner">
                                        {result.isDraw ? <strong>It's a Draw</strong> : <>Winner: <strong>{result.status}</strong></>}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
