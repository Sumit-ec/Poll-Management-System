import React, { useState, type JSX } from "react";
import NavBar from "./NavBar";
import { db } from "../Services/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

interface Poll {
    name: string;
    options: string[];
    createdAt: Timestamp;
}

export default function CreatePoll(): JSX.Element {
    const [pollName, setPollName] = useState<string>("");
    const [options, setOptions] = useState<string[]>(["", ""]);

    const handleAddOption = (): void => {
        setOptions([...options, ""]);
    };

    const handleRemoveOption = (): void => {
        if (options.length > 2) {
            setOptions(options.slice(0, -1));
        }
    };

    const handleOptionChange = (index: number, value: string): void => {
        const updatedOptions = [...options];
        updatedOptions[index] = value;
        setOptions(updatedOptions);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        const validOptions = options.filter((opt) => opt.trim() !== "");
        if (pollName.trim() === "" || validOptions.length < 2) {
            alert("Poll name and at least 2 valid options are required.");
            return;
        }

        const newPoll: Poll = {
            name: pollName,
            options: validOptions,
            createdAt: Timestamp.now(),
        };

        try {
            await addDoc(collection(db, "polls"), newPoll);
            alert("Poll created successfully!");
            setPollName("");
            setOptions(["", ""]);
        } catch (error) {
            console.error("Error creating poll:", error);
            alert("Error creating poll. Please try again.");
        }
    };

    return (
        <div>
            <NavBar />
            <div className="container-poll">
                <h2 className="poll-title">Create New Poll</h2>
                <form onSubmit={handleSubmit} className="poll-form">
                    <label htmlFor="poll-name">Poll Name</label>
                    <input
                        id="poll-name"
                        type="text"
                        value={pollName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setPollName(e.target.value)
                        }
                        placeholder="Enter poll name"
                        required
                    />

                    <label>Poll Options</label>
                    {options.map((option, index) => (
                        <input
                            key={index}
                            type="text"
                            value={option}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleOptionChange(index, e.target.value)
                            }
                            placeholder={`Option ${index + 1}`}
                            required
                        />
                    ))}

                    <div className="button-group">
                        <button
                            type="button"
                            className="add-option-btn"
                            onClick={handleAddOption}
                        >
                            Add Option
                        </button>

                        <button
                            type="button"
                            className="remove-option-btn"
                            onClick={handleRemoveOption}
                        >
                            Remove Option
                        </button>
                    </div>

                    <button type="submit" className="submit-btn">
                        Create Poll
                    </button>
                </form>
            </div>
        </div>
    );
}
