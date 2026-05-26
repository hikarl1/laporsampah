import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import api from "../utils/api"

function BuatLaporanPage() {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  // State Form Laporan Sampah
  const [jenisSampah, setJenisSampah] = useState("Sampah Anorganik")
  const [kecamatan, setKecamatan] = useState("Kec. Klojen")
  const [keterangan, setKeterangan] = useState("")
  const [loading, setLoading] = useState(false)

  const handleKirimLaporan = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        jenisSampah,
        lokasi: `${kecamatan}, Kota Malang`,
        keterangan,
        status: "menunggu"
      }
      
      // Mengirimkan data formulir baru ke backend kelompokmu
      await api.post("/api/laporan", payload)
      alert("Laporan berhasil dikirim ke petugas wilayah!")
      navigate("/warga")
    } catch (err) {
      console.log("Gagal mengirim ke backend, mengalihkan simulasi kembali ke halaman utama.")
      navigate("/warga")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: "flex", background: "#f7fbf7", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif" }}>
      
      {/* ================= 1. SIDEBAR KIRI (DESKTOP NAVIGASI) ================= */}
      <div style={{ width: "240px", background: "white", padding: "30px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderRight: "1px solid #eef2ee", position: "fixed", height: "calc(100vh - 60px)" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "40px", color: "#42b549", fontWeight: "bold", fontSize: "20px" }}>
            🍃 LaporSampah!
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div onClick={() => navigate("/warga")} style={{ padding: "12px 16px", borderRadius: "12px", color: "gray", fontWeight: "500", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px" }}>
              🏠 Beranda
            </div>
            <div onClick={() => navigate("/laporan-detail")} style={{ padding: "12px 16px", borderRadius: "12px", color: "gray", fontWeight: "500", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px" }}>
              📄 Laporan Saya
            </div>
          </div>
        </div>

        <button 
          onClick={() => { localStorage.clear(); navigate("/") }}
          style={{ padding: "12px", background: "#ffebee", color: "#c62828", border: "none", borderRadius: "12px", fontWeight: "bold", cursor: "pointer", textAlign: "left" }}
        >
          ▮ Keluar
        </button>
      </div>

      {/* ================= 2. AREA KONTEN UTAMA UTK DESKTOP (GRID FORM) ================= */}
      <div style={{ flex: 1, padding: "40px 40px 40px 280px" }}>
        
        {/* Header Teks Utama */}
        <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "30px" }}>
          <button 
            onClick={() => navigate("/warga")} 
            style={{ background: "white", border: "1px solid #e0e0e0", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "16px", fontWeight: "bold" }}
          >
            ←
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: "26px", color: "#2c3e50" }}>Buat Laporan Baru</h1>
            <p style={{ margin: "4px 0 0 0", color: "gray", fontSize: "14px" }}>Isi data tumpukan sampah liar di bawah ini dengan benar untuk diproses petugas.</p>
          </div>
        </div>

        {/* Stepper Indikator Alur */}
        <div style={{ display: "flex", background: "white", padding: "15px 30px", borderRadius: "16px", gap: "40px", marginBottom: "30px", border: "1px solid #f0f5f0", maxWidth: "600px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#2e7d32", fontWeight: "600", fontSize: "14px" }}>
            <span style={{ background: "#e8f5e9", width: "26px", height: "26px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>1</span> Foto & Deteksi
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#2e7d32", fontWeight: "600", fontSize: "14px" }}>
            <span style={{ background: "#e8f5e9", width: "26px", height: "26px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>2</span> Lokasi Kejadian
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "gray", fontSize: "14px" }}>
            <span style={{ background: "#f5f5f5", width: "26px", height: "26px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>3</span> Kirim
          </div>
        </div>

        {/* BENTUK UTAMA FORM DENGAN GRID 2 KOLOM */}
        <form onSubmit={handleKirimLaporan} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
          
          {/* == BLOK KOLOM KIRI: DOKUMENTASI & AI == */}
          <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
            
            {/* Box Pratinjau Deteksi Gambar */}
            <div style={{ background: "white", borderRadius: "20px", padding: "24px", border: "1px solid #f0f5f0", boxShadow: "0 4px 12px rgba(0,0,0,0.01)" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "gray", letterSpacing: "0.5px", display: "block", marginBottom: "15px" }}>HASIL FOTO & DETEKSI AI</span>
              
              <div style={{ position: "relative", width: "100%", height: "220px", borderRadius: "14px", overflow: "hidden", marginBottom: "15px" }}>
                <img 
                  src="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=600&auto=format&fit=crop" 
                  alt="Sampah menumpuk" 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{ position: "absolute", bottom: "15px", left: "15px", right: "15px", background: "rgba(255, 255, 255, 0.95)", padding: "12px 18px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
                  <div>
                    <span style={{ fontSize: "10px", color: "gray", display: "block" }}>KATEGORI TERDETEKSI</span>
                    <strong style={{ color: "#2e7d32", fontSize: "14px" }}>Sampah Anorganik</strong>
                  </div>
                  <span style={{ background: "#42b549", color: "white", fontSize: "11px", fontWeight: "bold", padding: "4px 8px", borderRadius: "6px" }}>98% AKURAT</span>
                </div>
              </div>

              {/* Input Konfirmasi Jenis */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#333" }}>Konfirmasi Jenis Sampah:</label>
                <input 
                  type="text" 
                  value={jenisSampah}
                  onChange={(e) => setJenisSampah(e.target.value)}
                  style={{ width: "93%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #dcdcdc", fontSize: "14px", outline: "none", background: "#fdfdfd" }}
                  required
                />
              </div>
            </div>

            {/* Box Keterangan Opsional */}
            <div style={{ background: "white", borderRadius: "20px", padding: "24px", border: "1px solid #f0f5f0", boxShadow: "0 4px 12px rgba(0,0,0,0.01)" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "gray", letterSpacing: "0.5px", display: "block", marginBottom: "12px" }}>KETERANGAN TAMBAHAN (OPSIONAL)</span>
              <textarea 
                placeholder="Berikan detail lebih lanjut seperti patokan lokasi atau jenis sampah yang dominan..."
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                style={{ width: "93%", height: "100px", padding: "14px", borderRadius: "10px", border: "1px solid #dcdcdc", fontSize: "14px", fontFamily: "inherit", resize: "none", outline: "none" }}
              />
              <div style={{ textAlign: "right", fontSize: "12px", color: "#aaa", marginTop: "5px" }}>{keterangan.length}/250</div>
            </div>

          </div>

          {/* == BLOK KOLOM KANAN: LOKASI MAPS & SUBMIT == */}
          <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
            
            {/* Box Peta dan Dropdown Lokasi */}
            <div style={{ background: "white", borderRadius: "20px", padding: "24px", border: "1px solid #f0f5f0", boxShadow: "0 4px 12px rgba(0,0,0,0.01)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "gray", letterSpacing: "0.5px" }}>LOKASI KEJADIAN</span>
                <span style={{ fontSize: "13px", color: "#42b549", fontWeight: "600", cursor: "pointer" }}>🔄 Refresh GPS</span>
              </div>

              {/* Google Maps Live Frame Aktif */}
              <div style={{ width: "100%", height: "200px", borderRadius: "12px", overflow: "hidden", marginBottom: "20px", border: "1px solid #e2ece2" }}>
                <iframe
                  title="Google Maps Lokasi Pengiriman Laporan"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m4!2s-7.956667!2d112.614444!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e788279149479e5%3A0x60a58ac0deb9!2sJl.%20Veteran%20No.10%2C%20Ketawanggede%2C%20Kec.%20Lowokwaru%2C%20Kota%20Malang%2C%20Jawa%20Timur!5e0!3m2!1sid!2sid!4v1716212100000!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>

              {/* Dropdown Kecamatan */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#333" }}>Pilih Kecamatan:</label>
                <select 
                  value={kecamatan}
                  onChange={(e) => setKecamatan(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #dcdcdc", fontSize: "14px", background: "white", cursor: "pointer" }}
                >
                  <option value="Kec. Klojen">Kec. Klojen</option>
                  <option value="Kec. Blimbing">Kec. Blimbing</option>
                  <option value="Kec. Lowokwaru">Kec. Lowokwaru</option>
                  <option value="Kec. Sukun">Kec. Sukun</option>
                  <option value="Kec. Kedungkandang">Kec. Kedungkandang</option>
                </select>
              </div>
            </div>

            {/* Note Penjelasan Info Sistem & Tombol Submit Kirim */}
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "15px", background: "#e8f2ea", borderRadius: "14px", border: "1px solid #d3ebd7" }}>
                <span style={{ fontSize: "18px" }}>ℹ️</span>
                <p style={{ margin: 0, fontSize: "12px", color: "#2e7d32", lineHeight: "1.4" }}>
                  Laporan Anda akan diproses oleh petugas kebersihan wilayah setempat dalam rentang waktu maksimal 1x24 jam.
                </p>
              </div>

              <button 
                type="submit"
                disabled={loading}
                style={{ 
                  width: "100%", 
                  padding: "16px", 
                  background: loading ? "#a5d6a7" : "#388e3c", 
                  color: "white", 
                  border: "none", 
                  borderRadius: "14px", 
                  fontSize: "15px", 
                  fontWeight: "bold", 
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: "0 6px 20px rgba(56,142,60,0.15)",
                  transition: "background 0.2s"
                }}
              >
                {loading ? "Mengirim Laporan..." : "Kirim Laporan Sekarang 🚀"}
              </button>
            </div>

          </div>

        </form>

      </div>
    </div>
  )
}

export default BuatLaporanPage