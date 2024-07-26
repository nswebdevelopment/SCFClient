import Dispatcher from "../dispatcher/Dispatcher";
import api from "../api/api";

export const ActionTypes = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  ERROR: "ERROR",
  GET_USER: "GET_USER",
  SHOW_LOADER: "SHOW_LOADER",
  HIDE_LOADER: "HIDE_LOADER",
};

export const UserActions = {
  login: (username, password, ) => {
    Dispatcher.dispatch({ type: ActionTypes.SHOW_LOADER });
    api
      .login(username, password, (response)=>{
        console.log("login data", response);
       
        Dispatcher.dispatch({
          type: ActionTypes.LOGIN,
          payload: response,
        });
        Dispatcher.dispatch({ type: ActionTypes.HIDE_LOADER });


        Dispatcher.dispatch({ type: ActionTypes.SHOW_LOADER });
        api.getUserDetails((response) => {
          Dispatcher.dispatch({
            type: ActionTypes.GET_USER,
            payload: response,
          });
          Dispatcher.dispatch({ type: ActionTypes.HIDE_LOADER });
        }, (error) => {
          Dispatcher.dispatch({
            type: ActionTypes.ERROR,
            payload: error.message,
          });
        });
        
      }, (error)=>{
        Dispatcher.dispatch({
          type: ActionTypes.ERROR,
          payload: error.message,
        });
      })
  },

  getUserDetails: () => {
    Dispatcher.dispatch({ type: ActionTypes.SHOW_LOADER });
    api.getUserDetails().then((data) => {
      Dispatcher.dispatch({
        type: ActionTypes.GET_USER,
        payload: data,
      });
      Dispatcher.dispatch({ type: ActionTypes.HIDE_LOADER });
    });
  },
};
