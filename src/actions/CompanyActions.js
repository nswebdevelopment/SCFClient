import Dispatcher from "../dispatcher/Dispatcher";
import api from "../api/api";

export const ActionTypes = {
  FETCHED_COMPANIES: "FETCHED_COMPANIES",
  ADD_COMPANY: "ADD_COMPANY",
  ADD_COMPANY_ADMIN: "ADD_COMPANY_ADMIN",
  REMOVE_COMPANY: "REMOVE_COMPANY",
  SHOW_LOADER: "SHOW_LOADER",
  HIDE_LOADER: "HIDE_LOADER",
  ERROR: "ERROR",
};


function hideLoader() {
  Dispatcher.dispatch({ type: ActionTypes.HIDE_LOADER });
}

export const CompanyActions = {
  fetchCompanies: () => {
    api.fetchCompanies(
      (response) => {
        Dispatcher.dispatch({
          type: ActionTypes.FETCHED_COMPANIES,
          payload: response.data,
        });
      },
      (error) => {
        console.log("ErrorAction:", error.message);
        Dispatcher.dispatch({
          type: ActionTypes.ERROR,
          payload: error,
        });
      }
    );
  },

  addCompany: (companyName, phone, email, pib, address) => {
    Dispatcher.dispatch({ type: ActionTypes.SHOW_LOADER });
    api
      .addCompany(companyName, phone, email, pib, address, (response)=>{
        Dispatcher.dispatch({
          type: ActionTypes.ADD_COMPANY,
          payload: response,
        });
        hideLoader();
      },
      (error)=>{
       
        Dispatcher.dispatch({
          type: ActionTypes.ERROR,
          payload: error,
        });

        hideLoader();
      })
     } ,


  addCompanyAdmin: (firstName, lastName, email, phone, password, companyId) => {
    Dispatcher.dispatch({ type: ActionTypes.SHOW_LOADER });
    api
      .addCompanyAdmin(firstName, lastName, email, phone, password, companyId, (response)=>{
        Dispatcher.dispatch({
          type: ActionTypes.ADD_COMPANY_ADMIN,
          payload: response,
        });
        hideLoader();
      },
      (error)=>{
       
        Dispatcher.dispatch({
          type: ActionTypes.ERROR,
          payload: error,
        });

        hideLoader();
      })
     } ,



  removeCompany: (company) => {
    Dispatcher.dispatch({ type: ActionTypes.SHOW_LOADER });
    api.removeCompany(company.id,(response)=>{
      Dispatcher.dispatch({
        type: ActionTypes.REMOVE_COMPANY,
        payload: response,
      });
      hideLoader();
    }, (error)=>{
      hideLoader();
      console.log("Error:", error.message);
      Dispatcher.dispatch({
        type: ActionTypes.ERROR,
        payload: error,
      });
    });
  },
};
