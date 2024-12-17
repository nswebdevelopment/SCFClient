import { EventEmitter } from "events";
import Dispatcher from "../dispatcher/Dispatcher";
import { ActionTypes } from "../actions/RequestActions";
import api from "../api/api";

class RequestStore extends EventEmitter {
  constructor() {
    super();
    console.log("RequestStore constructor");
    this.requests = [];
  }

  async fetchRequest() {
    try {
        api.fetchRequests().then((data) => {
            this.requests = [...data];
            console.log("RequestStore fetchRequest", this.requests);
            this.emit('change');
        });
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  }

  getAll() {
    return this.requests;
  }

  async getRequest(id) {
    return this.requests.find(request => parseInt(request.id) === parseInt(id));
  }

  handleActions(action) {
    switch (action.type) {
      case ActionTypes.FETCHED_REQUESTS:
        console.log("RequestStore FETCHED_REQUESTS", action.payload);
        this.requests = [...action.payload.data];
        this.emit("change");
      break;

      case ActionTypes.CREATE_REQUEST:
        // this.projects.push(action.payload);
        console.log("request_added")
        this.emit("request_added", action.payload);
        break;

      // case ActionTypes.REMOVE_PROJECT:
      //   this.projects = this.projects.filter(project => project.id !== action.payload);
      //   this.emit("change");
      //   break;

      case ActionTypes.CHANGE_STATUS_REQUEST:
        this.requests.find(request => request.id === action.payload.id).status = action.payload.status;


        this.emit("status_changed");
      break;

      default:
      // Do nothing
    }
  }
}

const requestStore = new RequestStore();
Dispatcher.register(requestStore.handleActions.bind(requestStore));

export default requestStore;
