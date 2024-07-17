import React, { useEffect, useState, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
} from "@react-google-maps/api";
import Parcel from "../../../../models/Parcel";
import { useModal } from "../popup_save/SaveParcelModal";
import { useExportModal } from "../popup_export/ExportParcels";
import FullScreenLoader from "../../../../components/loader/Loader";
import MapUtils from "../../../../utils/mapUtils";
import { baseUrl } from "../../../../utils/constants";
import "./MapStyles.css";
import api from "../../../../api/api";
import MapOptions from "./map_options/MapOptions";
import PopupShapeChange from "./popup_save_shape_changes/PopupShapeChange";
import CustomDrawingManager from "./drawing_manager/CustomDrawingManager";

function Map(props) {
  const [loading, setIsLoading] = useState(false);
  const [map, setMap] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [libraries] = useState(["drawing", "geometry", "places"]);

  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [infoWindowPosition, setInfoWindowPosition] = useState(null);
  const [initialPolygonState, setInitialPolygonState] = useState(null);

  const parcelsRef = useRef();

  const { openModal } = useModal();
  const { openExportModal } = useExportModal();

  parcelsRef.current = props.parcels;

  const [placesService, setPlacesService] = useState(null);

  const addOverlaysForParcel = React.useCallback(
    (parcel) => {
      console.log("Adding overlay for parcel:");
      if (map && map instanceof window.google.maps.Map) {
        // Only access overlayMapTypes if map is defined and is an instance of google.maps.Map

        console.log("Adding overlay for parcel:", parcel.imageUrl);
        const imageMapType = getImageMapType(parcel.imageUrl, 1.0, parcel.id);
        map.overlayMapTypes.push(imageMapType);
      }
    },
    [map]
  );

  const clearOverlayForParcel = (parcel) => {
    console.log("Clearing overlay for parcel:", parcel.name);

    const overlayIndex = map.overlayMapTypes.getArray().findIndex((overlay) => {
      return overlay.name === parcel.id;
    });

    if (overlayIndex !== -1) {
      map.overlayMapTypes.removeAt(overlayIndex);
    }
  };

  useEffect(() => {
    if (props.removedParcel) {
      console.log("Removing parcel:", props.removedParcel);
      props.removedParcel.shape.setMap(null);
      clearOverlayForParcel(props.removedParcel);
      props.addParcel((prevParcels) =>
        prevParcels.filter((parcel) => parcel.id !== props.removedParcel.id)
      );
    }
  }, [props.removedParcel]);

  useEffect(() => {
    if (!map) {
      return;
    }

    setPlacesService(new window.google.maps.places.PlacesService(map));
  
    MapUtils.centerToCurrentLocation(map);
    map.setMapTypeId(window.google.maps.MapTypeId.HYBRID);
    console.log("Google Maps API has loaded");
  }, [map]);

  function onMapLoaded(googleMap) {
    setMap(googleMap);
    setMapLoaded(true);
  }

  useEffect(() => {
    if (mapLoaded === false) return;

    api.getProjectParcels(props.parcelsOfProject).then((data) => {
      console.log("fetchProject", data);
      data.map((parcel) => {
        const savedCoordinates = JSON.parse(parcel.coordinates);

        const shape = new window.google.maps.Polygon({
          paths: savedCoordinates,
          editable: false,
          fillColor: "lightblue",
          fillOpacity: 0.0,
          strokeColor: "grey",
          strokeOpacity: 1,
          strokeWeight: 2,
        });

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

        const handleParcelEdit = () => handlePolygonEdit(shape);
        shape.getPath().addListener("set_at", handleParcelEdit);
        shape.getPath().addListener("insert_at", handleParcelEdit);

        // parcel.polygon = shape;

        shape.setMap(map);
        shape.addListener("click", (event) => {
          props.setSelectedParcel(newParcel);
        });

        props.addParcel((prevParcels) => [...prevParcels, newParcel]);
        // createPolygon(pol, parcel.coverTypes, parcel.name, parcel.desc)
        addOverlaysForParcel(newParcel);
      });
    });
  }, [mapLoaded]);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  useEffect(() => {
    if (props.editParcel != null) {
      console.log("Edit Parcel:", props.editParcel.shape);

      openModal(
        props.editParcel.name,
        props.editParcel.desc,
        props.editParcel.coverTypes,
        (parcel) => {
          props.editParcel.name = parcel.name;
          props.editParcel.desc = parcel.desc;

          // Save the parcel with the entered name and description
          if (parcel) {
            if (
              parcel.selectedTypes.length > 0 &&
              parcel.selectedTypes !== props.editParcel.coverTypes
            ) {
              clearOverlayForParcel(props.editParcel);

              const vertices = MapUtils.getVertices(props.editParcel.shape);
              fetchCoverTypes(vertices, parcel.selectedTypes, (data) => {
                props.editParcel.imageUrl = data["urlFormat"];
                props.editParcel.urlFormat = data["urlFormat"];
                props.editParcel.areas = data["areas"];
                props.editParcel.parcelArea = data["parcelArea"];
                props.editParcel.totalArea = data["totalArea"];
                props.editParcel.coverTypes = parcel.selectedTypes;

                // const handleParcelEdit = () => handlePolygonEdit(newParcel);

                // if (polygon.getBounds) {
                //   polygon.addListener('bounds_changed', handleParcelEdit);
                // } else if (polygon.getPath) {
                //   polygon.getPath().addListener('set_at', handleParcelEdit);
                //   polygon.getPath().addListener('insert_at', handleParcelEdit);
                // }

                // Find the index of the edited parcel in the parcels array
                const parcelIndex = parcelsRef.current.findIndex(
                  (p) => p.id === props.editParcel.id
                );

                console.log("Parcel index:", parcelsRef.current.length);
                // Create a new array with the updated parcel
                const newParcels = [...parcelsRef.current];
                newParcels[parcelIndex] = props.editParcel;

                // Update the parcels state

                api
                  .addParcelToProject(props.parcelsOfProject, props.editParcel)
                  .then((data) => {
                    props.addParcel(newParcels);
                  });

                addOverlaysForParcel(props.editParcel, map);
                setIsLoading(false);
              });

              console.log("Modal closed without saving.");
            } else {
              const parcelIndex = parcelsRef.current.findIndex(
                (p) => p.id === props.editParcel.id
              );

              console.log("Parcel index:", parcelsRef.current.length);
              // Create a new array with the updated parcel
              const newParcels = [...parcelsRef.current];
              newParcels[parcelIndex] = props.editParcel;

              // Update the parcels state
              api
                .addParcelToProject(props.parcelsOfProject, props.editParcel)
                .then((data) => {
                  props.addParcel(newParcels);
                });
              // props.addParcel(newParcels);

              setIsLoading(false);
            }
          }
        },
        () => {
          console.log("Modal closed without saving.");
          // polygon.setMap(null);
          props.setEditParcel(null);
        }
      );
    }
    // eslint-disable-next-line
  }, [props.editParcel]);

  useEffect(() => {
    if (props.selectedParcel && map) {
      const shape = props.selectedParcel.shape;
      const bounds = getBoundsOfShape(shape);
      saveCurrentShapeState(shape);

      // map.zoom = 13;
      map.panTo(bounds.getCenter());
    }
  }, [props.selectedParcel, map]);

  function saveCurrentShapeState(shape) {
    if (shape.getBounds) {
      setInitialPolygonState([
        shape.getBounds().getSouthWest(),
        shape.getBounds().getNorthEast(),
      ]);
    } else if (shape.getPath) {
      setInitialPolygonState(
        shape
          .getPath()
          .getArray()
          .map((coord) => ({ lat: coord.lat(), lng: coord.lng() }))
      );
    }
  }

  // Add a new function to handle the "Cancel" button click
  function handleShapeChangeCancel() {
    const shape = props.selectedParcel.shape;

    if (shape.getBounds) {
      const initialBounds = new window.google.maps.LatLngBounds(
        initialPolygonState[0], // southwest corner
        initialPolygonState[1] // northeast corner
      );

      // Set the rectangle's bounds back to its initial state
      shape.setBounds(initialBounds);
    } else if (shape.getPath) {
      // Set the polygon's path to the initial state
      shape.setPath(
        initialPolygonState.map(
          (coord) => new window.google.maps.LatLng(coord.lat, coord.lng)
        )
      );

      const handleParcelEdit = () => handlePolygonEdit(shape);
      shape.getPath().addListener("set_at", handleParcelEdit);
      shape.getPath().addListener("insert_at", handleParcelEdit);
    }
    // Close the InfoWindow or OverlayView
    setShowInfoWindow(false);
  }

  function handleShapeChangeSave() {
    clearOverlayForParcel(props.selectedParcel);

    const vertices = MapUtils.getVertices(props.selectedParcel.shape);

    fetchCoverTypes(vertices, props.selectedParcel.coverTypes, (data) => {
      props.selectedParcel.imageUrl = data["urlFormat"];
      props.selectedParcel.urlFormat = data["urlFormat"];
      props.selectedParcel.areas = data["areas"];
      props.selectedParcel.parcelArea = data["parcelArea"];
      props.selectedParcel.totalArea = data["totalArea"];

      // Find the index of the edited parcel in the parcels array
      const parcelIndex = parcelsRef.current.findIndex(
        (p) => p.id === props.selectedParcel.id
      );

      // Create a new array with the updated parcel
      const newParcels = [...parcelsRef.current];

      props.selectedParcel.coordinates = JSON.stringify(vertices);

      newParcels[parcelIndex] = props.selectedParcel;

      console.log("To update:", props.selectedParcel.coordinates);
      api
        .addParcelToProject(props.parcelsOfProject, props.selectedParcel)
        .then((data) => {
          props.addParcel(newParcels);
        });

      //  props.addParcel(newParcels);

      addOverlaysForParcel(props.selectedParcel, map);
      setIsLoading(false);
    });

    saveCurrentShapeState(props.selectedParcel.shape);
    setShowInfoWindow(false);
  }

  function getBoundsOfShape(shape) {
    if (shape.getBounds) {
      return shape.getBounds();
    } else if (shape.getPath) {
      const bounds = new window.google.maps.LatLngBounds();

      shape.getPath().forEach(function (point) {
        bounds.extend(point);
      });

      return bounds;
    }
    return null;
  }



  function getImageMapType(urlFormat, opacity = 1.0, name = "Clipped Image") {
    return new window.google.maps.ImageMapType({
      getTileUrl: function (tile, zoom) {
        return urlFormat
          .replace("{z}", zoom)
          .replace("{x}", tile.x)
          .replace("{y}", tile.y);
      },
      tileSize: new window.google.maps.Size(256, 256),
      name: name,
      opacity: opacity,
    });
  }

  function fetchCoverTypes(vertices, types, callback) {
    setIsLoading(true);
    const lngLatArray = [];
    const latLngArray = [];

    vertices.forEach((vertex) => {
      console.log({ lat: vertex.lat(), lng: vertex.lng() });
      lngLatArray.push([vertex.lng(), vertex.lat()]);
      latLngArray.push([vertex.lat(), vertex.lng()]);
    });

    console.log("body:", JSON.stringify({ lngLatArray, types }));

    console.log(
      "Sending request to server to get world cover types...",
      baseUrl + "/api/getWorldCoverTypes"
    );
    fetch(baseUrl + "/api/getWorldCoverTypes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lngLatArray, types }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Data:", data);

        callback(data);
      });
    return;
  }

  function createPolygon(polygon, selectedTypes, name, desc) {
    const vertices = MapUtils.getVertices(polygon);
    fetchCoverTypes(vertices, selectedTypes, (data) => {
      const newParcel = new Parcel(
        props.parcels.length,
        name,
        desc,
        0,
        polygon,
        data["urlFormat"],
        data["areas"],
        data["parcelArea"],
        data["totalArea"],
        selectedTypes
      );

      const handleParcelEdit = () => handlePolygonEdit(polygon);

      if (polygon.getBounds) {
        polygon.addListener("bounds_changed", handleParcelEdit);
      } else if (polygon.getPath) {
        polygon.getPath().addListener("set_at", handleParcelEdit);
        polygon.getPath().addListener("insert_at", handleParcelEdit);
      }

      console.log("Modal closed and parcel saved.", props.parcels.length);

      api.addParcelToProject(props.parcelsOfProject, newParcel).then((data) => {
        props.addParcel((prevParcels) => [...prevParcels, newParcel]);
      });

      addOverlaysForParcel(newParcel, map);
      setIsLoading(false);
    });
  }

  function handlePolygonComplete(polygon) {
    openModal(
      `Parcel No. ${(props.parcels.length + 1).toString().padStart(5, "0")}`,
      "",
      [],
      (parcel) => {
        // Save the parcel with the entered name and description
        if (parcel && parcel.selectedTypes.length > 0) {
          createPolygon(
            polygon,
            parcel.selectedTypes,
            parcel.name,
            parcel.desc
          );
        }
        console.log("Modal closed without saving.");
      },
      () => {
        console.log("Modal closed without saving.");
        polygon.setMap(null);
      }
    );
  }

  function handlePolygonEdit(polygon) {
    console.log("Polygon:", polygon);
    console.log("selectedParcel:", props.selectedParcel);

    setShowInfoWindow(true);
    setInfoWindowPosition(getPolygonCenter(polygon));
  }

  function getPolygonCenter(polygon) {
    var bounds = new window.google.maps.LatLngBounds();

    if (polygon.getBounds) {
      return polygon.getBounds().getCenter();
    } else {
      polygon.getPath().forEach(function (point, index) {
        bounds.extend(point);
      });
    }

    return bounds.getCenter();
  }

  const exportToKml = () => {
    // Your KML export logic here
    console.log("Export to KML button clicked", props.parcels.length);
    if (props.parcels.length === 0) {
      return;
    }

    openExportModal(
      props.parcels,
      (data) => {
        if (data && data.parcels.length > 0) {
          MapUtils.exportToKML(data.parcels);
        }
      },
      () => {
        console.log("Modal closed without saving.");
      }
    );
  };

  return (
    <div className="containerStyle">
      {loading ? <FullScreenLoader /> : null}
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        libraries={libraries}
        preventGoogleFontsLoading={false}
      >
        <GoogleMap
          mapContainerStyle={ { height: 'calc(100vh - 80px)', width: "100%" }}
          zoom={MapUtils.initialZoom}
          center={MapUtils.initialCenter}
          onLoad={onMapLoaded}
          onUnmount={onUnmount}
          options={{
            mapTypeControl: true,
            mapTypeControlOptions: {
              style: mapLoaded
                ? window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR
                : undefined,
              position: mapLoaded
                ? window.google.maps.ControlPosition.LEFT_TOP
                : undefined,
            },
            fullscreenControl: false,
          }}
        >
          {mapLoaded &&
            props.parcels.map((parcel) => {
              MapUtils.drawPolygonsOnMap(map, parcel, () => {
                props.setSelectedParcel(parcel);
              });
              return null; // Add a return statement here
            })}

          {mapLoaded && (
            <CustomDrawingManager 
            onComplete={handlePolygonComplete}/>
          )}
          {showInfoWindow && (
              <PopupShapeChange
                position={infoWindowPosition}
                onSave={handleShapeChangeSave}
                onCancel={handleShapeChangeCancel}
              />
          )}
        </GoogleMap>

        <MapOptions 
        isVisible={props.parcels.length > 0}
        map = {map}
        placesService={placesService}
        exportCallback = {exportToKml}
        />
      </LoadScript>
    </div>
  );
}

export default Map;
