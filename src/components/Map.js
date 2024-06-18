import React, { useEffect, useState, useRef } from "react";
import { GoogleMap, LoadScript, DrawingManager } from "@react-google-maps/api";
import Parcel from "../models/Parcel";
import { useModal } from "./SaveParcelModal";
import FullScreenLoader from "./Loader";
import MapUtils from "../utils/mapUtils";

const containerStyle = {
  flex: 1,
  height: "calc(100vh - 80px)",
  top: 0,
  position: 'relative'
};

const exportButton = {
  position: 'absolute',
  top: '10px',
  right: '10px'
};

const center = { lat: 45.2671, lng: 19.8335 };



function Map(props) {
  const [isCreatingPolygon, setIsCreatingPolygon] = useState(false);

  const [map, setMap] = React.useState(null);
  const [loaded, setLoaded] = React.useState(false);

  const [libraries] = React.useState(["drawing", "geometry"]);

  const { openModal } = useModal();

  // const clearOverlays = React.useCallback(() => {
  //   if (map?.overlayMapTypes) {
  //     while (map.overlayMapTypes.getLength() > 0) {
  //       map.overlayMapTypes.removeAt(0);
  //     }
  //   } else {
  //     console.log("Map is not defined or not a Google Maps object");
  //   }
  // }, [map]);


  const addOverlaysForParcel = React.useCallback((parcel) => {

      const imageMapType = getImageMapType(parcel.imageUrl);
      // const imageMapTypeGrassland = getImageMapType(parcel.grasslandImageUrl);
      // const imageMapTypeCropland = getImageMapType(parcel.croplandImageUrl);
      
      // const imageMapTypeForest = getImageMapType(parcel.forrestImageUrl);

      map.overlayMapTypes.push(imageMapType);
      // map.overlayMapTypes.push(imageMapTypeGrassland);
      // map.overlayMapTypes.push(imageMapTypeCropland);
      // map.overlayMapTypes.push(imageMapTypeForest);






  }, [map]);



  // const addOverlays = React.useCallback(() => {
  //   clearOverlays();
  //   for(const parcel of props.parcels){
  //     addOverlaysForParcel(parcel);
  //   }
  // }, [props.parcels, clearOverlays, addOverlaysForParcel]);


  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
    setLoaded(true);

    map.setMapTypeId(window.google.maps.MapTypeId.SATELLITE);

  
    // Hide labels
    map.setOptions({
      styles: [
        {
          featureType: "all",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
      mapTypeControl: false, // Disable map type control
      // mapTypeControlOptions: {
      //   mapTypeIds: ["roadmap", "satellite"],
      // },
      
      fullscreenControl: false, // Disable fullscreen control
    });

    console.log("Google Maps API has loaded");
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  useEffect(() => {
    if (loaded) {
      console.log("Rendering DrawingManager");
    }
  }, [loaded]);



  useEffect(() => {
    if (props.selectedParcel && map) {
      const shape = props.selectedParcel.polygon;
      const bounds = getBoundsOfShape(shape);

      // map.zoom = 13;
      map.panTo(bounds.getCenter());

     
    }
  }, [props.selectedParcel, map]);


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

  function getImageMapType(urlFormat) {
    return new window.google.maps.ImageMapType({
      getTileUrl: function (tile, zoom) {
        return urlFormat
          .replace("{z}", zoom)
          .replace("{x}", tile.x)
          .replace("{y}", tile.y);
      },
      tileSize: new window.google.maps.Size(256, 256),
      name: "Clipped Image",
    });
  }

  function handlePolygonComplete(polygon) {
    openModal(
      `Parcel No. ${(props.parcels.length + 1).toString().padStart(5, '0')}`,
      (parcel) => {
        // Save the parcel with the entered name and description
        if (parcel && parcel.selectedTypes.length > 0) {
          setIsCreatingPolygon(true);
          // Access the vertices of the polygon
          const vertices = getVertices(polygon);
          
          const area =
            window.google.maps.geometry.spherical.computeArea(vertices);
          const lngLatArray = [];
          const latLngArray = [];
          const types = parcel.selectedTypes;
          // console.log("selectedTypes:", selectedTypes);

          vertices.forEach((vertex) => {
            console.log({ lat: vertex.lat(), lng: vertex.lng() });
            lngLatArray.push([vertex.lng(), vertex.lat()]);
            latLngArray.push([vertex.lat(), vertex.lng() ]);
          });

          console.log("body:",  JSON.stringify({ lngLatArray, types }));

          fetch("/api/getWorldCoverTypes", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ lngLatArray, types }),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("Data:", data);

              const newParcel = new Parcel(
                props.parcels.length,
                parcel.name,
                parcel.desc,
                area,
                polygon,
                data["urlFormat"],
                data["grasslandUrlFormat"],
                data["croplandUrlFormat"],
                data["forestUrlFormat"],
                data["areas"],
                data["parcelArea"],
                data["totalArea"]
              );
              props.addParcel((prevParcels) => [
                ...prevParcels,
                newParcel
                ,
              ]);
              console.log("Modal closed and parcel saved.", props.parcels.length);
            
              addOverlaysForParcel(newParcel, map);
              setIsCreatingPolygon(false);

            });
          return;
        }
        console.log("Modal closed without saving.");
        setIsCreatingPolygon(false);

        // polygon.setMap(null);
      },
      () => {
        console.log("Modal closed without saving.");
        polygon.setMap(null);
      }
    );
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


  useEffect(() => {
    const exportButton = document.getElementById('exportButton');
    if (exportButton) {
      exportButton.addEventListener('click', function() {
        if (parcelsRef.current) {
          MapUtils.exportToKML(parcelsRef.current);
        }
      });
    }
  }, []); 



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
          center={center}
          zoom={10}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            mapTypeControl: true,
            mapTypeControlOptions: {
              style: loaded
                ? window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR
                : undefined,
              position: loaded
                ? window.google.maps.ControlPosition.LEFT_BOTTOM
                : undefined,
            },
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

          
        </GoogleMap>
        <button style = {exportButton} id="exportButton">Export to KML</button>
      </LoadScript>
    </div>
  );
}

export default Map;
