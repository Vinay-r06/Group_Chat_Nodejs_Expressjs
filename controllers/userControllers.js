const User = require('../models/userModel');
const bcrypt=require('bcrypt');
const sequelize=require('../util/database');
const jwt= require('jsonwebtoken')



function isstringinvalid(string){
    if(string==undefined || string.length===0){
        return true
    } else{
        return false
    }
}

const generateAccessToken = (id,name)=>{
  return jwt.sign({userId:id, name:name}, 'secretkey')
}


const postSignup= async (req,res)=>{
  const t = await sequelize.transaction();  
  try{
    const {name, phone, email, password}= req.body;
  
     if(isstringinvalid(name) || isstringinvalid(phone)|| isstringinvalid(email) || isstringinvalid(password)){
        return res.status(400).json({err: "bad parameters . something is missing"})
     }
   
     const user = await User.findOne({where:{email:email}});

     if(!user){

     const saltrounds= 10 ;
     bcrypt.hash(password, saltrounds, async(err, hash)=>{                       // register and password will be stored by encrypt

     if(err){
      await t.rollback();
      console.log('err in hash',err);
     }
        await User.create({ name,phone,email, password:hash })
        await t.commit();
      return  res.status(201).json({message: 'successfuly create new user'})
     })

    }else{
             res.json({message:'User already registered, pleasr login'})
    }

    } catch(err){
      await t.rollback();
       return res.status(500).json({err: "User already exists"});
       throw new Error(err);
    } 

    
}


const postlogin= async (req, res)=>{
  try{
const {email, password} = req.body;
if(isstringinvalid(email) || isstringinvalid(password)){
  return res.status(400).json({message: "Email id or password is missing", success:false})
}

const user= await User.findAll({where: {email}})
if(user.length>0){
  bcrypt.compare(password, user[0].password, (err, result)=>{
if(err){
throw new Error("something went wrong");                                 // handle the bcrypt error if caused...it jump to catches error 
}
if(result===true){
  return res.status(200).json({success:true, message: "User logged in successfully", token: generateAccessToken(user[0].id, user[0].name)})        // if matches password
}else{
  return res.status(400).json({success:false, message: "Password is incorrect"})             // if not matches password
}
  })
}else{
  return res.status(404).json({success:false, message:"User does not exit"})               // if no email means error handle
}
  }catch(err){
 return res.status(500).json({message:err, success:false})                             //   try fails catch error handle
  }
}


module.exports={postSignup,postlogin,generateAccessToken}



