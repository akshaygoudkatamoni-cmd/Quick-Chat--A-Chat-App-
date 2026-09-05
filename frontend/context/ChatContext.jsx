import { createContext, useContext, useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import { AuthContext } from "./AuthContext.jsx"



export const ChatContext = createContext()

export const ChatProvider = ({ children }) => {

    const [messages, setMessages] = useState([])
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [unseenMessages, setUnseenMessages] = useState({})

    const selectedUserRef = useRef(selectedUser)
    selectedUserRef.current = selectedUser

    const {socket, axios} = useContext(AuthContext)

    // Clear unread count whenever the selected user changes
    useEffect(() => {
        if(selectedUser?._id){
            setUnseenMessages((prev) => ({
                ...prev,
                [selectedUser._id]: 0
            }))
        }
    }, [selectedUser])

    // function to get all users for sidebar
    const getUsers = async () => {
        try{
            const {data} = await axios.get(`/api/messages/users`)
            if(data.success){
                setUsers(data.users)
                const unseen = { ...(data.unseenMessages || {}) }
                if(selectedUserRef.current?._id){
                    unseen[selectedUserRef.current._id] = 0
                }
                setUnseenMessages(unseen)
            }
        }
        catch(error){
            console.log(error)
            toast.error(error.message)
        }
    }

    // function to get messages for selected user
    const getMessages = async (userId) => {
        try{
            const {data} = await axios.get(`/api/messages/${userId}`)
            if(data.success){
                setMessages(data.messages)
                setUnseenMessages((prev) => ({
                    ...prev,
                    [userId]: 0
                }))
            }
        }
        catch(error){
            console.log(error)
            toast.error(error.message)
        }
    }

    // function to send message to selected user
    const sendMessage = async (messageData) => {
        if(!selectedUser?._id) return
        try{
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData)
            if(data.success){
                setMessages((prev) => [...prev, data.newMessage])
            }
            else{
                toast.error(data.message)
            }
        }
        catch(error){
            console.log(error)
            toast.error(error.response?.data?.message || error.message)
        }
    }

    // function to subscribe to messages for selected user
    const subscribeToMessages = () => {
        if(!socket) return

        socket.on('newMessage', (newMessage) => {
            const currentSelected = selectedUserRef.current
            const isFromSelectedUser = currentSelected && String(newMessage.senderId) === String(currentSelected._id)
            if(isFromSelectedUser){
                newMessage.seen = true
                setMessages((prev) => [...prev, newMessage])
                setUnseenMessages((prev) => ({
                    ...prev,
                    [newMessage.senderId]: 0
                }))
                axios.put(`/api/messages/seen/${newMessage._id}`).catch((err) => console.log(err))
            }
            else{
                setUnseenMessages((prevUnseenMessages) => ({
                    ...prevUnseenMessages,
                    [newMessage.senderId]: (prevUnseenMessages[newMessage.senderId] || 0) + 1
                }))
            }
        })
    }

    // function to unsubscribe from messages for selected user
    const unsubscribeFromMessages = () => {
        if(socket) socket.off('newMessage')
    }

    useEffect(() => {
        subscribeToMessages()
        return () => {
            unsubscribeFromMessages()
        }
    }, [socket])


    const value = {
        messages,
        users,
        selectedUser,
        unseenMessages,
        getUsers,
        getMessages,
        sendMessage,
        setSelectedUser,
        setUnseenMessages,
    }

    return (
        <ChatContext.Provider value={value}>
            { children }
        </ChatContext.Provider>
    )
}