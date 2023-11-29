import { useEffect } from "react"

/** Heroicons */
import { InformationCircleIcon, ArrowLongRightIcon } from "@heroicons/react/24/outline"

/** Redux related */
import { useDispatch, useSelector } from "react-redux"
import { fetchWeeklyTotalDuration } from "../../../redux/tracks/reducer"

export default function Header() {

  /** Redux related */
  const dispatch = useDispatch()

  /** State */
  const user = useSelector((state) => state.users.user)
  const weeklyTotalDuration = useSelector((state) => state.tracks.weeklyTotalDuration)
  const isLoading = useSelector((state) => state.tracks.isLoading)

  const userId = user.user_id

  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric", year: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    if (userId) {
      dispatch(fetchWeeklyTotalDuration(userId));
    }
  }, [dispatch, userId]);

  return (
    <div className="w-full text-white">
      <div className="px-10 py-7 w-full flex flex-row items-center justify-between border-b border-slate-700">
        <div className="text-2xl">Time Tracker</div>
        <div className="flex flex-col items-end">
          <div className="text-lg flex flex-row items-center gap-2">
            <InformationCircleIcon className="w-5 h-5 text-gray-500"/>
            <span className="text-gray-500">Total this week: </span> 
            {isLoading ? (
              <span>Loading...</span>
            ) : (
              <span className="font-bold">
                {weeklyTotalDuration ? weeklyTotalDuration.total_duration_within_week : 'Loading...'}
              </span>
            )}
          </div>
          <div className="flex flex-row items-center gap-2">
            <span className="text-xs">
              {weeklyTotalDuration ? formatDate(weeklyTotalDuration.start_date) : 'Loading...'}
            </span>
            <ArrowLongRightIcon className="w-5 h-5 text-white"/>
            <span className="text-xs">
              {weeklyTotalDuration ? formatDate(weeklyTotalDuration.end_date) : 'Loading...'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
