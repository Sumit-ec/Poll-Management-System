// import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import Home from '../pages/Home';
import DashBoard from '../pages/DashBoard';


export default function RoutePath() {
    return (
        <>
            <Routes >
                <Route path='/login' element={<Login />} />
                <Route path='/' element={<SignUp />} />
                <Route path='/home' element={<Home />} />
                <Route path='/dashboard' element={<DashBoard />} />
            </Routes>
        </>
    );
}
