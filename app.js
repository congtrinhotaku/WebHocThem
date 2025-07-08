const express = require("express")
const app = express()
const env = require("dotenv").config()
const path = require ("path")
const session = require ("express-session")
const methodOverride = require('method-override');
const db = require ("./config/db")
const morgan = require ("morgan")
const bcrypt = require("bcrypt");
const userRouter = require ("./routes/userRouter")
const adminRouter = require ("./routes/adminRouter")
db()    

app.use(methodOverride('_method'));
app.use(express.json()) 
app.use(express.urlencoded({extended:true}))
app.use(session({
    secret:process.env.SECRET_KEY, 
    resave:false,  
    saveUninitialized:true, 
    cookie:{
        secure:false,
        httpOnly:true,
        maxAge:72*60*60*1000
    }
})) 

app.use((req,res,next)=>{
    res.set('cache-control','no-store')
    next()
})

app.set("view engine","ejs")
app.set("views",[path.join(__dirname,'views/user'),path.join(__dirname,'views/admin')])
app.use(express.static(path.join(__dirname,"public")))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// app.use("/",userRouter)
app.use("/admin",adminRouter)


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const errorMessage = err.message || 'Internal Server Error'
  res.status(statusCode).render('errorPage', { statusCode, errorMessage })
})

app.use((req, res) => {
  res.status(404).render('page-404')
})



app.listen(process.env.PORT,()=>{
    console.log("Server is running http://localhost:"+process.env.PORT)
})

module.exports = app;
