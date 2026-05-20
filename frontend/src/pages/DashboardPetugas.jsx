import { useContext, useState, useEffect } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import api from "../utils/api"

function DashboardPetugas() {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  // 1. Database Simulasi Tugas Berdasarkan Kecamatan di Kota Malang
  const dataTugasPerKecamatan = {
    Klojen: {
      id: "TSK-2026-MLG01",
      jenisSampah: "Anorganik (Plastik & Botol)",
      prioritas: "Menengah",
      catatanPelapor: "Tumpukan botol plastik menghalangi akses trotoar dekat Alun-Alun Klojen.",
      latLong: "-7.9826, 112.6308",
      fotoSebelum: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=500"
    },
    Blimbing: {
      id: "TSK-2026-MLG02",
      jenisSampah: "Organik (Limbah Pasar)",
      prioritas: "Tinggi",
      catatanPelapor: "Sampah sayuran membeludak di sekitar area Pasar Blimbing, bau menyengat.",
      latLong: "-7.9402, 112.6433",
      fotoSebelum: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=500"
    },
    Lowokwaru: {
      id: "TSK-2026-MLG03",
      jenisSampah: "Anorganik (Kardus & Sterofoam)",
      prioritas: "Rendah",
      catatanPelapor: "Banyak tumpukan kardus bekas di dekat kawasan kost mahasiswa Sumbersari.",
      latLong: "-7.9521, 112.6142",
      fotoSebelum: "https://images.unsplash.com/photo-1605600611280-1a6b5a41c22d?w=500"
    },
    Sukun: {
      id: "TSK-2026-MLG04",
      jenisSampah: "Sampah Campuran",
      prioritas: "Menengah",
      catatanPelapor: "Warga membuang sampah sembarangan di pinggir jalan raya Sukun.",
      latLong: "-7.9985, 112.6159",
      fotoSebelum: "https://images.unsplash.com/photo-1516996087931-5ae4025553d8?w=500"
    },
    Kedungkandang: {
      id: "TSK-2026-MLG05",
      jenisSampah: "Limbah Kayu & Konstruksi",
      prioritas: "Rendah",
      catatanPelapor: "Sisa puing bangunan kayu dibuang di lahan kosong daerah Madyopuro.",
      latLong: "-7.9862, 112.6625",
      fotoSebelum: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=500"
    }
  }

  // State untuk menyimpan kecamatan yang sedang dipilih petugas
  const [kecamatanDipilih, setKecamatanDipilih] = useState("Klojen")
  
  // State untuk data tugas aktif (diambil otomatis berdasarkan kecamatanDipilih)
  const [tugasAktif, setTugasAktif] = useState(dataTugasPerKecamatan["Klojen"])
  const [fotoSelesai, setFotoSelesai] = useState(null)

  // Setiap kali petugas mengganti dropdown kecamatan, update isi detail tugasnya
  // GANTI useEffect YANG LAMA DENGAN INI BIAR NYAMBUNG KE BACKEND
useEffect(() => {
  const ambilTugasDariBackend = async () => {
    try {
      const res = await api.get(`/api/laporan?kecamatan=${kecamatanDipilih}`)
      
      if (res.data && res.data.length > 0) {
        // A. JIKA ADA LAPORAN WARGA: Tampilkan data asli dari database
        const laporanTerbaru = res.data[res.data.length - 1]
        setTugasAktif({
          id: `TSK-2026-MLG${laporanTerbaru.id}`,
          jenisSampah: laporanTerbaru.jenisSampah,
          prioritas: laporanTerbaru.prioritas || "Menengah",
          catatanPelapor: laporanTerbaru.lokasi,
          lokasiNama: `Wilayah: ${kecamatanDipilih}, Kota Malang`,
          latLong: "-7.9826, 112.6308",
          fotoSebelum: laporanTerbaru.fotoSebelum
        })
      } else {
        // B. JIKA DATABASE KOSONG (BELUM ADA YANG LAPOR): Set data ke kondisi bersih
        setTugasAktif({
          id: "TIDAK ADA TUGAS",
          jenisSampah: "-",
          prioritas: "-",
          catatanPelapor: `Alhamdulillah! Saat ini belum ada laporan penumpukan sampah di wilayah Kecamatan ${kecamatanDipilih}.`,
          lokasiNama: `Wilayah: ${kecamatanDipilih}, Kota Malang`,
          latLong: "-7.9826, 112.6308",
          fotoSebelum: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500" // Foto lingkungan hijau/bersih sebagai placeholder
        })
      }
    } catch (err) {
      console.log("Gagal memuat data dari server.")
    }
  }

  ambilTugasDariBackend()
}, [kecamatanDipilih])

  const handleFileChange = (e) => {
    setFotoSelesai(e.target.files[0])
    alert("Foto bukti selesai berhasil diunggah!")
  }

  const handleNavigasiMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${tugasAktif.latLong}`
    window.open(url, "_blank")
  }

  const handleSelesaikanTugas = () => {
    if (!fotoSelesai) {
      alert("Peringatan: Mohon upload foto setelah selesai dibersihkan terlebih dahulu!")
      return
    }
    alert(`Selamat! Tugas di Kecamatan ${kecamatanDipilih} telah berhasil diselesaikan.`)
  }

  return (
    <div style={{ display: "flex", background: "#f7fbf7", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif" }}>
      
      {/* ================= 1. SIDEBAR KIRI ================= */}
      <div style={{ width: "240px", background: "white", padding: "30px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderRight: "1px solid #eef2ee", position: "fixed", height: "calc(100vh - 60px)" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "40px", color: "#42b549", fontWeight: "bold", fontSize: "20px" }}>
            🍃 LaporSampah!
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ padding: "12px 16px", borderRadius: "12px", background: "#e8f5e9", color: "#2e7d32", fontWeight: "600", cursor: "pointer" }}>
              🗺️ Navigasi Tugas
            </div>
          </div>
        </div>
        <button 
          onClick={() => { localStorage.clear(); navigate("/") }}
          style={{ padding: "12px", background: "#ffebee", color: "#c62828", border: "none", borderRadius: "12px", fontWeight: "bold", cursor: "pointer" }}
        >
          ▮ Keluar
        </button>
      </div>

      {/* ================= 2. AREA KONTEN UTAMA DESKTOP ================= */}
      <div style={{ flex: 1, padding: "40px 40px 40px 280px", display: "flex", flexDirection: "column", gap: "25px" }}>
        
        {/* Header Atas dengan Dropdown Pilihan Wilayah */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "white", padding: "20px 30px", borderRadius: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.01)" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "24px", color: "#2c3e50" }}>Ruang Kerja Petugas 🛠️</h1>
            <p style={{ margin: "5px 0 0 0", color: "gray", fontSize: "14px" }}>Selamat bertugas, <b>{user?.nama || "Petugas"}</b></p>
          </div>
          
          {/* IMPLEMENTASI DROPDOWN KECAMATAN SESUAI FIGMA */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "14px", fontWeight: "600", color: "gray" }}>📍 Pilih Wilayah:</span>
            <select 
              value={kecamatanDipilih}
              onChange={(e) => setKecamatanDipilih(e.target.value)}
              style={{ 
                padding: "10px 20px", 
                borderRadius: "12px", 
                border: "2px solid #2e7d32", 
                background: "#e8f5e9", 
                color: "#2e7d32", 
                fontWeight: "bold", 
                fontSize: "14px",
                cursor: "pointer",
                outline: "none"
              }}
            >
              <option value="Klojen">Kec. Klojen, Malang</option>
              <option value="Blimbing">Kec. Blimbing, Malang</option>
              <option value="Lowokwaru">Kec. Lowokwaru, Malang</option>
              <option value="Sukun">Kec. Sukun, Malang</option>
              <option value="Kedungkandang">Kec. Kedungkandang, Malang</option>
            </select>
          </div>
        </div>

        {/* Layout 2 Kolom Sejajar */}
        <div style={{ display: "flex", gap: "30px", flex: 1 }}>
          
          {/* KOLOM KIRI: PETA GOOGLE MAPS DINAMIS */}
          <div style={{ flex: 1.2, background: "#e8ece9", borderRadius: "24px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "500px", position: "relative", boxShadow: "0 4px 12px rgba(0,0,0,0.02)", border: "1px solid #e0e5e0" }}>
            <span style={{ color: "gray", fontSize: "14px" }}>[ Peta Satelit Pemantauan Tugas Kota Malang ]</span>
            <span style={{ color: "#aaa", fontSize: "12px", marginTop: "5px" }}>Koordinat: {tugasAktif.latLong}</span>
            
            {/* Pin Darurat Merah Dinamis */}
            <div style={{ position: "absolute", top: "45%", left: "45%", background: "#c62828", color: "white", padding: "8px 16px", borderRadius: "12px", fontSize: "13px", fontWeight: "bold", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", textAlign: "center" }}>
              🚨 Laporan Aktif<br/>
              <span style={{ fontSize: "11px", fontWeight: "normal" }}>Kec. {kecamatanDipilih}</span>
            </div>
          </div>

          {/* KOLOM KANAN: PANEL DETAIL DATA TUGAS YANG OTOMATIS BERUBAH */}
          <div style={{ flex: 1, background: "white", borderRadius: "24px", padding: "30px", boxShadow: "0 4px 12px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column", gap: "20px", border: "1px solid #eef2ee" }}>
            <div>
              <h3 style={{ margin: "0 0 5px 0", fontSize: "20px", color: "#1b5e20", fontWeight: "700" }}>Detail Tugas Aktif</h3>
              <span style={{ fontSize: "13px", color: "gray" }}>ID Laporan: <b>{tugasAktif.id}</b></span>
            </div>

            {/* Foto dari Warga */}
            <div>
              <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "gray", fontWeight: "600" }}>FOTO LAPORAN WARGA</p>
              <div style={{ width: "100%", height: "180px", borderRadius: "16px", backgroundImage: `url(${tugasAktif.fotoSebelum})`, backgroundSize: "cover", backgroundPosition: "center", transition: "all 0.3s ease" }} />
            </div>

            {/* Spek Sampah & Prioritas */}
            <div style={{ display: "flex", gap: "15px" }}>
              <div style={{ flex: 1, background: "#f4f9f4", padding: "12px", borderRadius: "12px", border: "1px solid #e8f5e9" }}>
                <span style={{ fontSize: "11px", color: "gray", display: "block", marginBottom: "4px" }}>JENIS SAMPAH</span>
                <span style={{ fontSize: "14px", fontWeight: "bold", color: "#2e7d32" }}>♻️ {tugasAktif.jenisSampah}</span>
              </div>
              <div style={{ 
                flex: 1, 
                background: tugasAktif.prioritas === "Tinggi" ? "#ffebee" : "#fff9c4", 
                padding: "12px", 
                borderRadius: "12px", 
                border: tugasAktif.prioritas === "Tinggi" ? "1px solid #ffcdd2" : "1px solid #fff59d" 
              }}>
                <span style={{ fontSize: "11px", color: "gray", display: "block", marginBottom: "4px" }}>PRIORITAS</span>
                <span style={{ 
                  fontSize: "14px", 
                  fontWeight: "bold", 
                  color: tugasAktif.prioritas === "Tinggi" ? "#c62828" : "#f57f17" 
                }}>
                  ⚠️ {tugasAktif.prioritas}
                </span>
              </div>
            </div>

            {/* Catatan Komplain */}
            <div style={{ background: "#f9f9f9", padding: "15px", borderRadius: "12px" }}>
              <span style={{ fontSize: "11px", color: "gray", fontWeight: "600", display: "block", marginBottom: "4px" }}>CATATAN PELAPOR</span>
              <p style={{ margin: 0, fontSize: "13px", color: "#555", fontStyle: "italic", lineHeight: "1.5" }}>"{tugasAktif.catatanPelapor}"</p>
            </div>

            {/* Tombol Rute Maps */}
            <button 
              onClick={handleNavigasiMaps}
              style={{ width: "100%", padding: "14px", background: "#2979ff", color: "white", border: "none", borderRadius: "12px", fontWeight: "bold", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            >
              🚀 Buka Navigasi Kec. {kecamatanDipilih}
            </button>

            {/* Bukti Upload Kerja */}
            <label style={{ width: "100%", border: "2px dashed #4caf50", borderRadius: "16px", padding: "20px 10px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "#f8fcf8", boxSizing: "border-box" }}>
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
              <span style={{ fontSize: "24px" }}>📤</span>
              <span style={{ fontSize: "14px", fontWeight: "bold", color: "#2e7d32", marginTop: "5px" }}>Upload Foto Bukti Selesai</span>
            </label>

            <button 
              onClick={handleSelesaikanTugas}
              style={{ width: "100%", padding: "14px", background: "#2e7d32", color: "white", border: "none", borderRadius: "12px", fontWeight: "bold", fontSize: "15px", cursor: "pointer", marginTop: "5px" }}
            >
              Konfirmasi Selesai Bersih ✨
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default DashboardPetugas