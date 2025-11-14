import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
    const { registerUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({
        username: "",
        email: "",
        password: "",
    });

    // Real-time validation
    const validateUsername = (username) => {
        if (!username) return "";
        if (username.length < 3) return "Username must be at least 3 characters.";
        if (username.length > 30) return "Username must be no more than 30 characters.";
        if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
            return "Username can only contain letters, numbers, underscores, hyphens, and dots.";
        }
        if (/^[._-]/.test(username)) {
            return "Username cannot start with a dot, underscore, or hyphen.";
        }
        if (/[._-]$/.test(username)) {
            return "Username cannot end with a dot, underscore, or hyphen.";
        }
        return "";
    };

    const validateEmail = (email) => {
        if (!email) return "";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return "Please enter a valid email address.";
        }
        return "";
    };

    const validatePassword = (password) => {
        if (!password) return "";
        if (password.length < 8) {
            return "Password must be at least 8 characters long.";
        }
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        // Validate all fields before submission
        const usernameError = validateUsername(formData.username);
        const emailError = validateEmail(formData.email);
        const passwordError = validatePassword(formData.password);
        
        setValidationErrors({
            username: usernameError,
            email: emailError,
            password: passwordError,
        });
        
        // Check if there are any validation errors
        if (usernameError || emailError || passwordError) {
            setError("Please fix the validation errors before submitting.");
            return;
        }
        
        // Check if fields are empty
        if (!formData.username || !formData.email || !formData.password) {
            setError("All fields are required.");
            return;
        }
        
        setIsLoading(true);
        
        try {
            const result = await registerUser(formData.username, formData.email, formData.password);
            
            if (result.success) {
                alert("Registration successful! You can now log in.");
                navigate("/");
            } else {
                setError(result.error || "Registration failed! Please try again.");
            }
        } catch (error) {
            setError("Registration failed! Please try again.");
            console.error("Registration error:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Check if form is valid
    const isFormValid = () => {
        return (
            formData.username &&
            formData.email &&
            formData.password &&
            !validationErrors.username &&
            !validationErrors.email &&
            !validationErrors.password
        );
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-50">
            <form 
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded-xl p-8 w-96"
                >
                    <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
                        Create Account
                    </h2>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}
                    <div className="mb-3">
                        <input 
                            type="text"
                            placeholder="Username"
                            value={formData.username}
                            className={`border p-2 w-full rounded ${
                                validationErrors.username ? 'border-red-500' : 'border-gray-300'
                            }`}
                            onChange={(e) => {
                                const username = e.target.value;
                                setFormData({ ...formData, username });
                                setValidationErrors({
                                    ...validationErrors,
                                    username: validateUsername(username)
                                });
                            }}
                            required
                        />
                        {validationErrors.username && (
                            <p className="text-red-500 text-xs mt-1">{validationErrors.username}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            3-30 characters. Letters, numbers, underscores, hyphens, and dots only.
                        </p>
                    </div>
                    <div className="mb-3">
                        <input
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            className={`border p-2 w-full rounded ${
                                validationErrors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                            onChange={(e) => {
                                const email = e.target.value;
                                setFormData({ ...formData, email });
                                setValidationErrors({
                                    ...validationErrors,
                                    email: validateEmail(email)
                                });
                            }}
                            required
                        />
                        {validationErrors.email && (
                            <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <input 
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            className={`border p-2 w-full rounded ${
                                validationErrors.password ? 'border-red-500' : 'border-gray-300'
                            }`}
                            onChange={(e) => {
                                const password = e.target.value;
                                setFormData({ ...formData, password });
                                setValidationErrors({
                                    ...validationErrors,
                                    password: validatePassword(password)
                                });
                            }}
                            required
                        />
                        {validationErrors.password && (
                            <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            Must be at least 8 characters long.
                        </p>
                    </div>
                    <button 
                        type="submit"
                        disabled={isLoading || !isFormValid()}
                        className="bg-blue-600 text-white p-2 w-full rounded hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Registering..." : "Register"}
                    </button>
                    <p className="text-center mt-4 text-sm text-gray-600">
                        Already have an account?{" "}
                        <a href="/" className="text-blue-600 hover:underline">
                            Log in
                        </a>
                    </p>

            </form>
        </div>
    );
};

export default Register;