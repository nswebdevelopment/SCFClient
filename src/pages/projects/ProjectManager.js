import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./ProjectManager.css";
import NewProjectPopup from "./components/NewProjectPopup";

import ProjectStore from "../../stores/ProjectStore";
import { ProjectActions } from "../../actions/ProjectActions";
import FullScreenLoader from "../../components/loader/Loader";

function ProjectManager() {
  const navigate = useNavigate();
  const [projects, setProject] = useState(ProjectStore.getAll());
  const [showPopup, setShowPopup] = useState(false);
  const [loader, setLoader] = useState(false);

  const nextProjectId = projects.length + 1;
  const handleClose = () => setShowPopup(false);

  useEffect(() => {
    ProjectStore.on("change", updateProjects);
    ProjectStore.on("showLoader", showLoader);
    ProjectStore.on("hideLoader", hideLoader);
    return () => {
      ProjectStore.removeListener("change", updateProjects);
      ProjectStore.removeListener("showLoader", showLoader);
      ProjectStore.removeListener("hideLoader", hideLoader);
    };
  }, []);

  const updateProjects = () => {
    setProject([...ProjectStore.getAll()]);
    setLoader(false);
  };

  const showLoader = () => {
    setLoader(true);
  };

  const hideLoader = () => {
    setLoader(false);
  };

  const handleRemoveProject = (project) => {
    if (project) {
      ProjectActions.removeProject(project);
    }
  };

  const handleAddProject = (projectName) => {
    if (projectName) {
      ProjectActions.addProject(projectName);
    }

    handleClose();
  };

  return (
    <div className="project-container">
      {loader ? <FullScreenLoader /> : null}
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
              handleRemoveProject(project);
            }}
          >
            Remove
          </button>
        </div>
      ))}

      {showPopup && (
        <NewProjectPopup
          id={nextProjectId}
          addNewProject={handleAddProject}
          onClose={handleClose}
        />
      )}
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
