import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import api from "../utils/api"

function DashboardAdmin() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  // State Utama
  const [stats, setStats] = useState({ totalLaporan: 0, totalUser: 0, totalPetugas: 0, totalSelesai: 0 })
  const [users, setUsers] = useState([])
  const [laporanList, setLaporanList] = useState([])

  // State Pop-up Kontrol
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // --- STATE BARU UNTUK SEARCH & FILTER ---
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")

  // Ambil data real-time dari backend
  const fetchData = async () => {
    try {
      const statsRes = await api.get("/api/admin/stats")
      setStats(statsRes.data)

      const usersRes = await api.get("/api/users") 
      setUsers(usersRes.data || [])

      const laporanRes = await api.get("/api/laporan")
      setLaporanList(laporanRes.data || [])
    } catch (err) {
      console.error("Gagal sinkronisasi data backend:", err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const triggerDeletePrompt = (userObj) => {
    setUserToDelete(userObj)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!userToDelete) return
    try {
      await api.delete(`/api/users/${userToDelete.id}`)
      setShowDeleteModal(false)
      setUserToDelete(null)
      alert("Pengguna berhasil dihapus!")
      fetchData()
    } catch (err) {
      setUsers(users.filter(u => u.id !== userToDelete.id))
      setShowDeleteModal(false)
    }
  }

  // --- LOGIKA FILTERING USER (REAL-TIME) ---
  const filteredUsers = users.filter((u) => {
    // 1. Cek kecocokan nama berdasarkan input search (tidak sensitif huruf besar/kecil)
    const matchesSearch = u.nama?.toLowerCase().includes(searchQuery.toLowerCase())
    
    // 2. Cek kecocokan Peran/Role
    const matchesRole = selectedRole === "all" || u.role?.toLowerCase() === selectedRole.toLowerCase()
    
    return matchesSearch && matchesRole
  })

  return (
    <div style={{ padding: "40px", background: "#f7fbf7", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif" }}>
      
      {/* --- MODAL POP-UP 1: KONFIRMASI HAPUS --- */}
      {showDeleteModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0, 0, 0, 0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ background: "white", padding: "30px", borderRadius: "16px", width: "400px", textAlign: "center" }}>
            <h3 style={{ margin: "0 0 15px 0" }}>Konfirmasi Hapus</h3>
            <p style={{ color: "gray", marginBottom: "25px" }}>Apakah anda yakin ingin menghapus pengguna <b>{userToDelete?.nama}</b>?</p>
            <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
              <button onClick={() => setShowDeleteModal(false)} style={{ padding: "10px 20px", border: "1px solid #ccc", borderRadius: "8px", background: "white", cursor: "pointer" }}>Batal</button>
              <button onClick={handleConfirmDelete} style={{ padding: "10px 20px", border: "none", borderRadius: "8px", background: "#d32f2f", color: "white", cursor: "pointer" }}>Konfirmasi</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL POP-UP 2: RINGKASAN DETAIL LAPORAN --- */}
      {showDetailModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ background: "white", padding: "30px", borderRadius: "24px", width: "800px", maxHeight: "80vh", overflowY: "auto", boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "2px solid #f0f0f0", paddingBottom: "10px" }}>
              <h2 style={{ margin: 0, color: "#2c3e50" }}>📋 Ringkasan Seluruh Laporan Masuk</h2>
              <button onClick={() => setShowDetailModal(false)} style={{ border: "none", background: "none", fontSize: "24px", cursor: "pointer", color: "gray" }}>&times;</button>
            </div>
            
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "#f4f9f4", color: "#2e7d32", fontSize: "14px" }}>
                  <th style={{ padding: "12px" }}>Jenis Sampah</th>
                  <th style={{ padding: "12px" }}>Lokasi</th>
                  <th style={{ padding: "12px" }}>Pelapor (Warga)</th>
                  <th style={{ padding: "12px" }}>Petugas Lapangan</th>
                  <th style={{ padding: "12px", textAlign: "center" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {laporanList.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: "30px", textAlign: "center", color: "gray" }}>Belum ada data laporan masuk di sistem.</td>
                  </tr>
                ) : (
                  laporanList.map((lapor, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f0f0f0", fontSize: "14px" }}>
                      <td style={{ padding: "12px", fontWeight: "600" }}>{lapor.jenisSampah || "Organik/Anorganik"}</td>
                      <td style={{ padding: "12px" }}>{lapor.lokasi || "Tidak Diketahui"}</td>
                      <td style={{ padding: "12px" }}>👤 {lapor.pelapor || lapor.warga || "Anonim"}</td>
                      <td style={{ padding: "12px" }}>👷 {lapor.petugas || "Belum Ditunjuk"}</td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <span style={{ padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "bold", background: lapor.status === "selesai" ? "#e8f5e9" : "#fff3e0", color: lapor.status === "selesai" ? "#2e7d32" : "#ef6c00" }}>
                          {(lapor.status || "diproses").toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- HEADER NAVBAR --- */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
        <div>
          <h1 style={{ margin: "0 0 5px 0", fontSize: "28px", color: "#2c3e50" }}>Halo {user?.nama || "Admin"} 👋</h1>
          <p style={{ margin: 0, color: "gray", fontSize: "15px" }}>Dashboard Admin LaporSampah</p>
        </div>
        <button style={{ padding: "12px 24px", border: "none", borderRadius: "12px", background: "#42b549", color: "white", fontWeight: "bold", cursor: "pointer" }} onClick={() => { localStorage.clear(); navigate("/") }}>Logout</button>
      </div>

      {/* --- RINGKASAN LAPORAN STATS --- */}
      <h2 style={{ fontSize: "16px", color: "gray", fontWeight: "bold", letterSpacing: "1px", marginBottom: "20px" }}>RINGKASAN LAPORAN <span style={{ float: "right", fontWeight: "normal" }}>Mei 2026 📅</span></h2>

      <div style={{ display: "flex", gap: "25px", marginBottom: "40px", flexWrap: "wrap" }}>
        {/* Sisi Kiri Box Utama Angka */}
        <div style={{ flex: "1.2", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ background: "#a3f0b0", padding: "25px", borderRadius: "24px", display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ background: "white", padding: "15px", borderRadius: "16px", fontSize: "24px" }}>📊</div>
            <div>
              <p style={{ margin: "0 0 5px 0", color: "#2e7d32", fontWeight: "600" }}>Total Laporan</p>
              <h1 style={{ margin: 0, fontSize: "36px", color: "#1b5e20" }}>{stats.totalLaporan}</h1>
            </div>
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: 1, background: "white", padding: "20px", borderRadius: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
              <span style={{ color: "green", fontSize: "12px", fontWeight: "bold" }}>● SELESAI</span>
              <h2 style={{ margin: "10px 0 0 0", fontSize: "28px" }}>{stats.totalSelesai}</h2>
            </div>
            <div style={{ flex: 1, background: "white", padding: "20px", borderRadius: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
              <span style={{ color: "orange", fontSize: "12px", fontWeight: "bold" }}>● PENGGUNA</span>
              <h2 style={{ margin: "10px 0 0 0", fontSize: "28px" }}>{stats.totalUser}</h2>
            </div>
          </div>
        </div>

        {/* Sisi Kanan: Box Tren Grafik */}
        <div style={{ flex: "1.8", background: "white", padding: "25px", borderRadius: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <h3 style={{ margin: 0, fontSize: "16px", color: "#333" }}>Tren Laporan Mingguan</h3>
            <span 
              onClick={() => setShowDetailModal(true)} 
              style={{ color: "#42b549", cursor: "pointer", fontSize: "14px", fontWeight: "600", textDecoration: "underline", whiteSpace: "nowrap" }}
            >
              Lihat Detail
            </span>
          </div>
          
          <div style={{ height: "120px", display: "flex", alignItems: "flex-end", gap: "20px", padding: "10px 0" }}>
            <div style={{ flex: 1, height: "15%", background: "#eef7ee", borderRadius: "6px" }}></div>
            <div style={{ flex: 1, height: "35%", background: "#eef7ee", borderRadius: "6px" }}></div>
            <div style={{ flex: 1, height: "20%", background: "#eef7ee", borderRadius: "6px" }}></div>
            <div style={{ flex: 1, height: "55%", background: "#eef7ee", borderRadius: "6px" }}></div>
            <div style={{ flex: 1, height: "40%", background: "#eef7ee", borderRadius: "6px" }}></div>
            <div style={{ flex: 1, height: stats.totalLaporan > 0 ? "85%" : "15%", background: "#42b549", borderRadius: "6px" }}></div>
          </div>
        </div>
      </div>

      {/* --- TABEL MANAJEMEN PENGGUNA (Dengan Search Bar & Filter) --- */}
      <div style={{ background: "white", padding: "30px", borderRadius: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
        
        {/* Kontainer Baris Judul & Control Filter */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", flexWrap: "wrap", gap: "15px" }}>
          <h2 style={{ margin: 0, fontSize: "20px", color: "#333" }}>Manajemen Pengguna</h2>
          
          {/* Sisi Kanan: Input Search & Filter Peran */}
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {/* Input Search */}
            <input 
              type="text"
              placeholder="🔍 Cari nama pengguna..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                border: "1px solid #e0e0e0",
                outline: "none",
                fontSize: "14px",
                width: "220px",
                background: "#f9fbf9"
              }}
            />

            {/* Dropdown Filter Peran */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                border: "1px solid #e0e0e0",
                background: "white",
                outline: "none",
                fontSize: "14px",
                fontWeight: "600",
                color: "#444",
                cursor: "pointer"
              }}
            >
              <option value="all">👥 Semua Peran</option>
              <option value="admin"> Admin </option>
              <option value="warga"> Warga </option>
              <option value="petugas"> Petugas </option>
            </select>
          </div>
        </div>
        
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #f0f0f0", color: "gray", fontSize: "14px" }}>
              <th style={{ padding: "12px" }}>Avatar</th>
              <th style={{ padding: "12px" }}>Nama Lengkap</th>
              <th style={{ padding: "12px" }}>Peran</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: "40px", textAlign: "center", color: "gray", fontSize: "15px" }}>
                  Tidak ada pengguna yang cocok dengan kriteria pencarian.
                </td>
              </tr>
            ) : (
              // Menggunakan filteredUsers hasil saringan, bukan array users mentah
              filteredUsers.map((u, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #f9f9f9", fontSize: "15px" }}>
                  <td style={{ padding: "12px" }}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.nama || "User")}`} alt="avatar" style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#eef7ee" }} />
                  </td>
                  <td style={{ padding: "12px", fontWeight: "600", color: "#2c3e50" }}>{u.nama}</td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ 
                      padding: "4px 10px", 
                      borderRadius: "6px", 
                      fontSize: "12px", 
                      fontWeight: "bold", 
                      background: u.role === "admin" ? "#e3f2fd" : u.role === "petugas" ? "#fff3e0" : "#e8f5e9", 
                      color: u.role === "admin" ? "#1565c0" : u.role === "petugas" ? "#e65100" : "#2e7d32" 
                    }}>
                      {(u.role || "warga").toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    <button onClick={() => triggerDeletePrompt(u)} style={{ padding: "6px 14px", background: "#ffebee", color: "#c62828", border: "1px solid #ffcdd2", borderRadius: "8px", cursor: "pointer", fontWeight: "500" }}>
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DashboardAdmin