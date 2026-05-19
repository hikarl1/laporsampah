require('dotenv').config()

const express=require('express')
const cors=require('cors')
const jwt=require('jsonwebtoken')

const app=express()

app.use(cors())
app.use(express.json())

let users=[
{
 id:1,
 nama:"Rafif",
 email:"rafif@warga.com",
 password:"warga123",
 role:"warga"
},
{
 id:2,
 nama:"Admin",
 email:"admin@admin.com",
 password:"admin123",
 role:"admin"
},
{
 id:3,
 nama:"Petugas",
 email:"petugas@petugas.com",
 password:"petugas123",
 role:"petugas"
}
]

function authMiddleware(req,res,next){

 const token=req.headers.authorization?.split(" ")[1]

 if(!token){
   return res.status(401).json({
      message:"token tidak ada"
   })
 }

 try{

   const decoded=jwt.verify(
      token,
      process.env.JWT_SECRET
   )

   req.user=users.find(
        u=>u.id===decoded.id
    )

    if(!req.user){

    return res.status(404).json({
        message:"user tidak ditemukan"
    })

    }

    next()

 }catch{

   return res.status(401).json({
      message:"token invalid"
   })

 }

}

app.post('/api/auth/login',(req,res)=>{

 const {email,password}=req.body

 const user=users.find(
  u=>
   u.email===email &&
   u.password===password
 )

 if(!user){

   return res.status(400).json({
     message:"user tidak ditemukan"
   })

 }

 const token=jwt.sign(
    {
        id:user.id
    },
    process.env.JWT_SECRET,
    {
        expiresIn:"1d"
    }
 )

 res.json({
    token,
    user
 })

})

app.post('/api/auth/register',(req,res)=>{

const newUser={

id:users.length+1,

...req.body,

role:req.body.role || "warga"

}

users.push(newUser)

res.json({
message:"register berhasil"
})

})

app.get(
'/api/auth/me',
authMiddleware,
(req,res)=>{

const {password,...user}=req.user

res.json(user)

})

// app.get(
//  '/api/auth/me',
//  authMiddleware,
//  (req,res)=>{

//  const {password,...safeUser}=req.user

//  res.json(
//    safeUser
//  )

// })

app.listen(
 process.env.PORT,
 ()=>{

 console.log(
   `server jalan ${process.env.PORT}`
 )

})