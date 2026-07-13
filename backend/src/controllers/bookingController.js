const pool = require('../config/db');

const CONSUMPTION_OPTIONS = ['Snack', 'Makan Siang', 'Makan Malam', 'Coffee Break'];

function mapBookingRow(row) {
  let consumption = row.consumption_type;
  if (typeof consumption === 'string') {
    try {
      consumption = JSON.parse(consumption);
    } catch (e) {
      consumption = [];
    }
  }
  return {
    id: row.id,
    room_id: row.room_id,
    room_name: row.room_name,
    room_capacity: row.room_capacity,
    booking_date: row.booking_date,
    start_time: row.start_time,
    end_time: row.end_time,
    participant_count: row.participant_count,
    nominal: row.nominal,
    consumption_type: consumption,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function validateBookingPayload(body) {
  const errors = [];
  const {
    room_id,
    booking_date,
    start_time,
    end_time,
    participant_count,
    nominal,
    consumption_type,
  } = body;

  if (!room_id) errors.push('room_id wajib diisi');
  if (!booking_date) errors.push('booking_date wajib diisi');
  if (!start_time) errors.push('start_time wajib diisi');
  if (!end_time) errors.push('end_time wajib diisi');
  if (start_time && end_time && start_time >= end_time) {
    errors.push('start_time harus lebih awal dari end_time');
  }
  if (participant_count === undefined || participant_count === null || participant_count === '') {
    errors.push('participant_count wajib diisi');
  } else if (isNaN(Number(participant_count)) || Number(participant_count) <= 0) {
    errors.push('participant_count harus berupa angka positif');
  }
  if (nominal === undefined || nominal === null || nominal === '') {
    errors.push('nominal wajib diisi');
  } else if (isNaN(Number(nominal)) || Number(nominal) < 0) {
    errors.push('nominal harus berupa angka');
  }
  if (!Array.isArray(consumption_type) || consumption_type.length === 0) {
    errors.push('consumption_type wajib dipilih minimal satu');
  } else {
    const invalid = consumption_type.filter((c) => !CONSUMPTION_OPTIONS.includes(c));
    if (invalid.length > 0) {
      errors.push(`consumption_type tidak valid: ${invalid.join(', ')}`);
    }
  }

  return errors;
}

// GET /api/bookings
exports.getAllBookings = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT b.*, r.name AS room_name, r.capacity AS room_capacity
       FROM bookings b
       JOIN rooms r ON r.id = b.room_id
       ORDER BY b.booking_date DESC, b.start_time DESC`
    );
    res.json({ data: rows.map(mapBookingRow) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data booking', error: err.message });
  }
};

// GET /api/bookings/:id
exports.getBookingById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT b.*, r.name AS room_name, r.capacity AS room_capacity
       FROM bookings b
       JOIN rooms r ON r.id = b.room_id
       WHERE b.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Booking tidak ditemukan' });
    }
    res.json({ data: mapBookingRow(rows[0]) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data booking', error: err.message });
  }
};

// POST /api/bookings
exports.createBooking = async (req, res) => {
  const errors = validateBookingPayload(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validasi gagal', errors });
  }

  const {
    room_id,
    booking_date,
    start_time,
    end_time,
    participant_count,
    nominal,
    consumption_type,
  } = req.body;

  try {
    const [roomRows] = await pool.query('SELECT id, capacity FROM rooms WHERE id = ?', [room_id]);
    if (roomRows.length === 0) {
      return res.status(400).json({ message: 'Ruangan tidak ditemukan' });
    }
    if (Number(participant_count) > roomRows[0].capacity) {
      return res.status(400).json({
        message: `Jumlah peserta melebihi kapasitas ruangan (maks ${roomRows[0].capacity})`,
      });
    }

    const [result] = await pool.query(
      `INSERT INTO bookings
        (room_id, booking_date, start_time, end_time, participant_count, nominal, consumption_type)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        room_id,
        booking_date,
        start_time,
        end_time,
        participant_count,
        nominal,
        JSON.stringify(consumption_type),
      ]
    );

    const [rows] = await pool.query(
      `SELECT b.*, r.name AS room_name, r.capacity AS room_capacity
       FROM bookings b JOIN rooms r ON r.id = b.room_id WHERE b.id = ?`,
      [result.insertId]
    );
    res.status(201).json({ message: 'Booking berhasil dibuat', data: mapBookingRow(rows[0]) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal membuat booking', error: err.message });
  }
};

// PUT /api/bookings/:id
exports.updateBooking = async (req, res) => {
  const errors = validateBookingPayload(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validasi gagal', errors });
  }

  const { id } = req.params;
  const {
    room_id,
    booking_date,
    start_time,
    end_time,
    participant_count,
    nominal,
    consumption_type,
  } = req.body;

  try {
    const [existing] = await pool.query('SELECT id FROM bookings WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Booking tidak ditemukan' });
    }

    const [roomRows] = await pool.query('SELECT id, capacity FROM rooms WHERE id = ?', [room_id]);
    if (roomRows.length === 0) {
      return res.status(400).json({ message: 'Ruangan tidak ditemukan' });
    }
    if (Number(participant_count) > roomRows[0].capacity) {
      return res.status(400).json({
        message: `Jumlah peserta melebihi kapasitas ruangan (maks ${roomRows[0].capacity})`,
      });
    }

    await pool.query(
      `UPDATE bookings SET
        room_id = ?, booking_date = ?, start_time = ?, end_time = ?,
        participant_count = ?, nominal = ?, consumption_type = ?
       WHERE id = ?`,
      [
        room_id,
        booking_date,
        start_time,
        end_time,
        participant_count,
        nominal,
        JSON.stringify(consumption_type),
        id,
      ]
    );

    const [rows] = await pool.query(
      `SELECT b.*, r.name AS room_name, r.capacity AS room_capacity
       FROM bookings b JOIN rooms r ON r.id = b.room_id WHERE b.id = ?`,
      [id]
    );
    res.json({ message: 'Booking berhasil diperbarui', data: mapBookingRow(rows[0]) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal memperbarui booking', error: err.message });
  }
};

// DELETE /api/bookings/:id
exports.deleteBooking = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM bookings WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking tidak ditemukan' });
    }
    res.json({ message: 'Booking berhasil dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menghapus booking', error: err.message });
  }
};

exports.CONSUMPTION_OPTIONS = CONSUMPTION_OPTIONS;
