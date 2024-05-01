const Comment=require("../models/commentModel");
const Post= require("../models/postModel");
const User=require("../models/UserModel");

exports.CreateComment= async(req,res)=>{
    try{
        const {postID, userID,content}=req.body;
        const newComment= await Comment.create({
            commentOwner:userID,
            parentPost:postID,
            moderationStatus:"pending"
        });
        res.status(201).json({message:"comment is submitted,waiting moderation"});


    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
};

exports.getAcceptedCommentPerPost=async(req,res)=>{
    
    try{
        const {postID}=req.params;
        const comments= await Comment.find({
            $and:[{parentPost:postID},
                  { moderationStatus:"accepted"}
            ],

        })
        if(comments.length==0){
          return  res.status(404).json({message:"no accepted comment was found"})
        }
        res.status(201).json({data:comments});
        


    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}