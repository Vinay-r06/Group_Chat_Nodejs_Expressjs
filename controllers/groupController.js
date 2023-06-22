const Group=require('../models/group');

const UserGroup=require('../models/groupuser')

const User=require('../models/userModel');

exports.createGroup=async(req,res,next)=>{
try{
     const {groupName,members}=req.body;
     const userId=req.user.id;
     const grp=await Group.findAll({where:{name:groupName}});
     const grpuser=await UserGroup.findAll({where:{groupName:groupName,userId:userId}})
     console.log('admin', grpuser);
     if(grp.length>0 && !grpuser[0].admin){
      res.status(202).json({success:false, message:'you are not admin of the group u can not add the user to the group'})
     }
     else if(grp.length>0 && grpuser[0].admin){
        for (const member of members){
            const user= await User.findOne({where:{name:member}});
            if(user){
                const memberUser={
                    userId:user.Id,
                    groupName:groupName,
                    name:user.name,
                    groupId:grp[0].id
                };
                await UserGroup.create(memberUser);
            }
        }
        res.status(200).json({success:true, groupid:grp[0].id,message:'Member added in group'})
     }
     else{
        const group = await Group.create({name:groupName});
        const groupUser={
            userId:userId,
            groupId:group.id,
            groupName:groupName,
            name:req.user.name,
            admin:true
        }
        await UserGroup.create(groupUser);

        for(const member of members){
            const user=await User.findOne({where:{name:member}});
            if(user){
                const memberuser={
                    userId:user.id,
                    groupName:groupName,
                    name:user.name,
                    groupId:group.id
                };
                await UserGroup.create(memberuser);
            }
        }
        res.status(201).json({success:true, groupid:group.id, message: 'Group created successfully'})
     }
    }catch(err){
     console.log(err)
     res.status(500).json({message:err.message, success:false});
}
}


exports.getgroupname= async(req,res,next)=>{
    try{
   const grpDetails= await UserGroup.findAll({where:{userId:req.user.id}});
   return res.status(201).json({success:true, groupDetails:grpDetails});

    }catch(err){
        res.status(500).json({message:err.message, success:false})
    }
}
