import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getProfile, updateProfile, uploadProfilePicture } from "../services/patientApi";

export default function ProfilePage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    gender: "",
    date_of_birth: "",
    profile_picture: "",
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
          profile_picture: data.profile_picture || "",
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

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setMessage("");
    try {
      const result = await uploadProfilePicture(file);
      // Reload profile to get updated picture URL
      const data = await getProfile();
      setForm(prev => ({
        ...prev,
        profile_picture: data.profile_picture || prev.profile_picture
      }));
      setMessage("Profile picture updated successfully!");
      setMessageType("success");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Failed to upload profile picture:", err);
      setMessage("Failed to upload profile picture. Please try again.");
      setMessageType("error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-xl font-semibold mb-4">Update Profile</h2>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-3 mb-6"
      >
  <img
    src={form.profile_picture ? form.profile_picture : "/images/default-avatar.png"}
    className="w-28 h-28 object-cover rounded-full shadow"
    alt="Profile"
  />

  <label className="cursor-pointer bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
    Change Photo
    <input type="file" className="hidden" onChange={handleProfilePictureUpload} />
  </label>
</motion.div>


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
