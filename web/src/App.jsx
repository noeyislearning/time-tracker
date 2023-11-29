import { useEffect } from "react"

/** React Router DOM */
import { Routes, Route } from "react-router-dom"

/** Components */
import SideNav from "./components/layouts/Navigations/SideNav"
import Header from "./components/layouts/Headers/Header"
import Tabs from "./components/layouts/Navigations/Tabs"
/** Components (Pages) */
import Tracker from "./pages/Tracker"
import Report from "./pages/Reports/Report"
import Reports from "./pages/Reports/Reports"
/** Component (Route Protection) */


/** Redux related */
import { useDispatch, useSelector } from "react-redux"
import { setTokensFromStorage, fetchUserDetails, setUserFromLocalStorage } from "./redux/users/reducer"

function App() {

  const dispatch = useDispatch()

  /** Retrieve user daata */
  const user = useSelector((state) => state.users.user)

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token")
    const refreshToken = localStorage.getItem("refresh_token")

    if (accessToken && refreshToken) { 
      dispatch(setTokensFromStorage({ accessToken, refreshToken }))
      dispatch(fetchUserDetails())
    }

    const storedUser = localStorage.getItem("user")

    if (storedUser) {
      dispatch(setUserFromLocalStorage(JSON.parse(storedUser)))
    }
  },  [dispatch])

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <main className="w-screen h-screen flex flex-row bg-slate-950 font-dm-sans tracking-tighter antialiased">
      {/* Aside (Side Navbar) */}
      <SideNav user={user}/>
      {/* Navbar */}
      <div className="w-full h-full flex flex-col">
        <Header />
        {/* Content */}
        {/* Tabs */}
        <Tabs/>
        <Routes>
          {/* Tracker */}
          <Route path="/tracker" element={<Tracker />} />
          {/* Reports */}
          <Route path="/reports" element={<Reports />} />
          {/* Nested Routes for Reports */}
          <Route path="/report/:projectId" element={<Report />} />
        </Routes>
      </div>
    </main>
  )
}

export default App
