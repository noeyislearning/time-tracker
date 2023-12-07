import { useState, useEffect, useMemo } from "react";

/** React Router DOM */
import { Link } from "react-router-dom";

/** HeadlessUI */
import { Disclosure } from "@headlessui/react";

/** Heroicons */
import {
  TrashIcon,
  StopIcon,
  ArrowLongRightIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";

/** Redux related */
import { useDispatch, useSelector } from "react-redux";
import { stopTrack } from "../../../redux/tracks/reducer";

export default function ProjectTrackerCard({ track }) {
  const dispatch = useDispatch();

  /** States */
  const isLoading = useSelector((state) => state.tracks.isLoading);

  /** Tracks */
  const { title, start_time, end_time, duration } = track;

  /** convert start_time and end_time to Date */
  const startTime = useMemo(() => new Date(start_time), [start_time]);
  const endTime = useMemo(
    () => (end_time ? new Date(end_time) : null),
    [end_time],
  );

  /** Format Duration */
  const formatDuration = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  /** States */
  const [elapsedTime, setElapsedTime] = useState(() => {
    return duration ? formatDuration(duration) : "00:00:00"; // Initialize with formatted duration
  });

  /** Handling Stop Tracks */
  const handleStopTrack = async () => {
    try {
      // Dispatch the stopTrack action passing the track id
      await dispatch(stopTrack(track.id));
      // Optionally, you can perform any additional logic after stopping the track
    } catch (error) {
      // Handle error if needed
      console.error("Error stopping track:", error);
    }
  };

  useEffect(() => {
    const calculateElapsedTime = () => {
      if (!endTime) {
        const now = new Date();
        const elapsed = Math.floor((now - startTime) / 1000);

        setElapsedTime(formatDuration(elapsed));
      }
    };

    const timer = setInterval(calculateElapsedTime, 1000);

    return () => clearInterval(timer);
  }, [endTime, startTime]);

  return (
    <Disclosure>
      {({ open }) => (
        <div className="w-full p-4 flex flex-col gap-4 bg-slate-800/75 rounded-md text-white">
          <div className="w-full px-4 flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-4">
              <span className="font-bold">{title}</span>
              <Link
                to={`/report/${track.project.id}`}
                className="px-2 py-.5 flex flex-row text-xs items-center gap-2 rounded-md bg-indigo-200"
              >
                <div className="text-indigo-600">{track.project.name}</div>
              </Link>
            </div>
            <div className="flex flex-row items-center gap-8">
              <div className="flex flex-row items-center gap-8">
                <div className="flex flex-row items-center gap-4">
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-gray-400">Started at</span>
                    <time className="-mt-1 text-lg font-bold">
                      {startTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </time>
                    <time className="-mt-2 text-xs text-gray-400">
                      {startTime.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                  {endTime && <ArrowLongRightIcon className="w-6 h-6" />}
                  {endTime && (
                    <div className="flex flex-col items-start">
                      <span className="text-xs text-gray-400">Ended at</span>
                      <time className="-mt-1 text-lg font-bold">
                        {endTime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </time>
                      <time className="-mt-2 text-xs text-gray-400">
                        {endTime.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                  )}
                </div>
                {/* If endTime is null display "On-going" if not display the {duration} */}
                <div className="flex">
                  {endTime ? (
                    isLoading ? (
                      <span className="-mt-1 text-lg font-bold">
                        Loading...
                      </span>
                    ) : (
                      <div className="flex flex-col items-start">
                        <span className="text-xs text-gray-400">Duration</span>
                        <time className="-mt-1 text-lg font-bold">
                          {duration}
                        </time>
                        <div className="-mt-2 text-xs text-indigo-400">
                          Good job!
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="flex flex-col items-start">
                      <span className="text-xs text-gray-400">
                        Elapsed time
                      </span>
                      {isLoading ? (
                        <span className="-mt-1 text-lg font-bold">
                          Loading...
                        </span>
                      ) : (
                        <>
                          <time className="-mt-1 text-lg font-bold">
                            {elapsedTime ? elapsedTime : "00:00:00"}
                          </time>
                          <div className="-mt-2 text-xs text-green-400">
                            Still running...
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className={`${
                  endTime ? "hidden" : "flex"
                } p-2 bg-red-500 rounded-full text-white text-sm tracking-tighter`}
                onClick={handleStopTrack}
              >
                <StopIcon className="w-5 h-5" />
              </button>
              <Disclosure.Button>
                <ChevronDownIcon
                  className={`${
                    open ? "rotate-180 transform" : ""
                  } h-5 w-5 text-indigo-500 duration-300`}
                />
              </Disclosure.Button>
            </div>
          </div>
          <Disclosure.Panel className="w-full px-4 pt-4 flex flex-row items-center justify-between border-t border-slate-700/75 text-sm text-gray-500">
            <span>{track.description}</span>
            <button className="text-red-500">
              <TrashIcon className="w-5 h-5" />
            </button>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}
