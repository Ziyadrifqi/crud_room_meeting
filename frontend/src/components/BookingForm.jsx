import { useEffect, useState } from 'react';
import CapacityMeter from './CapacityMeter';
import ConsumptionSelect from './ConsumptionSelect';

const emptyForm = {
  room_id: '',
  unit_id: '',   
  booking_date: '',
  start_time: '',
  end_time: '',
  participant_count: '',
  nominal: '',
  consumption_type: [],
};

export default function BookingForm({
  rooms,
  units,       
  consumptionOptions,
  editingBooking,
  onSubmit,
  onCancelEdit,
  submitting,
}) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (editingBooking) {
      setForm({
        room_id: String(editingBooking.room_id),
        unit_id: String(editingBooking.unit_id),  
        booking_date: editingBooking.booking_date?.slice(0, 10) || '',
        start_time: editingBooking.start_time?.slice(0, 5) || '',
        end_time: editingBooking.end_time?.slice(0, 5) || '',
        participant_count: String(editingBooking.participant_count),
        nominal: String(editingBooking.nominal),
        consumption_type: editingBooking.consumption_type || [],
      });
      setErrors([]);
    } else {
      setForm(emptyForm);
    }
  }, [editingBooking]);

  const selectedRoom = rooms.find((r) => String(r.id) === String(form.room_id));

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const localErrors = [];
    if (!form.room_id) localErrors.push('Pilih ruangan meeting');
    if (!form.unit_id) localErrors.push('Pilih unit kerja'); 
    if (!form.booking_date) localErrors.push('Tanggal rapat wajib diisi');
    if (!form.start_time) localErrors.push('Waktu mulai wajib diisi');
    if (!form.end_time) localErrors.push('Waktu selesai wajib diisi');
    if (form.start_time && form.end_time && form.start_time >= form.end_time) {
      localErrors.push('Waktu mulai harus lebih awal dari waktu selesai');
    }
    if (!form.participant_count || Number(form.participant_count) <= 0) {
      localErrors.push('Jumlah peserta harus lebih dari 0');
    }
    if (selectedRoom && Number(form.participant_count) > selectedRoom.capacity) {
      localErrors.push(`Jumlah peserta melebihi kapasitas ruangan (maks ${selectedRoom.capacity})`);
    }
    if (form.nominal === '' || Number(form.nominal) < 0) {
      localErrors.push('Nominal konsumsi harus diisi dengan angka valid');
    }
    if (form.consumption_type.length === 0) {
      localErrors.push('Pilih minimal satu jenis konsumsi');
    }

    if (localErrors.length > 0) {
      setErrors(localErrors);
      return;
    }
const payload = {
      room_id: Number(form.room_id),
      unit_id: Number(form.unit_id),  
      booking_date: form.booking_date,
      start_time: form.start_time,
      end_time: form.end_time,
      participant_count: Number(form.participant_count),
      nominal: Number(form.nominal),
      consumption_type: form.consumption_type,
    };

    const result = await onSubmit(payload, editingBooking?.id);
    if (result?.errors) {
      setErrors(result.errors);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      {errors.length > 0 && (
        <div className="alert alert-error">
          {errors.map((err, idx) => (
            <div key={idx}>{err}</div>
          ))}
        </div>
      )}

      <section className="form-section">
        <h2 className="section-title">Informasi Ruang Meeting</h2>
        <div className="row-3">
          <div className="field">
            <label htmlFor="room_id">Pilihan Ruangan Meeting</label>
            <select
              id="room_id"
              value={form.room_id}
              onChange={(e) => updateField('room_id', e.target.value)}
            >
              <option value="">Pilih Ruangan Meeting</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="unit_id">Unit Kerja</label>
            <select
              id="unit_id"
              value={form.unit_id}
              onChange={(e) => updateField('unit_id', e.target.value)}
            >
              <option value="">Pilih Unit Kerja</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="capacity">Kapasitas Ruangan</label>
            <input id="capacity" type="text" value={selectedRoom ? `${selectedRoom.capacity} Orang` : ''} readOnly placeholder="Kapasitas Ruangan" />
          </div>
        </div>
        {selectedRoom && (
          <CapacityMeter capacity={selectedRoom.capacity} participantCount={form.participant_count} />
        )}
      </section>
      <div className="section-divider" />

      <section className="form-section">
        <h2 className="section-title">Informasi Rapat</h2>
        <div className="row-3">
          <div className="field">
            <label htmlFor="booking_date">Tanggal Rapat *</label>
            <input
              id="booking_date"
              type="date"
              value={form.booking_date}
              onChange={(e) => updateField('booking_date', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="start_time">Pilihan Waktu Mulai</label>
            <input
              id="start_time"
              type="time"
              value={form.start_time}
              onChange={(e) => updateField('start_time', e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="end_time">Waktu Selesai</label>
            <input
              id="end_time"
              type="time"
              value={form.end_time}
              onChange={(e) => updateField('end_time', e.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="participant_count">Jumlah Peserta</label>
          <input
            id="participant_count"
            type="number"
            min="1"
            placeholder="Masukan Jumlah Peserta"
            value={form.participant_count}
            onChange={(e) => updateField('participant_count', e.target.value)}
          />
        </div>

        <div className="field">
          <label>Jenis Konsumsi</label>
          <ConsumptionSelect
            options={consumptionOptions}
            selected={form.consumption_type}
            onChange={(value) => updateField('consumption_type', value)}
          />
        </div>

        <div className="field">
          <label htmlFor="nominal">Nominal Konsumsi</label>
          <div className="input-prefix-group">
            <span className="input-prefix">Rp</span>
            <input
              id="nominal"
              type="number"
              min="0"
              step="1000"
              placeholder="0"
              value={form.nominal}
              onChange={(e) => updateField('nominal', e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="form-actions form-actions-end">
        <button type="button" className="btn btn-cancel" onClick={onCancelEdit}>
          Batal
        </button>
        <button type="submit" className="btn btn-primary btn-inline" disabled={submitting}>
          {submitting ? 'Menyimpan…' : 'Simpan'}
        </button>
      </div>
    </form>
  );
}
