import React, { useState } from "react";
import PropTypes from "prop-types";
import { RequestActions } from "../../actions/RequestActions";
// import { set } from "react-hook-form";
function SCFRequestStatusPopup({ requestId, currentStatus, sendRequest, onClose }) {

  const [status, setStatus] = useState(currentStatus);

  // console.log("SCFRequestPopup", projects);
  const handleSendRequest = (event) => {
    event.preventDefault();
    // if (projectName) {
    RequestActions.changeStatus(requestId, status);

    sendRequest();
    // }
  };


  return (
    <div className="dialog">
      <div className="dialog-content">
        <h2>Change status of request id: {requestId}</h2>

        <div>
              <h4>Type of service</h4>

              <div
                style={{
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <input
                  type="checkbox"
                  id={"parcel.id"}
                  name={"parcel.name"}
                  value={"parcel"}
                  checked={status === "pending".toUpperCase()}
                  onChange={(e) => {
                    setStatus("pending".toUpperCase());
                    // setGlobalEnhancedAiMapping(e.target.checked);
                    // setLocalAiMapping(!e.target.checked);
                  }}
                />
                <label>Pending</label>
              </div>

              <div
                style={{
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <input
                  type="checkbox"
                  id={"parcel.id"}
                  name={"parcel.name"}
                  value={"parcel"}
                  checked={status === "IN_PROGRESS".toUpperCase()}
                  onChange={(e) => {
                    setStatus("IN_PROGRESS".toUpperCase());
                    // setLocalAiMapping(e.target.checked);
                    // setGlobalEnhancedAiMapping(!e.target.checked);
                  }}
                />
                <label>In Progress</label>
              </div>

              <div
                style={{
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <input
                  type="checkbox"
                  id={"parcel.id"}
                  name={"parcel.name"}
                  value={"parcel"}
                  checked={status === "Finished".toUpperCase()}
                  onChange={(e) => {
                    setStatus("finished".toUpperCase());
                    // setLocalAiMapping(e.target.checked);
                    // setGlobalEnhancedAiMapping(!e.target.checked);
                  }}
                />
                <label>Finished</label>
              </div>
            </div>







        <form onSubmit={handleSendRequest}>
          <button type="submit">Change Status</button>
        </form>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

SCFRequestStatusPopup.propTypes = {
  sendRequest: PropTypes.func.isRequired,
  requestId: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  currentStatusL: PropTypes.string,
};

export default SCFRequestStatusPopup;
