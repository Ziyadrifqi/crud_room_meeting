-- ============================================================
-- Meeting Room Booking - Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS booking_meeting
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE booking_meeting;

-- Ruangan meeting (dinamis, punya kapasitas)
CREATE TABLE IF NOT EXISTS rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  capacity INT NOT NULL
);

-- Data ruangan contoh (silakan diubah/ditambah sesuai kebutuhan)
INSERT INTO rooms (name, capacity) VALUES
('Ruang Meeting A', 10),
('Ruang Meeting B', 20),
('Ruang Meeting C', 30),
('Ruang Serbaguna', 50);

-- Booking ruangan meeting
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_id INT NOT NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  participant_count INT NOT NULL,
  nominal DECIMAL(15,2) NOT NULL,
  consumption_type JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_bookings_room FOREIGN KEY (room_id) REFERENCES rooms(id)
    ON DELETE CASCADE
);
