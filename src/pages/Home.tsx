import { useEffect, useState } from "react";
import { db } from "../Services/firebase";
import {
    collection,
    getDocs,
    doc,
    updateDoc,
    increment,
    arrayUnion,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBar from "./NavBar";

interface Poll {
    id: string;
    name: string;
    options: string[];
    votes: Record<string, number>;
    voters?: string[];
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
                    voters: data.voters || [],
                };
            });
            setPolls(pollData);
        } catch (error) {
            console.error("Error fetching polls:", error);
        }
    };

    const handleVote = async (pollId: string, option: string) => {
        if (!userId) {
            alert("Please log in to vote.");
            return;
        }

        const poll = polls.find((p) => p.id === pollId);
        if (poll?.voters?.includes(userId)) {
            alert("You have already voted for this poll.");
            return;
        }

        try {
            const pollRef = doc(db, "polls", pollId);
            await updateDoc(pollRef, {
                [`votes.${option}`]: increment(1),
                voters: arrayUnion(userId),
            });

            alert("Thank you for voting!");

            setPolls(prevPolls => {
                return prevPolls.map(poll => {
                    if (poll.id !== pollId) return poll;

                    const updatedVotes = { ...poll.votes };
                    updatedVotes[option] = (updatedVotes[option] || 0) + 1;

                    const updatedVoters = [...(poll.voters || []), userId];

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
                <h2 className="poll-header"> Polls List</h2>
                {polls.map((poll) => (
                    <div key={poll.id} className="poll-card">
                        <h3>{poll.name}</h3>
                        {poll.options.map((option) => (
                            <button
                                key={option}
                                onClick={() => handleVote(poll.id, option)}
                                disabled={poll.voters?.includes(userId ?? "")}
                                className="vote-button"
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
}
