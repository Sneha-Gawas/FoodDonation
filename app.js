if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const cors = require('cors')
const userRouter = require("./routers/userRouter.js")
const User = require("./models/userModel.js")
const foodRouter = require('./routers/foodRouter.js')
const MongoStore = require('connect-mongo');


const dburl =process.env.DB_URL
main()
.then(()=>{
    console.log("Connected to the db Successfully")
})
.catch((err)=>{
    console.log("Error occurred!!")
})

async function main() {
    await mongoose.connect(dburl)
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionOptions = {
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    store: MongoStore.create({
        mongoUrl: process.env.DB_URL, // Replace with your MongoDB connection string
        ttl: 7 * 24 * 60 * 60, // Session lifetime in seconds (7 days)
    }),
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
        sameSite: 'Lax'
    }
}

app.use(cors( {
    origin: true, 
    credentials: true,  
}))

app.use(session(sessionOptions));

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use("/api",userRouter)
app.use("/donor",foodRouter)

app.get("/test",(req,res)=>{
    console.log('Session:', req.session);
    if(req.isAuthenticated()){
        res.status(200).send({success:true,data:req.user})
    }else{
        res.status(200).send({success:false,error:"Not found"})
    }
    
})

app.get("/ngo",(req,res)=>{
    if(req.isAuthenticated()&& req.user.role === "NGO"){
        res.status(200).send(req.user)
    }else{
        res.send("error")
    }
})
app.listen(8080,(req,res)=>{
    console.log("Listening on port 8080")
})