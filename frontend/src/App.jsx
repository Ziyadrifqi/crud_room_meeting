import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import BookingListPage from './pages/BookingListPage';
import BookingFormPage from './pages/BookingFormPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<BookingListPage />} />
        <Route path="/bookings/new" element={<BookingFormPage />} />
        <Route path="/bookings/:id/edit" element={<BookingFormPage />} />
      </Route>
    </Routes>
  );
}
