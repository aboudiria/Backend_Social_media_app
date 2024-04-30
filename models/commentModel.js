const mongoose= require('mongoose');
const Schema= mongoose.Schema;

const commentSchema= new Schema({
    commentOwner: {
        type:Schema.Types.ObjectId,
        ref:"user"
    },
    parentPost:{
        type:Schema.Types.ObjectId,
        ref:"Post" 
    },
    content:{
        type:String,
        maxlength:1000,
        trim:true,
    },
    moderationStatus:{
        type:String,
        default:"pendig",
        enum:['pending','rejected','accepted']

    }
   
}
{ timestamps: true }
)

module.exports=mongoose.model("Comment",commentSchema);