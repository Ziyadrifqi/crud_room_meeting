const express = require('express');
const router = express.Router();
const {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  CONSUMPTION_OPTIONS,
} = require('../controllers/bookingController');

router.get('/consumption-options', (req, res) => {
  res.json({ data: CONSUMPTION_OPTIONS });
});

router.get('/', getAllBookings);
router.get('/:id', getBookingById);
router.post('/', createBooking);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);

module.exports = router;
