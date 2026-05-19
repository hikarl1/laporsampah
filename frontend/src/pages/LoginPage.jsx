import {useState,useContext} from "react"
import {useNavigate} from "react-router-dom"
import {AuthContext} from "../contexts/AuthContext"
import api from "../utils/api"

function LoginPage(){

const[email,setEmail]=useState("")
const[password,setPassword]=useState("")

const {setUser}=useContext(AuthContext)

const navigate=useNavigate()

async function handleLogin(){

try{

const res=await api.post(
"/auth/login",
{
email,
password
}
)

localStorage.setItem(
"token",
res.data.token
)

setUser(
res.data.user
)

if(res.data.user.role==="warga"){
navigate("/warga")
}
else if(res.data.user.role==="admin"){
navigate("/admin")
}
else{
navigate("/petugas")
}

}catch{

alert("login gagal")

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

<h2>

Laporkan Sampah Dengan Mudah

</h2>

<p
style={{
width:"70%",
textAlign:"center",
color:"gray"
}}
>

Platform pelaporan sampah untuk membantu warga,
petugas, dan admin memantau kebersihan lingkungan.

</p>

<div
style={{
fontSize:"120px"
}}
>

🧍🗑️

</div>

</div>

<div
style={{
width:"450px",
background:"white",
display:"flex",
flexDirection:"column",
justifyContent:"center",
padding:"40px",
boxShadow:"0 0 20px rgba(0,0,0,.1)"
}}
>

<h1>Selamat Datang</h1>

<p>Masuk ke akun Anda</p>

<input
placeholder="Email"
onChange={
e=>setEmail(e.target.value)
}
style={{
padding:"12px",
marginTop:"10px",
borderRadius:"10px"
}}
/>

<input
placeholder="Password"
type="password"
onChange={
e=>setPassword(e.target.value)
}
style={{
padding:"12px",
marginTop:"10px",
borderRadius:"10px"
}}
/>

<button
onClick={handleLogin}
style={{
marginTop:"20px",
padding:"14px",
border:"none",
borderRadius:"30px",
background:"#42b549",
color:"white",
cursor:"pointer"
}}
>

Masuk ke Akun

</button>

<p
style={{
marginTop:"20px"
}}
>

Belum punya akun? Daftar

</p>

</div>

</div>

)

}

export default LoginPage