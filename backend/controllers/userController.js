import { generateToken } from "../lib/utils.js"
import User from "../models/User.js"
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js"


export const signup = async (req, res) => {
    const { email, fullName, password, bio } = req.body

    try {
        if(!fullName || !email || !password || !bio) {
            return res.json({ success: false,  message: "All fields are required" })

        }
        
        const user = await User.findOne({ email })

        if(user) {
            return res.json({ success: false, message:"User already exists with this email"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            email,
            fullName,
            password: hashedPassword,
            bio
        })

        const token = generateToken(newUser._id)

        res.json({ success: true, token, userData: newUser, message: "User created successfully" })

    }
    catch(err) {
        console.log(err.message)
        res.json({success: false, message: err.message})
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body
        const userData = await User.findOne({email})

        if(!userData) {
            return res.json({success: false, message: "Invalid email or password"})
        }

        const isPasswordCorrect = await bcrypt.compare(password, userData.password)

        if(!isPasswordCorrect) {
            return res.json({success: false, message: "Invalid email or password"})
        }

        const token = generateToken(userData._id)

        res.json({success: true, userData, token, message: "Login Successful"})

    }
    catch(err){
        console.log(err.message)
        res.json({success: false, message: err.message})
    }
}

export const checkAuth = (req, res) => {
    res.json({success: true, user: req.user, message: "User is authenticated"})
}


export const updateprofile = async (req, res) => {
    try {
        const {fullName, bio, profilePic} = req.body
        const userId = req.user._id
        let updateUser

        if(!profilePic){
            updateUser = await User.findByIdAndUpdate(userId, {bio, fullName},
            {new: true})
        }
        else{
            const upload = await cloudinary.uploader.upload(profilePic)

            updateUser = await User.findByIdAndUpdate(userId, {bio, fullName, profilePic: upload.secure_url},
            {new: true})
        }
        res.json({success: true, message: "Profile updated successfully", userData: updateUser})
    }
    catch(err) {
        console.log(err)
        res.json({success: false, message: err.message})
    }
}