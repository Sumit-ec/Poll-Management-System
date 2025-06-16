import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../Services/firebase";
import { Box, Typography, LinearProgress, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

interface Poll {
    id: string;
    name: string;
    options: string[];
    votes: Record<string, number>;
}

function LinearProgressWithLabel({ value }: { value: number }) {
    return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: "100%", mr: 1 }}>
                <LinearProgress variant="determinate" value={value} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">
                    {`${Math.round(value)}%`}
                </Typography>
            </Box>
        </Box>
    );
}

export default function DashBoard() {
    const [polls, setPolls] = useState<Poll[]>([]);
    const navigate = useNavigate();

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
                };
            });
            setPolls(pollData);
        } catch (error) {
            console.error("Error fetching polls:", error);
        }
    };

    useEffect(() => {
        fetchPolls();
    }, []);

    const handleDelete = async (pollId: string) => {
        if (window.confirm("Are you sure you want to delete this poll?")) {
            try {
                await deleteDoc(doc(db, "polls", pollId));
                fetchPolls();
            } catch (error) {
                console.error("Error deleting poll:", error);
            }
        }
    };

    const handleEdit = (poll: Poll) => {
        navigate(`/admin-dashboard/edit-poll/${poll.id}`, { state: poll });
    };

    return (
        <>
            <NavBar />
            <div className="dashboard-container">
                <Typography variant="h4" gutterBottom className="dashboard-header">
                    Poll Status
                </Typography>
                {polls.map((poll) => {
                    const totalVotes =
                        Object.values(poll.votes).reduce((acc, val) => acc + val, 0) || 1;

                    return (
                        <div key={poll.id} className="poll-card">
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="h6" className="poll-title">
                                    {poll.name}
                                </Typography>
                                <div>
                                    <IconButton onClick={() => handleEdit(poll)} title="Edit">
                                        <EditIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(poll.id)} title="Delete">
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </div>
                            </div>

                            {poll.options.map((option) => {
                                const votes = poll.votes?.[option] || 0;
                                const percent = (votes / totalVotes) * 100;

                                return (
                                    <Box key={option} sx={{ mb: 2 }}>
                                        <Typography variant="body1" className="option-label">
                                            {option} ({votes} votes)
                                        </Typography>
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
