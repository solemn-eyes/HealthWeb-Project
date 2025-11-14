import React, { useEffect, useState } from "react";
import { getAppointments, createAppointment, cancelAppointment } from "../services/patientApi";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({ doctor_name: '', department: '', date: '', time: '' });

  useEffect(() => {
    const load = async () => {
      const a = await getAppointments();
      setAppointments(a);
    };
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const newAppt = await createAppointment(form);
    setAppointments(prev => [newAppt, ...prev]);
    setForm({ doctor_name: '', department: '', date: '', time: '' });
  };

  const handleCancel = async (id) => {
    await cancelAppointment(id);
    setAppointments(prev => prev.map(a => a.id === id ? {...a, status: 'cancelled'} : a));
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h2 className="text-xl font-semibold mb-4">Appointments</h2>

      <form onSubmit={handleCreate} className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-2">
        <input value={form.doctor_name} onChange={e=>setForm({...form, doctor_name:e.target.value})} placeholder="Doctor name" className="p-2 rounded border" required/>
        <input value={form.department} onChange={e=>setForm({...form, department:e.target.value})} placeholder="Department" className="p-2 rounded border" required/>
        <input type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} className="p-2 rounded border" required/>
        <input type="time" value={form.time} onChange={e=>setForm({...form, time:e.target.value})} className="p-2 rounded border" required/>
        <button type="submit" className="md:col-span-4 bg-blue-600 text-white py-2 rounded">Book Appointment</button>
      </form>

      <div className="space-y-3">
        {appointments.length === 0 && <div className="text-gray-500">No appointments yet.</div>}
        {appointments.map(appt => (
          <div key={appt.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-medium">{appt.department} — {appt.doctor_name}</div>
              <div className="text-sm text-gray-500">{appt.date} at {appt.time} • {appt.status}</div>
            </div>
            <div>
              {appt.status !== 'cancelled' && <button onClick={()=>handleCancel(appt.id)} className="text-red-600">Cancel</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
