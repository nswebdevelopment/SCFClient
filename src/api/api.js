import useApiManager from "./apiManager.js";
import appStore from "../stores/AppStore";

// const baseUrl = 'http://localhost:3001';

function ApiManager() {
  const { api, setToken } = useApiManager();


  function handleResponse(response, onResponse, onError) {
      console.log("HANDLE_RESPONSE", response);

      try{
        if (response.status === 200) {
          console.log("HANDLE_RESPONSE", response.data.content);
            onResponse(response.data.content);
        } 
        else {
          console.log("handleError from response", response.response.data.message);
          onError(response.response.data.message);
        }
      }
      catch(e){
        console.log("HandleResponse Error", e);
      }
   
  }

  function handleError(error, onError){
    console.log("HANDLE_ERROR", error);
    // onError(error.message);
    onError(error.data.message);
  }

  //AUTHORIZATION START
  async function login(username, password, onResponse, onError) {

    api
    .post("/api/Account/login", {
      username: username,
      password: password
    })
    .then((response) => {
      console.log("login response", response);
          
      const token = response.data.content.acceessToken;
      const refreshToken = response.data.content.acceessToken;
    // Save the token to localStorage
    setToken(token, refreshToken);
        handleResponse(response, onResponse, onError);
    })
    .catch((error) => {
      console.log("login error", error);
      handleError(error, onError);
      throw error;
    });
  }
  //AUTHORIZATION END

  //USER START
  function getUserDetails(onResponse, onError) {
    return api
      .get("/api/Account/myProfile/", {})
      .then((response) => {
        handleResponse(response, onResponse, onError);
      })
      .catch((error) => {
        handleError(error, onError);
        // throw error; // Throw the error so it can be caught in LoginPage
      });
  }


  function resetPassword(oldPassword, newPassword, onResponse, onError) {
    return api
      .post("/api/Account/password/", {
        oldPassword: oldPassword,
        newPassword: newPassword,
      })
      .then((response) => {
        handleResponse(response, onResponse, onError);
      })
      .catch((error) => {
        handleError(error, onError);
        // throw error; // Throw the error so it can be caught in LoginPage
      });
  }

  //USER END

  async function getProjects(onResponse, onError) {
    return api
      .get("/api/Project?pageNumber=1&pageSize=100")
      .then((response) => {
        handleResponse(response, onResponse, onError);
      })
      .catch((error) => {
        onError(error);
      });
  }

  async function getProjectsByCompanyId(companyId, onResponse, onError) {
    return api
      .get('/api/Project/ByCompanyId/'+companyId)
      .then((response) => {
        handleResponse(response, onResponse, onError);
      })
      .catch((error) => {
        onError(error);
      });
  }

  async function addProject(projectName, onResponse, onError) {
    api
    .post("/api/Project", {
      name: projectName,
    })
    .then((response) => {
        handleResponse(response, onResponse, onError);
    })
    .catch((error) => {
      handleError(error, onError);
      throw error;
    });

}

  async function removeProject(projectId, onResponse, onError) {
    return api
      .delete("/api/Project/" + projectId)
      .then((response) => {
        handleResponse(response, onResponse, onError);
      })
      .catch((error) => {
          handleError(error, onError);
      });
  }

  //PROJECTS END

  //PARCELS START
  function createParcel(projectId, parcel, onResponse, onError) {
    const coords = JSON.parse(parcel.coordinates);
    const coordinates = coords.map((coord) => {
      return [coord.lng, coord.lat];
    });

    const groundTypes = parcel.areas.reduce((obj, value, index) => {
      obj[value.land_cover_name] = value.area;
      return obj;
    }, {});

    console.log("groundTypes", groundTypes);
    console.log("shapeType", parcel.shapeType);

    return api
      .post("/api/Parcel/", {
        projectId: projectId,
        name: parcel.name,
        description: parcel.description,
        isRectangle: parcel.shapeType === "rectangle",
        imageUrl: parcel.imageUrl,
        coordinates: coordinates,
        groundTypes: groundTypes,
      })
      .then((response) => {
        handleResponse(response, onResponse, onError);
      })
      .catch((error) => {
        handleError(error, onError);
      });
  }

  function updateParcel(parcel, isProjectView,  onResponse, onError) {
    const coords = JSON.parse(parcel.coordinates);
    const coordinates = coords.map((coord) => {
      return [coord.lng, coord.lat];
    });

    const groundTypes = parcel.areas.reduce((obj, value, index) => {
      obj[value.land_cover_name] = value.area;
      return obj;
    }, {});

    console.log("groundTypes", groundTypes);
    console.log("shapeType", parcel.shapeType);

    return api
      .put(isProjectView ? "/api/Parcel/" : "/api/ParcelRequest/parcel", {
        id: parcel.id,
        name: parcel.name,
        description: parcel.description,
        isRectangle: parcel.shapeType === "rectangle",
        imageUrl: parcel.imageUrl,
        coordinates: coordinates,
        groundTypes: groundTypes,
      })
      .then((response) => {
        console.log("updateParcel", response);
        handleResponse(response, onResponse, onError);
      })
      .catch((error) => {
        handleError(error);
      });
  }

  function removeParcel(parcel, onResponse, onError) {
    return api
      .delete("/api/Parcel/" + parcel.id)
      .then((response) => {
        handleResponse(response, onResponse, onError);
      })
      .catch((error) => {
        handleError(error);
      });
  }

  function fetchParcels(projectId, onResponse, onError) {
    return api
      .get("/project/" + projectId)
      .then((response) => {
        handleResponse(response, onResponse, onError);
      })
      .catch((error) => {
        handleError(error);
      });
  }
  //PARCELS END



  //COMPANIES START

  function fetchCompanies(onResponse, onError) {
    return api
      .get("/api/Company?pageNumber=1&pageSize=100")
      .then((response) => {
        handleResponse(response, onResponse, onError);
      })
      .catch((error) => {
        handleError(error);
      });
  }


  async function addCompany(companyName, phone, email, pib, address, onResponse, onError) {
    api
    .post("/api/Company", {
      name: companyName,
      phone: phone,
      email: email,
      pib: pib,
      address: address,
    })
    .then((response) => {
        handleResponse(response, onResponse, onError);
    })
    .catch((error) => {
      handleError(error, onError);
      throw error;
    });
  }


  async function addCompanyAdmin(firstName, lastName, email, phone, password, companyId, onResponse, onError) {
    api
    .post("/api/Account/register", {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      password: password,
      companyId: companyId
    })
    .then((response) => {
        handleResponse(response, onResponse, onError);
    })
    .catch((error) => {
      handleError(error, onError);
      throw error;
    });
  }


  async function removeCompany(companyId, onResponse, onError) {
    return api
      .delete("/api/Company/" + companyId)
      .then((response) => {
        handleResponse(response, onResponse, onError);
      })
      .catch((error) => {
          handleError(error, onError);
      });
  }


  async function removeUser(userId, onResponse, onError) {
    return api
      .delete("/api/Account/" + userId)
      .then((response) => {
        handleResponse(response, onResponse, onError);
      })
      .catch((error) => {
          handleError(error, onError);
      });
  }



//COMPANIES END



//REQUESTS START
function createRequest(name, desc, parcelIds, parameterIds, serviceTypeId, instructions, desiredDate, onResponse, onError) {

const body = {
  name: name,
  description: desc,
  parcelIds: parcelIds,
  parameterIds: parameterIds,
  serviceTypeId: serviceTypeId,
  instructions: instructions,
  desiredTimeline: desiredDate
}

console.log(body)
  
  return api
    .post("/api/ParcelRequest", body)
    .then((response) => {
      handleResponse(response, onResponse, onError);
    })
    .catch((error) => {
      handleError(error, onError);
    });
}

function fetchRequests(onResponse, onError) {

  console.log("isSystemAdmisssxxxxxn", appStore.getUserRole());

  return appStore.getUserRole() === "SuperAdmin" ? api
  .get("/api/ParcelRequest?pageNumber=1&pageSize=100&includeDeleted=false")
  .then((response) => {
    handleResponse(response, onResponse, onError);
  })
  .catch((error) => {
    handleError(error, onError);
  }) : api
  .get("/api/ParcelRequest/myRequests?pageNumber=1&pageSize=100&includeDeleted=false")
  .then((response) => {
    handleResponse(response, onResponse, onError);
  })
  .catch((error) => {
    handleError(error, onError);
  });
  
}

function changeStatus(requestId, status, onResponse, onError) {
  return api
  .put("/api/ParcelRequest/status", {
    status: status,
    requestId: requestId,
  })
  .then((response) => {
    handleResponse(response, onResponse, onError);
  })
  .catch((error) => {
    handleError(error, onError);
  });
}



  return {
    login,
    getProjects,
    getProjectsByCompanyId,
    addProject,
    updateParcel,
    removeParcel,
    removeProject,
    fetchParcels,
    getUserDetails,
    createParcel,
    fetchCompanies,
    addCompany,
    removeCompany,
    removeUser,
    addCompanyAdmin,
    createRequest,
    fetchRequests,
    changeStatus,
    resetPassword

  };
}

// const api = createApi();
export default ApiManager();
