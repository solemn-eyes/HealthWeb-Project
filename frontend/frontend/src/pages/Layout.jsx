import { Outlet, NavLink } from "react-router-dom";
import { Calendar, FileText, LayoutDashboard, User, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Layout() {
  const { logoutUser } = useContext(AuthContext);

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard /> },
    { to: "/dashboard/appointments", label: "Appointments", icon: <Calendar /> },
    { to: "/dashboard/records", label: "Records", icon: <FileText /> },
    { to: "/dashboard/profile", label: "Profile", icon: <User /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 min-h-screen sticky top-0">
        <h1 className="text-2xl font-bold text-teal-600 mb-8">Health Facility</h1>

        <nav className="space-y-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition 
                ${isActive ? "bg-teal-600 text-white" : "hover:bg-teal-50"}`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={logoutUser}
          className="flex items-center gap-3 mt-10 p-3 w-full text-red-600 hover:bg-red-50 rounded-lg"
        >
          <LogOut /> Logout
        </button>
      </aside>

      {/* Page Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 bg-gray-50 p-8"
      >
        <Outlet />
      </motion.main>
    </div>
  );
}

