import { EventEmitter } from "events";
import Dispatcher from "../dispatcher/Dispatcher";
import { ActionTypes } from "../actions/ProjectActions";
import api from "../api/api";

class ProjectStore extends EventEmitter {
  constructor() {
    super();
    this.projects = [];
  }

  async fetchProjects() {
    try {
        api.fetchProject().then((data) => {
            this.projects = [...data];
            console.log("ProjectStore fetchProject", this.projects);
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
      case ActionTypes.FETCHED_PROJECTS:
        console.log("ProjectStore FETCHED_PROJECTS", action.payload);
        this.projects = [...action.payload];
        this.emit("change");
      break;

      case ActionTypes.ADD_PROJECT:
        this.projects.push(action.payload);
        this.emit("project_added", action.payload);
        break;

      case ActionTypes.REMOVE_PROJECT:
        this.projects = this.projects.filter(project => project.id !== action.payload);
        this.emit("change");
        break;

      default:
      // Do nothing
    }
  }
}

const projectStore = new ProjectStore();
Dispatcher.register(projectStore.handleActions.bind(projectStore));

export default projectStore;
