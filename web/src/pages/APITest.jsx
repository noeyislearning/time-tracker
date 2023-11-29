import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../redux/projects/reducer';

export default function APITest() {
  const dispatch = useDispatch();
  const { isLoading, isError, projects } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // Render based on the fetched data
  return (
    <div>
      <h1>Project List</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>Error fetching projects</p>
      ) : Array.isArray(projects) && projects.length > 0 ? (
        <ul>
          {projects.map((project) => (
            <li key={project.id} className='text-white'>{project.name}</li>
            // Assuming 'name' is a property of your project object, adjust this accordingly
          ))}
        </ul>
      ) : (
        <p>No projects available</p>
      )}
    </div>
  );
}
