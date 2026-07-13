import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const getRooms = () => client.get('/rooms').then((res) => res.data.data);

export const getConsumptionOptions = () =>
  client.get('/bookings/consumption-options').then((res) => res.data.data);

export const getBookings = () => client.get('/bookings').then((res) => res.data.data);

export const getBooking = (id) => client.get(`/bookings/${id}`).then((res) => res.data.data);

export const createBooking = (payload) =>
  client.post('/bookings', payload).then((res) => res.data);

export const updateBooking = (id, payload) =>
  client.put(`/bookings/${id}`, payload).then((res) => res.data);

export const deleteBooking = (id) =>
  client.delete(`/bookings/${id}`).then((res) => res.data);

export default client;
