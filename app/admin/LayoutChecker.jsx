'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const LayoutChecker = (props) => {
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [token, settoken] = useState(false);
    const router = useRouter();
    console.log("token",token)
    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem("admin_token");
        if (!token) {
            settoken(null)
            setUserLoggedIn(false);
            // router.push("/admin/login");  // Redirect to login page if no token
        } else {
            settoken(token)
            setUserLoggedIn(true);
            // fetchCommittees();
        }
    }, []);
    if (token) {
        return <>{props?.children}</>
    } else {
        router.push("/adminLogin"); 
    }
}

export default LayoutChecker