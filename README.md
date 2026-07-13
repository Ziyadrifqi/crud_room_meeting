# Booking Ruang Meeting

Aplikasi CRUD Booking Ruang Meeting.

- **Frontend**: React (Vite)
- **Backend**: Express.js
- **Database**: MySQL

## Field

| Field           | Tipe Input                                                                      |
| --------------- | ------------------------------------------------------------------------------- |
| Ruangan Meeting | Dropdown dinamis (dari tabel `ruangan`), menampilkan kapasitas ruangan otomatis |
| Tanggal         | Date                                                                            |
| Waktu Mulai     | Time                                                                            |
| Waktu Selesai   | Time                                                                            |
| Jumlah Peserta  | Numerik                                                                         |
| Nominal         | Numerik                                                                         |
| Jenis Konsumsi  | Multiple choice (checkbox, bisa pilih lebih dari satu)                          |

## Struktur Folder

```
booking-ruangan/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── database.sql
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/client.js
    │   ├── components/
    │   ├── App.jsx
    │   └── index.css
    └── index.html
```

## Cara Menjalankan

### 1. Database

```bash
mysql -u root -p < backend/database.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env    # sesuaikan kredensial MySQL
npm install
npm run dev
```

Berjalan di `http://localhost:5000`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Berjalan di `http://localhost:5173`.

## API Endpoints

| Method | Endpoint                            | Keterangan          |
| ------ | ----------------------------------- | ------------------- |
| GET    | /api/ruangan                        | List ruangan        |
| POST   | /api/ruangan                        | Tambah ruangan      |
| PUT    | /api/ruangan/:id                    | Update ruangan      |
| DELETE | /api/ruangan/:id                    | Hapus ruangan       |
| GET    | /api/booking                        | List booking        |
| GET    | /api/booking/:id                    | Detail booking      |
| POST   | /api/booking                        | Tambah booking      |
| PUT    | /api/booking/:id                    | Update booking      |
| DELETE | /api/booking/:id                    | Hapus booking       |
| GET    | /api/booking/options/jenis-konsumsi | Opsi jenis konsumsi |
