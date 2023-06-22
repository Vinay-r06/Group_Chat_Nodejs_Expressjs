const sequelize=require('../util/database');
const Chat = require('../models/chatModel');
const {Op} = require('sequelize')

exports.postSentMessage= async(req,res,next)=>{
    try{
         
      console.log(req);
      //console.log('checking user', await req.user);
    const chats= await Chat.create({
        message:req.body.text,
        userName:req.user.name,
        userId:req.user.id,
        groupId:req.query.groupId,
        time:new Date().getTime()

      }); 

     return res.status(201).json({success:true, chatData:chats, message:'succesfully sent text'});
    }catch(err){
    return res.status(500).json({success:false, message:'ERR in post message', message:err})       
    }
}



exports.getchat=async(req,res,next)=>{
    try{
      
      const groupId= req.query.groupId || null;
      
        const chats= await Chat.findAll({
          where:{ groupId:groupId }
        })
       // console.log(chats);
        return res.status(201).json({success:true, message:chats});


    }catch(err){
        return res.status(500).json({success:false, error:err})
    }
}