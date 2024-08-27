import React, { useState } from "react";
import PropTypes from "prop-types";

function NewCompanyPopup({ addNewCompany, onClose }) {
  // name, phone, email, pib, address

  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pib, setPib] = useState("");
  const [address, setAddress] = useState("");

  const handleAddCompany = (event) => {
    event.preventDefault();
    if (companyName && phone && email && pib && address) {
      addNewCompany(companyName, phone, email, pib, address);
    }
  };

  return (
    <div className="dialog">
      <div className="dialog-content">
        <h2>Add New Company</h2>
        <form onSubmit={handleAddCompany}>
          <label>
            Company Name:
            <input
              autoFocus
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
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
            Email:
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label>
            Address:
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>

          <label>
            PIB:
            <input
              type="text"
              value={pib}
              onChange={(e) => setPib(e.target.value)}
            />
          </label>

          <button type="submit">Add</button>
        </form>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

NewCompanyPopup.propTypes = {
  addNewCompany: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default NewCompanyPopup;
