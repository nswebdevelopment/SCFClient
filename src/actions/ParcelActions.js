import Dispatcher from "../dispatcher/Dispatcher";
import api from "../api/api";
import { baseUrl } from "../utils/constants";
import Parcel from "../models/Parcel";
import MapUtils from "../utils/mapUtils";
import requestStore from "../stores/RequestStore";

export const ActionTypes = {
  SET_PROJECT_ID: "SET_PROJECT_ID",
  FETCH_PARCELS: "FETCH_PARCELS",
  ADD_PARCEL: "ADD_PARCEL",
  UPDATE_PARCEL: "UPDATE_PARCEL",
  UPDATE_PARCEL_URL: "UPDATE_PARCEL_URL",
  REMOVE_PARCEL: "REMOVE_PARCEL",
  SELECTED_PARCEL: "SELECTED_PARCEL",
  EDIT_PARCEL: "EDIT_PARCEL",

  COVER_LAND: "COVER_LAND",
  SHOW_LOADER: "SHOW_LOADER",
  HIDE_LOADER: "HIDE_LOADER",
  ERROR: "ERROR",
  
};




function handleError(error) {
  console.error("Error:", error);
  Dispatcher.dispatch({
    type: ActionTypes.ERROR,
    payload: error,
  });
}

function hideLoader() {
  Dispatcher.dispatch({ type: ActionTypes.HIDE_LOADER });
}


function updateParcel(parcel, isProjectView)
{
  // Dispatcher.dispatch({ type: ActionTypes.SHOW_LOADER });
  console.log("UPDATE PARCEL: " + parcel.imageUrl)
  api.updateParcel(parcel, isProjectView,
      (response)=>{
      parcel.shape.setMap(null);
      hideLoader();
      Dispatcher.dispatch({
        type: ActionTypes.UPDATE_PARCEL,
        payload: response,
      });
    }
    , (error)=>{
      parcel.shape.setMap(null);
      hideLoader();
      handleError(error);
    }
  );
}

function updateLandTypeCover(parcel, isProjectView) {
  const types = parcel.coverTypes

  const coords = JSON.parse(parcel.coordinates);
  const lngLatArray = coords.map((coord) => {
      return [coord.lng, coord.lat];
    });

  fetch(baseUrl + "/api/getWorldCoverTypes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ lngLatArray, types }),
  })
    .then((response) => response.json())
    .then((data) => {

      console.log("getLandTypeCover_UPDATE", data);

      parcel.imageUrl = data["urlFormat"];
      parcel.urlFormat = data["urlFormat"];
      console.log(parcel.urlFormat)

      updateParcel(parcel, isProjectView)
    });
}

