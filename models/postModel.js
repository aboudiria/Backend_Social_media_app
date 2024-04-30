const mongoose= require("mongoose");
const Schema=mongoose.Schema;

const postSchema= new Schema({
    postOwner:{
        type: Schema.Types.ObjectId,
        ref:"user",

    },
    content:{
        type:string,
        maxlength:1000,
        trim:true
    }, 

    media:[
        {
            type:"string",
            default:"",

        }
    ],
    likes:[{
        type:Schema.Types.ObjectId,
        ref:"User",

    }],
   

   
} 
{timestamps: true}
);

module.exports=mongoose.model("Post",postSchema);
