import { EventEmitter } from "events";
import Dispatcher from "../dispatcher/Dispatcher";
import { ActionTypes } from "../actions/ProjectActions";
import api from "../api/api";

class ProjectStore extends EventEmitter {
  constructor() {
    super();
    this.projects = [];
    this.fetchProjects();
  }

  async fetchProjects() {
    try {
        api.fetchProject().then((data) => {
            this.projects = [...data];
            this.emit('change');
        });
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  }

  getAll() {
    return this.projects;
  }

  handleActions(action) {
    switch (action.type) {
      case ActionTypes.ADD_PROJECT:
        this.projects.push(action.payload);
        this.emit("change");
        break;

      case ActionTypes.REMOVE_PROJECT:
        this.projects = this.projects.filter(project => project.id !== action.payload);
        this.emit("change");
        break;

      case ActionTypes.SHOW_LOADER:
        this.emit("showLoader");
        break;

      case ActionTypes.HIDE_LOADER:
        this.emit("hideLoader");
        break;

      default:
      // Do nothing
    }
  }
}

const projectStore = new ProjectStore();
Dispatcher.register(projectStore.handleActions.bind(projectStore));

export default projectStore;
