const User= require("../models/UserModel");

exports.followUnfollow=async(req,res)=>{
    const{performerID,currentUserID}=req.body;

    try{
        if(performerID.toString()===currentUserID.toString()){
            return res.status(409).json({message:"you can not follow unfollow your self"});
        }
        const currentUser=await User.findOne();
        const targetUser=await User.find();

        const isFollowing=targetUser.followers.includes(currentUserID);
        if(!isFollowing){
            await Promise.all([
                currentUser.updateOne({$push:{following:targetUserID}}),
                targetUser.updateOne({$push:{followers:currentUserID}})

            ])
            return res 
            .status(200)
            .json({message:"you are following this user"});

        }else{
            await Promise.all([
                 currentUser.updateOne({$pull:{following:targetUserID}}),
                targetUser.updateOne({$pull:{followers:currentUserID}})
            ])
        }



    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}