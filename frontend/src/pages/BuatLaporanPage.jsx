import { useState } from "react"
import { useNavigate } from "react-router-dom" // <--- WAJIB DIIMPOR BIAR BISA PINDAH HALAMAN
import api from "../utils/api"

function BuatLaporanPages() {
  const navigate = useNavigate() // <--- Inisialisasi fungsi navigasi

  // State Form Input
  const [jenisSampah, setJenisSampah] = useState("")
  const [kecamatan, setKecamatan] = useState("Klojen") // Default Kota Malang
  const [lokasi, setLokasi] = useState("")
  const [foto, setFoto] = useState(null)

  const handleFileChange = (e) => {
    setFoto(e.target.files[0]) 
  }

  // GABUNGKAN SEMUA LOGIKA JADI SATU FUNGSI SUBMIT DI SINI
  const handleSubmitLaporan = async (e) => {
    e.preventDefault()
    
    // Gunakan FormData karena menyertakan file foto/gambar
    const formData = new FormData()
    formData.append("jenisSampah", jenisSampah)
    formData.append("kecamatan", kecamatan) // Dikirim ke petugas
    formData.append("lokasi", lokasi)
    formData.append("foto", foto) 

    try {
      await api.post("/api/laporan", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      
      alert("Laporan berhasil dikirim!")
      navigate("/warga") // <--- Otomatis balik ke dashboard warga setelah sukses melapor
    } catch (err) {
      console.error("Gagal mengirim laporan:", err)
      alert("Gagal mengirim laporan, silakan coba lagi.")
    }
  }

  return (
    <div style={{ padding: "40px", maxWidth: "500px", margin: "0 auto", fontFamily: "'Segoe UI', sans-serif" }}>
      <h2 style={{ color: "#2e7d32", marginBottom: "25px" }}>Formulir Pengaduan Sampah</h2>
      
      <form onSubmit={handleSubmitLaporan} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        
        {/* INPUT 1: JENIS SAMPAH */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontWeight: "600" }}>Jenis Sampah:</label>
          <input 
            type="text"
            placeholder="Contoh: Plastik/Anorganik, Limbah Sayur"
            value={jenisSampah}
            onChange={(e) => setJenisSampah(e.target.value)}
            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
            required
          />
        </div>

        {/* INPUT 2: PILIHAN KECAMATAN (Kunci Utama Biar Nyambung ke Petugas) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontWeight: "600" }}>Kecamatan (Kota Malang):</label>
          <select 
            value={kecamatan}
            onChange={(e) => setKecamatan(e.target.value)}
            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc", background: "white" }}
          >
            <option value="Klojen">Kec. Klojen</option>
            <option value="Blimbing">Kec. Blimbing</option>
            <option value="Lowokwaru">Kec. Lowokwaru</option>
            <option value="Sukun">Kec. Sukun</option>
            <option value="Kedungkandang">Kec. Kedungkandang</option>
          </select>
        </div>

        {/* INPUT 3: DETAIL ALAMAT/LOKASI */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontWeight: "600" }}>Detail Alamat / Patokan Lokasi:</label>
          <textarea 
            placeholder="Contoh: Jl. Borobudur No. 10, depan ruko fotokopi"
            value={lokasi}
            onChange={(e) => setLokasi(e.target.value)}
            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc", minHeight: "80px", fontFamily: "inherit" }}
            required
          />
        </div>

        {/* INPUT 4: UNGHAH FOTO */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontWeight: "600" }}>Unggah Foto Tumpukan Sampah:</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            style={{ padding: "5px" }}
            required
          />
        </div>

        {/* TOMBOL SUBMIT */}
        <button 
          type="submit"
          style={{ padding: "14px", background: "#42b549", color: "white", border: "none", borderRadius: "30px", fontWeight: "bold", fontSize: "16px", cursor: "pointer", marginTop: "10px" }}
        >
          Kirim Laporan Ke Sistem 🚀
        </button>
      </form>
    </div>
  )
}

export default BuatLaporanPages