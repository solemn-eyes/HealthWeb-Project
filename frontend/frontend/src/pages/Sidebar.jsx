import { Calendar, ClipboardList, FileText } from "lucide-react";


export default function Sidebar() {
    return (
        <div className="w-64 bg-white shadow-md sticky top-0 h-screen p-6">
  <h1 className="text-2xl font-semibold text-teal-700 mb-8">Health Facility</h1>

  <nav className="space-y-3 text-gray-700">
    <a href="/dashboard" className="flex items-center gap-3 p-3 rounded hover:bg-teal-50">
      <Calendar className="w-5" />
      Dashboard
    </a>

    <a href="/dashboard/appointments" className="flex items-center gap-3 p-3 rounded hover:bg-teal-50">
      <ClipboardList className="w-5" />
      Appointments
    </a>

    <a href="/dashboard/records" className="flex items-center gap-3 p-3 rounded hover:bg-teal-50">
      <FileText className="w-5" />
      Records
    </a>

    <a href="/dashboard/profile" className="flex items-center gap-3 p-3 rounded hover:bg-teal-50">
      Profile Settings
    </a>
  </nav>
</div>

    );
}