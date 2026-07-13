const pool = require('../config/db');

// GET /api/units - daftar unit kerja
exports.getAllUnits = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name FROM units ORDER BY name ASC');
    res.json({ data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data unit', error: err.message });
  }
};