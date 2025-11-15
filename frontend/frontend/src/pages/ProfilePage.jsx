import React, { useState, useEffect } from "react";
import { getProfile, updateProfile } from "../services/patientApi";

export default function ProfilePage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    gender: "",
    date_of_birth: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProfile();
        setForm({
          username: data.username || "",
          email: data.email || "",
          phone: data.phone || "",
          gender: data.gender || "",
          date_of_birth: data.date_of_birth || "",
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
        setMessage("Failed to load profile. Please try again.");
        setMessageType("error");
      }
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await updateProfile(form);
      setMessage("Profile updated successfully!");
      setMessageType("success");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setMessage("Failed to update profile. Please try again.");
      setMessageType("error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-xl font-semibold mb-4">Update Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="w-full p-2 border rounded"
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full p-2 border rounded"
        />

        <select
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <input
          type="date"
          value={form.date_of_birth}
          onChange={(e) =>
            setForm({ ...form, date_of_birth: e.target.value })
          }
          className="w-full p-2 border rounded"
        />

        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Save Changes
        </button>

        {message && (
          <div className={messageType === "success" ? "text-green-600" : "text-red-600"}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
