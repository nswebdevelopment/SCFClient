import React, { useEffect, useState, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  DrawingManager,
  OverlayView,
} from "@react-google-maps/api";
import Parcel from "../models/Parcel";
import { useModal } from "./SaveParcelModal";
import { useExportModal } from "./ExportParcels";
import FullScreenLoader from "./Loader";
import MapUtils from "../utils/mapUtils";
import { baseUrl } from "../utils/constants";

const containerStyle = {
  flex: 1,
  height: "calc(100vh - 80px)",
  top: 0,
  position: "relative",
};

const exportButton = {
  position: "absolute",
  top: "70px",
  right: "10px",
};

const locationOptions = {
  position: "absolute",
  top: "10px",
  right: "10px",
};

// const soilToggleButton = {
//   position: "absolute",
//   top: "50px",
//   right: "10px",
// };

const center = { lat: 0, lng: 0 };

function Map(props) {
  const [isCreatingPolygon, setIsCreatingPolygon] = useState(false);

  const [map, setMap] = React.useState(null);
  const [loaded, setLoaded] = React.useState(false);

  const [libraries] = React.useState(["drawing", "geometry", "places"]);

  const { openModal } = useModal();
  const {openExportModal} = useExportModal();

  // const [showSoil, setShowSoil] = useState(true);
  // const [soilUrl, setSoilUrl] = useState("");

  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);

  // Add state for the InfoWindow
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  // const [infoWindowContent, setInfoWindowContent] = useState(null);
  const [infoWindowPosition, setInfoWindowPosition] = useState(null);

  // Add a new state variable to store the initial state of the polygon
  const [initialPolygonState, setInitialPolygonState] = useState(null);

  const updateCenter = () => {
    map.setCenter({ lat: parseFloat(lat), lng: parseFloat(lng) });
  };

  const centerToCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        map.setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });

        map.setZoom(10);
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };


// Create a ref for the PlacesService instance
const placesServiceRef = useRef(null);
const [placeName, setPlaceName] = useState('');

  // Add a new function to search for a location by name
