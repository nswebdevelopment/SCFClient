import React, { useState } from "react";
import PropTypes from "prop-types";
import Validator from "../../../utils/validator";

function NewCompanyPopup({ addNewCompany, onClose }) {
  // name, phone, email, pib, address

  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [address, setAddress] = useState("");

  const handleAddCompany = (event) => {
    event.preventDefault();
    if (companyName && phone && email && contactPerson && address) {
      if(!Validator.validateEmail(email))
      {
        alert("Email is not valid");
        return
      }

      if(!Validator.validatePhoneNumber(phone))
        {
          alert("Phone number is not valid");
          return
        }

      addNewCompany(companyName, phone, email, contactPerson, address);
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
              type="tel"
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
            Contact Person:
            <input
              type="text"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
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
