const express=require("express")
const { mysqlpool } = require("./config/database")
const { router } = require("./routes/userRoutes")


const app=express()
const port=8000

app.use("/api/v1",router)


 app.use(express.json())

 mysqlpool.query('SELECT 1').then(()=>{
    console.log("database connection successfull")
 }).catch((err)=>{
    console.log(err)
    console.log("erro occur in database connection ")
 })
app.listen(port,()=>{
    console.log(`app is running on port ${port}`)


})