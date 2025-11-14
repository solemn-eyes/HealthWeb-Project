import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
    const { registerUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser(formData.username, formData.email, formData.password);
            alert("Registration successful! You can now log in.");
        } catch (error) {
            alert("Registration failed! Please try again.");
        }
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
                    <input 
                        type="text"
                        placeholder="Username"
                        value={formData.username}
                        className="border p-2 mb-3 w-full rounded"
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        className="border p-2 mb-3 w-full rounded"
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <input 
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        className="border p-2 mb-4 w-full rounded"
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                    <button 
                        type="submit"
                        className="bg-blue-600 text-white p-2 w-full rounded hover:bg-blue-700 transition"
                    >
                        Register
                    </button>

            </form>
        </div>
    );
};

export default Register;