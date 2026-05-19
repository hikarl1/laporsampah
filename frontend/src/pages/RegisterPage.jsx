import {useState} from "react"
import {useNavigate} from "react-router-dom"
import api from "../utils/api"

function RegisterPage(){

const[nama,setNama]=useState("")
const[email,setEmail]=useState("")
const[password,setPassword]=useState("")

const navigate=useNavigate()

async function handleRegister(){

try{

await api.post(
"/auth/register",
{
nama,
email,
password
}
)

alert("register berhasil")

navigate("/")

}catch{

alert("register gagal")

}

}

return(

<div
style={{
display:"flex",
height:"100vh",
background:"#eef7ee"
}}
>

<div
style={{
flex:1,
display:"flex",
flexDirection:"column",
justifyContent:"center",
alignItems:"center",
padding:"50px"
}}
>

<h1
style={{
fontSize:"50px",
color:"#42b549"
}}
>

🍃 LaporSampah

</h1>

<h2>Buat Akun Baru</h2>

<p
style={{
width:"70%",
textAlign:"center",
color:"gray"
}}
>

Gabung untuk membantu menjaga kebersihan lingkungan

</p>

<div
style={{
fontSize:"120px"
}}
>

📝♻️

</div>

</div>

<div
style={{
width:"450px",
background:"white",
display:"flex",
flexDirection:"center",
padding:"40px",
boxShadow:"0 0 20px rgba(0,0,0,.1)"
}}
>

<div style={{width:"100%"}}>

<h1>Daftar</h1>

<input
placeholder="Nama Lengkap"
onChange={e=>setNama(e.target.value)}
style={{
width:"100%",
padding:"12px",
marginTop:"15px",
borderRadius:"10px"
}}
/>

<input
placeholder="Email"
onChange={e=>setEmail(e.target.value)}
style={{
width:"100%",
padding:"12px",
marginTop:"10px",
borderRadius:"10px"
}}
/>

<input
placeholder="Password"
type="password"
onChange={e=>setPassword(e.target.value)}
style={{
width:"100%",
padding:"12px",
marginTop:"10px",
borderRadius:"10px"
}}
/>

<button
onClick={handleRegister}
style={{
width:"100%",
marginTop:"20px",
padding:"14px",
background:"#42b549",
border:"none",
color:"white",
borderRadius:"30px"
}}
>

Daftar

</button>

<p style={{marginTop:"15px"}}>

Sudah punya akun? Masuk

</p>

</div>

</div>

</div>

)

}

export default RegisterPage