export const ParcelActions = {
  setProjectId: (projectId) => {
    Dispatcher.dispatch({ 
      type: ActionTypes.SET_PROJECT_ID,
      payload: projectId
    });
},

  fetchParcels: (projectId) => {
    Dispatcher.dispatch({ type: ActionTypes.SHOW_LOADER });

    api.fetchParcels(projectId, (response) =>{
      Dispatcher.dispatch({
        type: ActionTypes.FETCH_PARCELS,
        payload: response,
      });
      hideLoader();
    }, (error)=>{
      hideLoader();
      handleError(error);
    });
  },

  fetchParcelsRequest: (requestId) => {
    Dispatcher.dispatch({ type: ActionTypes.SHOW_LOADER });
    requestStore.getRequest(requestId).then((request) => {
            Dispatcher.dispatch({
            type: ActionTypes.FETCH_PARCELS,
            payload: request.parcels,
      });
    });
   
    // if(request){
    //   console.log("fetchParcelsRequest");
    //   Dispatcher.dispatch({
    //     type: ActionTypes.FETCH_PARCELS,
    //     payload: request.parcels,
    //   });
    //   hideLoader();
    // }
    // else {
    //   console.log("fetchParcelsRequest Error");
    //   hideLoader();
    //   handleError("Cant find request");
    // };
  },

  addParcel: (projectId, parcel) => {
    Dispatcher.dispatch({ type: ActionTypes.SHOW_LOADER });
    api.createParcel(projectId, parcel, (response)=>{
      hideLoader();
      parcel.shape.setMap(null);
      Dispatcher.dispatch({
        type: ActionTypes.ADD_PARCEL,
        payload: response,
      });
   
    }, (error)=>{
      parcel.shape.setMap(null);
      hideLoader();
      handleError(error);
    });
  },

  updateParcel: (parcel, isProjectView) => {
    updateParcel(parcel, isProjectView)
  },

  removeParcel: (parcel) => {
    Dispatcher.dispatch({ type: ActionTypes.SHOW_LOADER });

    api.removeParcel(parcel, (response) => {
      console.log("removeParcel", response);
      parcel.shape.setMap(null);
      Dispatcher.dispatch({
        type: ActionTypes.REMOVE_PARCEL,
        payload: response,
      });
      hideLoader();


    }, (error)=>{});
  },

  setSelectedParcel: (parcel) => {
    Dispatcher.dispatch({ 
      type: ActionTypes.SELECTED_PARCEL,
      payload: parcel
    });
  },

  editParcel: () => {
    Dispatcher.dispatch({ 
      type: ActionTypes.EDIT_PARCEL
    });
  },


  createParcel: (projectId, vertices, types, name, desc, polygon)=>{
    Dispatcher.dispatch({ type: ActionTypes.SHOW_LOADER });
    ParcelActions.getLandCover(vertices, types)
    .then((data) => {
    
      const newParcel = new Parcel(
        Math.floor(Math.random() * 1000000),
        name,
        desc,
        0,
        polygon,
        data["urlFormat"],
        data["areas"],
        data["parcelArea"],
        data["totalArea"],
        types
      );


      console.log("createParcel", newParcel.shapeType);
      ParcelActions.addParcel(projectId, newParcel);
    });
  },

  updateParcelLandCover: (parcel, vertices, types, isProjectView)=>{
    Dispatcher.dispatch({ type: ActionTypes.SHOW_LOADER });
    ParcelActions.getLandCover(vertices, types)
    .then((data) => {

      parcel.imageUrl = data["urlFormat"];
      parcel.urlFormat = data["urlFormat"];
      parcel.areas = data["areas"];
      parcel.parcelArea = data["parcelArea"];
      parcel.totalArea = data["totalArea"];
      parcel.coverTypes = types;
      
      parcel.coordinates = JSON.stringify(MapUtils.getVertices(parcel.shape));

    ParcelActions.updateParcel(parcel, isProjectView);

    });

  },


  getLandCover: (vertices, types) => {
    return new Promise((resolve, reject) => {
      const lngLatArray = [];
      const latLngArray = [];
      vertices.forEach((vertex) => {
        lngLatArray.push([vertex.lng(), vertex.lat()]);
        latLngArray.push([vertex.lat(), vertex.lng()]);
      });
  
      fetch(baseUrl + "/api/getWorldCoverTypes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lngLatArray, types }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("getLandTypeCover", types);
          // Resolve the promise with the new parcel
          resolve(data);
        })
        .catch((error) => {
          // Reject the promise with the error
          reject(error);
        });
    });
  },

  getLandTypeCover: (vertices, types, name, desc, polygon) => {
    const lngLatArray = [];
    const latLngArray = [];
    vertices.forEach((vertex) => {
      lngLatArray.push([vertex.lng(), vertex.lat()]);
      latLngArray.push([vertex.lat(), vertex.lng()]);
    });

    fetch(baseUrl + "/api/getWorldCoverTypes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lngLatArray, types }),
    })
      .then((response) => response.json())
      .then((data) => {

        console.log("getLandTypeCover", types);
        const newParcel = new Parcel(
          Math.floor(Math.random() * 1000000),
          name,
          desc,
          0,
          polygon,
          data["urlFormat"],
          data["areas"],
          data["parcelArea"],
          data["totalArea"],
          types
        );
  
        Dispatcher.dispatch({ 
          type: ActionTypes.COVER_LAND,
          payload: newParcel
        });
      });
    return;
  },

  checkParcelUrl: (parcel, isProjectView) => {

    const formatUrl = parcel.imageUrl
    .replace("{z}", 0)
    .replace("{x}", 0)
    .replace("{y}", 0);



      fetch(formatUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },  
      })
      .then((response) => 
  {
  
      if(response.status !== 200)
        {
          updateLandTypeCover(parcel, isProjectView)
        }
      }
    )
    

  },    
};
