import React,{useState, useRef, useEffect} from "react";

import MapUtils from "../../../../../utils/mapUtils";



function MapOptions({isVisible, map, placesService, exportCallback}){
    const [isOptionsVisible, setOptionsIsVisible] = useState(false);
    // const [placeName, setPlaceName] = useState("");
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [marker, setMarker] = useState(null);

    const autocompleteInputRef = useRef(null);

    useEffect(() => {
      if (autocompleteInputRef.current) {
        const autocomplete = new window.google.maps.places.Autocomplete(autocompleteInputRef.current);
  
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.geometry) {
            MapUtils.updateCenterWithPin(
              map,
              place.geometry.location.lat(),
              place.geometry.location.lng()
            );

            if (marker) {
              marker.setMap(null);
            }

           const newLatLng = new window.google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());

           setMarker(new window.google.maps.Marker({
            position: newLatLng,
              map: map,
           }));

          }
        });
      }
    }, [marker, map]);

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
              <input ref={autocompleteInputRef} type="text" placeholder="Search location" />
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
            onClick={() => MapUtils.centerToCurrentLocationWithPin(map, marker, setMarker)}
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