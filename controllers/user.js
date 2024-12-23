const { mysqlpool } = require("../config/database");
const bcrpt=require("bcrypt")
const jwt=require('jsonwebtoken')
require("dotenv").config()
const nodemailer=require("nodemailer")
exports.signup = async (req, res) => {
  try {
    console.log("tis is rq body",req.body)
    const {firstname,lastname,email,password}= req.body;
    console.log("tis is rq body",req.body)
    console.log(firstName)
    if (!firstname) {
      return res.status(400).json({
        success: false,
        message: "first name is required ",
      });
    } else if (!lastname) {
        return res.status(400).json({
            success: false,
            message: "last  name is required ",
          });
    } else if (!password) {
        return res.status(400).json({
            success: false,
            message: "password   is required ",
          });
    } else if (!email) {
        return res.status(400).json({
            success: false,
            message: "email  is required ",
          });
    }

     const [existeuser]=await mysqlpool.query('SELECT * FROM user WHERE email=?',[email])
     if(existeuser.length>=0){
        return res.status(400).json({
            success: false,
            message: " usr already existed on this email ",
          });
     }
     const hashpassword=await bcrpt.hash(password,10)
      
     const [user] =await mysqlpool.query('INSERT INTO (firstName,lastName,email,password) VALUE (?,?,?,?)',[firstName,lastName,email,hashpassword])
      
     return res.status(200).json({
        success:true,
        message:"user created succesfully"
     })

   
  } catch (error) {
    console.log(error);
     return res.status(400).json({
        success:false,
        message:" erro in register in user in database or something went wrong "
     })
  }
};


exports.login=async(req,res)=>{
    try {
         const {email,password}=req.body
         if(!email){
            return res.status(400).json({
                success: false,
                message: "email  is required ",
              });
         }else if(!password){
            return res.status(400).json({
                success: false,
                message: "password   is required ",
              });
         }
          const [notuser]=await mysqlpool.query('SELECT * FROM user WHERE email=?',[email])
          if(notuser.length<=0){
            return res.status(400).json({
                success:false,
                message:"user not found on this email pleaase signup"
            })
          } 

            const payload={id:notuser.id,email:notuser.email}
             const token=jwt.sign(payload,process.env.JWT_SECERET)
               return res.cookie(token,"token").status(200).json({
                success:true,
                message:"user login successfully"
               })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success:false,
            message:" eror in login "
         })
        
    }
}


exports.ForgotPassword=async(req,res)=>{
    const {token,email,password,updatePassword}=req.body
    if(!email){
        return res.status(400).json({
            success:false,
            message:"email is required "
        })
    }
    if(!password){
        return res.status(400).json({
            success:false,
            message:"password is  required "
        })
    }
    
    try {
         const transport=nodemailer.createTransport({
               host:MAIL_HOST,
               user:MAIL_USER,
               password:MAIL_PASSS
         })
          transport.sendMail({
            from:"pranay jaunajl",
            to:"hr@codesfortomorrow.com",
            subject:"TAsk submission",
            body:`you forgot password link http://localhost:8000${token}`
          })

        await mysqlpool.query("UPDATE INTO user WHERE email=? password=?",[email,updatePassword])
        return res.status(200).json({
            success:true,
            message:"password updated successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success:false,
            message:"password not forgot"
        })
        
    }
}