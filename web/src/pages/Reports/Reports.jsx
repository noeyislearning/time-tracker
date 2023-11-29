import { useEffect } from "react";

/** React Router DOM */
import { Link } from "react-router-dom";

/** Heroicons */
import {
  ShieldCheckIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";

/** Redux related */
import { useSelector, useDispatch } from "react-redux";
import { fetchProjects } from "../../redux/projects/reducer";

export default function Reports() {
  /** Redux related */
  const dispatch = useDispatch();
  const { projects } = useSelector((state) => state.projects);

  /** Fetching data (projects) from the API. */
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  return (
    <main className="p-7 w-full overflow-y-scroll">
      <div className="w-full flex flex-col text-white">
        <div className="w-full flex flex-row items-center gap-8 justify-end">
          <div className="flex flex-row items-center gap-1 text-green-700">
            <ShieldCheckIcon className="w-5 h-5" />
            <span>Authorized</span>
          </div>
          <div className="flex flex-row items-center gap-1 text-red-700">
            <ShieldExclamationIcon className="w-5 h-5" />
            <span>Not authorized</span>
          </div>
        </div>
        <div className="pt-4 w-full grid grid-cols-4 gap-4 items-center text-white">
          {projects.map((project) => {
            const activeTracks = project.tracks.filter(
              (track) => !track.end_time,
            ).length;

            return (
              <Link
                key={project.id}
                to={`/report/${project.id}`}
                className="p-4 w-full flex flex-col bg-slate-800/75 rounded-lg hover:bg-slate-700/75"
              >
                <span className="text-lg font-bold whitespace-nowrap overflow-hidden overflow-ellipsis">
                  {project.name}
                </span>
                <div className="flex flex-row items-center gap-2">
                  <div className="flex flex-row items-center gap-1">
                    <span className="text-sm text-gray-500">Total:</span>
                    <span
                      className={`text-sm font-bold ${
                        project.tracks.length > 0
                          ? "text-green-500"
                          : "text-gray-500"
                      }`}
                    >
                      {project.tracks.length}
                    </span>
                  </div>
                  <div className="flex flex-row items-center gap-1">
                    <span className="text-sm text-gray-500">Active:</span>
                    <span
                      className={`text-sm font-bold ${
                        activeTracks > 0 ? "text-green-500" : "text-gray-500"
                      }`}
                    >
                      {activeTracks}
                    </span>
                  </div>
                </div>
                <div className="mt-8 flex flex-row items-center gap-1">
                  <span className="text-sm text-gray-500">Added by</span>
                  <span className="text-sm text-indigo-500 underline underline-offset-2">
                    {" "}
                    {project.added_by}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
