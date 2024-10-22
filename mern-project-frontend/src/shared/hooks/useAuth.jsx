import React, {useEffect, useState} from "react";

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState('');
    const [expirationTime, setExpirationTime] = useState(null)

    const login = (userData) => {
        setToken(userData?.token);
        setUserId(userData?.id);
        const tokenExpirationTime = (userData?.tokenExpirationTime && new Date(userData?.tokenExpirationTime)) || new Date(new Date().getTime() + 1000*60) // We have set token expiration time to 1 hour in the backend
        setExpirationTime(tokenExpirationTime);
        localStorage?.setItem('userData', JSON.stringify({userId: userData?.id, token: userData?.token, tokenExpirationTime: tokenExpirationTime?.toISOString()}));
    }

    const logout = () => {
        setToken(null);
        setUserId(null);
        setExpirationTime(null)
        localStorage.removeItem('userData');
    }

    useEffect(() => {
        const storedUserData = JSON.parse(localStorage?.getItem('userData'));
        if (storedUserData && storedUserData?.token && new Date(storedUserData?.expirationTime) > new Date()) {
            login(storedUserData)
        }
    }, []);

    // Logout After one hour 

    useEffect(() => {
        if(token && expirationTime) {
            const remainingTime = expirationTime - new Date().getTime()
            logoutTimer = setTimeout(logout, remainingTime)
        } else {
            clearTimeout(logoutTimer);
        }
    }, [token, expirationTime]);

    return [token, login, logout, userId]
}