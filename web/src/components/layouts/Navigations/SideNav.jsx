import { useEffect } from "react";

/** React Toastify */
import { toast } from "react-toastify";

/** React Router DOM */
import { useNavigate } from "react-router-dom";

/** Heroicons */
import { ClockIcon } from "@heroicons/react/24/outline";

/** Redux related */
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../../redux/users/reducer";

export default function SideNav() {
  /** Redux related */
  const dispatch = useDispatch();

  /** React Router DOM */
  const navigate = useNavigate();

  /** States */
  const user = useSelector((state) => state.users.user);
  const isLoading = useSelector((state) => state.users.isLoading); // New isLoading state

  useEffect(() => {
    localStorage.getItem("refresh_token");
    localStorage.getItem("access_token");
  }, [dispatch]);

  /** Handling logout */
  const handleLogout = () => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      setTimeout(() => {
        dispatch(logoutUser(accessToken))
          .then(() => {
            // Clear tokens from localStorage after successful logout
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");

            // Navigate to login page
            navigate("/");

            // Display logout toast
            handleLogoutToast();
          })
          .catch((error) => {
            console.error("Error logging out:", error);
          });
      }, 500); // Delay everything by 3000 ms
    } else {
      console.log("Access token not available");
    }
  };

  const handleLogoutToast = () => {
    toast.info("You have successfully logged out!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      draggable: true,
    });
  };

  return (
    <aside className="w-96 h-full border-r border-slate-700 text-white">
      <div className="flex h-full flex-col items-start">
        {/* Team */}
        <div className="p-4 w-full flex flex-row items-center gap-4 border-b border-slate-700">
          <div className="relative inline-flex items-center justify-center w-14 h-14 overflow-hidden bg-indigo-800 rounded-full">
            <span className="font-bold text-2xl text-gray-300">CW</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-semibold text-lg">Countable Web</span>
            <span className="-mt-1 text-sm text-gray-400">Pro Team</span>
          </div>
        </div>
        {/* Tools */}
        <div className="px-4 pt-16 pb-4 w-full flex flex-col items-start">
          <div className="text-xl">Tools</div>
          <div className="pt-4 w-full flex flex-col items-start gap-4">
            <div className="px-4 py-3 w-full flex flex-row gap-4 items-center bg-slate-800/75 rounded-lg cursor-pointer">
              <ClockIcon className="w-6 h-6" />
              <div className="text-base font-medium">Time Tracker</div>
            </div>
          </div>
        </div>
        <div className="p-4 mt-auto w-full flex flex-row items-center justify-between">
          {isLoading ? (
            <div className="flex flex-col items-start animate-pulse">
              <div className="text-lg">Loading...</div>
              <span className="-mt-1 text-sm text-gray-500">Loading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-start">
              <div className="text-lg">
                {user.first_name} {user.last_name}
              </div>
              <span className="-mt-1 text-sm text-gray-500">{user.email}</span>
            </div>
          )}
          <button
            className="px-4 py-2 text-sm bg-red-500 rounded-lg tracking-tight"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
