import { useState } from 'react';

const formatRupiah = (value) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
    Number(value)
  );

const formatTime = (value) => value?.slice(0, 5);

const formatDate = (value) =>
  new Date(value).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

const PAGE_SIZE = 10;

export default function BookingTable({ bookings, onEdit, onDelete, deletingId }) {
  const [page, setPage] = useState(1);

  if (bookings.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">Belum ada booking ruangan. Klik "Pesan Ruangan" untuk menambahkan.</div>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(bookings.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageRows = bookings.slice(start, start + PAGE_SIZE);

  return (
    <div className="card card-flush">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Ruang Meeting</th>
              <th>Unit Kerja</th>
              <th>Kapasitas</th>
              <th>Tanggal Rapat</th>
              <th>Waktu</th>
              <th>Jumlah Peserta</th>
              <th>Jenis Konsumsi</th>
              <th>Nominal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((booking) => (
              <tr key={booking.id}>
                <td className="cell-strong">{booking.room_name}</td>
                <td>{booking.unit_name}</td>
                <td>{booking.room_capacity} Orang</td>
                <td>{formatDate(booking.booking_date)}</td>
                <td>
                  {formatTime(booking.start_time)} s/d {formatTime(booking.end_time)}
                </td>
                <td>{booking.participant_count} Orang</td>
                <td>
                  {booking.consumption_type.map((item) => (
                    <span key={item} className="tag">
                      {item}
                    </span>
                  ))}
                </td>
                <td>{formatRupiah(booking.nominal)}</td>
                <td>
                  <div className="table-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => onEdit(booking.id)}>
                      Ubah
                    </button>
                    <button
                      className="btn btn-danger-ghost btn-sm"
                      onClick={() => onDelete(booking.id)}
                      disabled={deletingId === booking.id}
                    >
                      {deletingId === booking.id ? 'Menghapus…' : 'Hapus'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <span className="pagination-info">
          Showing {start + 1}-{Math.min(start + PAGE_SIZE, bookings.length)} of {bookings.length}
        </span>
        <div className="pagination-controls">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Back
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .slice(0, 5)
            .map((num) => (
              <button
                key={num}
                className={`pagination-page${num === currentPage ? ' active' : ''}`}
                onClick={() => setPage(num)}
              >
                {num}
              </button>
            ))}
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}