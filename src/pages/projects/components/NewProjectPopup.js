import React, { useState } from "react";
import api from "../../../api/api";


function NewProjectPopup(props) {

    const [projectName, setProjectName] = useState(`Project ${props.projects.length + 1}`);
    const handleAddProject = (event) => {
      event.preventDefault();
      api.addProject(projectName).then((data) => {
        props.setProject([...props.projects, data]);
      });
      props.onClose();
    };

    return (
      <div>
        <h2>Add New Project</h2>
        <form onSubmit={handleAddProject}>
          {/* Add your form fields here */}
          <input type="text" placeholder="Project Name" value={projectName}  onChange={(e) => setProjectName(e.target.value)} />
          <button type="submit">Add</button>
          <button type="button" onClick={props.onClose}>Cancel</button>
        </form>
      </div>
    );
  }

  export default NewProjectPopup;