import React, { useState, useEffect } from "react";
import ParcelList from "../components/ParcelList";
import { ModalProvider } from "../components/SaveParcelModal";
import Map from "../components/Map";
import { ExportParcelsModal } from "../components/ExportParcels";
import { useLocation } from 'react-router-dom';
import  api  from '../api/api';


function ParcelManager() {
  const location = useLocation();
  const [parcelsOfProject, setParcelsOfProject] = useState(null);

  // console.log("MapPage props", location.state.data);
  useEffect(() => {
    if (location.state) {
      setParcelsOfProject(location.state.data);
    }
  }, [location.state]);

  const [parcels, addParcel] = useState([]);

  const [selectedParcel, setSelectedParcel] = useState(null);
  const [editParcel, setEditParcel] = useState(null);
  const [removedParcel, setRemovedParcel] = useState(null);

  useEffect(() => {
    if (selectedParcel) {
      setEditParcel(null);
      console.log("edit parcel set to null");
      parcels.map((parcel) => {
        parcel.polygon.setOptions({ strokeWeight: 1, strokeColor: "white" });
        parcel.polygon.setEditable(false);
        return null;
      });

      selectedParcel.polygon.setOptions({
        strokeWeight: 3,
        strokeColor: "white",
      });
      selectedParcel.polygon.setEditable(true);
    }
  }, [selectedParcel, parcels]);

  return (
    <div className="home" style={styles.container}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100vw",
          overflow: "hidden",
        }}
      >
        <ExportParcelsModal>
          <ModalProvider>
            <Map
            parcelsOfProject = {parcelsOfProject}
              parcels={parcels}
              addParcel={addParcel}
              selectedParcel={selectedParcel}
              setSelectedParcel={setSelectedParcel}
              editParcel={editParcel}
              setEditParcel={setEditParcel}
              removedParcel={removedParcel}
            />
          </ModalProvider>
        </ExportParcelsModal>
        <ParcelList
          parcels={parcels}
          setSelectedParcel={setSelectedParcel}
          selectedParcel={selectedParcel}
          setEditParcel={setEditParcel}
          removeParcel={(parcel) => {

            api.removeParcel(parcelsOfProject, parcel).then((res) => {
              setRemovedParcel(parcel);
              // parcel.polygon.setMap(null);
              // const newParcels = parcels.filter((p) => p !== parcel);
              // addParcel(newParcels);

            });
           
          }}
        />
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: "absolute", // Position it relative to the parent
    left: 0, // Start from the left
    right: 0, // Stretch to the right
    top: 80, // Start from the top
    bottom: 0, // Stretch to the bottom
    backgroundColor: "white", // Set the background color to blue
    overflow: "hidden", // Hide the overflowing content
  },
};

export default ParcelManager;
