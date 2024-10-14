import React, { useEffect, useReducer } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
// import { useModal } from "../popup_save/SaveParcelModal";
import { useExportModal } from "../popup_export/ExportParcels";
import FullScreenLoader from "../../../../components/loader/Loader";
import MapUtils from "../../../../utils/mapUtils";

import "./MapStyles.css";
import MapOptions from "./map_options/MapOptions";
import PopupShapeChange from "./popup_save_shape_changes/PopupShapeChange";
import CustomDrawingManager from "./drawing_manager/CustomDrawingManager";
import ParcelStore from "../../../../stores/ParcelStore";
import AppStore from "../../../../stores/AppStore";


import { ParcelActions } from "../../../../actions/ParcelActions";
import {
  mapReducer,
  initialState,
  setInfoWindow,
  setLoading,
  setParcels,
  setInitialPolygonState,
  setMapLoaded,
  setPlacesService,
  setShowSCFRequest
} from "../../../../reducers/mapReducer";
import SCFRequestPopup from "../../../../components/popups/SCFRequest";
import { useParams } from 'react-router-dom';
// import appStore from "../../../../stores/AppStore";
const libraries = ["drawing", "geometry", "places"];

function Map(openModal) {
  const { projectId } = useParams();
  const { requestId } = useParams();
  console.log("projectIdMap: ", projectId);
  console.log("requestIdMap: ", requestId);


  const [state, dispatch] = useReducer(mapReducer, initialState);
  const { openExportModal } = useExportModal();
  const [isProjectView, setIsProjectView] = React.useState(false);

  function onMapLoaded(googleMap) {
    googleMap.setMapTypeId(window.google.maps.MapTypeId.HYBRID);
    dispatch(setMapLoaded(googleMap, true));
    console.log("Map loaded");

    if(projectId)
      {
        setIsProjectView(true);
        ParcelActions.fetchParcels(projectId);
      }

    if(requestId)
    {
      setIsProjectView(false);
      ParcelActions.fetchParcelsRequest(requestId);
    }
  }

  const onError = (error) => {
    alert(error);
    // error.shape.setMap(null);
  };
  // Handle the "Parcels Fetched" event
  const parcelsFetched = () => {
    const bounds = new window.google.maps.LatLngBounds();
    var fitBounds = false;
    ParcelStore.getProjectParcels().map((parcel) => {
      if (parcel.shape.getBounds) {
        const b = parcel.shape.getBounds();
        bounds.extend(b.getNorthEast());
        bounds.extend(b.getSouthWest());
        bounds.extend(b.getNorthEast());
        bounds.extend(b.getSouthWest());
      } else if (parcel.shape.getPath) {
        const path = parcel.shape.getPath().getArray();
        path.forEach(point => {
          bounds.extend(point);
        });
      }

      configureParcel(parcel);
      fitBounds = true;
      return null;

    });

    // console.log("Parcels fetched:", ParcelStore.getProjectParcels());
    dispatch(setParcels([...ParcelStore.getProjectParcels()]));
    if(fitBounds)
    state.map.fitBounds(bounds);
  };

  const handleSendRequest = () => {
    handleClose();
  }

  const handleClose = () => {
    dispatch(setShowSCFRequest(false))
  };

  //Handle the "Parcel Removed" event
  const parcelRemoved = (parcelId) => {
    MapUtils.clearOverlayForParcel(state.map, parcelId);
    dispatch(setParcels([...ParcelStore.getProjectParcels()]));
  };

  //Handle the "Selected Parcel Changed" event
  const selectedParcelChanged = () => {
    const selected = ParcelStore.getSelectedParcel();

    const shape = selected.shape;
    const bounds = MapUtils.getBoundsOfShape(shape);
    //Save the initial state of the shape
    dispatch(setInitialPolygonState(MapUtils.getShape(shape)));

    // map.zoom = 13;
    state.map.panTo(bounds.getCenter());

    ParcelStore.getProjectParcels().forEach((parcel) => {
      const isCurrentParcel = parcel.id === selected.id;
      parcel.shape.setMap(state.map);
      parcel.shape.setOptions({
        strokeWeight: isCurrentParcel ? 3 : 1,
        strokeColor: "white",
      });
      parcel.shape.setEditable(isCurrentParcel);
    });
  };

  const openEditModal = () => {
    const selectedParcel = ParcelStore.getSelectedParcel();

    openModal(
      selectedParcel.name,
      selectedParcel.description,
      selectedParcel.coverTypes,
      (parcel) => {
        selectedParcel.name = parcel.name;
        selectedParcel.description = parcel.description;
        // Save the parcel with the entered name and description
        if (parcel) {
          if (
            parcel.selectedTypes.length > 0 &&
            parcel.selectedTypes !== selectedParcel.coverTypes
          ) {
            const vertices = MapUtils.getVertices(selectedParcel.shape);
            ParcelActions.updateParcelLandCover(
              selectedParcel,
              vertices,
              parcel.selectedTypes
            );
          } else {
            ParcelActions.updateParcel(selectedParcel);
          }
        }
      },
      () => {
        console.log("Modal closed without saving.");
      }
    );
  };

  const onParcelCreated = (parcel) => {
    configureParcel(parcel);
    dispatch(setParcels([...ParcelStore.getProjectParcels()]));
  };

  function configureParcel(parcel) {
    //Draw polugon/rectangle on map and set on click event
    MapUtils.drawPolygonsOnMap(state.map, parcel, () => {
      ParcelActions.setSelectedParcel(parcel);
    });

    //Add event listener for polygon/rectangle edit
    const handleParcelEdit = () => handlePolygonEdit(parcel.shape);
    if (parcel.shape.getBounds) {
      parcel.shape.addListener("bounds_changed", handleParcelEdit);
    } else if (parcel.shape.getPath) {
      parcel.shape.getPath().addListener("set_at", handleParcelEdit);
      parcel.shape.getPath().addListener("insert_at", handleParcelEdit);
    }

    // Add a new function to add overlays for the parcel
    MapUtils.addOverlaysForParcel(parcel, state.map);
  }

  //Handle the "Parcel Updated" event
  const onParcelUpdated = (parcel) => {
    MapUtils.clearOverlayForParcel(state.map, parcel.id);
    configureParcel(parcel);
  };

  useEffect(() => {
    if (state.mapLoaded === false) return;

    dispatch(
      setPlacesService(new window.google.maps.places.PlacesService(state.map))
    );
    MapUtils.centerToCurrentLocation(state.map);

    ParcelStore.on("parcelsFetched", parcelsFetched);
    ParcelStore.on("parcelRemoved", parcelRemoved);
    ParcelStore.on("selectedParcel", selectedParcelChanged);
    ParcelStore.on("editParcel", openEditModal);
    ParcelStore.on("parcelCreated", onParcelCreated);
    ParcelStore.on("updateParcel", onParcelUpdated);
    AppStore.on("error", onError);
    AppStore.on("showLoader", showLoader);
    AppStore.on("hideLoader", hideLoader);

    // Cleanup
    return () => {
      ParcelStore.removeListener("parcelsFetched", parcelsFetched);
      ParcelStore.removeListener("parcelRemoved", parcelRemoved);
      ParcelStore.removeListener("selectedParcel", selectedParcelChanged);
      ParcelStore.removeListener("editParcel", openEditModal);
      ParcelStore.removeListener("parcelCreated", onParcelCreated);
      ParcelStore.removeListener("updateParcel", onParcelUpdated);
      AppStore.removeListener("error", onError);
      AppStore.removeListener("showLoader", showLoader);
      AppStore.removeListener("hideLoader", hideLoader);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.mapLoaded]);

  const handleMapUnmount = React.useCallback(function callback(map) {
    dispatch(setMapLoaded(null, false));
  }, []);

  const showLoader = () => {
    dispatch(setLoading(true));
  };

  const hideLoader = () => {
    dispatch(setLoading(false));
  };

  function setShapeBounds(shape, initialBounds) {
    shape.setBounds(initialBounds);
  }

  function setShapePath(shape, initialPath) {
    shape.setPath(
      initialPath.map(
        (coord) => new window.google.maps.LatLng(coord.lat, coord.lng)
      )
    );
  }

  // Handle the "Shape Change Cancel" event
  function handleShapeChangeCancel() {
    const shape = ParcelStore.getSelectedParcel().shape;

    // Return the shape to its initial state
    if (shape.getBounds) {
      const initialBounds = new window.google.maps.LatLngBounds(
        state.initialPolygonState[0], // southwest corner
        state.initialPolygonState[1] // northeast corner
      );
      setShapeBounds(shape, initialBounds);
    } else if (shape.getPath) {
      shape.setPath(
        state.initialPolygonState.map(
          (coord) => new window.google.maps.LatLng(coord.lat, coord.lng)
        )
      );

      setShapePath(shape, state.initialPolygonState);
      const handleParcelEdit = () => handlePolygonEdit(shape);
      shape.getPath().addListener("set_at", handleParcelEdit);
      shape.getPath().addListener("insert_at", handleParcelEdit);
    }

    dispatch(setInfoWindow(false));
  }

  // Handle the "Shape Change Save" event
  function handleShapeChangeSave() {
    const selectedParcel = ParcelStore.getSelectedParcel();
    const vertices = MapUtils.getVertices(selectedParcel.shape);
    ParcelActions.updateParcelLandCover(
      selectedParcel,
      vertices,
      selectedParcel.coverTypes
    );

    dispatch(setInfoWindow(false));
  }

  // Handle the Drawing Manager "Polygon Complete" event
  function handlePolygonComplete(polygon) {
    openModal(
      `Parcel No. ${(state.parcels.length + 1).toString().padStart(5, "0")}`,
      "",
      [],
      (parcel) => {
        if (parcel && parcel.selectedTypes.length > 0) {
          const vertices = MapUtils.getVertices(polygon);
          ParcelActions.createParcel(
            projectId,
            vertices,
            parcel.selectedTypes,
            parcel.name,
            parcel.desc,
            polygon
          );
        } else {
          alert("You must select at least one land cover type.");
          polygon.setMap(null);
        }
      },
      () => {
        polygon.setMap(null);
      }
    );
  }

  // Handle the "Polygon Edit" event
  function handlePolygonEdit(polygon) {
    dispatch(setInfoWindow(true, MapUtils.getPolygonCenter(polygon)));
  }

  const exportToKml = () => {
    if (state.parcels.length === 0) {
      return;
    }
    openExportModal(
      state.parcels,
      (data) => {
        if (data && data.parcels.length > 0) {
          MapUtils.exportToKML(data.parcels);
        }
      },
      () => {
        // Add a new function to handle the "Cancel" button click
      }
    );
  };


  const requestSCF = () => {
    if (state.parcels.length === 0) {
      return;
    }
    dispatch(setShowSCFRequest(true));
  };

  return (
    <div className="containerStyle">

      {state.loading ? <FullScreenLoader /> : null}
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        libraries={libraries}
        preventGoogleFontsLoading={false}
      >
        <GoogleMap
          mapContainerStyle={{ height: "calc(100vh - 80px)", width: "100%" }}
          zoom={MapUtils.initialZoom}
          center={MapUtils.initialCenter}
          onLoad={onMapLoaded}
          onUnmount={handleMapUnmount}
          options={{
            mapTypeControl: true,
            mapTypeControlOptions: {
              style: state.mapLoaded
                ? window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR
                : undefined,
              position: state.mapLoaded
                ? window.google.maps.ControlPosition.LEFT_TOP
                : undefined,
            },
            fullscreenControl: false,
          }}
        >


          {state.mapLoaded &&  (
            isProjectView &&
            <CustomDrawingManager onComplete={handlePolygonComplete} />
          )}
          {state.showInfoWindow && (
            <PopupShapeChange
              position={state.infoWindowPosition}
              onSave={handleShapeChangeSave}
              onCancel={handleShapeChangeCancel}
            />
          )}
        </GoogleMap>

        {
          isProjectView? 
          <MapOptions
          isVisible={state.parcels.length > 0}
          map={state.map}
          placesService={state.placesService}
          exportCallback={exportToKml}
          requestCallback={requestSCF}
        />
         : 

        
      
       null



        } 
    
         
   



    { 
        state.showRequestPopup ? (
          <SCFRequestPopup
          projects={[]}
          parcels={[...state.parcels]}
          sendRequest={handleSendRequest}
          onClose={handleClose}
        />
          // <SCFRequestPopup
          //   projects={[]}
          //   sendRequest={ dispatch(setShowSCFRequest(false))}
          //   onClose={ dispatch(setShowSCFRequest(false))}
          // />
      ) : (null)}


      </LoadScript>
    </div>
  );
}

export default Map;
