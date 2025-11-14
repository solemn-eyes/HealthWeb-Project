import { createContext, useState, useEffect } from "react";
import apiClient from "../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem("authTokens")
            ? JSON.parse(localStorage.getItem("authTokens"))
            : null
    );

    const loginUser = async (email, password) => {
        const response = await apiClient.post("/auth/token/", {
            username: email,
            password,
        });

        if (response.status === 200) {
            setAuthTokens(response.data);
            localStorage.setItem("authTokens", JSON.stringify(response.data));
            setUser({ email});
            return true;
        }
        return false;
    };

    const registerUser = async (username, email, password) => {
        const response = await apiClient.post("/auth/register/", {
            username,
            email,
            password,
        });
        return response;
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
    };

    const contextData = { user, authTokens, loginUser, logoutUser, registerUser};

    return (
        <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
    );
};