import React, { useState } from 'react'
import assets from '../assets/chat-app-assets/assets'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

const LoginPage = () => {

  const [currentState, setCurrentState] = useState("Sign up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)

  const { login } = useContext(AuthContext)

  const onSubmitHandler = (event) => {
    event.preventDefault()

    if(currentState === "Sign up" && !isDataSubmitted){
      setIsDataSubmitted(true)
      return
    }

    login(currentState === "Sign up" ? 'signup' : 'login', {fullName, email, password, bio})
  }

  return (
    <div className='relative isolate min-h-screen overflow-hidden flex items-center justify-center gap-24 px-6 py-10 text-white before:absolute before:inset-0 before:-z-10 before:scale-110 before:bg-[url("./assets/chat-app-assets/bgImage.svg")] before:bg-cover before:bg-center before:blur-2xl'>
      {/* --- left --- */}
      <div className='hidden md:flex w-[420px] items-center justify-center'>
        <img src={assets.logo_big} alt="QuickChat" className='w-full max-w-[310px]' />
      </div>

      {/* --- right --- */}

      <form onSubmit={onSubmitHandler} className='w-full max-w-[320px] rounded-lg border border-white/35 bg-black/25 px-5 py-6 shadow-2xl backdrop-blur-md'>
        <h2 className='mb-6 flex items-center justify-between text-xl font-semibold'>
          {currentState}
          {isDataSubmitted && <img onClick={() => setIsDataSubmitted(false)} src={assets.arrow_icon} alt="Back" className='w-5 cursor-pointer opacity-70' />}
        </h2>

        {currentState ==="Sign up" && !isDataSubmitted && (
          <input onChange={(e) => setFullName(e.target.value)} value={fullName}
          type="text" className='mb-4 w-full rounded-md border border-white/35 bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/55 focus:border-violet-400' placeholder='Full Name' required />
        )}

        {!isDataSubmitted && (
          <>
          <input onChange={(e) => setEmail(e.target.value)} value={email}
           type="email" placeholder='Email Address' required className='mb-4 w-full rounded-md border border-white/35 bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/55 focus:border-violet-400' />
           <input onChange={(e) => setPassword(e.target.value)} value={password}
           type="password" placeholder='Password' required className='mb-5 w-full rounded-md border border-white/35 bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/55 focus:border-violet-400' />
          </>
        )}

        {currentState === "Sign up" && isDataSubmitted && (
          <textarea onChange={(e) => setBio(e.target.value)} value={bio}
           rows={4} className='mb-5 w-full resize-none rounded-md border border-white/35 bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/55 focus:border-violet-400' placeholder='provide a short bio...' required></textarea>
        )}

        <button type='submit' className='w-full rounded-md bg-gradient-to-r from-fuchsia-400 to-violet-600 py-3 text-sm font-medium text-white transition hover:opacity-90'>
          {currentState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        {currentState === "Sign up" && !isDataSubmitted && (
          <label className='mt-5 flex items-start gap-2 text-xs text-white/55'>
            <input type='checkbox' className='mt-0.5 accent-violet-500' required />
            <span>Agree to the terms of use &amp; privacy policy.</span>
          </label>
        )}

        <div className='mt-5 text-xs text-white/55'>
          {currentState === "Sign up" ? (
            <p>Already have an account ? <span onClick={() => {setCurrentState("Login"); setIsDataSubmitted(false)}} className='cursor-pointer text-violet-400 hover:text-violet-300'>Login here</span></p>
          ) : (
            <p>Create an account <span onClick={() => {setCurrentState("Sign up")}} className='cursor-pointer text-violet-400 hover:text-violet-300'>Click here</span></p>
          )}
        </div>

      </form>
    </div>
  )
}

export default LoginPage