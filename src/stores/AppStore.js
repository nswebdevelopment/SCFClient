import { EventEmitter } from "events";
import Dispatcher from "../dispatcher/Dispatcher";
import { ActionTypes } from "../actions/ParcelActions";

class AppStore extends EventEmitter {
  constructor() {
    super();
    console.log("AppStore constructor");
  }

  getUserRole() {
    console.log("getUserRole", localStorage.getItem("role"));
    return localStorage.getItem("role");
  }

  isSuperAdmin() {
    return this.getUserRole() === "SuperAdmin";
  } 

  handleActions(action) {
    switch (action.type) {
      case ActionTypes.SHOW_LOADER:
        this.emit("showLoader");
        break;

      case ActionTypes.HIDE_LOADER:
        this.emit("hideLoader");
        break;

      case ActionTypes.ERROR:
        console.log("ErrorAPPStore:", action.payload);
        this.emit("error", action.payload);
        break;

      default:
      // Do nothing
    }
  }
}

const appStore = new AppStore();
Dispatcher.register(appStore.handleActions.bind(appStore));

export default appStore;
