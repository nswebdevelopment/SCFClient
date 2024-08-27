import { EventEmitter } from "events";
import Dispatcher from "../dispatcher/Dispatcher";
import { ActionTypes } from "../actions/CompanyActions";

class CompanyStore extends EventEmitter {
  constructor() {
    super();
    this.companies = [];
  }
  
  getAll() {
    return this.companies;
  }

  getProject(id) {
    return this.companies.find(company => company.id === id);
  }

  handleActions(action) {
    switch (action.type) {
      case ActionTypes.FETCHED_COMPANIES:
        this.companies = [...action.payload];
        console.log("FETCHED_COMPANIES", this.companies);
        this.emit("change");
      break;

      case ActionTypes.ADD_COMPANY:
        this.companies.push(action.payload);
        this.emit("company_added", action.payload);
        break;

      case ActionTypes.REMOVE_COMPANY:
        this.companies = this.companies.filter(company => company.id !== action.payload);
        this.emit("change");
        break;

        case ActionTypes.ADD_COMPANY_ADMIN:
          this.emit("admin_added", action.payload);
          break;

      default:
      // Do nothing
    }
  }
}

const companyStore = new CompanyStore();
Dispatcher.register(companyStore.handleActions.bind(companyStore));

export default companyStore;
