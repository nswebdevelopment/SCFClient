import React, { useState } from "react";
import PropTypes from "prop-types";
import { RequestActions } from "../../actions/RequestActions";
// import { set } from "react-hook-form";
function SCFRequestStatusPopup({ requestName, requestId, currentStatus, sendRequest, onClose }) {

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
        <h2>Project status of {requestName}</h2>

        <div>

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
                  checked={status === "Received"}
                  onChange={(e) => {
                    setStatus("Received");
                    // setGlobalEnhancedAiMapping(e.target.checked);
                    // setLocalAiMapping(!e.target.checked);
                  }}
                />
                <label>Received</label>
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
                  checked={status === "In Review"}
                  onChange={(e) => {
                    setStatus("In Review");
                    // setLocalAiMapping(e.target.checked);
                    // setGlobalEnhancedAiMapping(!e.target.checked);
                  }}
                />
                <label>In Review</label>
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
                  checked={status === "Quoted"}
                  onChange={(e) => {
                    setStatus("Quoted");
                    // setLocalAiMapping(e.target.checked);
                    // setGlobalEnhancedAiMapping(!e.target.checked);
                  }}
                />
                <label>Quoted</label>
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
