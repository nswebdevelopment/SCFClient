import { EventEmitter } from "events";
import Dispatcher from "../dispatcher/Dispatcher";
import { ActionTypes } from "../actions/ParcelActions";
import Parcel from "../models/Parcel";

class ParcelStore extends EventEmitter {
  constructor() {
    super();
    console.log("ParcelStore constructor");
    this.parcels = [];
    this.selectedParcel = null;
    this.projectId = null;
    this.isLoading = false;
  }

  getProjectParcels() {
    return this.parcels;
  }

  getSelectedParcel() {
    return this.selectedParcel;
  }

  getProjectId() {
    return this.projectId;
  }

  getIsLoading() {
    return this.isLoading;
  }

  handleActions(action) {
    switch (action.type) {
      case ActionTypes.SET_PROJECT_ID:
        this.projectId = action.payload;
        break;

      case ActionTypes.FETCH_PARCELS:
        this.parcels = [];
        console.log("FETCH_PARCELS", action.payload);
        action.payload.map((parcel) => {
          const savedCoordinates = JSON.parse(parcel.coordinates);

          let shape;
          if (parcel.shapeType === "rectangle") {
            var bounds = new window.google.maps.LatLngBounds(
              new window.google.maps.LatLng(savedCoordinates[1]), // southwest corner
              new window.google.maps.LatLng(savedCoordinates[3]) // northeast corner
            );

            shape = new window.google.maps.Rectangle({
              bounds: bounds,
              editable: false,
              fillOpacity: 0.0,
              strokeColor: "white",
              strokeOpacity: 1,
              strokeWeight: 2,
            });
          } else {
            shape = new window.google.maps.Polygon({
              paths: savedCoordinates,
              editable: false,
              fillOpacity: 0.0,
              strokeColor: "white",
              strokeOpacity: 1,
              strokeWeight: 2,
            });
          }

          const newParcel = new Parcel(
            parcel.id,
            parcel.name,
            parcel.desc,
            parcel.area,
            shape,
            parcel.imageUrl,
            parcel.areas,
            parcel.parcelArea,
            parcel.totalArea,
            parcel.coverTypes
          );

          this.parcels.push(newParcel);
          return null; // Add a return statement here
        });

        this.emit("parcelsFetched");
        this.emit("changed");
        break;

      case ActionTypes.ADD_PARCEL:
        this.parcels.push(action.payload);
        this.emit("parcelCreated", action.payload);
        this.emit("changed");
        break;

      case ActionTypes.UPDATE_PARCEL:
        // this.parcels.push(action.payload);

        const parcel = action.payload;

        const parcelIndex = this.parcels.findIndex((p) => p.id === parcel.id);

        if (parcelIndex !== -1) {
          // Create a new array with the updated parcel
          const newParcels = [...this.parcels];
          newParcels[parcelIndex] = parcel;

          this.parcels = newParcels;
        }

        this.emit("updateParcel", action.payload);
        this.emit("changed");
        break;

      case ActionTypes.REMOVE_PARCEL:
        this.parcels = this.parcels.filter(
          (parcel) => parcel.id !== action.payload
        );
        this.emit("parcelRemoved", action.payload);
        this.emit("changed");

        break;

      case ActionTypes.SELECTED_PARCEL:
        this.selectedParcel = action.payload;
        this.emit("selectedParcel");
        break;

      case ActionTypes.EDIT_PARCEL:
        this.emit("editParcel");
        break;

      case ActionTypes.SHOW_LOADER:
        this.isLoading = true;
        this.emit("loaderStatusChanged");
        break;

      case ActionTypes.HIDE_LOADER:
        this.isLoading = false;
        this.emit("loaderStatusChanged");
        break;

      case ActionTypes.RESET_STORE:
        this.parcels = [];
        this.selectedParcel = null;
        this.projectId = null;
        this.isLoading = false;
        break;

      default:
      // Do nothing
    }
  }
}

const parcelStore = new ParcelStore();
Dispatcher.register(parcelStore.handleActions.bind(parcelStore));

export default parcelStore;
