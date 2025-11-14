import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import PatientDashboard from './pages/PatientDashboard'
import AppointmentsPage from './pages/AppointmentsPage'
import RecordsPage from './pages/RecordsPage'
import PrescriptionsPage from './pages/PresciptionsPage'
import { useContext } from 'react'
import { AuthContext } from './context/AuthContext'
import './App.css'

function PrivateRoute({ children }) {
  const { authTokens } = useContext(AuthContext);
  return authTokens ? children : <PatientDashboard />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <PatientDashboard />
          </PrivateRoute>
        } />
        <Route path="/dashboard/appointments" element={
          <PrivateRoute>
            <AppointmentsPage />
          </PrivateRoute>
        } />
        <Route path="/dashboard/records" element={
          <PrivateRoute>
            <RecordsPage />
          </PrivateRoute>
        } />
        <Route path="/dashboard/prescriptions" element={
          <PrivateRoute>
            <PrescriptionsPage />
          </PrivateRoute>
        } />
        
      </Routes>
    </Router>
  );
}

export default App;
