import { useEffect, useState } from "react";
import { db } from "../Services/firebase";
import {
    collection,
    getDocs,
    doc,
    updateDoc,
    increment,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBar from "./NavBar";

interface Poll {
    id: string;
    name: string;
    options: string[];
    votes: Record<string, number>;
    voters?: Record<string, string>;
}

export default function Home() {
    const [polls, setPolls] = useState<Poll[]>([]);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                fetchPolls();
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchPolls = async () => {
        try {
            const snapshot = await getDocs(collection(db, "polls"));
            const pollData: Poll[] = snapshot.docs.map((docSnap) => {
                const data = docSnap.data();
                return {
                    id: docSnap.id,
                    name: data.name,
                    options: data.options,
                    votes: data.votes || {},
                    voters: data.voters || {},
                };
            });
            setPolls(pollData);
        } catch (error) {
            console.error("Error fetching polls:", error);
        }
    };

    const handleVote = async (pollId: string, selectedOption: string) => {
        if (!userId) {
            alert("Please log in to vote.");
            return;
        }

        const poll = polls.find((p) => p.id === pollId);
        if (!poll) return;

        const previousVote = poll.voters?.[userId];

        if (previousVote === selectedOption) {
            alert("You already voted for this option.");
            return;
        }

        const pollRef = doc(db, "polls", pollId);

        const updates: any = {
            [`voters.${userId}`]: selectedOption,
        };

        if (previousVote) {
            updates[`votes.${previousVote}`] = increment(-1);
        }
        updates[`votes.${selectedOption}`] = increment(1);

        try {
            await updateDoc(pollRef, updates);

            setPolls(prevPolls => {
                return prevPolls.map(poll => {
                    if (poll.id !== pollId) return poll;

                    const updatedVotes = { ...poll.votes };
                    if (previousVote) {
                        updatedVotes[previousVote] = (updatedVotes[previousVote] || 1) - 1;
                    }
                    updatedVotes[selectedOption] = (updatedVotes[selectedOption] || 0) + 1;

                    const updatedVoters = {
                        ...poll.voters,
                        [userId]: selectedOption,
                    };

                    return {
                        ...poll,
                        votes: updatedVotes,
                        voters: updatedVoters,
                    };
                });
            });
        } catch (error) {
            console.error("Error submitting vote:", error);
            alert("Something went wrong.");
        }
    };

    return (
        <>
            <NavBar />
            <div className="home-container">
                <h2 className="poll-header">Polls List</h2>
                {polls.map((poll) => (
                    <div key={poll.id} className="poll-card">
                        <h3>{poll.name}</h3>
                        {poll.options.map((option) => (
                            <button
                                key={option}
                                onClick={() => handleVote(poll.id, option)}
                                className={`vote-button ${poll.voters?.[userId ?? ""] === option ? "selected-option" : ""
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                        {poll.voters?.[userId ?? ""] && (
                            <p className="voted-info">
                                You voted for:{" "}
                                <strong>{poll.voters[userId ?? ""]}</strong>
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}