const searchLocation  = () => {
  console.log("Searching for location:", placeName);
  if(placesServiceRef.current && placeName){
  placesServiceRef.current.textSearch({ query: placeName }, (results, status) => {
    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
      // Move the map to the first result
      map.setCenter(results[0].geometry.location);
      map.setZoom(12);
    } else {
      console.error('Places search failed:', status);
    }
  });
}
}


  const addOverlaysForParcel = React.useCallback(
    (parcel) => {
      const imageMapType = getImageMapType(parcel.imageUrl, 1.0, parcel.id);
      // const imageMapTypeGrassland = getImageMapType(parcel.grasslandImageUrl);
      // const imageMapTypeCropland = getImageMapType(parcel.croplandImageUrl);

      // const imageMapTypeForest = getImageMapType(parcel.forrestImageUrl);

      map.overlayMapTypes.push(imageMapType);
      // map.overlayMapTypes.push(imageMapTypeGrassland);
      // map.overlayMapTypes.push(imageMapTypeCropland);
      // map.overlayMapTypes.push(imageMapTypeForest);
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

  // const addOverlays = React.useCallback(() => {
  //   clearOverlays();
  //   for(const parcel of props.parcels){
  //     addOverlaysForParcel(parcel);
  //   }
  // }, [props.parcels, clearOverlays, addOverlaysForParcel]);

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
    setLoaded(true);

    placesServiceRef.current = new window.google.maps.places.PlacesService(map);
    console.log("Places Service:", placesServiceRef.current);
    //  Use the Geolocation API to get the user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        // Update the center of the map to the user's current location
        map.setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        map.setZoom(10);
      });
    } else {
      // Browser doesn't support Geolocation
      console.log("Geolocation is not supported by this browser.");
    }

    map.setMapTypeId(window.google.maps.MapTypeId.HYBRID);
    // loadSoilData();
    console.log("Google Maps API has loaded");
  }, []);

  // function loadSoilData() {
  //   fetch(baseUrl + "/api/getSoilData")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log("Soil data:", data["soc_100_200cm"]);
  //       setSoilUrl(data["soc_100_200cm"]);
  //     });
  // }

  // function showSoilLayer() {

  //   console.log("Showing soil layer", soilUrl);
  //   if(showSoil && map){
  //     console.log("Adding soil layer to map", soilUrl);
  //     const soilLayer = getImageMapType(soilUrl);
  //     map.overlayMapTypes.push(soilLayer);

  //   }
  // }

  // useEffect(() => {
  //   if (soilUrl && showSoil && map) {
  //     console.log("Adding soil layer to map", soilUrl);
  //     const soilLayer = getImageMapType(soilUrl);
  //     // map.overlayMapTypes.push(soilLayer);

  //     // Shift up all existing overlays
  //     for (let i = map.overlayMapTypes.getLength() - 1; i >= 0; i--) {
  //       const overlay = map.overlayMapTypes.getAt(i);
  //       map.overlayMapTypes.setAt(i + 1, overlay);
  //     }
  //     map.overlayMapTypes.setAt(0, soilLayer);
  //   }
  // }, [soilUrl, showSoil, map]);

  // function toggleSoilLayer() {
  //   console.log("Toggling soil layer");
  //   setShowSoil((prevState) => !prevState);

  //   if (showSoil && map) {
  //     // console.log("Removing soil layer from map");

  //     // map.overlayMapTypes.removeAt(0)
  //     // // Remove the soil layer at its index

  //     const soilLayer = getImageMapType(soilUrl, 0.0);
  //     // map.overlayMapTypes.push(soilLayer);

  //     // Shift up all existing overlays
  //     // for (let i = map.overlayMapTypes.getLength() - 1; i >= 0; i--) {
  //     //   const overlay = map.overlayMapTypes.getAt(i);
  //     //   map.overlayMapTypes.setAt(i + 1, overlay);
  //     // }
  //     map.overlayMapTypes.setAt(0, soilLayer);
  //   }
  // }

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  useEffect(() => {
    if (loaded) {
      console.log("Rendering DrawingManager");
    }
  }, [loaded]);

  useEffect(() => {
    if (props.editParcel != null) {
      console.log("Edit Parcel:", props.editParcel.polygon);

      openModal(
        props.editParcel.name,
        props.editParcel.desc,
        props.editParcel.coverTypes,
        (parcel) => {

          props.editParcel.name = parcel.name;
          props.editParcel.desc = parcel.desc;

          // Save the parcel with the entered name and description
          if(parcel)
            {
              if (parcel.selectedTypes.length > 0 && parcel.selectedTypes !== props.editParcel.coverTypes) {
                clearOverlayForParcel(props.editParcel);
                fetchCoverTypes(
                  props.editParcel.polygon,
                  parcel.selectedTypes,
                  (data) => {
                 
                    props.editParcel.imageUrl = data["urlFormat"];
                    props.editParcel.urlFormat = data["urlFormat"];
                    props.editParcel.grasslandUrlFormat =
                      data["grasslandUrlFormat"];
                    props.editParcel.croplandUrlFormat = data["croplandUrlFormat"];
                    props.editParcel.forestUrlFormat = data["forestUrlFormat"];
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
                    props.addParcel(newParcels);
    
                    addOverlaysForParcel(props.editParcel, map);
                    setIsCreatingPolygon(false);
                  }
                );
    
                console.log("Modal closed without saving.");
              }
              else
              {
            
                const parcelIndex = parcelsRef.current.findIndex(
                  (p) => p.id === props.editParcel.id
                );
    
                console.log("Parcel index:", parcelsRef.current.length);
                // Create a new array with the updated parcel
                const newParcels = [...parcelsRef.current];
                newParcels[parcelIndex] = props.editParcel;
    
                // Update the parcels state
                props.addParcel(newParcels);
    
                setIsCreatingPolygon(false);
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
  }, [props.editParcel]);

  useEffect(() => {
    if (props.selectedParcel && map) {
      const shape = props.selectedParcel.polygon;
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
    const shape = props.selectedParcel.polygon;

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

      const handleParcelEdit = () =>handlePolygonEdit(props.selectedParcel, shape);

        shape.getPath().addListener("set_at", handleParcelEdit);
        shape.getPath().addListener("insert_at", handleParcelEdit);
      

  
    }
    // Close the InfoWindow or OverlayView
    setShowInfoWindow(false);
  }

  function handleShapeChangeSave() {
    clearOverlayForParcel(props.selectedParcel);

    fetchCoverTypes(
      props.selectedParcel.polygon,
      props.selectedParcel.coverTypes,
      (data) => {
        props.selectedParcel.imageUrl = data["urlFormat"];
        props.selectedParcel.urlFormat = data["urlFormat"];
        props.selectedParcel.grasslandUrlFormat = data["grasslandUrlFormat"];
        props.selectedParcel.croplandUrlFormat = data["croplandUrlFormat"];
        props.selectedParcel.forestUrlFormat = data["forestUrlFormat"];
        props.selectedParcel.areas = data["areas"];
        props.selectedParcel.parcelArea = data["parcelArea"];
        props.selectedParcel.totalArea = data["totalArea"];

        // Find the index of the edited parcel in the parcels array
        const parcelIndex = parcelsRef.current.findIndex(
          (p) => p.id === props.selectedParcel.id
        );

        // Create a new array with the updated parcel
        const newParcels = [...parcelsRef.current];
        newParcels[parcelIndex] = props.selectedParcel;

        // Update the parcels state
        props.addParcel(newParcels);

        addOverlaysForParcel(props.selectedParcel, map);
        setIsCreatingPolygon(false);
      }
    );

    saveCurrentShapeState(props.selectedParcel.polygon);
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

  function getVertices(shape) {
    console.log("Shape:", shape);

    if (shape.getBounds) {
      const bounds = shape.getBounds();

      // Get the North East and South West points
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();

      // Create an array of the four corner points
      const path = [
        new window.google.maps.LatLng(ne.lat(), ne.lng()), // North East,
        new window.google.maps.LatLng(ne.lat(), sw.lng()), // North West,
        new window.google.maps.LatLng(sw.lat(), sw.lng()), // South West,
        new window.google.maps.LatLng(sw.lat(), ne.lng()), // South East
      ];

      console.log("Rectangle bounds:", path);

      // Return the path
      return path;
    } else if (shape.getPath) {
      console.log("Polygon");

      const path = shape.getPath().getArray();
      console.log("Rectangle bounds:", path);
      return path;
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

  function fetchCoverTypes(polygon, types, callback) {
    setIsCreatingPolygon(true);

    // Access the vertices of the polygon
    const vertices = getVertices(polygon);

    // const area = window.google.maps.geometry.spherical.computeArea(vertices);
    const lngLatArray = [];
    const latLngArray = [];

    // console.log("selectedTypes:", selectedTypes);

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

  function handlePolygonComplete(polygon) {
    openModal(
      `Parcel No. ${(props.parcels.length + 1).toString().padStart(5, "0")}`,
      '',
      [],
      (parcel) => {
        // Save the parcel with the entered name and description
        if (parcel && parcel.selectedTypes.length > 0) {
          fetchCoverTypes(polygon, parcel.selectedTypes, (data) => {
            const newParcel = new Parcel(
              props.parcels.length,
              parcel.name,
              parcel.desc,
              0,
              polygon,
              data["urlFormat"],
              data["grasslandUrlFormat"],
              data["croplandUrlFormat"],
              data["forestUrlFormat"],
              data["areas"],
              data["parcelArea"],
              data["totalArea"],
              parcel.selectedTypes
            );

            const handleParcelEdit = () =>
              handlePolygonEdit(newParcel, polygon);

            if (polygon.getBounds) {
              polygon.addListener("bounds_changed", handleParcelEdit);
            } else if (polygon.getPath) {
              polygon.getPath().addListener("set_at", handleParcelEdit);
              polygon.getPath().addListener("insert_at", handleParcelEdit);
            }

            props.addParcel((prevParcels) => [...prevParcels, newParcel]);
            console.log("Modal closed and parcel saved.", props.parcels.length);

            addOverlaysForParcel(newParcel, map);
            setIsCreatingPolygon(false);
          });
        }
        console.log("Modal closed without saving.");
        // setIsCreatingPolygon(false);

        // polygon.setMap(null);
      },
      () => {
        console.log("Modal closed without saving.");
        polygon.setMap(null);
      }
    );
  }

  function handlePolygonEdit(parcel, polygon) {
    // Handle the polygon edit here
    // const parcel = this.parcel;
    console.log("Polygon:", polygon);
    // parcel.name = 'Edited Parcel';
    // clearOverlayForParcel(parcel);
    // console.log("Polygon edited", this.getArray);

    // parcel.polygon = polygon;

    setShowInfoWindow(true);
    // setInfoWindowContent(`Polygon ${parcel.name} is being edited.`);
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

  // useEffect(() => {
  //   if (props.selectedParcel) {

  //     clearOverlays();
  //     addOverlaysForParcel(props.selectedParcel);
  //   }
  // }, [props.selectedParcel, props.parcels, addOverlaysForParcel, clearOverlays]);

  function drawPolygonsOnMap(parcel) {
    parcel.polygon.setMap(map);
    parcel.polygon.addListener("click", (event) => {
      props.setSelectedParcel(parcel);
    });
  }

  const parcelsRef = useRef();
  parcelsRef.current = props.parcels;

  // useEffect(() => {
  //   const exportButton = document.getElementById('exportButton');
  //   if (exportButton) {
  //     exportButton.addEventListener('click', function() {

  //       if (parcelsRef.current) {

  //         MapUtils.exportToKML(parcelsRef.current);
  //       }
  //     });
  //   }
  // }, []);

  const exportToKml = () => {
    // Your KML export logic here
    console.log("Export to KML button clicked", props.parcels.length);
    if (props.parcels.length === 0) {
      return;
    }
    // MapUtils.exportToKML(props.parcels);


    openExportModal(
      props.parcels,
      (data) => {
        // Save the parcel with the entered name and description
   
        if (data && data.parcels.length > 0) {
            console.log("Exporting parcels:", data.parcels);
          
          MapUtils.exportToKML(data.parcels);
        }
       
        // setIsCreatingPolygon(false);

        // polygon.setMap(null);
      },
      () => {
        console.log("Modal closed without saving.");
      }
    );
  };

  return (
    <div style={containerStyle}>
      {isCreatingPolygon ? <FullScreenLoader /> : null}
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        libraries={libraries}
        preventGoogleFontsLoading={false}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          zoom={2}
          center={center}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            mapTypeControl: true,
            mapTypeControlOptions: {
              style: loaded
                ? window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR
                : undefined,
              position: loaded
                ? window.google.maps.ControlPosition.LEFT_TOP
                : undefined,
            },
            fullscreenControl: false,
          }}
        >
          {props.parcels.map((parcel) => {
            drawPolygonsOnMap(parcel);
            // console.log(parcel.name);
            return null; // Add a return statement here
          })}

          {loaded && (
            <DrawingManager
              options={{
                drawingControl: true,
                drawingControlOptions: {
                  position: window.google.maps.ControlPosition.TOP_CENTER,
                  drawingModes: [
                    window.google.maps.drawing.OverlayType.POLYGON,
                    // window.google.maps.drawing.OverlayType.CIRCLE,
                    window.google.maps.drawing.OverlayType.RECTANGLE,
                    //   window.google.maps.drawing.OverlayType.POLYLINE,
                    //   window.google.maps.drawing.OverlayType.MARKER,
                  ],
                },
                polygonOptions: {
                  editable: false,
                  fillColor: "lightblue",
                  fillOpacity: 0.0,
                  strokeColor: "grey",
                  strokeOpacity: 1,
                  strokeWeight: 2,
                },

                rectangleOptions: {
                  editable: false,
                  fillColor: "lightblue",
                  fillOpacity: 0.0,
                  strokeColor: "grey",
                  strokeOpacity: 1,
                  strokeWeight: 2,
                },
              }}
              onPolygonComplete={handlePolygonComplete}
              onRectangleComplete={handlePolygonComplete}
            />
          )}
          {showInfoWindow && (
            <OverlayView
              position={infoWindowPosition}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <div>
                <button onClick={handleShapeChangeSave}>Save</button>
                <button onClick={handleShapeChangeCancel}>Cancel</button>
              </div>
            </OverlayView>
          )}
        </GoogleMap>

        <button
          style={exportButton}
          id="exportButton"
          onClick={exportToKml}
          disabled={props.parcels.length === 0}
        >
          Export to KML
        </button>
        {/* <button onClick={toggleSoilLayer} style={soilToggleButton}>
          {showSoil ? "Hide" : "Show"} Soil Layer
        </button> */}


  

        <div style={locationOptions}>
         
        <div>
        <input
            type="text"
            value={placeName}
            onChange={(e) => setPlaceName(e.target.value)}
            placeholder="Place Name"
          />
          <button onClick={searchLocation}>Go</button>

        </div>

          <input
            type="number"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="Latitude"
          />
          <input
            type="number"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            placeholder="Longitude"
          />

<button onClick={updateCenter}>Go</button>
          <div>
          
            <button onClick={centerToCurrentLocation}>
              Center to Current Location
            </button>
          </div>
        </div>
      </LoadScript>
    </div>
  );
}

export default Map;
