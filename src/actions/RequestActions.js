import Dispatcher from "../dispatcher/Dispatcher";
import api from "../api/api";

export const ActionTypes = {
    FETCHED_REQUESTS: "FETCHED_REQUESTS",
    CREATE_REQUEST: "CREATE_REQUEST",
    CHANGE_STATUS_REQUEST: "CHANGE_STATUS_REQUEST",
    SHOW_LOADER: "SHOW_LOADER",
    HIDE_LOADER: "HIDE_LOADER",
    ERROR: "ERROR",
};

function hideLoader() {
  Dispatcher.dispatch({ type: ActionTypes.HIDE_LOADER });
}

export const RequestActions = {
    createRequest: (name, desc, parcelIds, parameterIds, serviceTypeId) => {
        Dispatcher.dispatch({ type: ActionTypes.SHOW_LOADER });
        api.createRequest(
            name,
            desc,
            parcelIds,
            parameterIds,
            serviceTypeId,
          (response) => {
            Dispatcher.dispatch({
              type: ActionTypes.CREATE_REQUEST,
              payload: response,
            });
            hideLoader();
          },
          (error) => {
            Dispatcher.dispatch({
              type: ActionTypes.ERROR,
              payload: error,
            });
    
            hideLoader();
          }
        );
      },

      fetchRequests: () => {
        
        Dispatcher.dispatch({ type: ActionTypes.SHOW_LOADER });
        api.fetchRequests(
          (response) => {
            Dispatcher.dispatch({
              type: ActionTypes.FETCHED_REQUESTS,
              payload: response,
            });
            hideLoader();
          },
          (error) => {
            Dispatcher.dispatch({
              type: ActionTypes.ERROR,
              payload: error,
            });
    
            hideLoader();
          }
        );
      },

      changeStatus: (requestId, status) => {
        api.changeStatus(requestId, status,
          (response) => {
            Dispatcher.dispatch({
              type: ActionTypes.CHANGE_STATUS_REQUEST,
              payload: response,
            });
            hideLoader();
          },
          (error) => {
            Dispatcher.dispatch({
              type: ActionTypes.ERROR,
              payload: error,
            });
    
            hideLoader();
          }
        );
      }

}