require('dotenv').config()

const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')

const app = express()

app.use(cors())
app.use(express.json())

//user
let users = [
  {
    id: 1,
    nama: "Admint",
    email: "admin@gmail.com",
    password: "admin123",
    role: "admin"
  }
]

let laporan = [] 
// let laporan = [
//   { id: 1, jenisSampah: "Plastik/Anorganik", lokasi: "Jl. Sukarno Hatta No. 5", pelapor: "Rafif", petugas: "Budi Santoso", status: "proses" }
// ]

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

//login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body
  const user = users.find(u => u.email === email && u.password === password)

  if (!user) {
    return res.status(400).json({ message: "user tidak ditemukan" })
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" })
  res.json({ token, user })
})

//register
app.post('/api/auth/register', (req, res) => {
  const newUser = {
    id: users.length + 1,
    ...req.body,
    role: req.body.role || "warga"
  }

  users.push(newUser)
  res.json({ message: "register berhasil" })
})

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const { password, ...user } = req.user
  res.json(user)
})

//statistik 
app.get("/api/admin/stats", (req, res) => {
  // Menghitung data dinamis berdasarkan isi array saat ini
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

//get pengguna
app.get("/api/users", (req, res) => {
  // Mengirim daftar user tanpa menyertakan password demi keamanan
  const safeUsers = users.map(({ password, ...u }) => u)
  res.json(safeUsers)
})

//hapus pengguna
app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params
  // Filter array untuk membuang user dengan id yang dicari
  users = users.filter(u => u.id !== parseInt(id))
  res.json({ message: "User berhasil dihapus" })
})

//api admin: ambil semua laporan
app.get("/api/laporan", (req, res) => {
  res.json(laporan)
})

app.listen(process.env.PORT, () => {
  console.log(`server jalan ${process.env.PORT}`)
})