import React, { useState } from "react";
import PropTypes from "prop-types";


function ResetPasswordPopup({ sendRequest, onClose }) {


  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSendRequest = (event) => {
    event.preventDefault();
    sendRequest(oldPassword, newPassword);
  };


  return (
    <div className="dialog">
      <div className="dialog-content">
        <h2>Reset Password</h2>
        <div>
              <input
              type="text"
              placeholder="Old Password"
              value={oldPassword}
              id="requestName"
              style={{ marginBottom: "10px", marginRight: "20px" }}
              onChange={(e) => setOldPassword(e.target.value)
              }
            />
            <input
              type="text"
              placeholder="New Password"
              value={newPassword}
              id="requestDescription"
              style={{ marginBottom: "10px" }}
              onChange={(e) => 
                setNewPassword(e.target.value)
              }
            />
          </div>


        <form onSubmit={handleSendRequest}>
          <button type="submit">Send Request</button>
        </form>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

ResetPasswordPopup.propTypes = {
  sendRequest: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ResetPasswordPopup;
