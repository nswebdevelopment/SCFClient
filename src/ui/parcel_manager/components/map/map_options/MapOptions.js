import React,{useState} from "react";

import MapUtils from "../../../../../utils/mapUtils";



function MapOptions({isVisible, map, placesService, exportCallback}){
    const [isOptionsVisible, setOptionsIsVisible] = useState(false);
    const [placeName, setPlaceName] = useState("");
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);

  // Add a new function to search for a location by name
  const searchLocation = () => {
    console.log("Searching for location:", placeName);
    if (placesService && placeName) {
        placesService.textSearch(
        { query: placeName },
        (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            // Move the map to the first result
            MapUtils.updateCenter(
              map,
              results[0].geometry.location.lat(),
              results[0].geometry.location.lng()
            );
          } else {
            console.error("Places search failed:", status);
          }
        }
      );
    }
    else{
        console.error("Places service not available or place name is empty")
    }
  };


    return (
        <div className = {'locationOptions'}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <button
            style={{ width: "30px" }}
            onClick={() => setOptionsIsVisible(!isOptionsVisible)}
          >
            {isOptionsVisible ? "▲" : "▼"}
          </button>
        </div>

        <div className={`slideToggle ${isOptionsVisible ? "open" : ""}`}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="text"
              value={placeName}
              onChange={(e) => setPlaceName(e.target.value)}
              placeholder="Place Name"
            />
            <button
              style={{ width: "40px", height: "100%" }}
              onClick={searchLocation}
            >
              Go
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="number"
              onChange={(e) => setLat(e.target.value)}
              placeholder="Latitude"
            />
            <input
              type="number"
              onChange={(e) => setLng(e.target.value)}
              placeholder="Longitude"
            />

            <button
              style={{ width: "40px" }}
              onClick={() => MapUtils.updateCenter(map, lat, lng)}
            >
              Go
            </button>
          </div>

          <div>
            <button 
            onClick={() => MapUtils.centerToCurrentLocation(map)}
            >
              Center to Current Location
            </button>
          </div>

          <div>
            <button
              id="exportButton"
              onClick={exportCallback}
              disabled={!isVisible}
            >
              Export to KML
            </button>
          </div>
          {/* Your existing code */}
        </div>
      </div>
    );
}

export default MapOptions;