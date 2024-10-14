import RequestStore from "../stores/RequestStore";

const SET_REQUEST = "SET_REQUEST";
const SET_SHOW_POPUP = "SET_SHOW_POPUP";
const SHOW_LOADER = "SHOW_LOADER";
const SHOW_REQUEST_POPUP = "SHOW_REQUEST_POPUP";

const initialState = {
  requests: RequestStore.getAll(),
  showPopup: false,
  showRequestPopup: false,
  loader: false,
};

function requestManagerReducer(state = initialState, action) {
  switch (action.type) {
    case SET_REQUEST:
      return {
        ...state,
        requests: action.payload,
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
const setRequests = (requests) => ({
  type: SET_REQUEST,
  payload: requests,
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

export { requestManagerReducer, initialState, setRequests, setShowPopup, setLoader, setShowRequestPopup};
