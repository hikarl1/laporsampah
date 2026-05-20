require('dotenv').config()

const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const multer = require('multer') // <--- Ditambahkan untuk membaca FormData (Upload Foto)

const app = express()

// Konfigurasi Multer dasar (menyimpan file di memori sebagai simulasi cepat)
const upload = multer({ storage: multer.memoryStorage() })

app.use(cors())
app.use(express.json())

// Database User (Simulasi Memory)
let users = [
  {
    id: 1,
    nama: "Admint",
    email: "admin@gmail.com",
    password: "admin123",
    role: "admin"
  },
  {
    id: 2,
    nama: "Petugas",
    email: "petugas@gmail.com",
    password: "petugas123",
    role: "petugas"
  }
]

// Database Laporan (Simulasi Memory)
let laporan = [] 

// Middleware Autentikasi JWT
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: "token tidak ada" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = users.find(u => u.id === decoded.id)

    if (!req.user) {
      return res.status(404).json({ message: "user tidak ditemukan" })
    }
    next()
  } catch {
    return res.status(401).json({ message: "token invalid" })
  }
}

// ================= ROUTE AUTHENTICATION =================

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body
  const user = users.find(u => u.email === email && u.password === password)

  if (!user) {
    return res.status(400).json({ message: "user tidak ditemukan" })
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" })
  res.json({ token, user })
})

// Register
app.post('/api/auth/register', (req, res) => {
  const newUser = {
    id: users.length + 1,
    ...req.body,
    role: req.body.role || "warga"
  }

  users.push(newUser)
  res.json({ message: "register berhasil" })
})

// Get Profile Me
app.get('/api/auth/me', authMiddleware, (req, res) => {
  const { password, ...user } = req.user
  res.json(user)
})


// ================= ROUTE LAPORAN & DATA UTAMA =================

// 1. Ambil Semua Laporan / Filter Berdasarkan Kecamatan (Untuk Petugas & Admin)
app.get("/api/laporan", (req, res) => {
  const { kecamatan } = req.query;
  
  if (kecamatan) {
    const laporanTersaring = laporan.filter(l => l.kecamatan.toLowerCase() === kecamatan.toLowerCase());
    return res.json(laporanTersaring);
  }
  
  res.json(laporan);
});

// 2. Tambah Laporan Baru dari Warga (Gunakan upload.single("foto") agar sinkron dengan frontend!)
app.post("/api/laporan", upload.single("foto"), (req, res) => {
  const { jenisSampah, lokasi, kecamatan } = req.body;
  
  // Simulasi link gambar jika warga mengupload file foto
  const linkFotoSimulasi = req.file 
    ? "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=500" 
    : "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=500";

  const laporanBaru = {
    id: laporan.length + 1,
    jenisSampah: jenisSampah || "Campuran",
    lokasi: lokasi || "Tidak ada lokasi detail",
    kecamatan: kecamatan || "Klojen",
    status: "menunggu",
    fotoSebelum: linkFotoSimulasi, // Disimpan untuk ditampilkan di dashboard petugas
    tanggal: new Date().toLocaleDateString("id-ID")
  };

  laporan.push(laporanBaru);
  res.json({ message: "Laporan berhasil disimpan", data: laporanBaru });
});

// 3. Ambil Laporan Saya (Dibuat mandiri di luar kurung kurawal route lain)
// UBAH ROUTE INI DI SERVER.JS BIAR BENAR-BENAR KOSONG DARI AWAL
app.get("/api/laporan/me", (req, res) => {
  // Langsung kembalikan isi array laporan asli apa adanya (kosong [] di awal)
  res.json(laporan);
});


// ================= ROUTE MANAGEMENT ADMIN =================

// Statistik Admin
app.get("/api/admin/stats", (req, res) => {
  const totalLaporan = laporan.length
  const totalUser = users.length
  const totalPetugas = users.filter(u => u.role === "petugas").length
  const totalSelesai = laporan.filter(l => l.status === "selesai").length

  res.json({
    totalLaporan,
    totalUser,
    totalPetugas,
    totalSelesai
  })
})

// Get Semua Pengguna
app.get("/api/users", (req, res) => {
  const safeUsers = users.map(({ password, ...u }) => u)
  res.json(safeUsers)
})

// Hapus Pengguna
app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params
  users = users.filter(u => u.id !== parseInt(id))
  res.json({ message: "User berhasil dihapus" })
})


// ================= RUN SERVER =================
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server berjalan lancar di port ${process.env.PORT || 5000}`)
})