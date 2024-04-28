const User=require("../models/UserModel");
const Request= require("../models/requestModel");

  const getRequestBasedOnStatus= async(req,status)=>{
      try{
             const checkRequest = await Request.find({
                $and:[
                    {
                      $and:[
                              { senderID:req.body['senderID']},
                               {receiverID:req.body['receiverID']},
                      ]
                    },
                    {
                        requestStatus:{$eq: status}
                    }
                ],
                
             };)
            } 
            let isFound= checkRequest.length!==0;   
            const result ={isFound:isFound , docsCount:checkRequest.length};

            return result;
            
      }catch(err){
        console.log(err);

      }
  };


  const limitRequest= async(req,status,maxReqNum)=>{
     
       try{
             const RequestToCheck=await getRequestBasedOnStatus(req,status);
             if(RequestToCheck.isFound===false){
                return true;
             }
             else{
                return RequestToCheck.docsCount>=maxReqNum;
             }

       }catch(err){
        console.log(err);
       }
  };


  exports.sendFreindRequest= async(req,res)=>{

    try{
           const{senderID,receiverID}=req.body;
          //1- check if both the sender and receiver are there
           const {sender,receiver}= await Promise.all([
            User.findById({_id:senderID});
            User.findById({_id:receiverID});
           ]);
           if(!sender || !receiver){
            res.status(404)
            .json({message:"Bothe  sender and receiver should be exit to establish the freind request"});
           }
         //2-check if freinds
         const areFreinds=sender.freinds.includes(receiverId) || 
         receiver.freinds.includes(senderId);

         if(areFreinds){
            return res.status(409).json({
                message:'you are already freinds with ${receiver.fullName}'
            });

         //3-check if there  is a pending request
         const checkPendingReq= await getRequestBasedOnStatus(req,"pending");
         if(checkPendingReq.isFound){
            return res.status(409).json({message: "there is already a pendig request"});
         }
         //4- create a new freind request
         const newFreindRequest= await Request.create({
            senderID,
            receiverID,
            requestStatus:"pending"
         });
         return res.status(201).json({
            message:"Freind request was sent succefully",
            data:newFreindRequest,
         });

         }

    }catch(err){
        console.log(err);
        res.status(500).json(err);

    }
  };


  // users/freindRequests/:requestID/cancel
  // users/freindRequests/:requestID/decline
  const actions={
    "accept":"accept",
    "decline":"decline",
    "cancel":"cancel"
};
  exports.cancel_declineFreindRequest= async(req,res)=>{
    try{
         const actionToexecute= req.path.split('/')[3];
         const currentUser=req.body['currentUserId'];

         const request=await getRequestBasedOnStatus(req,"pending");
         if(!request.isFound){
            return res.status(404).json({message:"No pending request was found to ${actionToexecute}"})
         }

         const isSender=request.senderID.toString()===currentUser.toString();
         const isReceiver=request.receiverID.toString()===currentUser.toString();

         if(actionToexecute===actions.cancel && isSender    ){
              request.requestStatus="canceled";
              await request.save();
              return res.status(200).json({message:"your request has been canceled"});


         } else if(actionToexecute===actions.decline){
            request.requestStatus="declined";
            await request.save();
            return res.status(200).json({message:"request has been declined"});
         }
         return res.status(404).json({message:"you dont have the permission to ${actionToexecute}"});
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
  }