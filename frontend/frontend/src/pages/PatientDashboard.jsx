import { useEffect, useState } from "react";
import WelcomeBanner from "./WelcomeBanner";
import {
  getAppointments,
  getLastVisit,
  getRecordCount,
  getProfile
} from "../services/patientApi";
import { Calendar, ClipboardList, FileText } from "lucide-react";
import { motion } from "framer-motion";


export default function PatientDashboard() {
  const [user, setUser] = useState({});
  const [nextAppointment, setNextAppointment] = useState(null);
  const [lastVisit, setLastVisit] = useState(null);
  const [recordCount, setRecordCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const profile = await getProfile();
      const appts = await getAppointments();
      const last = await getLastVisit();
      const recs = await getRecordCount();

      setUser(profile);
      setRecordCount(recs);

      const futureAppts = appts.filter(a => new Date(a.date) >= new Date());
      setNextAppointment(futureAppts[0] || null);
      setLastVisit(last || null);
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <WelcomeBanner user={user} />

      {/* Stats */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.15
            }
          }
        }}
      >
        <DashboardCard
          color="from-teal-500 to-teal-600"
          icon={<Calendar />}
          title="Next Appointment"
          value={
            nextAppointment
              ? `${nextAppointment.date} • ${nextAppointment.time}`
              : "No upcoming appointments"
          }
        />

        <DashboardCard
          color="from-blue-500 to-blue-600"
          icon={<ClipboardList />}
          title="Last Visit"
          value={
            lastVisit
              ? `${lastVisit.date} • ${lastVisit.time}`
              : "No recent visits"
          }
        />

        <DashboardCard
          color="from-orange-500 to-orange-600"
          icon={<FileText />}
          title="Medical Records"
          value={`${recordCount} Record(s)`}
        />
      </motion.div>
    </div>
  );
}

function DashboardCard({ icon, title, value, color }) {
  return (
    <motion.div 
      className="bg-white p-5 rounded-xl shadow hover:shadow-md transition cursor-pointer"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br ${color} text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600 mt-1">{value}</p>
    </motion.div>
  );
}
