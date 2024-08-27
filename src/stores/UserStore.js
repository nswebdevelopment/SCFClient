import { EventEmitter } from "events";
import Dispatcher from "../dispatcher/Dispatcher";
import { ActionTypes } from "../actions/UserActions";

class UserStore extends EventEmitter {
  constructor() {
    super();
    console.log("UserStore constructor");
    this.user = null;
    this.error = null;
  }

  getUserDetails() {
    console.log("getUserDetails", this.user);
    return this.user;
  }

  getError() {
    return this.error;
  }

  handleActions(action) {
    switch (action.type) {
      case ActionTypes.LOGIN:
        this.emit("logged_in");
        break;

      case ActionTypes.ERROR:
        this.error = action.payload;
        this.emit("login_error");
        break;

      case ActionTypes.GET_USER:
        this.user = action.payload;
      
        console.log("UserStore GET_USER", this.user);
        console.log("UserStore GET_USER ROLE", this.user.role);
        if (this.user) {
          localStorage.setItem("user_name", this.user.firstName + " " + this.user.lastName);
          localStorage.setItem("role", this.user.role);

          this.emit("change");
        }
        
        break;
      default:
      // Do nothing
    }
  }
}

const userStore = new UserStore();
Dispatcher.register(userStore.handleActions.bind(userStore));

export default userStore;
