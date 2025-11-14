import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await loginUser(formData.email, formData.password);
    if (success) navigate("/dashboard");
    else alert("Invalid credentials.");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-8 w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
          Patient Login
        </h2>
        <input
          type="text"
          placeholder="Username"
          className="border p-2 mb-3 w-full rounded"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 mb-3 w-full rounded"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded w-full"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
