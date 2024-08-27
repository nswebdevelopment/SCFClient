import CompanyStore from "../stores/CompanyStore";

const SET_COMPANIES = "SET_COMPANIES";
const SET_COMPANY = "SET_COMPANY";
const SET_SHOW_POPUP = "SET_SHOW_POPUP";

const SET_SHOW_POPUP_NEW_USER = "SET_SHOW_POPUP_NEW_USER";

const SHOW_LOADER = "SHOW_LOADER";

const initialState = {
  companies: CompanyStore.getAll(),
  showPopup: false,
  showPopupNewUser: false,
  loader: false,
  company: null,
};

function companyManagerReducer(state = initialState, action) {
  switch (action.type) {
    case SET_COMPANIES:
      return {
        ...state,
        companies: action.companies,
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
    case SET_SHOW_POPUP_NEW_USER:
      return {
        ...state,
        showPopupNewUser: action.payload,
      };

      case SET_COMPANY:
        return {
          ...state,
          company: action.company,
        };

    default:
      return state;
  }
}

const setCompanies = (companies) => ({
  type: SET_COMPANIES,
  companies: companies,
});

const setCompany = (company) => ({
  type: SET_COMPANY,
  company: company,
});

const setShowPopup = (showPopup) => ({
  type: SET_SHOW_POPUP,
  payload: showPopup,
});

const setShowPopupNewUser = (showPopup) => ({
  type: SET_SHOW_POPUP_NEW_USER,
  payload: showPopup,
});

const setLoader = (loader) => ({
  type: SHOW_LOADER,
  payload: loader,
});

export {
  companyManagerReducer,
  initialState,
  setCompanies,
  setShowPopup,
  setLoader,
  setShowPopupNewUser,
  setCompany,
};
