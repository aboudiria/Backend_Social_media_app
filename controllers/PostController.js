const { request } = require("express");
const Post=require("../models/postModel");
const User= require("../models/UserModel");

exports.like_dislike=async(req,res)=>{
    try {
        const post=await Post.findOne({_id:req.params['postId']});
        const {userID}=request.body;
        if(!post){
         return res
         .status(404)
         .json({message:"Post not found"});
        }

        if(!post.likes.includes(userID)){
            await post.updateOne({$push:{likes : userID}});
            return res.status(200).json({message:"post has been liked"})

        }else{
            await post.updateOne({$pull:{likes : userID}});
            return res.status(200).json({message:"post has been disliked"})
        }

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};


exports.fetchTimelinePosts=async(req,res)=>{
    try{
        const currentUser=await User.findById(_id:req.body["currentUserId"]);
        if(!currentUser){
            return res.status(401).json({message:"please login to get access"});
        }
        const currentUserPosts=await Post.find({postOwner:currentUser._id});
        const freindsPosts= await Promise.all(
            currentUser.freinds.map((freindID)=>{
                return Post.find({postOwner:freindID});
            })
        );

         const timelinePosts=currentUserPosts.concat(...freindsPosts);
         return timelinePosts.length<=0 ? 
         res.status(404).json({message:"No timeline post are available to render"}):
         res.status(200).json({data:timelinePosts});
     
    }catch(err){
        console.log(err);
        res 
        .status(500)
        .json(err);
    }
}