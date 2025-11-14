import { createContext, useState, useEffect } from "react";
import { decodeJWT } from "../utils/jwtDecoder";
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
        try {
            const response = await apiClient.post("/auth/token/", {
                username: email,
                password,
            });

            if (response.status === 200) {
                setAuthTokens(response.data);
                localStorage.setItem("authTokens", JSON.stringify(response.data));
                setUser({ email });
                return true;
            }
            return false;
        } catch (err) {
            // axios will throw for non-2xx responses — return false so callers can handle it
            console.error('loginUser error', err?.response || err.message || err);
            return false;
        }
    };

    const registerUser = async (username, email, password) => {
        try {
            const response = await apiClient.post("/auth/register/", {
                username,
                email,
                password,
            });
            return { success: true, data: response.data };
        } catch (err) {
            // Log full error details for debugging
            console.error('registerUser error:', {
                message: err?.message,
                response: err?.response?.data,
                status: err?.response?.status,
                fullError: err
            });
            
            // Extract error message from various possible formats
            let errorMessage = 'Registration failed. Please try again.';
            
            if (err?.response?.data) {
                const errorData = err.response.data;
                
                // Handle Django REST Framework error formats
                if (typeof errorData === 'string') {
                    errorMessage = errorData;
                } else if (errorData.detail) {
                    errorMessage = errorData.detail;
                } else if (errorData.message) {
                    errorMessage = errorData.message;
                } else if (errorData.error) {
                    errorMessage = errorData.error;
                } else if (Array.isArray(errorData)) {
                    // Handle array of errors
                    errorMessage = errorData.join(', ');
                } else if (typeof errorData === 'object') {
                    // Handle field-specific errors (e.g., {username: ["error"], email: ["error"]})
                    const fieldErrors = Object.entries(errorData)
                        .map(([field, messages]) => {
                            const msg = Array.isArray(messages) ? messages.join(', ') : messages;
                            return `${field}: ${msg}`;
                        })
                        .join('; ');
                    errorMessage = fieldErrors || errorMessage;
                }
            } else if (err?.message) {
                errorMessage = err.message;
            }
            
            return { success: false, error: errorMessage };
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
    };

    useEffect(() => {
        if (authTokens) {
            apiClient.attachAuth(authTokens.access);

            const decoded = decodeJWT(authTokens.access);
            setUser({
                email: decoded?.email,
                username: decoded?.username,
                id: decoded?.user_id,
            });
        } else {
            apiClient.attachAuth(null);
            setUser(null);
        }
    }, [authTokens]);

    const contextData = { user, authTokens, loginUser, logoutUser, registerUser};

    return (
        <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
    );
};