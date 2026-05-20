import { useContext, useState, useEffect } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import api from "../utils/api"

function DashboardWarga() {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  // State Simulasi/Realtime data stats laporan milik warga
  const [stats, setStats] = useState({ total: 2, proses: 2, selesai: 0 })
  
  // State Daftar Laporan (Akan otomatis memanjang ke bawah jika data bertambah)
  const [laporanList, setLaporanList] = useState([
    { id: 1, judul: "Tumpukan Plastik Liar", lokasi: "Kec. Blimbing", status: "menunggu" },
    { id: 2, judul: "Sampah Organik Menumpuk", lokasi: "Kec. Klojen", status: "proses" },
  ])

  // Ambil data real-time dari backend (jika API sudah siap)
  useEffect(() => {
    const fetchLaporanWarga = async () => {
      try {
        const res = await api.get("/api/laporan/saya") // Sesuaikan endpoint backend kelompokmu
        if (res.data) {
          setLaporanList(res.data)
          // Hitung otomatis stats dari data backend
          const total = res.data.length
          const proses = res.data.filter(l => l.status === "proses" || l.status === "menunggu").length
          const selesai = res.data.filter(l => l.status === "selesai").length
          setStats({ total, proses, selesai })
        }
      } catch (err) {
        console.log("Menggunakan data simulasi warga.")
      }
    }
    fetchLaporanWarga()
  }, [])

  const handleGoToBuatLaporan = () => {
    navigate("/buat-laporan")
  }

  return (
    <div style={{ display: "flex", background: "#f7fbf7", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif" }}>
      
      {/* ================= 1. SIDEBAR KIRI ================= */}
      <div style={{ width: "240px", background: "white", padding: "30px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderRight: "1px solid #eef2ee", position: "fixed", height: "calc(100vh - 60px)" }}>
        <div>
          {/* Logo Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "40px", color: "#42b549", fontWeight: "bold", fontSize: "20px" }}>
            🍃 LaporSampah!
          </div>

          {/* Menu Navigasi */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div onClick={() => navigate("/warga")} style={{ padding: "12px 16px", borderRadius: "12px", background: "#e8f5e9", color: "#2e7d32", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px" }}>
              🏠 Beranda
            </div>
            <div onClick={() => navigate("/laporan-saya")} style={{ padding: "12px 16px", borderRadius: "12px", color: "gray", fontWeight: "500", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px" }}>
              📄 Laporan Saya
            </div>
          </div>
        </div>

        {/* Tombol Keluar */}
        <button 
          onClick={() => { localStorage.clear(); navigate("/") }}
          style={{ padding: "12px", background: "#ffebee", color: "#c62828", border: "none", borderRadius: "12px", fontWeight: "bold", cursor: "pointer", textAlign: "left" }}
        >
          ▮ Keluar
        </button>
      </div>

      {/* ================= 2. KONTEN UTAMA (LEBIH LUAS & MELEBAR) ================= */}
      <div style={{ flex: 1, padding: "40px 40px 40px 280px" }}>
        
        {/* Header Dinamis */}
        <div style={{ marginBottom: "35px" }}>
          <p style={{ margin: "0 0 5px 0", color: "gray", fontSize: "14px" }}>Selamat pagi,</p>
          <h1 style={{ margin: 0, fontSize: "28px", color: "#2c3e50" }}>Halo, {user?.nama || "Warga"} 👋</h1>
        </div>

        {/* Grid Box Stats Ringkasan */}
        <div style={{ display: "flex", gap: "25px", marginBottom: "35px" }}>
          <div style={{ flex: 1, background: "white", padding: "25px", borderRadius: "24px", textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
            <h1 style={{ margin: "0 0 5px 0", color: "#2e7d32", fontSize: "36px" }}>{stats.total}</h1>
            <span style={{ fontSize: "12px", color: "gray", fontWeight: "600", letterSpacing: "1px" }}>LAPORAN</span>
          </div>
          <div style={{ flex: 1, background: "white", padding: "25px", borderRadius: "24px", textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
            <h1 style={{ margin: "0 0 5px 0", color: "#2e7d32", fontSize: "36px" }}>{stats.proses}</h1>
            <span style={{ fontSize: "12px", color: "gray", fontWeight: "600", letterSpacing: "1px" }}>DIPROSES</span>
          </div>
          <div style={{ flex: 1, background: "white", padding: "25px", borderRadius: "24px", textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
            <h1 style={{ margin: "0 0 5px 0", color: "#2e7d32", fontSize: "36px" }}>{stats.selesai}</h1>
            <span style={{ fontSize: "12px", color: "gray", fontWeight: "600", letterSpacing: "1px" }}>SELESAI</span>
          </div>
        </div>

        {/* Banner Ajakan Buat Laporan */}
        <div style={{ background: "#388e3c", padding: "35px", borderRadius: "24px", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", boxShadow: "0 8px 24px rgba(56,142,60,0.15)" }}>
          <div style={{ maxWidth: "75%" }}>
            <h2 style={{ margin: "0 0 10px 0", fontSize: "24px" }}>Laporkan Sampah Sekarang</h2>
            <p style={{ margin: "0 0 25px 0", color: "#e8f5e9", fontSize: "15px", lineHeight: "1.5" }}>Bantu kami menjaga kebersihan lingkungan sekitarmu dengan mengunggah foto tumpukan sampah liar.</p>
            <button 
              onClick={handleGoToBuatLaporan}
              style={{ padding: "12px 28px", background: "white", color: "#2e7d32", border: "none", borderRadius: "12px", fontWeight: "bold", cursor: "pointer", fontSize: "14px" }}
            >
              Buat Laporan ➔
            </button>
          </div>
          <div style={{ background: "rgba(255,255,255,0.15)", width: "80px", height: "80px", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px" }}>
            🗑️
          </div>
        </div>

        {/* ================= SECTION RIWAYAT LAPORAN BARU (MEMANJANG KE BAWAH) ================= */}
        <div style={{ marginTop: "20px" }}>
          <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", color: "#2c3e50", fontWeight: "700" }}>Riwayat Laporan Anda</h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {laporanList.length === 0 ? (
              <div style={{ background: "white", padding: "30px", borderRadius: "20px", textAlign: "center", color: "gray", border: "1px dashed #e0e0e0" }}>
                Belum ada laporan yang Anda kirimkan.
              </div>
            ) : (
              laporanList.map((lapor) => (
                <div 
                  key={lapor.id} 
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between", 
                    padding: "20px", 
                    background: "white", 
                    borderRadius: "20px", 
                    boxShadow: "0 4px 12px rgba(0,0,0,0.01)",
                    border: "1px solid #f0f5f0"
                  }}
                >
                  {/* Bagian Kiri: Foto & Teks Info */}
                  <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    {/* Kotak Miniatur Gambar */}
                    <div style={{ width: "65px", height: "65px", background: "#f4f9f4", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", border: "1px solid #e8f0e8" }}>
                      📷
                    </div>
                    {/* Judul & Lokasi */}
                    <div>
                      <h4 style={{ margin: "0 0 6px 0", fontSize: "16px", color: "#333", fontWeight: "600" }}>{lapor.judul}</h4>
                      <p style={{ margin: 0, fontSize: "13px", color: "gray" }}>📍 {lapor.lokasi}</p>
                    </div>
                  </div>

                  {/* Bagian Kanan: Badge Status */}
                  <span style={{ 
                    padding: "6px 14px", 
                    borderRadius: "8px", 
                    fontSize: "12px", 
                    fontWeight: "bold", 
                    textTransform: "uppercase",
                    background: lapor.status === "menunggu" ? "#fff3e0" : lapor.status === "proses" ? "#e3f2fd" : "#e8f5e9", 
                    color: lapor.status === "menunggu" ? "#ef6c00" : lapor.status === "proses" ? "#1565c0" : "#2e7d32" 
                  }}>
                    {lapor.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default DashboardWarga