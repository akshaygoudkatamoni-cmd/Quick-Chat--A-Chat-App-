import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/chat-app-assets/assets';
import { AuthContext } from '../../context/AuthContext';

const ProfilePage = () => {

  const {authUser, updateProfile} = useContext(AuthContext)

  const [selectedImage, setSelectedImage] = useState(null)
  const navigate = useNavigate();
  const [name, setName] = useState(authUser?.fullName || "")
  const [bio, setBio] = useState(authUser?.bio || "")

  useEffect(() => {
    if (authUser) {
      setName(authUser.fullName || "")
      setBio(authUser.bio || "")
    }
  }, [authUser])

  const handleSubmit = async (e) => {
     e.preventDefault()
     if(!selectedImage){
      await updateProfile({fullName : name, bio})
      navigate('/')
      return;
     }

     const reader = new FileReader();
     reader.readAsDataURL(selectedImage);
     reader.onload = async () => {
       const base64Image = reader.result
       await updateProfile({fullName : name, bio, profilePic : base64Image })
       navigate('/')
     }
  }

  return (
    <div className='min-h-screen bg-black/20 bg-cover bg-center bg-no-repeat px-5 py-10 text-white flex items-center justify-center'>
      <div className='flex w-full max-w-[510px] items-center justify-between gap-10 rounded-lg border border-white/35 bg-black/20 px-8 py-8 shadow-2xl backdrop-blur-md'>
        <form onSubmit={handleSubmit} className='w-full max-w-[252px]'>
          <h3 className='mb-5 text-sm font-medium text-white/75'>Profile details</h3>
          <label htmlFor="avatar" className='mb-5 flex cursor-pointer items-center gap-3 text-xs text-white/75'>
            <input onChange={(e) => setSelectedImage(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden />
            <img src={selectedImage ? URL.createObjectURL(selectedImage) : (authUser?.profilePic || assets.avatar_icon)} alt="Profile preview" className='h-9 w-9 rounded-full object-cover'/>
            Click Here To Upload Profile Image
          </label>
          <input onChange={(e) => setName(e.target.value)} value={name} type="text" required placeholder='Your Name' className='mb-4 w-full rounded-md border border-white/35 bg-transparent px-2.5 py-2 text-xs text-white outline-none placeholder:text-white/60 focus:border-violet-400'/>
          <textarea onChange={(e) => setBio(e.target.value)} value={bio} rows={4} placeholder='Write profile bio' required className='mb-4 w-full resize-none rounded-md border border-white/35 bg-transparent px-2.5 py-2 text-xs text-white outline-none placeholder:text-white/60 focus:border-violet-400'></textarea>
          <button type="submit" className='w-full rounded-full bg-gradient-to-r from-fuchsia-400 to-violet-600 py-2 text-xs font-medium text-white transition hover:opacity-90'>Save</button>
        </form>
        <img className='w-40 h-40 rounded-full object-cover mx-auto max-sm:mt-10 border-2 border-violet-500/50 shadow-lg' src={selectedImage ? URL.createObjectURL(selectedImage) : (authUser?.profilePic || assets.avatar_icon)} alt="QuickChat" />
      </div>
    </div>
  )
}

export default ProfilePage