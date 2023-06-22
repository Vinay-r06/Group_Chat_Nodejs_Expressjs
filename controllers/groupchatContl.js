const UserGroup=require('../models/groupuser');

exports.getgrpUsers= async (req,res,next)=>{
try{
    const grpusers= await UserGroup.findAll({where:{groupId:req.query.groupId}})
    res.status(201).json({message:'successfully sent group text', grpusers:grpusers})

}catch(err){
    console.log(err);
    res.status(500).json({error:err})

}
}

exports.makeAdmin= async(req,res,next)=>{
    try{
 const members=req.body.members;
 const admin=await UserGroup.findAll({where:{groupId:req.body.grpId, userId:req.user.id}});
console.log(admin, 'checking admin')
if(admin[0].admin){

 for(const member of members){
  const user=await UserGroup.findAll({where:{groupId:req.body.grpId,name:member}})
  if(user){
    if(user.admin){
        return res.status(204).json({message: `${member} is already admin of the group`})
    }else{
        await UserGroup.update({admin:true}, {where:{groupId:req.body.grpId,name:member}})
    }
  }else{
    return  res.status(200).json({message:`${member} is not member of this group`})
  }
 }
res.status(201).json({success:true, message:'selected member now admin'})
}else{
    res.status(200).json({message:'u r not the admin of the the grp u can not make user admin'})
}
}catch(err){
console.log('err', err);
res.status(500).json({error:err})
}
}


exports.removeAdmin=async(req,res,next)=>{
    try{
       const members=req.body.members;
       const admin=await UserGroup.findAll({where:{groupId:req.body.grpId, userId:req.user.id}});
       if(admin[0].admin){
        for(const member of members){
            const user= await UserGroup.findAll({where:{groupId:req.body.grpId,name:member}});
            if(user.length>0){
                await UserGroup.destroy({where:{groupId:req.body.grpId,name:member}});
            }
            else{
                return res.status(200).json({message:`${member} is not member of this group`});
            }
        }
        res.status(201).json({success:true, message:'member successfully removed from this group'});
       }
       else {
        res.status(202).json({success:false, message:'you are not admin of the group, you can not remove user from the group'});
       }
    
    }catch(err){
        console.log(err, 'err');
        res.status(500).json({error:err})
    }
}