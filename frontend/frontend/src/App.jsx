import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import PatientDashboard from './pages/PatientDashboard'
import AppointmentsPage from './pages/AppointmentsPage'
import RecordsPage from './pages/RecordsPage'
import PrescriptionsPage from './pages/PresciptionsPage'
import ProfilePage from './pages/ProfilePage'
import { useContext } from 'react'
import { AuthContext } from './context/AuthContext'
import './App.css'
import Layout from './pages/Layout'

function PrivateRoute() {
  const { authTokens } = useContext(AuthContext);
  return authTokens ? <Outlet /> : <Navigate to="/" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<PatientDashboard />} />
            <Route path="/dashboard/appointments" element={<AppointmentsPage />} />
            <Route path="/dashboard/records" element={<RecordsPage />} />
            <Route path="/dashboard/prescriptions" element={<PrescriptionsPage />} />
            <Route path="/dashboard/profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
