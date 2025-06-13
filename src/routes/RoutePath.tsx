// // import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import Login from '../pages/Login';
// import SignUp from '../pages/SignUp';
// import Home from '../pages/Home';
// import DashBoard from '../pages/DashBoard';
// import CreatePoll from '../pages/CreatePoll';
// import Result from '../pages/Result';
// import ProtectRoute from './ProtectRoute';


// export default function RoutePath() {
//     return (
//         <>
//             <Routes >
//                 <Route path='/login' element={<Login />} />
//                 <Route path='/' element={<SignUp />} />
//                 <Route path='/home' element={ <Home /> } />
//                 <Route path='/admin-dashboard' element={ <DashBoard />} />
//                 <Route path='/admin-dashboard/create-poll' element={ <CreatePoll /> } />
//                 <Route path='/results' element={ <Result />} />
//             </Routes>
//         </>
//     );
// }


import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Home from "../pages/Home";
import DashBoard from "../pages/DashBoard";
import CreatePoll from "../pages/CreatePoll";
import Result from "../pages/Result";
import ProtectRoute from "./ProtectRoute";

export default function RoutePath() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<SignUp />} />

            {/* Protected Routes */}
            <Route
                path="/home"
                element={
                    <ProtectRoute>
                        <Home />
                    </ProtectRoute>
                }
            />
            <Route
                path="/admin-dashboard"
                element={
                    <ProtectRoute>
                        <DashBoard />
                    </ProtectRoute>
                }
            />
            <Route
                path="/admin-dashboard/create-poll"
                element={
                    <ProtectRoute>
                        <CreatePoll />
                    </ProtectRoute>
                }
            />
            <Route
                path="/results"
                element={
                    <ProtectRoute>
                        <Result />
                    </ProtectRoute>
                }
            />
        </Routes>
    );
}
