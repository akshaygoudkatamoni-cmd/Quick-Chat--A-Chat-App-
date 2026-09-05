import express from "express"
import "dotenv/config"
import cors from "cors"
import http from "http"
import { connectDB } from "./lib/db.js"
import userRouter from "./routes/userRoutes.js"
import messageRouter from "./routes/messageRoutes.js"
import { Server } from "socket.io"


const app = express()
const server = http.createServer(app)


export const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

// Store online users
export const userSocketMap = {}

// Socket.io connection handler
io.on("connection", (socket) => {
    console.log("A user connected", socket.id)
    const userId = socket.handshake.query.userId
    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id
    }

    // Emit the list of online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id)
        if (userId && userId !== "undefined" && userSocketMap[userId] === socket.id) {
            delete userSocketMap[userId]
        }
        // Emit the list of online users to all connected clients
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})


app.use(express.json({limit: "10mb"}))
app.use(express.urlencoded({extended: true, limit: "10mb"}))
app.use(cors());


app.use("/api/status", (req,res) => res.send("Server is live"))
app.use("/api/user", userRouter)
app.use("/api/messages", messageRouter)



await connectDB()

const PORT = process.env.PORT || 5000

server.listen(PORT, () => console.log('Server is running on PORT: ' + PORT))