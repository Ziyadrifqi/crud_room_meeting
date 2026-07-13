const pool = require('../config/db');

// GET /api/rooms - daftar ruangan meeting (dinamis + kapasitas)
exports.getAllRooms = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, capacity FROM rooms ORDER BY name ASC');
    res.json({ data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data ruangan', error: err.message });
  }
};
