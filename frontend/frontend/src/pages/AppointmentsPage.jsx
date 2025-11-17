import { useCallback, useEffect, useRef, useState } from "react";
import { getAppointments, createAppointment, cancelAppointment } from "../services/patientApi";
import { motion } from "framer-motion";
import { Calendar, Clock, XCircle, Plus, ChevronDown } from "lucide-react";

const getErrorMessage = (err, fallback) =>
  err?.response?.data?.detail ||
  err?.response?.data?.error ||
  err?.message ||
  fallback;

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [form, setForm] = useState({
    doctor_name: "",
    department: "",
    date: "",
    time: "",
    reason: "",
  });
  const reminderRef = useRef(new Set());

  const setStatusMessage = useCallback((type, text) => {
    setStatus({ type, text });
  }, []);

  const loadAppointments = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAppointments();
      setAppointments(data);
    } catch (err) {
      console.error("Failed to load appointments:", err);
      setStatusMessage("error", getErrorMessage(err, "Failed to load appointments."));
    } finally {
      setIsLoading(false);
    }
  }, [setStatusMessage]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const resetForm = () =>
    setForm({
      doctor_name: "",
      department: "",
      date: "",
      time: "",
      reason: "",
    });

  const handleCreate = async () => {
    if (!form.doctor_name || !form.department || !form.date || !form.time) return;
    try {
      setIsSaving(true);
      await createAppointment(form);
      await loadAppointments();
      setStatusMessage("success", "Appointment saved successfully.");
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error("Failed to create appointment:", err);
      setStatusMessage("error", getErrorMessage(err, "Could not save appointment."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      // confirm cancel
      const confirmCancel = window.confirm("Are you sure you want to cancel this appointment?");
      if (!confirmCancel) return;

      await cancelAppointment(id);
      // Optimistically update UI: mark the appointment cancelled
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a)));
      setStatusMessage("success", "Appointment cancelled.");
    } catch (err) {
      console.error("Failed to cancel appointment:", err);
      setStatusMessage("error", getErrorMessage(err, "Could not cancel appointment."));
    }
  };

  useEffect(() => {
    if (!appointments.length) return;

    const ensureExistingIds = () => {
      const currentIds = new Set(appointments.map((appt) => appt.id));
      reminderRef.current.forEach((id) => {
        if (!currentIds.has(id)) {
          reminderRef.current.delete(id);
        }
      });
    };

    const notifyDueAppointments = () => {
      ensureExistingIds();
      const now = new Date();
      appointments.forEach((appt) => {
        if (!appt?.date || !appt?.time || appt?.status === "cancelled") return;
        const target = new Date(`${appt.date}T${appt.time}`);
        if (Number.isNaN(target.getTime())) return;
        if (target <= now && !reminderRef.current.has(appt.id)) {
          reminderRef.current.add(appt.id);
          alert(
            `Reminder: Appointment with ${
              appt.doctor_name || "your provider"
            } is scheduled for now.`
          );
        }
      });
    };

    notifyDueAppointments();
    const interval = setInterval(notifyDueAppointments, 60000);
    return () => clearInterval(interval);
  }, [appointments]);

  useEffect(() => {
    if (!status.text) return;
    const timer = setTimeout(() => setStatus({ type: "", text: "" }), 4000);
    return () => clearTimeout(timer);
  }, [status]);

  return (
    <div className="space-y-6">

      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold">Appointments</h2>

        <button
          onClick={() => setShowForm(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus /> New Appointment
        </button>
      </div>

      {status.text && (
        <div
          className={`p-3 rounded-lg text-sm ${
            status.type === "error"
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-700"
          }`}
        >
          {status.text}
        </div>
      )}

      {/* APPOINTMENTS LIST */}
      {isLoading && (
        <div className="bg-white border rounded-xl p-4 shadow animate-pulse">
          Loading appointments...
        </div>
      )}

      {!isLoading && appointments.length === 0 && (
        <div className="bg-white border rounded-xl p-6 text-gray-500 text-center">
          No appointments yet. Click “New Appointment” to get started.
        </div>
      )}

      {appointments.map((appt, index) => (
        <motion.div
          key={appt.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white shadow p-4 rounded-xl border cursor-pointer"
          onClick={() => setOpenId(openId === appt.id ? null : appt.id)}
        >
          <div className={`flex justify-between ${appt.status === 'cancelled' ? 'opacity-70' : ''}`}>
            <div>
              <p className={`font-semibold ${appt.status === 'cancelled' ? 'line-through' : ''}`}>{appt.doctor_name}</p>
              <p className="text-gray-500 flex items-center gap-1">
                <Calendar className="w-4" /> {appt.date}
              </p>
            </div>

              <div className="flex items-center gap-3">
              <ChevronDown
                className={`transition ${openId === appt.id ? "rotate-180" : ""}`}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                    if (appt.status !== 'cancelled') handleCancel(appt.id);
                }}
                className={`text-red-600 hover:text-red-700 ${appt.status === 'cancelled' ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Cancel appointment"
                aria-disabled={appt.status === 'cancelled'}
              >
                <XCircle className="w-6" />
              </button>
            </div>
          </div>

          {openId === appt.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 text-gray-600 space-y-2"
            >
              <p className="flex items-center gap-2">
                <Clock className="w-4" /> {appt.time}
              </p>
              <p>Department: {appt.department}</p>
              <p>Reason: {appt.reason}</p>
              <p>
                Status:{" "}
                <span className={`font-semibold ${appt.status === 'cancelled' ? 'text-red-600' : 'text-blue-600'}`}>
                  {appt.status === 'cancelled' ? 'Cancelled' : appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                </span>
              </p>
            </motion.div>
          )}
        </motion.div>
      ))}

      {/* ADD APPOINTMENT MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-xl w-96 space-y-4 shadow-xl"
          >
            <h3 className="text-xl font-semibold">New Appointment</h3>

            <input
              type="text"
              placeholder="Doctor name"
              className="border p-2 rounded w-full"
              value={form.doctor_name}
              onChange={(e) => setForm({ ...form, doctor_name: e.target.value })}
            />

            <input
              type="text"
              placeholder="Department"
              className="border p-2 rounded w-full"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            />

            <input
              type="date"
              className="border p-2 rounded w-full"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />

            <input
              type="time"
              className="border p-2 rounded w-full"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
            />

            <input
              type="text"
              placeholder="Reason for appointment"
              className="border p-2 rounded w-full"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-3 py-1 bg-teal-600 text-white rounded disabled:opacity-60"
                disabled={!form.doctor_name || !form.department || !form.date || !form.time}
              >
                Save
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
