const express = require('express');
const cors = require('cors');
require('dotenv').config();

const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route tidak ditemukan' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
