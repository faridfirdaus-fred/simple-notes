# Simple Notes App

Aplikasi catatan sederhana yang dibuat dengan Express.js, MongoDB, dan Tailwind CSS.

## Fitur

- ✅ **Create** - Tambah catatan baru dengan nama pengirim dan isi catatan
- ✅ **Read** - Tampilkan semua catatan dalam bentuk grid cards
- ✅ **Update** - Edit catatan yang sudah ada
- ✅ **Delete** - Hapus catatan dengan konfirmasi

## Tech Stack

- **Backend**: Express.js, Node.js
- **Database**: MongoDB dengan Mongoose
- **Frontend**: HTML, JavaScript (Vanilla), Tailwind CSS
- **Additional**: Cors, Helmet untuk security

## Instalasi

1. Clone atau download project ini
2. Install dependencies:
   ```bash
   npm install
   ```

3. Pastikan MongoDB sudah terinstall dan berjalan di komputer Anda, atau update connection string di `config/database.js` untuk menggunakan MongoDB Atlas

4. Jalankan aplikasi:
   ```bash
   # Development mode (dengan auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

5. Buka browser dan akses `http://localhost:3000`

## Struktur Project

```
simple-note/
├── config/
│   └── database.js      # Konfigurasi koneksi MongoDB
├── models/
│   └── Note.js          # Schema model untuk catatan
├── routes/
│   └── notes.js         # API routes untuk CRUD operations
├── views/
│   └── index.html       # Frontend HTML page
├── public/
│   └── js/
│       └── app.js       # Client-side JavaScript
├── server.js            # Main server file
└── package.json
```

## API Endpoints

- `GET /api/notes` - Mendapatkan semua catatan
- `GET /api/notes/:id` - Mendapatkan catatan berdasarkan ID
- `POST /api/notes` - Membuat catatan baru
- `PUT /api/notes/:id` - Update catatan berdasarkan ID
- `DELETE /api/notes/:id` - Hapus catatan berdasarkan ID

## Format Data

Setiap catatan memiliki struktur:
```json
{
  "_id": "ObjectId",
  "sender": "Nama Pengirim",
  "content": "Isi catatan",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Validasi

- Nama pengirim: Required, maksimal 100 karakter
- Isi catatan: Required, maksimal 1000 karakter
- Auto-update timestamp saat data diubah

## Fitur UI

- Responsive design dengan Tailwind CSS
- Real-time character counter
- Toast notifications untuk feedback
- Loading states
- Empty state handling
- Konfirmasi sebelum menghapus
- Edit inline dengan form yang sama

## Konfigurasi Database

Secara default, aplikasi akan terhubung ke `mongodb://localhost:27017/simple-notes`. 

Untuk menggunakan MongoDB Atlas atau database lain, ubah connection string di `config/database.js` atau set environment variable:

```bash
MONGODB_URI=your_mongodb_connection_string
```

## Development

Untuk development, gunakan:
```bash
npm run dev
```

Ini akan menjalankan server dengan nodemon yang akan restart otomatis ketika ada perubahan file.

## Production

Untuk production, gunakan:
```bash
npm start
```

Atau set environment variable untuk port:
```bash
PORT=8080 npm start
```