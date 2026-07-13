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
    unit_id: row.unit_id,        
    unit_name: row.unit_name,    
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
    unit_id,          
    booking_date,
    start_time,
    end_time,
    participant_count,
    nominal,
    consumption_type,
  } = body;

  if (!room_id) errors.push('room_id wajib diisi');
  if (!unit_id) errors.push('unit_id wajib diisi'); 
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

export const getRooms = () => client.get('/rooms').then((res) => res.data.data);

export const getUnits = () => client.get('/units').then((res) => res.data.data); // BARU

export const getConsumptionOptions = () =>
  client.get('/bookings/consumption-options').then((res) => res.data.data);