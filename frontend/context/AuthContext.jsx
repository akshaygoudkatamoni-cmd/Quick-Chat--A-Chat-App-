import { createContext } from "react";
import axios from "axios";
import toast from "react-hot-toast"
import {io} from "socket.io-client"
import { useState, useEffect } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = BACKEND_URL;

// Automatically attach token to every request
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.token = token;
    }
    return config;
});

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    
    const [token, setToken] = useState(localStorage.getItem("token"))
    const [authUser, setAuthUser] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [socket, setSocket] = useState(null)
    const [isCheckingAuth, setIsCheckingAuth] = useState(Boolean(localStorage.getItem("token")))

    // Check if the user is authenticated and if so, set the user data and connect to the socket
    const checkAuth = async () => {
        const storedToken = localStorage.getItem("token")
        if (!storedToken) {
            setIsCheckingAuth(false)
            return
        }
        try {
            const { data } = await axios.get("/api/user/check")
            if (data.success) {
                setAuthUser(data.user)
                connectSocket(data.user)
            } else {
                setAuthUser(null)
                localStorage.removeItem("token")
                setToken(null)
            }
        } catch (error) {
            console.error("Auth check failed:", error)
            setAuthUser(null)
            localStorage.removeItem("token")
            setToken(null)
        } finally {
            setIsCheckingAuth(false)
        }
    }


    // Login function to handle user authentication and socket connection and also send a login request to the server
    const login = async (state, credentials) => {
        try{
            const { data } = await axios.post(`/api/user/${state}`, credentials)
            if (data.success) {
                setAuthUser(data.userData)
                connectSocket(data.userData)
                setToken(data.token)
                localStorage.setItem("token", data.token)
                toast.success(data.message || "Login successful")
            } else {
                toast.error(data.message)
            }
        }
        catch(err){
            toast.error(err.message)
        }
    }

    //  Logout function to handle user logout and socket disconnection
    const logout = async () => {
        localStorage.removeItem("token")
        setToken(null)
        setAuthUser(null)
        setOnlineUsers([])
        if (socket) {
            socket.disconnect()
            setSocket(null)
        }
        toast.success("Logout successful")
    }

    // Update profile function to update user profile details
    const updateProfile = async (body) => {
        try{
            const { data } = await axios.put("/api/user/updateprofile", body)
            if(data.success){
                setAuthUser(data.userData)
                toast.success("Profile updated successfully")
            }
            else {
                console.log(data)
                toast.error(data.message)
            }
        }
        catch(error){
            console.log(error)
            toast.error(error.message)
        }
    }


    // Connect socket function to handle socket connection and online users updates
    const connectSocket = (userData) => {
        if(!userData || !userData._id) return
        if(socket?.connected) return
        if(socket) {
            socket.disconnect()
        }

        const newSocket = io(BACKEND_URL, {
            query: {
                userId: userData._id
            }
        })
        newSocket.connect()
        setSocket(newSocket)

        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds)
        })
    }

    useEffect(() => {
        checkAuth()
    }, [])

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile,
        isCheckingAuth
    }
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}