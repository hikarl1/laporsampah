import {useState,useContext} from "react"
import {useNavigate} from "react-router-dom"
import {AuthContext} from "../contexts/AuthContext"
import api from "../utils/api"

function LoginPage(){

const[email,setEmail]=useState("")
const[password,setPassword]=useState("")

const {setUser}=useContext(
AuthContext
)

const navigate=useNavigate()

async function handleLogin(){

try{

const res=
await api.post(
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

if(
res.data.user.role==="warga"
){

navigate("/warga")

}

else if(
res.data.user.role==="admin"
){

navigate("/admin")

}

else{

navigate("/petugas")

}

}catch{

alert(
"login gagal"
)

}

}

return(

<div>

<h1>Login</h1>

<input
placeholder="email"
onChange={
e=>setEmail(e.target.value)
}
/>

<input
placeholder="password"
type="password"
onChange={
e=>setPassword(e.target.value)
}
/>

<button
onClick={
handleLogin
}
>

Login

</button>

</div>

)

}

export default LoginPage