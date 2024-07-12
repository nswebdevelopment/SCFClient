import Dispatcher from "../dispatcher/Dispatcher";
import api from "../api/api";

export const ActionTypes = {
  ADD_PROJECT: "ADD_PROJECT",
  REMOVE_PROJECT: "REMOVE_PROJECT",
  SHOW_LOADER: "SHOW_LOADER",
  HIDE_LOADER: "HIDE_LOADER",
};

export const ProjectActions = {
  addProject: (projectName) => {
    Dispatcher.dispatch({ type: ActionTypes.SHOW_LOADER });

    api.addProject(projectName).then((data) => {
      Dispatcher.dispatch({
        type: ActionTypes.ADD_PROJECT,
        payload: data,
      });
      Dispatcher.dispatch({ type: ActionTypes.HIDE_LOADER });
    })
        .catch((error) => {
      console.error("Error:", error);
      // If login fails, you can show an error message here
      Dispatcher.dispatch({
        type: ActionTypes.ERROR,
        payload: error,
      });
    });
  },
  removeProject: (project) => {
    Dispatcher.dispatch({ type: ActionTypes.SHOW_LOADER });
    api.removeProject(project.id).then((data) => {
      console.log("removeProject", data);
      Dispatcher.dispatch({
        type: ActionTypes.REMOVE_PROJECT,
        payload: data,
      });
      Dispatcher.dispatch({ type: ActionTypes.HIDE_LOADER });
    });
  },
};
