import { useNavigate } from "react-router-dom"
import { assets } from "../assets/assets"
import { useEffect, useRef, useState, type FormEvent } from "react"
import AOS from "aos"
import toast from "react-hot-toast"
import axios from "axios"


const ForgotPassword = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [isEmail, setIsEmail] = useState(false)
    const [otp, setOtp] = useState("")
    const [isOtp, setIsOtp] = useState(false)
    const [newPassword, setNewPassword] = useState("")

    useEffect(() => {
        AOS.init({once: true})
        inputRef.current[0]?.focus()
    },[])

    const inputRef = useRef<HTMLInputElement[]>([])

    axios.defaults.withCredentials = true

    const onsubEmail = async(e:FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(email.trim().length === 0) return toast.error("Email is required!")
        
        const toastId = toast.loading("sending OTP to mail")

        try {
            const {data} = await axios.post(`${import.meta.env.VITE_BackendURL}/api/user/send-reset-otp`, {email})

            if(data.success){
                setIsEmail(true)
                toast.success(data.msg)
            }
            else{
                toast.error(data.msg)
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message)
        }
        finally{
            toast.dismiss(toastId)
        }
    }

    const onSetOTP = async(e:FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const enteredOtp = inputRef.current.map(item => item.value).join('')

        setOtp(enteredOtp)

        if(enteredOtp.trim().length < 6) return toast.error("Please enter valid OTP")
            
        try {
            const {data} = await axios.post(`${import.meta.env.VITE_BackendURL}/api/user/check`,
                {email,otp: enteredOtp}
            )

            if(data.success){
                toast.success(data.msg)
                setIsOtp(true)
            }
            else{
                toast.error(data.msg)
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const onInput = (e:React.ChangeEvent<HTMLInputElement>, index:number) => {
        if(e.target.value && index < inputRef.current.length - 1){
            inputRef.current[index + 1].focus()
        }
    }

    const handleKey = (e:React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if(e.key === "Backspace" && (e.target as HTMLInputElement).value === "" && index > 0){
            inputRef.current[index - 1].focus()
        }
    }

    const handlePaste = (e:React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault()
        const otpClip = e.clipboardData.getData('text').slice(0,6)
        inputRef.current.forEach(item => item.value = "")
        otpClip.split("").forEach((char, index) => {
            if(inputRef.current[index]){
                inputRef.current[index].value = char
            }
        })
    }

    const handleNewPassword = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(newPassword.trim().length < 6) return toast.error("Password must be at least 6 characters");

        try {
            const {data} = await axios.post(`${import.meta.env.VITE_BackendURL}/api/user/reset-password`,
                {email,newPassword}
            )

            if(data.success){
                toast.success(data.msg)
                navigate("/login")
            }else{
                toast.error(data.msg)
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message)
        }
    }
  return (
    <>
        <div className="fixed inset-0 bg-black/40 backdrop-blur-lg flex items-center justify-center z-50">
            {!isEmail && (
                <div data-aos="fade-up" className="bg-[#1f2937] text-white p-6 mx-2 rounded-xl shadow-2xl w-full sm:w-[450px] animate-fadeIn relative">
                    {/* Logo */}
                    <div
                    onClick={() => navigate("/")}
                    className="flex items-center justify-center mb-6 cursor-pointer select-none"
                    >
                    <img
                        src={assets.logo}
                        alt="LaForge Logo"
                        className="w-10 h-10 mr-2 drop-shadow-md"
                    />
                    <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                        LaForge
                    </p>
                    </div>

                    <h2 className="text-center text-sm font-light mb-6">
                    Enter your existing email for verification
                    </h2>

                    <form  onSubmit={e => onsubEmail(e)} className="space-y-5">
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm mb-1">
                        Email
                        </label>
                        <div className="flex items-center bg-[#374151] border border-gray-600 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition">
                        <i className="fas fa-envelope text-gray-400 mr-2"></i>
                        <input
                            id="email"
                            type="email"
                            onChange={e => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                            className="w-full bg-transparent focus:outline-none placeholder-gray-400 text-sm"
                        />
                        </div>
                    </div>


                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition text-center"
                    >
                        Submit
                    </button>
                    </form>
                </div>
            )}

            {isEmail && !isOtp && (
                <div data-aos="fade-up"  onPaste={e => handlePaste(e)} className="bg-[#1f2937] text-white p-6 mx-2 rounded-xl shadow-2xl w-full sm:w-[450px] animate-fadeIn relative">
                    {/* Logo */}
                    <div
                    onClick={() => navigate("/")}
                    className="flex items-center justify-center mb-6 cursor-pointer select-none"
                    >
                    <img
                        src={assets.logo}
                        alt="LaForge Logo"
                        className="w-10 h-10 mr-2 drop-shadow-md"
                    />
                    <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                        LaForge
                    </p>
                    </div>

                    <h2 className="text-center text-sm font-light mb-6">
                        Enter the 6-digit OTP code we sent to your email to verify your
                        account.
                    </h2>

                    <form onSubmit={e => onSetOTP(e)} className="space-y-5">
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm mb-1">
                            Enter OTP
                        </label>
                        <div className="flex items-center justify-center bg-[#374151] border border-gray-600 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition">
                            <i className="fas fa-key text-gray-400 mr-2"></i>
                            <div className="flex items-center gap-1">
                                {Array(6).fill(0).map((_,i) => (
                                    <input type="text" key={i} onKeyDown={e => handleKey(e,i)} onChange={(e) => onInput(e,i)} maxLength={1} ref={e => {if(e){
                                        inputRef.current[i] = e
                                    }}}  className="h-10 w-10 sm:h-14 sm:w-14 text-center border border-gray-600 outline-0 rounded" />
                                ))}
                            </div>
                        </div>
                    </div>


                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition text-center"
                    >
                        Submit
                    </button>
                    </form>
                </div>
            )}

            {isEmail && isOtp && (
                <div data-aos="fade-up" className="bg-[#1f2937] text-white p-6 mx-2 rounded-xl shadow-2xl w-full sm:w-[450px] animate-fadeIn relative">
                    {/* Logo */}
                    <div
                    onClick={() => navigate("/")}
                    className="flex items-center justify-center mb-6 cursor-pointer select-none"
                    >
                    <img
                        src={assets.logo}
                        alt="LaForge Logo"
                        className="w-10 h-10 mr-2 drop-shadow-md"
                    />
                    <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                        LaForge
                    </p>
                    </div>

                    <h2 className="text-center text-sm font-light mb-6">
                    Reset your password
                    </h2>

                    <form onSubmit={e => handleNewPassword(e)} className="space-y-5">
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm mb-1">
                        New Password
                        </label>
                        <div className="flex items-center bg-[#374151] border border-gray-600 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition">
                        <i className="fas fa-key text-gray-400 mr-2"></i>
                        <input
                            
                            type="text"
                            onChange={e => setNewPassword(e.target.value)}
                            required
                            placeholder="Enter your new password"
                            className="w-full bg-transparent focus:outline-none placeholder-gray-400 text-sm"
                        />
                        </div>
                    </div>


                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition text-center"
                    >
                        Submit
                    </button>
                    </form>
                </div>
            )}

            
        </div>
    </>
  )
}

export default ForgotPassword