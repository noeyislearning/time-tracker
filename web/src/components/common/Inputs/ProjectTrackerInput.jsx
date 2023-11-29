import { Fragment, useState, useEffect } from "react";

/** HeadlessUI */
import { Listbox, Transition } from "@headlessui/react";

/** Heroicons */
import { ChevronUpDownIcon, PlayIcon } from "@heroicons/react/24/solid";

/** Redux related */
import { useSelector, useDispatch } from "react-redux";
import { fetchProjects } from "../../../redux/projects/reducer";
import {
  createTrack,
  fetchTracksByUserId,
} from "../../../redux/tracks/reducer";

export default function ProjectTrackerInput() {
  /** Redux related */
  const dispatch = useDispatch();
  const { projects } = useSelector((state) => state.projects);
  const user = useSelector((state) => state.users.user);

  /** States */
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  );
  const [selectedProject, setSelectedProject] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  /** Fecthing data (projects) from the API. */
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  /** Real-time update Time */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /** Date today, format: Nov. 25, 2023 */
  const dateToday = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  /** Handling Create Tracks */
  const handleCreateTrack = (event) => {
    event.preventDefault();

    if (selectedProject && title) {
      const trackData = {
        title,
        description,
        project: selectedProject.id,
        start_time: new Date().toISOString(),
        end_time: null,
        status: "ST",
        duration: null,
        added_by: user.user_id,
      };

      dispatch(createTrack(trackData))
        .then(() => {
          setSelectedProject(null);
          setTitle("");
          setDescription("");

          // Fetch tracks again after successful creation
          dispatch(fetchTracksByUserId(user.user_id));
        })
        .catch((error) => {
          console.error("Error creating track:", error);
        });
    } else {
      console.error("Please fill in all required fields.");
    }
  };

  return (
    <div className="px-3 pt-4 w-full">
      <form
        action="POST"
        className="p-4 w-full bg-slate-800/75 rounded-lg"
        onSubmit={handleCreateTrack}
      >
        <div className="flex flex-col gap-4">
          <div className="px-4 w-full flex flex-row items-center">
            <input
              className="bg-transparent w-full outline-none text-lg text-white font-bold placeholder:font-normal"
              placeholder="What are you working for?"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <div className="w-full flex flex-row justify-end items-center gap-8">
              <Listbox value={selectedProject} onChange={setSelectedProject}>
                <div className="relative">
                  <div className="relative cursor-default overflow-hidden rounded-lg text-left focus:outline-none">
                    <Listbox.Button className="relative w-48 text-sm text-white cursor-default rounded-lg bg-slate-700/75 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none">
                      <span className="block truncate">
                        {selectedProject
                          ? selectedProject.name
                          : "Select a Project"}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="mt-2 absolute max-h-60 w-full overflow-auto rounded-lg bg-white text-basefocus:outline-none text-sm">
                      {projects.map((project, index) => (
                        <Listbox.Option
                          key={index}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 px-4 ${
                              active
                                ? "bg-slate-300 text-slate-900"
                                : "text-gray-900"
                            }`
                          }
                          value={project}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {project.name}
                              </span>
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
              <div className="flex flex-row items-start gap-8">
                <div className="flex flex-col items-start">
                  <span className="text-xs text-gray-400">Date starts at</span>
                  <time className="-mt-1 text-lg text-gray-500 font-bold">
                    {dateToday}
                  </time>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs text-gray-400">Time starts at</span>
                  <time className="-mt-1 text-lg text-gray-500 font-bold">
                    {currentTime}
                  </time>
                </div>
              </div>
              <button
                type="submit"
                className="p-2 bg-indigo-700 rounded-full text-white text-sm tracking-tighter"
              >
                <PlayIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="border-t border-slate-700/75 px-4 pt-4 text-sm text-gray-500">
            <input
              className="bg-transparent w-full outline-none text-white"
              placeholder="Wanna give it a short description?"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
