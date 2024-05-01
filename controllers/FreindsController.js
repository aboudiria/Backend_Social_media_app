const User = require("../models/UserModel");
const Request = require("../models/requestModel");

const getRequestBasedOnStatus = async (req, status) => {
    try {
        const checkRequest = await Request.find({
            $and: [
                {
                    $and: [
                        { senderID: req.body['senderID'] },
                        { receiverID: req.body['receiverID'] },
                    ]
                },
                {
                    requestStatus: { $eq: status }
                }
            ]
        });
        let isFound = checkRequest.length !== 0;
        const result = { isFound: isFound, docsCount: checkRequest.length };

        return result;

    } catch (err) {
        console.log(err);
    }
};

const limitRequest = async (req, status, maxReqNum) => {

    try {
        const RequestToCheck = await getRequestBasedOnStatus(req, status);
        if (RequestToCheck.isFound === false) {
            return true;
        } else {
            return RequestToCheck.docsCount >= maxReqNum;
        }

    } catch (err) {
        console.log(err);
    }
};

exports.sendFriendRequest = async (req, res) => {
    try {
        const { senderID, receiverID } = req.body;
        //1- check if both the sender and receiver are there
        const [sender, receiver] = await Promise.all([
            User.findById(senderID),
            User.findById(receiverID)
        ]);
        if (!sender || !receiver) {
            return res.status(404)
                .json({ message: "Both sender and receiver should exist to establish the friend request" });
        }
        //2-check if friends
        const areFriends = sender.friends.includes(receiverId) ||
            receiver.friends.includes(senderId);

        if (areFriends) {
            return res.status(409).json({
                message: `You are already friends with ${receiver.fullName}`
            });
        }
        //3-check if there is a pending request
        const checkPendingReq = await getRequestBasedOnStatus(req, "pending");
        if (checkPendingReq.isFound) {
            return res.status(409).json({ message: "There is already a pending request" });
        }
        //4- create a new friend request
        const newFriendRequest = await Request.create({
            senderID,
            receiverID,
            requestStatus: "pending"
        });
        return res.status(201).json({
            message: "Friend request was sent successfully",
            data: newFriendRequest,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};


const actions = {
    "accept": "accept",
    "decline": "decline",
    "cancel": "cancel"
};

exports.cancelDeclineFriendRequest = async (req, res) => {
    try {
        const actionToExecute = req.path.split('/')[3];
        const currentUser = req.body['currentUserId'];

        const request = await getRequestBasedOnStatus(req, "pending");
        if (!request.isFound) {
            return res.status(404).json({ message: `No pending request was found to ${actionToExecute}` });
        }

        const isSender = request.senderID.toString() === currentUser.toString();
        const isReceiver = request.receiverID.toString() === currentUser.toString();

        if (actionToExecute === actions.cancel && isSender) {
            request.requestStatus = "canceled";
            await request.save();
            return res.status(200).json({ message: "Your request has been canceled" });

        } else if (actionToExecute === actions.decline) {
            request.requestStatus = "declined";
            await request.save();
            return res.status(200).json({ message: "Request has been declined" });
        }
        return res.status(404).json({ message: `You don't have the permission to ${actionToExecute}` });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

exports.acceptFriendRequest = async (req, res) => {
    try {
        const actionToExecute = req.path.split('/')[3];
        const currentUser = req.body['currentUserId'];

        const request = await getRequestBasedOnStatus(req, "pending");
        if (!request.isFound) {
            return res.status(404).json({ message: `No pending request was found to ${actionToExecute}` });
        }

        const isSender = request.senderID.toString() === currentUser.toString();
        const isReceiver = request.receiverID.toString() === currentUser.toString();

        if (actions[actionToExecute] === actions.accept && isReceiver) {
            request.requestStatus = "accepted";
            await request.save();
            const [sender, receiver] = await Promise.all([
                User.findByIdAndUpdate(request.senderID, { $push: { friends: request.receiverID } })
            ]);

            await User.findByIdAndUpdate(request.receiverID, { $push: { friends: request.senderID } });
            return res.status(200).json({ message: "Friend request accepted successfully" });
        }

        if (!sender || !receiver) {
            return res
                .status(404)
                .json({ message: "sender or receiver not found" });
        };

        return res.status(200).json({ message: "You are now friends" });

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};


