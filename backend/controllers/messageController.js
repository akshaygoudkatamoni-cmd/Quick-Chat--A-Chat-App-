import Message from "../models/message.js"
import User from "../models/User.js"
import cloudinary from "../lib/cloudinary.js"
import { io, userSocketMap } from "../server.js"
import mongoose from "mongoose"


export const getUserFromSideBar = async (req, res) => {
    try {
        const userId = req.user._id
        const filteredUser = await User.find({_id: {$ne: userId}}).select("-password")
        
        const unseenMessages = {}

        const promises = filteredUser.map(async (user) => {
            const messages = await Message.find({
                senderId: user._id,
                receiverId: userId,
                seen: false
            })
            if(messages.length > 0) {
                unseenMessages[user._id] = messages.length
            }
        })
        await Promise.all(promises)
        res.status(200).json({success: true, users: filteredUser, unseenMessages})
    }
    catch(err) {
        console.log(err)
        res.status(500).json({success: false, message: "Internal Server Error"})
    }
}

// Get all messages for selected user
export const getMessages = async (req, res) => {
    try{
        const { id: selectedUserId } = req.params
        const myId = req.user._id

        const selectedUserObjId = mongoose.Types.ObjectId.isValid(selectedUserId) 
            ? new mongoose.Types.ObjectId(selectedUserId) 
            : selectedUserId

        await Message.updateMany(
            {
                $or: [
                    { senderId: selectedUserId, receiverId: myId, seen: false },
                    { senderId: selectedUserObjId, receiverId: myId, seen: false }
                ]
            },
            { $set: { seen: true } }
        )

        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: selectedUserId},
                {senderId: selectedUserId, receiverId: myId}
            ]
        }).sort({ createdAt: 1 })

        res.status(200).json({success: true, messages})
    }
    catch(err) {
        console.log(err)
        res.status(500).json({success: false, message: "Internal Server Error"})
    }
}

// api to mark message as seen using message id
export const markMessageAsSeen = async (req, res) => {
    try{
        const { id } = req.params
        await Message.findByIdAndUpdate(id, {seen: true})
        res.status(200).json({success: true, message: "Message marked as seen"})
    }
    catch(err) {
        console.log(err)
        res.status(500).json({success: false, message: "Internal Server Error"})
    }
}

// send message to selected user
export const sendMessage = async (req, res) => {
    try{
        const receiverId = req.params.id
        const senderId = req.user._id
        const { text, image } = req.body

        if(!text && !image) {
            return res.status(400).json({success: false, message: "Message cannot be empty"})
        }

        let imageUrl = ""

        if(image) {
            const uploadResponse = await cloudinary.uploader.upload(image, {
                resource_type: "auto",
                folder: "messages"
            })
            imageUrl = uploadResponse.secure_url
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text: text || "",
            image: imageUrl
        })
        await newMessage.save()

        // Emit the new message to the receiver's socket
        const receiverSocketId = userSocketMap[receiverId]
        if(receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }
        
        res.status(200).json({success: true, newMessage})
    }
    catch(err) {
        console.log(err)
        res.status(500).json({success: false, message: "Internal Server Error"})
    }
}