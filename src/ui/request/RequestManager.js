import { useNavigate } from "react-router-dom";
import React, { useReducer, useEffect, useState } from "react";
import "./RequestManager.css";

import RequestStore from "../../stores/RequestStore";
import AppStore from "../../stores/AppStore";
import { RequestActions } from "../../actions/RequestActions";
import FullScreenLoader from "../../components/loader/Loader";

import { useLocation } from "react-router-dom";

import {
  requestManagerReducer,
  initialState,
  setRequests,
  setShowPopup,
  setLoader,
  setShowRequestPopup,
} from "../../reducers/requestManagerReducer";
import SCFRequestStatusPopup from "../../components/popups/SCFRequestStatus";
// import { set } from "react-hook-form";
import appStore from "../../stores/AppStore";

function RequestManager() {
  const navigate = useNavigate();

  const location = useLocation();
  const data = location.state?.data;
  // const companyId = location.state?.companyId;
  initialState.showPopup = data;
  const [state, dispatch] = useReducer(requestManagerReducer, initialState);
  const [request, setRequest] = React.useState(null);

  useEffect(() => {
    window.onbeforeunload = () => {
      if (data) {
        navigate(location.pathname, { state: { data: null }, replace: true });
      }
    };
    return () => {
      window.onbeforeunload = null;
    };
    // eslint-disable-next-line
  }, []);

  // const nextProjectId = state.requests.length + 1;
  const handleClose = () => {
    dispatch(setShowPopup(false));
    dispatch(setShowRequestPopup(false));
  };

  const updateRequests = () => {
    console.log("RequestManager updateRequests", RequestStore.getAll());
    dispatch(setRequests([...RequestStore.getAll()]));
    dispatch(setLoader(false));

    setFilteredItems(RequestStore.getAll());
    // setFilterCategory('');
    // handleFilter('');
  };

  const requestAdded = (project) => {
    updateRequests();
    // navigate(`/projects/${project.id}`, {
    //   state: { data: project },
    // });
  };

  const statusChanged = () => {
    console.log("RequestManager statusChanged");
    // RequestActions.fetchRequests();
    updateRequests();
  };

  const showLoader = () => {
    dispatch(setLoader(true));
  };

  const hideLoader = () => {
    dispatch(setLoader(false));
  };

  const handleStatusChanged = (event, request) => {
    event.stopPropagation();
    changeRequestStatus(request);
  };

  const changeRequestStatus = (request) => {
    if (request) {
      setRequest(request);
      dispatch(setShowRequestPopup(true));
      // ProjectActions.removeProject(request);
    }
  };

  const handleSendRequest = () => {
    handleClose();
  };

  // const handleShowPopup = () => {
  //   dispatch(setShowPopup(true));
  // };

  // const handleShowRequestPopup = () => {
  //   dispatch(setShowRequestPopup(true));
  // };

  const onError = (error) => {
    alert("Error: " + error);
  };

  const [filterCategory, setFilterCategory] = useState("");
  const [filteredItems, setFilteredItems] = useState(state.requests);

  // Filter items based on the category
  const handleFilter = (category) => {
    setFilterCategory(category);
    if (category === "") {
      setFilteredItems(state.requests); // Show all items if no category is selected
    } else {
      const filtered = state.requests.filter(
        (item) => item.status === category
      );
      setFilteredItems(filtered);
    }
  };

  useEffect(() => {
    RequestStore.on("change", updateRequests);
    RequestStore.on("project_added", requestAdded);
    RequestStore.on("status_changed", statusChanged);
    AppStore.on("showLoader", showLoader);
    AppStore.on("hideLoader", hideLoader);
    AppStore.on("error", onError);

    RequestActions.fetchRequests();
    return () => {
      RequestStore.removeListener("change", updateRequests);
      RequestStore.removeListener("project_added", requestAdded);
      RequestStore.removeListener("status_changed", statusChanged);
      AppStore.removeListener("showLoader", showLoader);
      AppStore.removeListener("hideLoader", hideLoader);
      AppStore.removeListener("error", onError);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <div>
        {state.loader ? <FullScreenLoader /> : null}
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Request</th>
              <th>Specific Instructions</th>
              <th>
                <div>
                  <label htmlFor="statusFilter">Status: </label>
                  <select
                    id="categorstatusFilterFilter"
                    value={filterCategory}
                    onChange={(e) => handleFilter(e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="Received">Received</option>
                    <option value="In Review">In Review</option>
                    <option value="Quoted">Quoted</option>
                  </select>
                </div>
              </th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((request) => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>
                  <div>
                    <h3>{request.name}</h3>

                    <div class="field">
                      <span class="label">Service Type:</span>
                      <p class="service-type">{request.serviceType}</p>
                    </div>
                    <div class="field">
                      <span class="label">Description:</span>
                      <p class="description">{request.description}</p>
                    </div>

                    <div class="field">
                      <span class="label">Desired Timeline:</span>
                      <p class="description">{request.desiredTimeline}</p>
                    </div>
                  </div>
                </td>
                <td>{request.instructions}</td>
                <td>{request.status}</td>
                {/* <td>{request.pib}</td> */}
                <td>{request.createdAt}</td>
                <td>
                  <button
                    onClick={(event) => {
                      navigate(`/requests/${request.id}`, {
                        //  state: { data: request },
                      });
                    }}
                  >
                    Details
                  </button>

                  {appStore.isSuperAdmin() ? (
                    <button
                      className={"red"}
                      onClick={(event) => {
                        handleStatusChanged(event, request);
                      }}
                    >
                      Change Status
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {state.showRequestPopup ? (
        <SCFRequestStatusPopup
          requestName={request.name}
          requestId={request.id}
          currentStatus={request.status}
          sendRequest={handleSendRequest}
          onClose={handleClose}
        />
      ) : null}
    </div>
  );
}
export default RequestManager;
