import { useEffect } from "react";

/** React Router DOM */
import { Link, useParams } from "react-router-dom";

/** Heroicons */
import { ChevronRightIcon } from "@heroicons/react/24/outline";

/** Redux related */
import { useSelector, useDispatch } from "react-redux";
import { fetchProjectById } from "../../redux/projects/reducer";

/** Components */
import ProjectTrackerCard from "../../components/common/Cards/ProjectTrackerCard";

export default function Report() {
  const dispatch = useDispatch();

  /** Getting the Project ID from the URL */
  const { projectId } = useParams();

  /** States */
  const { selectedProject, isLoading } = useSelector((state) => state.projects);
  const tracks = useSelector(
    (state) => state.projects.selectedProject?.tracks || [],
    (prev, next) => prev.length === next.length,
  );

  /** Fetching data (projects) from the API. */
  useEffect(() => {
    if (projectId) dispatch(fetchProjectById(projectId));
  }, [dispatch, projectId]);

  /** Getting the date from the tracks */
  const today = new Date();
  const currentDate = today.toDateString();

  const getTrackDate = (track) => {
    const trackDate = new Date(track.start_time);
    const trackDateString = trackDate.toDateString();

    return trackDateString === currentDate
      ? "Today"
      : trackDate.toLocaleDateString("en-US", { weekday: "long" });
  };

  /** Organize tracks by their date */
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

    // Reorder the trackGroups to ensure "Today" appears first
    if (trackGroups["Today"]) {
      const todayTracks = trackGroups["Today"];
      delete trackGroups["Today"];
      const sortedTrackGroups = { Today: todayTracks, ...trackGroups };
      return sortedTrackGroups;
    }

    return trackGroups;
  };

  const countActiveTracksByDate = (groupedTracks) => {
    return groupedTracks.filter((track) => !track.end_time).length;
  };
  const trackGroups = organizeTracksByDate();

  return (
    <main className="p-7 w-full overflow-y-scroll">
      <div className="flex flex-col">
        <div className="px-3 flex flex-row items-center gap-2">
          <Link
            to={"/reports"}
            className="text-gray-500 hover:underline hover:underline-offset-2"
          >
            Reports
          </Link>
          <ChevronRightIcon className="h-4 w-4 text-gray-500" />
          <span className="text-white">
            {isLoading
              ? "Loading..."
              : selectedProject === null
                ? "Not found"
                : selectedProject?.name}
          </span>
        </div>
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
                    {/* Mapping tracks and rendering ProjectTrackerCard component */}
                    {groupedTracks.map((track) => (
                      <ProjectTrackerCard key={track.id} track={track} />
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
    </main>
  );
}
