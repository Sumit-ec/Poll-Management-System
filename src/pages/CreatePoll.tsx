import React, { useState, useEffect, type JSX } from "react";
import NavBar from "./NavBar";
import { db } from "../Services/firebase";
import { collection, addDoc, Timestamp, updateDoc, doc } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";

interface Poll {
    id?: string;
    name: string;
    options: string[];
    createdAt?: Timestamp;
}

export default function CreatePoll(): JSX.Element {
    const navigate = useNavigate();
    const location = useLocation();

    const editingPoll = location.state as Poll | null;

    const [pollName, setPollName] = useState<string>("");
    const [options, setOptions] = useState<string[]>(["", ""]);

    useEffect(() => {
        if (editingPoll) {
            setPollName(editingPoll.name);
            setOptions(editingPoll.options);
        }
    }, [editingPoll]);

    const handleAddOption = () => setOptions([...options, ""]);
    const handleRemoveOption = () => {
        if (options.length > 2) {
            setOptions(options.slice(0, -1));
        }
    };

    const handleOptionChange = (index: number, value: string) => {
        const updatedOptions = [...options];
        updatedOptions[index] = value;
        setOptions(updatedOptions);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validOptions = options.filter((opt) => opt.trim() !== "");

        if (pollName.trim() === "" || validOptions.length < 2) {
            alert("Poll name and at least 2 valid options are required.");
            return;
        }

        if (editingPoll?.id) {
            const pollRef = doc(db, "polls", editingPoll.id);
            await updateDoc(pollRef, {
                name: pollName,
                options: validOptions,
            });
            alert("Poll updated successfully!");
        } else {
            const newPoll: Poll = {
                name: pollName,
                options: validOptions,
                createdAt: Timestamp.now(),
            };
            await addDoc(collection(db, "polls"), newPoll);
            alert("Poll created successfully!");
        }

        navigate("/admin-dashboard");
    };

    return (
        <div>
            <NavBar />
            <div className="container-poll">
                <h2 className="poll-title">{editingPoll ? "Edit Poll" : "Create New Poll"}</h2>
                <form onSubmit={handleSubmit} className="poll-form">
                    <label htmlFor="poll-name">Poll Name</label>
                    <input
                        id="poll-name"
                        type="text"
                        value={pollName}
                        onChange={(e) => setPollName(e.target.value)}
                        placeholder="Enter poll name"
                        required
                    />

                    <label>Poll Options</label>
                    {options.map((option, index) => (
                        <input
                            key={index}
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                            required
                        />
                    ))}

                    <div className="button-group">
                        <button
                            type="button"
                            onClick={handleAddOption}
                            className="add-option-btn"
                        >
                            Add Option
                        </button>
                        <button
                            type="button"
                            onClick={handleRemoveOption}
                            className="remove-option-btn"
                        >
                            Remove Option
                        </button>
                    </div>

                    <button type="submit" className="submit-btn">
                        {editingPoll ? "Update Poll" : "Create Poll"}
                    </button>
                </form>
            </div>
        </div>
    );
}
