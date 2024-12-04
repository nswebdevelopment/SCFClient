import { useNavigate } from "react-router-dom";
import React, { useReducer, useEffect } from "react";

import CompanyStore from "../../stores/CompanyStore";
import AppStore from "../../stores/AppStore";
import { CompanyActions } from "../../actions/CompanyActions";
import FullScreenLoader from "../../components/loader/Loader";

import {
  companyManagerReducer,
  initialState,
  setCompanies,
  setShowPopup,
  setLoader,
  setShowPopupNewUser,
  setCompany,
} from "../../reducers/companyManagerReducer";
import NewCompanyPopup from "./components/NewCompanyPopup";
import "./CompanyManager.css";
import NewUserPopup from "./components/NewUserPopup";

function CompanyManager() {
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(companyManagerReducer, initialState);

  //   const nextProjectId = state.companies.length + 1;
  const handleClose = () => {
    dispatch(setShowPopup(false));
    dispatch(setShowPopupNewUser(false));
  };

  const updateCompanies = () => {
    dispatch(setCompanies([...CompanyStore.getAll()]));
    dispatch(setLoader(false));
  };

  const companyAdded = (company) => {
    updateCompanies();
    // navigate(`/projects/${project.id}`, {
    //   state: { data: project },
    // });
  };

  const showLoader = () => {
    dispatch(setLoader(true));
  };

  const hideLoader = () => {
    dispatch(setLoader(false));
  };

  const handleCompanyRemoval = (event, company) => {
    event.stopPropagation();
    handleRemoveCompany(company);
  };

  const handleRemoveCompany = (company) => {
    if (company) {
      CompanyActions.removeCompany(company);
    }
  };

  const handleAddCompany = (companyName, phone, email, pib, address) => {
    if (companyName) {
      CompanyActions.addCompany(companyName, phone, email, pib, address);
    }
    handleClose();
  };

  const handleAddUser = (
    firstName,
    lastName,
    email,
    phone,
    password,
    companyId
  ) => {
    CompanyActions.addCompanyAdmin(
      firstName,
      lastName,
      email,
      phone,
      password,
      companyId
    );
    handleClose();
  };

  const adminCreated = (admin) => {
    console.log("adminCreated", admin);
  };

  const handleShowPopup = () => {
    dispatch(setShowPopup(true));
  };

  const handleShowPopupAddUser = (company) => {
    dispatch(setCompany(company));
    dispatch(setShowPopupNewUser(true));
  };


  const handleUserRemoval = (event, user) => {
    event.stopPropagation();
    handleRemove(user);
  };


  const handleRemove = (user) => {
    if (user) {
      CompanyActions.removeUser(user);
    }
  };



  const onError = (error) => {
    alert("Error: " + error);
  };

  useEffect(() => {
    CompanyStore.on("change", updateCompanies);
    CompanyStore.on("company_added", companyAdded);
    CompanyStore.on("admin_added", adminCreated);
    AppStore.on("showLoader", showLoader);
    AppStore.on("hideLoader", hideLoader);
    AppStore.on("error", onError);

    CompanyActions.fetchCompanies();
    return () => {
      CompanyStore.removeListener("change", updateCompanies);
      CompanyStore.removeListener("company_added", companyAdded);
      CompanyStore.on("admin_added", adminCreated);
      AppStore.removeListener("showLoader", showLoader);
      AppStore.removeListener("hideLoader", hideLoader);
      AppStore.removeListener("error", onError);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      {state.loader ? <FullScreenLoader /> : null}
      <table className="table">
        <thead>
          <tr>
            <th>Company ID</th>
            <th>Company Name</th>
            <th>Address</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Contact Person</th>
            <th>Admins</th>
            <th>No. Projects</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {state.companies.map((company) => (
            <tr key={company.id}>
              <td>{company.id}</td>
              <td>{company.name}</td>
              <td>{company.address}</td>
              <td>{company.email}</td>
              <td>{company.phone}</td>
              <td>{company.contactPerson}</td>
              <td>
              <ul>
              {company.users.map((user, index) => (
               <li key={index} className="user-item">
                <span>{user.email}</span>
                <button className="remove-button" onClick={(event) => handleUserRemoval(event, user)}>×</button>
                 </li>
              ))}
              </ul>
              </td>
              <td>
                <button
                  onClick={(event) => {
                    navigate(`/projects`, { state: { companyId: company.id } });
                  }}
                >
                  Projects {company.projects.length}
                </button>
              </td>
              <td>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <button
                    className="red"
                    onClick={(event) => {
                      handleCompanyRemoval(event, company);
                    }}
                  >
                    Remove
                  </button>

                  {/* <button onClick={(event) => {}}>Details</button> */}

                  <button
                    onClick={(event) => {
                      handleShowPopupAddUser(company);
                    }}
                  >
                    Add Admin
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {state.showPopup ? (
        <NewCompanyPopup
          addNewCompany={handleAddCompany}
          onClose={handleClose}
        />
      ) : null}

      {state.showPopupNewUser ? (
        <NewUserPopup
          id={state.company.id}
          addNewUser={handleAddUser}
          onClose={handleClose}
          companyName={state.company.name}
        />
      ) : null}
      <button onClick={handleShowPopup}>Add New Company</button>
    </div>
  );
}
export default CompanyManager;
