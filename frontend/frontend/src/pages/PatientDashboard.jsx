import React, { useEffect, useState } from "react";
import { Calendar, FileText, Heart, User } from "lucide-react";
import { getProfile, getAppointments } from "../services/patientApi";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition">
    <div className="flex items-center space-x-4">
      <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded">
        {icon}
      </div>
      <div>
        <h4 className="text-sm text-gray-500">{title}</h4>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  </div>
);


export default function PatientDashboard() {
  const { authTokens } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const p = await getProfile();
        setProfile(p);
        const a = await getAppointments();
        setAppointments(a);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [authTokens]);

  const nextAppt = appointments.length ? `${appointments[0].date} ${appointments[0].time}` : "No upcoming";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Hello, {profile?.username ?? "Patient"}</h1>
          <p className="text-sm text-gray-500">Welcome back — here's your health overview.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-sm text-gray-500">Account</div>
            <div className="font-medium">{profile?.email}</div>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white">
            <User size={20} />
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard title="Next Appointment" value={nextAppt} icon={<Calendar />} />
        <StatCard title="Last Visit" value="3 months ago" icon={<Heart />} />
        <StatCard title="Records" value="View records" icon={<FileText />} />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/dashboard/appointments" className="p-4 bg-white rounded-lg shadow hover:bg-blue-50 transition">
          <h3 className="font-semibold mb-2">Appointments</h3>
          <p className="text-sm text-gray-500">Book, view or cancel appointments</p>
        </Link>

        <Link to="/dashboard/records" className="p-4 bg-white rounded-lg shadow hover:bg-blue-50 transition">
          <h3 className="font-semibold mb-2">Medical Records</h3>
          <p className="text-sm text-gray-500">View your records and downloads</p>
        </Link>

        <Link to="/dashboard/prescriptions" className="p-4 bg-white rounded-lg shadow hover:bg-blue-50 transition">
          <h3 className="font-semibold mb-2">Prescriptions</h3>
          <p className="text-sm text-gray-500">Active & past prescriptions</p>
        </Link>
      </section>
    </div>
  );
}
