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

export const getLastVisit = async () => {
  const res = await apiClient.get('/last-visit/');
  return res.data;
};

export const getRecordCount = async () => {
  const res = await apiClient.get('/record-count/');
  return res.data.count;
};

export const updateProfile = async (data) => {
  const res = await apiClient.patch('/patients/me/update/', data);
  return res.data;
};

export const uploadProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append("profile_picture", file);

  const res = await apiClient.patch("/patients/me/update/", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  return res.data;
};
