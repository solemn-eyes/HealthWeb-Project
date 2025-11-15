import React, { useEffect, useState } from "react";
import { Calendar, FileText, Heart, User } from "lucide-react";
import { getProfile, getAppointments, getLastVisit, getRecordCount } from "../services/patientApi";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [nextAppointment, setNextAppointment] = useState(null);
  const [lastVisit, setLastVisit] = useState(null);
  const [recordCount, setRecordCount] = useState(0);


  useEffect(() => {
    const load = async () => {
      try {
        const p = await getProfile();
        setProfile(p);
        const appts = await getAppointments();
        setAppointments(appts);
        
        // Try to get last visit, but it's okay if it's null (no previous visits)
        try {
          const last = await getLastVisit();
          setLastVisit(last || null);
        } catch (err) {
          console.error("Error loading last visit:", err);
          setLastVisit(null);
        }
        
        const recs = await getRecordCount();
        setRecordCount(recs);

        const futureAppts = appts.filter(a => new Date(a.date) >= new Date());
        setNextAppointment(futureAppts[0] || null);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      }
    };
    load();
  }, [authTokens]);



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
        <div onClick={() => navigate("/dashboard/appointments")} className="cursor-pointer">
          <StatCard 
            title="Next Appointment"
            value={
              nextAppointment 
                ? `${nextAppointment.date} at ${nextAppointment.time}`
                : "No upcoming appointments"
            }
            icon={<Calendar />}
          />
        </div>
        <div onClick={() => navigate("/dashboard/appointments")} className="cursor-pointer">
          <StatCard 
            title="Last Visit"
            value={
              lastVisit 
                ? `${lastVisit.date} at ${lastVisit.time}`
                : "No previous visits"
            }
            icon={<Heart />}
          />
        </div>
        <div onClick={() => navigate("/dashboard/records")} className="cursor-pointer">
          <StatCard 
            title="Medical Records"
            value={`${recordCount} records`}
            icon={<FileText />}
          />
        </div>
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
