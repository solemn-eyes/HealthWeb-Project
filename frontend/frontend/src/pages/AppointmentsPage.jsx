import { useEffect, useState } from "react";
import { getAppointments } from "../services/patientApi";
import { motion } from "framer-motion";
import { Calendar, Clock, ChevronDown } from "lucide-react";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAppointments();
        setAppointments(data);
      } catch (err) {
        console.error("Failed to load appointments:", err);
      }
    };
    load();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Your Appointments</h2>

      {appointments.map((appt, index) => (
        <motion.div
          key={appt.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white p-4 shadow rounded-xl border cursor-pointer"
          onClick={() => setOpenId(openId === appt.id ? null : appt.id)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{appt.doctor_name}</p>
              <p className="text-gray-500 flex items-center gap-2">
                <Calendar className="w-4" /> {appt.date}
              </p>
            </div>

            <ChevronDown className={`transition ${openId === appt.id ? "rotate-180" : ""}`} />
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
              <p>Reason: {appt.reason}</p>
              <p>Status: <span className="font-semibold text-blue-600">{appt.status}</span></p>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
