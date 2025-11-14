import apiClient from '../api';

export const getProfile = async () => {
  const res = await apiClient.get('/patients/me/');
  return res.data;
};

export const getAppointments = async () => {
  const res = await apiClient.get('/appointments/');
  return res.data;
};

export const createAppointment = async (payload) => {
  // payload: { doctor_name, department, date, time }
  const res = await apiClient.post('/appointments/', payload);
  return res.data;
};

export const cancelAppointment = async (id) => {
  const res = await apiClient.patch(`/appointments/${id}/`, { status: 'cancelled' });
  return res.data;
};

export const getPrescriptions = async () => {
  const res = await apiClient.get('/prescriptions/');
  return res.data;
};

export const getRecords = async () => {
  const res = await apiClient.get('/records/');
  return res.data;
};
