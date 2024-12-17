import { useNavigate } from "react-router-dom";
import React, { useReducer, useEffect } from "react";
import "./ProjectManager.css";
import NewProjectPopup from "./components/NewProjectPopup";

import ProjectStore from "../../stores/ProjectStore";
import RequestStore from "../../stores/RequestStore"
import  AppStore from '../../stores/AppStore';
import { ProjectActions } from "../../actions/ProjectActions";
import FullScreenLoader from "../../components/loader/Loader";

import { useLocation } from 'react-router-dom';


import {  projectManagerReducer, initialState, setProjects, setShowPopup, setLoader, setShowRequestPopup  } from "../../reducers/projectManagerReducer";
import SCFRequestPopup from "../../components/popups/SCFRequest";
import MessagePopup from "../../components/popups/MessagePopup";

function ProjectManager() {
  const navigate = useNavigate();

  const location = useLocation();
  const data = location.state?.data;
  const companyId = location.state?.companyId;
  initialState.showPopup = data;
  const [state, dispatch] = useReducer(projectManagerReducer, initialState);

  const [showMessage, setShowMessage] = React.useState(false);
  const [popupMessage, setPopupMessage] = React.useState("");

  useEffect(() => {
    window.onbeforeunload = () => {
      if (data) {
        navigate(location.pathname, { state: { data: null }, replace: true });
      }
    };
    return () => {
      window.onbeforeunload = null;
    };
    // eslint-disable-next-line
  }, []);


  useEffect(() => {
    // Attach event listener to detect clicks outside the popup
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
     
    };
  }, []);

  const handleOutsideClick = (event) => {
    setShowMessage(false); // Hide the popup
};

  

  const nextProjectId = state.projects.length + 1;
  const handleClose = () => {
    dispatch(setShowPopup(false))
    dispatch(setShowRequestPopup(false))
  };

  const updateProjects = () => {
    console.log("ProjectManager updateProjects", ProjectStore.getAll());
    dispatch(setProjects([...ProjectStore.getAll()]));
    dispatch(setLoader(false));
  };


  const projectAdded = (project) => {
    updateProjects();
    navigate(`/projects/${project.id}`, {
      state: { data: project },
    });
  };

  const requestAdded = (request) => {
    setPopupMessage(`Your request ${request.name} has been sent`)
    setShowMessage(true);
  };

  const showLoader = () => {
    dispatch(setLoader(true));
  };

  const hideLoader = () => {
    dispatch(setLoader(false));
  };

  const handleProjectRemoval = (event, project) => {
    event.stopPropagation();
    handleRemoveProject(project);
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


  const handleSendRequest = () => {
    handleClose();
  }

  const handleShowPopup = () => {
    dispatch(setShowPopup(true));
  };

  const handleShowRequestPopup = () => {
    dispatch(setShowRequestPopup(true));
  };

  const onError = (error) => {
    alert("Error: " + error);  
  }

  useEffect(() => {
    ProjectStore.on("change", updateProjects);
    ProjectStore.on("project_added", projectAdded);
    RequestStore.on("request_added", requestAdded);
    AppStore.on("showLoader", showLoader);
    AppStore.on("hideLoader", hideLoader);
    AppStore.on("error", onError);

    ProjectActions.fetchProjects(companyId);
    return () => {
      ProjectStore.removeListener("change", updateProjects);
      ProjectStore.removeListener("project_added", projectAdded);
      RequestStore.removeListener("request_added", requestAdded)
      AppStore.removeListener("showLoader", showLoader);
      AppStore.removeListener("hideLoader", hideLoader);
      AppStore.removeListener("error", onError);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className="project-container">
      {state.loader ? <FullScreenLoader /> : null}
      {state.projects.map((project) => (
        <div
          key={project.id}
          className="project"
          onClick={() => {
            navigate(`/projects/${project.id}`, {
              // state: { data: project },
            });
          }}
        >
          <h2>{project.name}</h2>
          <p>Project ID: {project.id}</p>
          <p>Number of Parcels: {project.parcels.length}</p>
          <button
            className={"red"}
            onClick={(event) => {
              handleProjectRemoval(event, project);
            }}
          >
            Remove
          </button>
        </div>
      ))}

      {state.showPopup ? (
        <NewProjectPopup
          id={nextProjectId}
          addNewProject={handleAddProject}
          onClose={handleClose}
        />

      ) : (
        <div className="newProject" onClick={handleShowPopup}>
          <h2>Add New Project</h2>
        </div>
      )}

      {
        state.showRequestPopup ? (

          <SCFRequestPopup
            projects={state.projects}
            parcels={[]}
            sendRequest={handleSendRequest}
            onClose={handleClose}
          />
      ) : (null)}

{       showMessage ? (
          MessagePopup("Successfully sent", `${popupMessage}`)
      ) : (null)}

      

      <button onClick={handleShowRequestPopup}>
        Send Request
      </button>
    </div>
  );
}
export default ProjectManager;
