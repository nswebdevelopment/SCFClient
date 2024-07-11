import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import api from "../../api/api";
import "./ProjectManager.css";
import NewProjectPopup from "./components/NewProjectPopup";

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
        </div>
      ))}

      {showPopup && <NewProjectPopup onClose={() => setShowPopup(false)} projects={projects} setProject={setProject}/>}
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
