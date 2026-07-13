import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import BookingForm from '../components/BookingForm';
import {
  getRooms,
  getUnits,
  getConsumptionOptions,
  getBooking,
  createBooking,
  updateBooking,
} from '../api/client';

export default function BookingFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [rooms, setRooms] = useState([]);
  const [units, setUnits] = useState([]);
  const [consumptionOptions, setConsumptionOptions] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [roomsData, unitsData, optionsData] = await Promise.all([
          getRooms(),
          getUnits(),
          getConsumptionOptions(),
        ]);
        setRooms(roomsData);
        setUnits(unitsData);
        setConsumptionOptions(optionsData);

        if (isEditing) {
          const booking = await getBooking(id);
          setEditingBooking(booking);
        }
      } catch (err) {
        setLoadError('Gagal memuat data. Pastikan backend berjalan di server API.');
      }
    };
    load();
  }, [id, isEditing]);

  const handleSubmit = async (payload, bookingId) => {
    setSubmitting(true);
    try {
      if (bookingId) {
        await updateBooking(bookingId, payload);
      } else {
        await createBooking(payload);
      }
      navigate('/');
      return {};
    } catch (err) {
      const errors = err.response?.data?.errors || [
        err.response?.data?.message || 'Terjadi kesalahan pada server.',
      ];
      return { errors };
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Pesan Ruangan"
        breadcrumb={`Ruang Meeting  >  ${isEditing ? 'Ubah Ruangan' : 'Pesan Ruangan'}`}
      />

      {loadError && <div className="alert alert-error">{loadError}</div>}

      <BookingForm
        rooms={rooms}
        units={units}
        consumptionOptions={consumptionOptions}
        editingBooking={editingBooking}
        onSubmit={handleSubmit}
        onCancelEdit={() => navigate('/')}
        submitting={submitting}
      />
    </div>
  );
}