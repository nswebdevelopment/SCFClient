import React, { useState } from "react";
import PropTypes from "prop-types";

function NewUserPopup({ id, companyName, addNewUser, onClose }) {
  // name, phone, email, pib, address

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [companyId] = useState(id);

  const handleAddUser = (event) => {
    event.preventDefault();
    if (firstName && lastName && email && password && companyId) {
      addNewUser(firstName, lastName, email, phone, password, companyId);
    }
    else {

      alert("Please fill all fields before submitting the form." + firstName + lastName + email + phone + password + companyId);
    }
  };

  return (
    <div className="dialog">
      <div className="dialog-content">
        <h2>Add Admin to {companyName}</h2>
        <form onSubmit={handleAddUser}>
          <label>
            First Name:
            <input
              autoFocus
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>

          <label>
            Last Name:
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>

          <label>
            Email:
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label>
            Phone:
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>

          <label>
            Password:
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button type="submit">Add</button>
        </form>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

NewUserPopup.propTypes = {
  addNewUser: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  companyName: PropTypes.string.isRequired,
};

export default NewUserPopup;
