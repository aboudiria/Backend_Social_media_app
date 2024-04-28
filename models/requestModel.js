const mongoose = require("mongoose");
const Schema=mongoose.Schema;

const requestModel=new Schema({
    senderID:{
        Id:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    receiverID:{
        Id:Schema.Types.ObjectId,
        ref:"User",
        required:true 
    },
    requestStatue:{
       type:String,
       default:"pending",
       enum:["pending","cancelled","accepted","declined"]
    }

},
{timestamps:true}
);
module.exports=mongoose.model("Request",requestModel); 