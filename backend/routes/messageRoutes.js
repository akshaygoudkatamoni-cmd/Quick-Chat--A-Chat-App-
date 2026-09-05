import express from "express"
import { protectRoute } from "../middleware/auth.js"
import { getUserFromSideBar, getMessages, markMessageAsSeen, sendMessage } from "../controllers/messageController.js"

const messageRouter = express.Router()

messageRouter.get("/users", protectRoute, getUserFromSideBar)
messageRouter.get("/:id", protectRoute, getMessages)
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen)
messageRouter.put("/seen/:id", protectRoute, markMessageAsSeen)
messageRouter.post("/send/:id", protectRoute, sendMessage)


export default messageRouter