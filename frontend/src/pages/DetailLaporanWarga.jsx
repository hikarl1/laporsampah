import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import api from "../utils/api"

function DetailLaporanWarga() {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [laporan, setLaporan] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ambilDetailLaporan = async () => {
      try {
        // Mengambil data tracking laporan milik warga dari backend
        const res = await api.get("/api/laporan/me")
        if (res.data && res.data.length > 0) {
          // Mengambil data laporan terbaru yang dikirim oleh warga
          setLaporan(res.data[res.data.length - 1])
        }
      } catch (err) {
        console.error("Gagal mengambil data dari backend, menggunakan data simulasi figma.")
      } finally {
        setLoading(false)
      }
    }
    ambilDetailLaporan()
  }, [])

  // DATA FALLBACK (Sesuai persis dengan data tampilan di gambar sistem Anda)
  const dataTampil = laporan || {
    id: "LS-99281-JKT",
    jenisSampah: "Anorganik",
    lokasi: "Jl. Veteran No. 10, Ketawanggede, Kota Malang",
    tanggal: "24 Mei 2026",
    status: "selesai"
  }

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#42b549", fontWeight: "600" }}>
        Memuat Pelacakan Sistem...
      </div>
    )
  }

  return (
    <div style={{ display: "flex", background: "#f7fbf7", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif" }}>
      
      {/* ================= 1. SIDEBAR KIRI (DESKTOP SAME AS DASHBOARD) ================= */}
      <div style={{ width: "240px", background: "white", padding: "30px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderRight: "1px solid #eef2ee", position: "fixed", height: "calc(100vh - 60px)" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "40px", color: "#42b549", fontWeight: "bold", fontSize: "20px" }}>
            🍃 LaporSampah!
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div onClick={() => navigate("/warga")} style={{ padding: "12px 16px", borderRadius: "12px", color: "gray", fontWeight: "500", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px" }}>
              🏠 Beranda
            </div>
            <div onClick={() => navigate("/laporan-detail")} style={{ padding: "12px 16px", borderRadius: "12px", background: "#e8f5e9", color: "#2e7d32", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px" }}>
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

      {/* ================= 2. KONTEN DUA KOLOM DESKTOP ================= */}
      <div style={{ flex: 1, padding: "40px 40px 40px 280px" }}>
        
        {/* Header Atas */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h1 style={{ margin: 0, fontSize: "28px", color: "#2c3e50" }}>Halo, {user?.nama || "Warga"}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#555" }}>
            <span>Halo, {user?.nama || "Warga"}</span>
            <div style={{ width: "35px", height: "35px", borderRadius: "50%", background: "#ccc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>👤</div>
          </div>
        </div>

        {/* Baris Ringkasan Atas (Stats Card Mini) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "30px" }}>
          <div style={{ background: "white", padding: "15px 20px", borderRadius: "16px", display: "flex", justifyBetween: "space-between", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.01)" }}>
            <div><span style={{ fontSize: "13px", color: "gray" }}>Laporan</span><h3 style={{ margin: "5px 0 0 0" }}>0</h3></div>
            <span style={{ background: "#e8f5e9", padding: "8px", borderRadius: "50%" }}>📍</span>
          </div>
          <div style={{ background: "white", padding: "15px 20px", borderRadius: "16px", display: "flex", justifyBetween: "space-between", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.01)" }}>
            <div><span style={{ fontSize: "13px", color: "gray" }}>Stats</span><h3 style={{ margin: "5px 0 0 0" }}>1</h3></div>
            <span style={{ background: "#fff3e0", padding: "8px", borderRadius: "50%" }}>🗑️</span>
          </div>
          <div style={{ background: "white", padding: "15px 20px", borderRadius: "16px", display: "flex", justifyBetween: "space-between", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.01)" }}>
            <div><span style={{ fontSize: "13px", color: "gray" }}>Bummary</span><h3 style={{ margin: "5px 0 0 0" }}>0</h3></div>
            <span style={{ background: "#ffebee", padding: "8px", borderRadius: "50%" }}>🎴</span>
          </div>
          <div style={{ background: "white", padding: "15px 20px", borderRadius: "16px", display: "flex", justifyBetween: "space-between", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.01)" }}>
            <div><span style={{ fontSize: "13px", color: "gray" }}>Categor</span><h3 style={{ margin: "5px 0 0 0", color: "#2e7d32" }}>{dataTampil.jenisSampah}</h3></div>
            <span style={{ background: "#e8f5e9", padding: "8px", borderRadius: "50%" }}>🛍️</span>
          </div>
        </div>

        {/* GRID LAYOUT UTAMA (KIRI MAPS - KANAN TIMELINE) */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "30px", alignItems: "start" }}>
          
          {/* KOLOM KIRI: LOKASI KEJADIAN (MAPS AKTIF) */}
          <div style={{ background: "white", borderRadius: "20px", padding: "24px", boxShadow: "0 4px 16px rgba(0,0,0,0.02)" }}>
            <h3 style={{ margin: "0 0 20px 0", fontSize: "16px", fontWeight: "700", color: "#333", letterSpacing: "0.5px" }}>LOKASI KEJADIAN</h3>
            
            {/* GOOGLE MAPS LIVE IFRAME */}
            <div style={{ width: "100%", height: "350px", borderRadius: "14px", overflow: "hidden", border: "1px solid #e0ebd1" }}>
              <iframe
                title="Google Maps Lokasi Penumpukan Sampah"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m4!2s-7.956667!2d112.614444!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e788279149479e5%3A0x60a58ac0deb9!2sJl.%20Veteran%20No.10%2C%20Ketawanggede%2C%20Kec.%20Lowokwaru%2C%20Kota%20Malang%2C%20Jawa%20Timur!5e0!3m2!1sid!2sid!4v1716212100000!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div style={{ marginTop: "16px", padding: "14px", background: "#f9fbf9", borderRadius: "10px", border: "1px solid #edf2ed", fontSize: "13px", color: "#555" }}>
              <strong>Alamat Fisik:</strong> {dataTampil.lokasi}
            </div>
          </div>

          {/* KOLOM KANAN: DETAIL DATA & TIMELINE STATUS */}
          <div style={{ background: "white", borderRadius: "20px", padding: "24px", boxShadow: "0 4px 16px rgba(0,0,0,0.02)" }}>
            
            {/* Header Judul Detail Laporan */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f5f5f5", paddingBottom: "15px", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button onClick={() => navigate("/warga")} style={{ background: "none", border: "none", fontSize: "16px", cursor: "pointer", color: "#666" }}>←</button>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>Detail Laporan</h3>
              </div>
              <span style={{ cursor: "pointer", color: "#aaa" }}>🔗</span>
            </div>

            {/* Spek Info Baris */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px", marginBottom: "25px", background: "#fcfdfc", padding: "16px", borderRadius: "12px", border: "1px solid #f0f5f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "gray" }}>ID Laporan</span>
                <span style={{ fontWeight: "700", color: "#2c3e50" }}>#{dataTampil.id}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "gray" }}>Category</span>
                <span style={{ background: "#e8f5e9", color: "#2e7d32", padding: "2px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "700" }}>{dataTampil.jenisSampah}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "gray" }}>Tanggal</span>
                <span style={{ fontWeight: "600" }}>{dataTampil.tanggal}</span>
              </div>
            </div>

            {/* SECTION TIMELINE STATUS */}
            <h4 style={{ margin: "0 0 16px 0", fontSize: "14px", color: "#333", fontWeight: "700" }}>STATUS PELAKSANAAN</h4>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", position: "relative", paddingLeft: "24px" }}>
              {/* Line Vertikal Hijau */}
              <div style={{ position: "absolute", left: "5px", top: "5px", bottom: "5px", width: "2px", background: "#42b549" }} />

              {/* Node 1 */}
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: "-23px", top: "3px", width: "8px", height: "8px", borderRadius: "50%", background: "#42b549", boxShadow: "0 0 0 4px #e8f5e9" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span style={{ fontWeight: "700" }}>Laporan Dikirim</span>
                  <span style={{ color: "#aaa", fontSize: "11px" }}>09:15 WIB</span>
                </div>
                <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "#777" }}>Laporan tumpukan sampah sukses masuk ke sistem antrean LaporSampah.</p>
              </div>

              {/* Node 2 */}
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: "-23px", top: "3px", width: "8px", height: "8px", borderRadius: "50%", background: "#42b549", boxShadow: "0 0 0 4px #e8f5e9" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span style={{ fontWeight: "700" }}>Petugas Ditugaskan</span>
                  <span style={{ color: "#aaa", fontSize: "11px" }}>10:30 WIB</span>
                </div>
                <p style={{ margin: "4px 0 0 0", fontSize: "11px", color: "#2e7d32", fontWeight: "600" }}>
                  👷 Tim Lapangan: Bpk. Budi Santoso (Kecamatan Lowokwaru)
                </p>
              </div>

              {/* Node 3 */}
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: "-23px", top: "3px", width: "8px", height: "8px", borderRadius: "50%", background: "#42b549", boxShadow: "0 0 0 4px #e8f5e9" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span style={{ fontWeight: "700" }}>Dalam Proses Pembersihan</span>
                  <span style={{ color: "#aaa", fontSize: "11px" }}>11:00 WIB</span>
                </div>
                <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "#777" }}>Petugas kebersihan armada kuning sedang mengangkut sampah di lokasi titik koordinat.</p>
              </div>

              {/* Node 4 */}
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: "-23px", top: "3px", width: "8px", height: "8px", borderRadius: "50%", background: "#42b549", boxShadow: "0 0 0 4px #e8f5e9" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span style={{ fontWeight: "700", color: "#2e7d32" }}>Laporan Selesai Bersih</span>
                  <span style={{ color: "#aaa", fontSize: "11px" }}>13:45 WIB</span>
                </div>
                <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "#555" }}>Lokasi dinyatakan steril & hijau kembali. Terima kasih atas laporan kepedulian Anda!</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

export default DetailLaporanWarga