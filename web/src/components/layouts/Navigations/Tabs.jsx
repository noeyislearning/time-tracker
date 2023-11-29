import { useEffect, useState } from "react";

/** React Router DOM */
import { NavLink, useLocation } from "react-router-dom";

/** ReactToolTip */
import { Tooltip } from "react-tooltip";

/** Heroicon */
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export default function Tabs() {
  const location = useLocation();
  const [isReportsActive, setIsReportsActive] = useState(false);

  useEffect(() => {
    setIsReportsActive(location.pathname.includes("/report"));
  }, [location]);

  return (
    <nav className="relative w-full text-white">
      <div className="pl-10 relative w-full flex gap-4 flex-row items-center z-10">
        <NavLink
          to={"/tracker"}
          className={({ isActive }) =>
            `py-4 ${isActive ? "border-b-2" : "border-b-2 border-transparent"}`
          }
        >
          Tracker
        </NavLink>
        <NavLink
          to={"/reports"}
          className={`py-4 ${
            isReportsActive ? "border-b-2" : "border-b-2 border-transparent"
          }`}
        >
          Reports
        </NavLink>
        <div className="flex flex-row gap-1 items-center text-gray-500 border-b-2 border-transparent">
          <span className="">Insights</span>
          <InformationCircleIcon id="tab-tooltip" className="w-5 h-5" />
          <Tooltip anchorSelect="#tab-tooltip">
            <span className="text-xs">Not yet available</span>
          </Tooltip>
        </div>
        <div className="flex flex-row gap-1 items-center text-gray-500 border-b-2 border-transparent">
          <span className="">Manage</span>
          <InformationCircleIcon id="tab-tooltip" className="w-5 h-5" />
          <Tooltip anchorSelect="#tab-tooltip">
            <span className="text-xs">Not yet available</span>
          </Tooltip>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 border-b border-slate-700"></div>
    </nav>
  );
}
