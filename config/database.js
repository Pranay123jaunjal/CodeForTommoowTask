const mysql=require("mysql2/promise")


const mysqlpool=mysql.createPool({
    host:"localhost",
    user:"root",
    password:"pranaysql123",
    database:'mysqltask'
})

module.exports={mysqlpool}