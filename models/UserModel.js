const mongoose= require("mongoose");
const Schema= mongoose.Schema;

const UserSchema= new Schema({
 
     fullName:{
        type:String,
        required:[true,"this fullName is required please enter "],
        trim:true,
        maxlength:40
    
     },

     username:{
        type:String,
        required:[true,"please this username is required"],
        unique:true,
        minlength:4,
        maxlength:10,
        trim:true,

     },
     email:{
        type:String,
        required:[true,"this email is required"],
        unique:true,
        maxlength:40,
        trim:true,


     },
     password:{
        type:String,
        required:[true,'please enter your password'],
        trim:true,
     },
     freinds:[{
        type:Schema.Types.ObjectId,
        ref:'User',
     }
     ],
    blocked_users:[{
        type:Schema.Types.ObjectId,
        ref:'User',
    }
     ],

     followers:[{
        type:Schema.Types.ObjectId,
        ref:'User',
    }
     ],
    
     following:[{
        type:Schema.Types.ObjectId,
        ref:'User',
    }
     ],


},
{timestamps:true}

);
module.exports=mongoose.model("User",UserSchema);