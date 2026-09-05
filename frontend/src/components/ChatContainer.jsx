import React, { useState, useContext, useEffect, useRef } from 'react'
import assets, { messagesDummyData } from '../assets/chat-app-assets/assets'
import { formatMessageTime } from '../lib/utils';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ChatContainer = () => {

  const {messages, selectedUser, setSelectedUser, sendMessage, getMessages} = useContext(ChatContext)
  const { authUser, onlineUsers } = useContext(AuthContext)

  const scrollEnd = useRef();

  const [input, setInput] = useState("")

  // function to handle sending message
  const handleSendMessage = async (e) => {
    if(e && e.preventDefault) e.preventDefault()
    if(input.trim() === "") return;
    const textToSend = input.trim();
    setInput("")
    await sendMessage({text: textToSend})
  }

  // handle sending an image
  const handleSendImage = async (e) => {
    const file = e.target.files[0]
    if(!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image file")
      return
    }
    const reader = new FileReader()

    reader.onloadend = async () => {
      const base64Image = reader.result
      await sendMessage({image: base64Image})
      e.target.value = ""
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if(selectedUser){
      getMessages(selectedUser._id)
    }
  }, [selectedUser])

  useEffect(() =>{
    if(scrollEnd.current && messages.length > 0){
      scrollEnd.current.scrollIntoView({behavior: "smooth"})
    }
  }, [messages])

  return selectedUser ? (
    <div className='h-full overflow-hidden flex flex-col relative backdrop-blur-lg'>
      {/* --- header ---  */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className='w-8 h-8 rounded-full object-cover'/>
        <p className='flex-1 text-lg text-white flex items-center gap-2'>
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-500'></span>}
        </p>
        <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="" className='md:hidden max-w-7 cursor-pointer' />
        <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5' />
      </div>
      {/* --- chat area --- */}
      <div className='flex-1 overflow-y-auto p-3 pb-20 flex flex-col gap-4'>
        {messages.map((msg, index) => {
          const isMyMessage = String(msg.senderId) === String(authUser?._id);
          return (
            <div key={msg._id || index} className={`flex items-end gap-2 ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
              {!isMyMessage && (
                <div className='text-center text-xs flex flex-col items-center shrink-0'>
                  <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-7 h-7 rounded-full object-cover'/>
                  <p className='text-gray-400 text-[10px] mt-1'>{formatMessageTime(msg.createdAt)}</p>
                </div>
              )}

              {msg.image ? (
                <div className='flex flex-col max-w-[240px]'>
                  <img src={msg.image} alt="" className='w-full rounded-lg border border-gray-700 object-cover' />
                  {msg.text && (
                    <p className={`p-2 text-sm font-light rounded-lg mt-1 break-words ${
                      isMyMessage ? 'bg-violet-600/70 text-white rounded-br-none' : 'bg-white/10 text-white rounded-bl-none'
                    }`}>{msg.text}</p>
                  )}
                </div>
              ) : (
                <p className={`p-2.5 max-w-[260px] md:max-w-[320px] text-sm font-light rounded-2xl break-words ${
                  isMyMessage 
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-none shadow-md' 
                    : 'bg-white/15 text-white border border-white/10 rounded-bl-none backdrop-blur-sm'
                }`}>{msg.text}</p>
              )}

              {isMyMessage && (
                <div className='text-center text-xs flex flex-col items-center shrink-0'>
                  <img src={authUser?.profilePic || assets.avatar_icon} alt="" className='w-7 h-7 rounded-full object-cover'/>
                  <p className='text-gray-400 text-[10px] mt-1'>{formatMessageTime(msg.createdAt)}</p>
                </div>
              )}
            </div>
          );
        })}
        <div ref={scrollEnd}></div>
      </div>

{/* --- bottom area --- */}

        <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3 bg-black/30 backdrop-blur-md'>
          <div className='flex-1 flex items-center bg-gray-100/15 px-3 rounded-full'>
            <input onChange={(e) => setInput(e.target.value)} value={input}
             onKeyDown={(e) => {
              if(e.key === 'Enter'){
                handleSendMessage(e)
              }
             }}
             type="text" placeholder="Send a message"
             className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400 bg-transparent' />
            <input onChange = {handleSendImage} type="file" id='image' accept='image/png, image/jpeg' hidden />
            <label htmlFor="image">
              <img src={assets.gallery_icon} alt="" className='w-5 mr-2 cursor-pointer' />
            </label>
          </div>
          <img onClick={handleSendMessage} src={assets.send_button} alt="" className='w-7 cursor-pointer hover:opacity-80 transition' />
        </div>

    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      <img src={assets.logo_icon} alt="" className='max-w-16' />
      <p className='text-lg font-medium text-white'>Chat anytime, anywhere</p>
    </div>
  )
}

export default ChatContainer