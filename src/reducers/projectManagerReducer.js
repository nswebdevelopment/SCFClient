import ProjectStore from "../stores/ProjectStore";

const SET_PROJECTS = "SET_PROJECTS";
const SET_SHOW_POPUP = "SET_SHOW_POPUP";
const SHOW_LOADER = "SHOW_LOADER";
const SHOW_REQUEST_POPUP = "SHOW_REQUEST_POPUP";

const initialState = {
  projects: ProjectStore.getAll(),
  showPopup: false,
  showRequestPopup: false,
  loader: false,
};

function projectManagerReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PROJECTS:
      return {
        ...state,
        projects: action.payload,
      };
    case SET_SHOW_POPUP:
      return {
        ...state,
        showPopup: action.payload,
      };

    case SHOW_LOADER:
      return {
        ...state,
        loader: action.payload,
      };

      case SHOW_REQUEST_POPUP:
        return {
          ...state,
          showRequestPopup: action.payload,
        };

    default:
      return state;
  }
}

// Action creators
const setProjects = (projects) => ({
  type: SET_PROJECTS,
  payload: projects,
});

const setShowPopup = (showPopup) => ({
    type: SET_SHOW_POPUP,
    payload: showPopup,
    });

    const setShowRequestPopup = (showPopup) => ({
      type: SHOW_REQUEST_POPUP,
      payload: showPopup,
      });

const setLoader = (loader) => ({
    type: SHOW_LOADER,
    payload: loader,
    });

export { projectManagerReducer, initialState, setProjects, setShowPopup, setLoader, setShowRequestPopup};
