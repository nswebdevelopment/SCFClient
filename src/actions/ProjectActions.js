import Dispatcher from "../dispatcher/Dispatcher";
import api from "../api/api";

export const ActionTypes = {
  FETCHED_PROJECTS: "FETCHED_PROJECTS",
  ADD_PROJECT: "ADD_PROJECT",
  REMOVE_PROJECT: "REMOVE_PROJECT",
  SHOW_LOADER: "SHOW_LOADER",
  HIDE_LOADER: "HIDE_LOADER",
  ERROR: "ERROR",
};


function hideLoader() {
  Dispatcher.dispatch({ type: ActionTypes.HIDE_LOADER });
}

export const ProjectActions = {
  fetchProjects: () => {
    api.getProjects(
      (response) => {
        Dispatcher.dispatch({
          type: ActionTypes.FETCHED_PROJECTS,
          payload: response.data,
        });
      },
      (error) => {
        console.log("ErrorAction:", error.message);
        Dispatcher.dispatch({
          type: ActionTypes.ERROR,
          payload: error,
        });
      }
    );
  },

  addProject: (projectName) => {
    Dispatcher.dispatch({ type: ActionTypes.SHOW_LOADER });
    api
      .addProject(projectName, (response)=>{
        Dispatcher.dispatch({
          type: ActionTypes.ADD_PROJECT,
          payload: response,
        });
        hideLoader();
      },
      (error)=>{
       
        Dispatcher.dispatch({
          type: ActionTypes.ERROR,
          payload: error,
        });

        hideLoader();
      })
     } ,


  removeProject: (project) => {
    Dispatcher.dispatch({ type: ActionTypes.SHOW_LOADER });
    api.removeProject(project.id,(response)=>{
      console.log("removeProject", response);
      Dispatcher.dispatch({
        type: ActionTypes.REMOVE_PROJECT,
        payload: response,
      });
      hideLoader();
    }, (error)=>{
      hideLoader();
      console.log("Error:", error.message);
      Dispatcher.dispatch({
        type: ActionTypes.ERROR,
        payload: error,
      });
    });
  },
};
