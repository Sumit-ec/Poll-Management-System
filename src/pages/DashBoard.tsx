import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Services/firebase";
import AdminNavBar from "./NavBar";

interface User {
    id: string;
    name: string;
    email: string;
    role?: string;
}

export default function DashBoard() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userCollection = collection(db, "users");
                const usersInfo = await getDocs(userCollection);
                const usersData = usersInfo.docs
                    .map((doc) => {
                        const data = doc.data() as Omit<User, "id"> & { role?: string };
                        return {
                            id: doc.id,
                            ...data,
                        };
                    })
                    .filter((user) => user.role !== "admin") as User[];

                setUsers(usersData);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <AdminNavBar />
            <div className="table-container">
                <h2 className="table-title">All Guest Users</h2>
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user.id}>
                                <td>{index + 1}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
