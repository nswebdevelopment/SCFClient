import { EventEmitter } from "events";
import Dispatcher from "../dispatcher/Dispatcher";
import { ActionTypes } from "../actions/ParcelActions";
import Parcel from "../models/Parcel";
import { landCoverColors } from ".././/utils/constants";

class ParcelStore extends EventEmitter {
  constructor() {
    super();
    this.parcels = [];
    this.selectedParcel = null;
    this.projectId = null;
    this.isLoading = false;
    console.log("ParcelStore constructor");
  }

  getProjectParcels() {
    return this.parcels;
  }

  getSelectedParcel() {
    return this.selectedParcel;
  }
  getProjectId()
  {
    console.log("ParcelStore getProjectId", this.projectId);
    return this.projectId;
  }

  // getProject() {
  //   return this.project;
  // }

  getIsLoading() {
    return this.isLoading;
  }

  parseParcel(parcel) {
    const savedCoordinates = parcel.coordinates.map((coord) => {
      return { lat: coord[1], lng: coord[0] };
    });

    var groundTotal = 0;

    const array = Object.entries(parcel.groundTypes).map(([key, value]) => ({
      key,
      value,
    }));
    const areas = array.map((coverType) => {
      groundTotal += coverType.value;

      return {
        area: coverType.value,
        color: landCoverColors[coverType.key],
        land_cover_name: coverType.key,
      };
    });

    const coverTypes = array.map((coverType) => {
      return parseInt(coverType.key);
    });


    let shape;
    if (parcel.isRectangle) {
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
      parcel.description,
      groundTotal,
      shape,
      parcel.imageUrl,
      areas,
      parcel.parcelArea,
      parcel.totalArea,
      coverTypes
    );

    return newParcel;
  }

  handleActions(action) {
    switch (action.type) {
      case ActionTypes.SET_PROJECT_ID:
        console.log("SET_PROJECT_ID", action.payload);
        // this.project = action.payload;
        this.projectId = action.payload;
        this.emit("projectSet");
        break;

      case ActionTypes.FETCH_PARCELS:
        this.parcels = [];

        // console.log("FETCH_PARCELS", action.payload);

        // eslint-disable-next-line array-callback-return
        action.payload.map((parcel) => {
          this.parcels.push(this.parseParcel(parcel));
          // return this.parseParcel(parcel);
        });

        console.log("FETCH_PARCELS parcels", this.parcels);
        this.emit("parcelsFetched");
        this.emit("changed");
        break;

      case ActionTypes.ADD_PARCEL:
        // this.parcels.push(action.payload);
        const parcelAdded = this.parseParcel(action.payload);
        this.parcels.push(parcelAdded);

        this.emit("parcelCreated", parcelAdded);
        this.emit("changed");
        break;

      // case ActionTypes.ERROR:
      //   this.emit("error", action.payload);
      //   break;

      case ActionTypes.UPDATE_PARCEL:
        // this.parcels.push(action.payload);

        const parcel = this.parseParcel(action.payload);

        const parcelIndex = this.parcels.findIndex((p) => p.id === parcel.id);

        if (parcelIndex !== -1) {
          // Create a new array with the updated parcel
          const newParcels = [...this.parcels];
          newParcels[parcelIndex] = parcel;

          this.parcels = newParcels;
        }


        this.emit("updateParcel", parcel);
        this.emit("changed");
        break;

      case ActionTypes.UPDATE_PARCEL_URL:
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

      // case ActionTypes.SHOW_LOADER:
      //   this.isLoading = true;
      //   this.emit("loaderStatusChanged");
      //   break;

      // case ActionTypes.HIDE_LOADER:
      //   this.isLoading = false;
      //   this.emit("loaderStatusChanged");
      //   break;

      case ActionTypes.RESET_STORE:
        this.parcels = [];
        this.selectedParcel = null;
        this.project = null;
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
