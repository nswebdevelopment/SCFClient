import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import api from "../api/api";
import "../styles/ProjectManager.css";

function ProjectManager() {
  const navigate = useNavigate();
  const [projects, setProject] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    api.fetchProject().then((data) => {
      console.log("fetchProject", data);
      setProject([...data]);
    });
  }, []);

  function NewProjectPopup({ onClose }) {

    const [projectName, setProjectName] = useState(`Project ${projects.length + 1}`);

    const handleAddProject = (event) => {
      event.preventDefault();
      // Add your logic for adding a new project here
      api.addProject(projectName).then((data) => {
        console.log("addedProject", data);
        setProject([...projects, data]);
      });
      onClose();
    };

    return (
      <div className="popup">
        <h2>Add New Project</h2>
        <form onSubmit={handleAddProject}>
          {/* Add your form fields here */}
          <input type="text" placeholder="Project Name" value={projectName}  onChange={(e) => setProjectName(e.target.value)} />
          <button type="submit">Add</button>
          <button onClick={onClose}>Cancel</button>
        </form>
      </div>
    );
  }

  return (
    <div className="project-container">
      {projects.map((project) => (
        <div
          key={project.id}
          className="project"
          onClick={() => {
            navigate(`/projects/${project.id}`, {
              state: { data: project.id },
            });
          }}
        >
          <h2>{project.name}</h2>
          <p>Project ID: {project.id}</p>
          <p>Number of Parcels: {project.parcels.length}</p>
          <button
            className={"red"}
            onClick={(event) => {
              event.stopPropagation();
              api.removeProject(project.id).then((data) => {
                console.log("removeProject", data);
                setProject(projects.filter((p) => p.id !== project.id));
              });
            }}
          >
            Remove
          </button>
          {/* <ul>
            {project.parcels.map((parcel) => (
              <li>
                <h3>{parcel.name}</h3>
              </li>
            ))}
          </ul> */}
        </div>
      ))}
      {/* <div className="newProject" onClick={()=>{
            api.addProject().then((data) =>{    
              console.log('addedProject', data);
              setProject([...projects, 
              data
              ]);
          })
      }} >
        <h2>Add New Project</h2>
      </div> */}

      {showPopup && <NewProjectPopup onClose={() => setShowPopup(false)} />}
      {!showPopup && (
        <div
          className="newProject"
          onClick={() => {
            setShowPopup(true);
          }}
        >
          <h2>Add New Project</h2>
        </div>
      )}
    </div>
  );
}
export default ProjectManager;
