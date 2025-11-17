import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [original, setOriginal] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

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
        // keep a copy to compute changed fields later
        setOriginal({
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
    setFieldErrors({});

    // Client-side validation
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.email && !emailRegex.test(form.email)) errors.email = 'Enter a valid email address.';
    if (form.date_of_birth && isNaN(new Date(form.date_of_birth).getTime())) errors.date_of_birth = 'Enter a valid date.';
    if (form.username && (form.username.length < 3 || form.username.length > 30)) errors.username = 'Username must be 3-30 characters.';
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      setMessage('Please fix the highlighted fields.');
      setMessageType('error');
      return;
    }

    try {
      // Build a payload containing only changed fields
      const payload = {};
      if (original) {
        ['username','email','phone','gender','date_of_birth'].forEach((k) => {
          const newVal = form[k] === "" ? null : form[k];
          const origVal = original[k] === "" ? null : original[k];
          if (newVal !== origVal) payload[k] = newVal;
        });
      } else {
        // fallback: send all (cleaned)
        payload.username = form.username || null;
        payload.email = form.email || null;
        payload.phone = form.phone || null;
        payload.gender = form.gender || null;
        payload.date_of_birth = form.date_of_birth && form.date_of_birth.length ? form.date_of_birth : null;
      }

      if (Object.keys(payload).length === 0) {
        setMessage('No changes to save.');
        setMessageType('info');
        return;
      }

      await updateProfile(payload);
      setMessage("Profile updated successfully!");
      setMessageType("success");
      // redirect to dashboard after a short delay so the user sees the success message
      setTimeout(() => navigate('/dashboard'), 800);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);
      // Prefer field-level errors from the API, then a detail message, otherwise generic
      const respData = err?.response?.data;
      let detail = "Failed to update profile. Please try again.";
      const newFieldErrors = {};
      if (respData) {
        if (typeof respData === 'string') detail = respData;
        else if (respData.detail) detail = respData.detail;
        else if (respData.error) detail = respData.error;
        else {
          // If it's a dict of field errors, map them
          Object.entries(respData).forEach(([k, v]) => {
            newFieldErrors[k] = Array.isArray(v) ? v.join(', ') : String(v);
          });
          const fieldErrorsText = Object.values(newFieldErrors).join(' | ');
          if (fieldErrorsText) detail = fieldErrorsText;
        }
      } else if (err?.message) detail = err.message;
      setFieldErrors(newFieldErrors);
      setMessage(detail);
      setMessageType("error");
    }
  };

  const MAX_FILE_BYTES = 2 * 1024 * 1024; // 2MB

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_FILE_BYTES) {
      setMessage("File too large. Please upload an image under 2MB.");
      setMessageType("error");
      return;
    }

    setMessage("");
    try {
      await uploadProfilePicture(file);
      const data = await getProfile();
      setForm((prev) => ({
        ...prev,
        profile_picture: data.profile_picture || prev.profile_picture,
      }));
      setMessage("Profile picture updated successfully!");
      setMessageType("success");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Failed to upload profile picture:", err);
      const detail =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to upload profile picture. Please try again.";
      setMessage(detail);
      setMessageType("error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow p-8 space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Profile Settings</h2>
          <p className="text-gray-500 mt-1">
            Update your personal details and keep your profile up to date.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-3"
        >
          <img
            src={form.profile_picture ? form.profile_picture : "/images/default-avatar.png"}
            className="w-28 h-28 object-cover rounded-full shadow"
            alt="Profile"
          />

          <label className="cursor-pointer bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700">
            Change Photo
            <input type="file" className="hidden" onChange={handleProfilePictureUpload} />
          </label>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {fieldErrors.username && (
              <div className="text-red-600 text-sm mt-1">{fieldErrors.username}</div>
            )}

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {fieldErrors.email && (
              <div className="text-red-600 text-sm mt-1">{fieldErrors.email}</div>
            )}

            <input
              type="text"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {fieldErrors.phone && (
              <div className="text-red-600 text-sm mt-1">{fieldErrors.phone}</div>
            )}

            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {fieldErrors.date_of_birth && (
              <div className="text-red-600 text-sm mt-1">{fieldErrors.date_of_birth}</div>
            )}
          </div>

          <button className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition">
            Save Changes
          </button>

          {message && (
            <div
              className={`text-center font-medium ${
                messageType === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
