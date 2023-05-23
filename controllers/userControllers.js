const User = require('../models/userModel');
const bcrypt=require('bcrypt');
const sequelize=require('../util/database');



function isstringinvalid(string){
    if(string==undefined || string.length===0){
        return true
    } else{
        return false
    }
}

exports.postSignup= async (req,res)=>{
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






