import Project from "../models/Project";
import useApiManager from "./apiManager.js";

// const baseUrl = 'http://localhost:3001';

function ApiManager() {
  const { api, setToken } = useApiManager();

  //AUTHORIZATION START
  function login(username, password) {
    return api
      .post("/auth/login", {
        username: username,
        password: password,
        expiresInMins: 1,
      })
      .then((response) => {
        // The access token is usually located in the response data
        console.log("login", response);
        const token = response.data.token;
        const refreshToken = response.data.refreshToken;
        // Save the token to localStorage
        setToken(token, refreshToken);
        return response.data;
      });
  }
  //AUTHORIZATION END

  //USER START
  function getUserDetails(id) {
    return api
      .get("/auth/me", {
        params: {
          callId: id,
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        // throw error; // Throw the error so it can be caught in LoginPage
      });
  }
  //USER END

  //PROJECTS START
  var projects = [
    new Project(Math.floor(Math.random() * 1000000), "Project 1", []),
  ];

  function fetchProject() {
    // console.log("fetchProject");
  
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(projects), 1000); // Simulate a delay of 1 second
    });
  }

  function addProject(projectName) {
    const newProject = new Project(
      Math.floor(Math.random() * 1000000),
      projectName,
      []
    );
    projects.push(newProject);

    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(newProject), 1000); // Simulate a delay of 1 second
    });
  }

  function removeProject(projectId) {
    // projects = projects.filter((p) => p.id !== projectId);

    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(projectId), 1000); // Simulate a delay of 1 second
    });
  }

  //PROJECTS END

  //PARCELS START
  function addParcelToProject(projectId, parcel) {
    console.log("addParcelToProject", projectId, parcel);
    const project = projects.find((project) => project.id === projectId);

    const parcelIndex = project.parcels.findIndex((p) => p.id === parcel.id);

    console.log("parcelIndex", parcelIndex);
    if (parcelIndex !== -1) {
      // If the parcel exists, update it
      console.log("update parcel", parcel.coordinates);
      project.parcels[parcelIndex] = parcel;
    } else {
      // If the parcel doesn't exist, add it
      project.parcels.push(parcel);
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(parcel), 1000); // Simulate a delay of 1 second
    });
  }

  function removeParcel(projectId, parcel) {
    console.log("addParcelToProject", projectId, parcel);
    const project = projects.find((project) => project.id === projectId);

    const parcelIndex = project.parcels.findIndex((p) => p.id === parcel.id);

    console.log("parcelIndex", parcelIndex);
    if (parcelIndex !== -1) {
      // If the parcel exists, remove it
      project.parcels = project.parcels.filter((p) => p.id !== parcel.id);
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(parcel.id), 1000); // Simulate a delay of 1 second
    });
  }


  function fetchParcels(projectId) {
    console.log("getProjectParcels", projects, projectId);
    const project = projects.find((project) => project.id === projectId);
    // return project.parcels;

    // if (project===null) return [];
    console.log("fetchParcels", project.name);
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(project.parcels), 1000); // Simulate a delay of 1 second
    });
  }

  //PARCELS END

  return {
    login,
    fetchProject,
    addProject,
    addParcelToProject,
    removeParcel,
    removeProject,
    fetchParcels,
    getUserDetails,  };
}

// const api = createApi();
export default ApiManager();
