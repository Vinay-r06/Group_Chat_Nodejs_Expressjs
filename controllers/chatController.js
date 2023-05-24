const sequelize=require('../util/database');
const Chat = require('../models/chatModel');

exports.postSentMessage= async(req,res,next)=>{
    const t= await sequelize.transaction();
    try{
         
      const message = req.body.message;
      console.log('checking user', await req.user);
      const data= await req.user.createChat({
        message:message
      },{transaction:t}); 
      await t.commit();
     return res.status(201).json({success:true, chatData:data});
    }catch(err){
      await t.rollback();
    return res.status(500).json({success:false, message:'ERR in post message', error:err})
      throw new Error(err);         
    }
}



exports.getChats=async(req,res,next)=>{
    try{
        
       return  res.status(201).json({success:true});
    }catch(err){
        return res.status(500).json({success:false, error:err})
    }
}