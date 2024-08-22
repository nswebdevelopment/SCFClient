import React, { useState } from "react";
import PropTypes from 'prop-types';

function NewProjectPopup({ id, addNewProject, onClose }) {
  const [projectName, setProjectName] = useState(
    `Project ${id}`
  );

  const handleAddProject = (event) => {
    event.preventDefault();
    if (projectName) {
      addNewProject(projectName);
    }
  };

  return (
    <div className="dialog">
    <div className="dialog-content">
      <h2>Add New Project</h2>
      <form onSubmit={handleAddProject}>
        <input
          autoFocus
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
      <button onClick={onClose}>Cancel</button>
    </div>
  </div>
  );
}

NewProjectPopup.propTypes = {
  addNewProject: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default NewProjectPopup;
