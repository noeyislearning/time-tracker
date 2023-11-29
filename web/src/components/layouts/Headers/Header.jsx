/** Heroicons */
import { InformationCircleIcon } from "@heroicons/react/24/outline"

export default function Header() {
  return (
    <div className="w-full text-white">
      <div className="px-10 py-7 w-full flex flex-row items-center justify-between border-b border-slate-700">
        <div className="text-2xl">Time Tracker</div>
        <div className="text-lg flex flex-row items-center gap-2">
          <InformationCircleIcon className="w-5 h-5 text-gray-500"/>
          <span className="text-gray-500">Total this week: </span> 
          <span className="font-bold">06:07:45</span>
        </div>
      </div>
    </div>
  )
}
