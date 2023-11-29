import { useState } from "react"

/** React Router DOM */
import { useNavigate } from "react-router-dom"

/** React Toastify */
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

/** Components */
import Particles from "../components/common/Background/Particles"

/** Redux related */
import { useDispatch } from "react-redux"
import { registerUser, loginUser } from "../redux/users/reducer"

export default function Auth() {

  /** Redux related */
  const dispatch = useDispatch()

  /** React Router DOM */
  const navigate = useNavigate()

  /** States */
  const [showLogin, setShowLogin] = useState(true)
  const [userData, setUserData] = useState({
    user_name: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirm_password: "",
  })

  /** Toggling Sign In/Sign Up */
  const toggleForm = () => {
    setShowLogin((prevState) => !prevState)
  }

  /** Handling inputs */
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUserData((prevState) => ({ ...prevState, [name]: value }))
  }

  /** Toasts */
  const handleRegistrationToast = () => {
    toast.success("You have successfully registered!", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
    })
  }

  const handleLoginToast = () => {
    toast.success("You have successfully logged in!", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
    })
  }

  /** Handling Registration */
  const handleRegisterUser = async () => {
    try {
      const actionResult = await dispatch(registerUser(userData))
      if (registerUser.fulfilled.match(actionResult)) {
        // Trigger the success toast notification when registration is successful
        handleRegisterSuccess()
      }
    } catch (error) {
      console.log("Error registering user: ", error)
    }
  }

  const handleRegisterSuccess = () => {
    // Trigger the registration toast notification
    handleRegistrationToast() 
    toggleForm()
  }

  /** Handling Login */
  const handleLoginUser = async () => {
    try {
      const actionResult = await dispatch(loginUser(userData))
      if (loginUser.fulfilled.match(actionResult)) {
        handleLoginSuccess(actionResult.payload);
      }
    } catch (error) {
      console.log("Error logging in user: ", error)
    }
  }
  
  const handleLoginSuccess = (userData) => {
    // Store tokens in localStorage
    localStorage.setItem("access_token", userData.access);
    localStorage.setItem("refresh_token", userData.refresh);
    localStorage.setItem("user_data", JSON.stringify(userData));
  
    // Trigger the login toast notification
    handleLoginToast()
    
    // Navigate to the dashboard
    setTimeout(() => navigate("/tracker"), 3000)
  }
  

  /** Handling data */
  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    handleRegisterUser()
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    handleLoginUser()
  }


  return (
    <main className="w-screen h-screen mx-autp flex flex-col justify-center items-center bg-slate-950 font-dm-sans tracking-tighter antialiased text-white">
      <Particles className="absolute inset-0 pointer-events-none" quantity={30} />
      <div className="w-full max-w-md flex flex-col items-center justify-center px-6 py-8 mx-auto">
        <div className="w-full p-6 space-y-4">
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-white">
            { showLogin 
              ? "Sign in to your account" 
              : "Create a new account"
            }
          </h1>
          <div className="w-full flex flex-col gap-4">
            {/* Login Form */}
            { showLogin && (
              <form className="flex flex-col gap-4" onSubmit={handleLoginSubmit}>
                <div>
                  <label className="block mb-2 text-sm font-medium text-white">Your email</label>
                  <input 
                    type="email" 
                    name="username" 
                    id="username" 
                    className="bg-gray-800 text-sm text-white rounded-lg focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5 placeholder:text-gray-500" 
                    placeholder="name@company.com" 
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-white">Password</label>
                  <input 
                    type="password" 
                    name="password" 
                    id="password" 
                    placeholder="••••••••" 
                    className="bg-gray-800 text-sm text-white rounded-lg focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5 placeholder:text-gray-500" 
                    onChange={handleInputChange}
                  />
                </div>
                <button type="submit" className="w-full text-white bg-indigo-700 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center tracking-tight">
                  Sign in
                  </button>
              </form>
            )}
            {/* Register Form */}
            { !showLogin && (
              <form className="flex flex-col gap-4" onSubmit={handleRegisterSubmit}>
                <div className="flex flex-row items-center gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-white">Your first name</label>
                    <input 
                      type="text" 
                      name="first_name" 
                      id="first_name" 
                      className="bg-gray-800 text-sm text-white rounded-lg focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5 placeholder:text-gray-500" 
                      placeholder="John" 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-white">Your last name</label>
                    <input 
                      type="text" 
                      name="last_name" 
                      id="last_name" 
                      className="bg-gray-800 text-sm text-white rounded-lg focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5 placeholder:text-gray-500" 
                      placeholder="Doe" 
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-white">Desired username <span className="text-indigo-500 text-xl">*</span></label>
                    <input 
                      type="text" 
                      name="user_name" 
                      id="user_name" 
                      className="bg-gray-800 text-sm text-white rounded-lg focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5 placeholder:text-gray-500" 
                      placeholder="johndoe" 
                      onChange={handleInputChange}
                    />
                  </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-white">Your email <span className="text-indigo-500 text-xl">*</span></label>
                  <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    className="bg-gray-800 text-sm text-white rounded-lg focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5 placeholder:text-gray-500" 
                    placeholder="name@company.com" 
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-white">Password <span className="text-indigo-500 text-xl">*</span></label>
                  <input 
                    type="password" 
                    name="password" 
                    id="password" 
                    placeholder="••••••••" 
                    className="bg-gray-800 text-sm text-white rounded-lg focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5 placeholder:text-gray-500" 
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-white">Confirm Password <span className="text-indigo-500 text-xl">*</span></label>
                  <input 
                    type="password" 
                    name="confirm_password" 
                    id="confirm_password" 
                    placeholder="••••••••" 
                    className="bg-gray-800 text-sm text-white rounded-lg focus:ring-indigo-700 focus:border-indigo-700 block w-full p-2.5 placeholder:text-gray-500" 
                    onChange={handleInputChange}
                  />
                </div>
                <button type="submit" className="w-full text-white bg-indigo-700 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center tracking-tight">
                  Sign up
                </button>
              </form>
            )}
            <p className="text-sm font-light text-gray-500">
              { showLogin 
                ? "Don’t have an account yet?" 
                : "Already have an account?"
              }
              <button className="pl-1 font-medium text-indigo-500 underline underline-offset-2" onClick={toggleForm}>
                { showLogin 
                  ? "Sign up" 
                  : "Sign in"
                }
              </button>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </main>
  )
}
