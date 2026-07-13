import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronLeft } from 'lucide-react';
import BookingTable from '../components/BookingTable';
import { getBookings, deleteBooking } from '../api/client';

export default function BookingListPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [notice, setNotice] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    try {
      const data = await getBookings();
      setBookings(data);
      setLoadError('');
    } catch (err) {
      setLoadError('Gagal memuat data. Pastikan backend berjalan di server API.');
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(''), 3000);
    return () => clearTimeout(timer);
  }, [notice]);

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus booking ini?')) return;
    setDeletingId(id);
    try {
      await deleteBooking(id);
      setNotice('Booking berhasil dihapus.');
      await load();
    } catch (err) {
      setLoadError(err.response?.data?.message || 'Gagal menghapus booking.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="page-header-row">
        <div className="page-header">
          <button type="button" className="page-back-btn" disabled aria-hidden="true">
            <ChevronLeft size={18} />
          </button>
          <div>
            <h1 className="page-title">Ruang Meeting</h1>
            <p className="page-breadcrumb">Ruang Meeting</p>
          </div>
        </div>
        <button className="btn btn-primary btn-inline" onClick={() => navigate('/bookings/new')}>
          <Plus size={16} /> Pesan Ruangan
        </button>
      </div>

      {loadError && <div className="alert alert-error">{loadError}</div>}
      {notice && <div className="alert alert-success">{notice}</div>}

      <BookingTable
        bookings={bookings}
        onEdit={(id) => navigate(`/bookings/${id}/edit`)}
        onDelete={handleDelete}
        deletingId={deletingId}
      />
    </div>
  );
}
