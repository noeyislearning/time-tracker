import { useEffect } from "react";

/** React Router DOM */
import { Link } from "react-router-dom";

/** Components */
import ProjectTrackerInput from "../components/common/Inputs/ProjectTrackerInput";
import ProjectTrackerCard from "../components/common/Cards/ProjectTrackerCard";

/** Redux related */
import { useSelector, useDispatch } from "react-redux";
import { fetchTracksByUserId } from "../redux/tracks/reducer";

export default function Tracker() {
  const dispatch = useDispatch();

  /** States */
  const user = useSelector((state) => state.users.user);
  const tracks = useSelector((state) => state.tracks.tracks);
  const { isLoading } = useSelector((state) => state.tracks);

  /** Fetching Tracks by User's ID */
  useEffect(() => {
    if (user && user.user_id) {
      dispatch(fetchTracksByUserId(user.user_id));
    }
  }, [dispatch, user]);

  /** Organization */
  const today = new Date();
  const currentDate = today.toDateString();

  const getTrackDate = (track) => {
    const trackDate = new Date(track.start_time);
    const trackDateString = trackDate.toDateString();

    return trackDateString === currentDate
      ? "Today"
      : trackDate.toLocaleDateString("en-US", { weekday: "long" });
  };

  const organizeTracksByDate = () => {
    const trackGroups = {};

    tracks.forEach((track) => {
      const trackDate = getTrackDate(track);
      if (!trackGroups[trackDate]) {
        trackGroups[trackDate] = [track];
      } else {
        trackGroups[trackDate].push(track);
      }
    });

    // Sort each group of tracks by 'created_at' timestamp
    Object.keys(trackGroups).forEach((date) => {
      trackGroups[date].sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at),
      );
    });

    if (trackGroups["Today"]) {
      const todayTracks = trackGroups["Today"];
      delete trackGroups["Today"];
      const sortedTrackGroups = { Today: todayTracks, ...trackGroups };
      return sortedTrackGroups;
    }

    return trackGroups;
  };

  const countActiveTracksByDate = (groupedTracks) =>
    groupedTracks.filter((track) => !track.end_time).length;
  const trackGroups = organizeTracksByDate();

  return (
    <main className="p-7 w-full h-full overflow-y-scroll">
      <ProjectTrackerInput />

      <div className="flex flex-col">
        {isLoading ? (
          <div className="pt-14 flex flex-col items-center justify-center w-full h-full">
            <span className="text-white text-xl">Fetching tracks...</span>
          </div>
        ) : Object.entries(trackGroups).length > 0 ? (
          Object.entries(trackGroups).map(([date, groupedTracks]) => {
            const activeTracks = countActiveTracksByDate(groupedTracks);
            return (
              <div
                key={date}
                className="px-3 w-full flex flex-row items-center justify-between"
              >
                <div className="w-full flex flex-col gap-4">
                  <div className="pt-14 w-full flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center gap-4">
                      <span className="text-base text-white">{date}</span>
                      <span className="text-gray-500">
                        {groupedTracks.length > 0
                          ? new Date(
                              groupedTracks[0].start_time,
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : ""}
                      </span>
                      <span className="px-4 py-1 bg-green-700 rounded-lg text-white text-sm">
                        {activeTracks} active tracks
                      </span>
                    </div>
                  </div>
                  <div className="w-full flex flex-col gap-1">
                    {groupedTracks.map((track, index) => (
                      <ProjectTrackerCard
                        key={`${track.id}-${index}`}
                        track={track}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="pt-14 flex flex-col items-center justify-center w-full h-full">
            <span className="text-white text-xl">No tracks found.</span>
          </div>
        )}
      </div>

      <div className="pt-4 text-center text-gray-500">
        To see more, navigate to{" "}
        <Link
          to={"/reports"}
          className="text-indigo-600 font-bold underline underline-offset-2"
        >
          Reports
        </Link>{" "}
        tab.
      </div>
    </main>
  );
}
