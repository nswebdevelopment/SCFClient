// Action types
const SET_INFO_WINDOW = "SET_INFO_WINDOW";
const SHOW_LOADER = "SHOW_LOADER";
const SET_PARCELS = "SET_PARCELS";
const SET_INITIAL_POLYGON_STATE = "SET_INITIAL_POLYGON_STATE";
const SET_MAP_LOADED = "SET_MAP_LOADED";
const SET_PLACES_SERVICE = "SET_PLACES_SERVICE";
const SET_SHOW_SCF_REQUEST = "SET_SHOW_SCF_REQUEST";

// Initial state
const initialState = {
  showInfoWindow: false,
  infoWindowPosition: null,
  loading: false,
  parcels: [],
  initialPolygonState: null,
  map: null,
  mapLoaded: false,
  placesService: null,
  showRequestPopup: false
};

// Reducer function
function mapReducer(state = initialState, action) {
  switch (action.type) {
    case SET_INFO_WINDOW:
      return {
        ...state,
        showInfoWindow: action.payload.showInfoWindow,
        infoWindowPosition: action.payload.infoWindowPosition,
      };

    case SHOW_LOADER:
      return {
        ...state,
        loading: action.payload,
      };

    case SET_PARCELS:
      console.log("SET_PARCELS", action.payload);
      return {
        ...state,
        parcels: action.payload,
      };

    case SET_INITIAL_POLYGON_STATE:
      return {
        ...state,
        initialPolygonState: action.payload,
      };

    case SET_MAP_LOADED:
      return {
        ...state,
        mapLoaded: action.payload.mapLoaded,
        map: action.payload.map,
      };

    case SET_PLACES_SERVICE:
      return {
        ...state,
        placesService: action.payload,
      };
      case SET_SHOW_SCF_REQUEST:
        return {
          ...state,
          showRequestPopup: action.payload,
        };


    default:
      return state;
  }
}

// Action creators
const setInfoWindow = (showInfoWindow, infoWindowPosition) => ({
  type: SET_INFO_WINDOW,
  payload: { showInfoWindow, infoWindowPosition },
});

const setLoading = (loading) => ({
  type: SHOW_LOADER,
  payload: loading,
});

const setParcels = (parcels) => ({
  type: SET_PARCELS,
  payload: parcels,
});

const setInitialPolygonState = (initialPolygonState) => ({
  type: SET_INITIAL_POLYGON_STATE,
  payload: initialPolygonState,
});

const setMapLoaded = (map, mapLoaded) => ({
  type: SET_MAP_LOADED,
  payload: { map, mapLoaded },
});

const setPlacesService = (placesService) => ({
  type: SET_PLACES_SERVICE,
  payload: placesService,
});

const setShowSCFRequest = (showRequestPopup) => ({
  type: SET_SHOW_SCF_REQUEST,
  payload: showRequestPopup,
});

export {
  mapReducer,
  initialState,
  setInfoWindow,
  setLoading,
  setParcels,
  setInitialPolygonState,
  setMapLoaded,
  setPlacesService,
  setShowSCFRequest
};
