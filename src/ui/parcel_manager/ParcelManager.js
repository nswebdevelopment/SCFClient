import React, { useState, useEffect } from "react";
import ParcelList from "./components/parcel_list/ParcelList";
import { ModalProvider } from "./components/popup_save/SaveParcelModal";
import Map from "./components/map/Map";
import { ExportParcelsModal } from "./components/popup_export/ExportParcels";
import { useLocation } from 'react-router-dom';
import { ParcelActions } from "../../actions/ParcelActions";
import ParcelStore from '../../stores/ParcelStore';


function ParcelManager() {
  const location = useLocation();
  // const [parcelsOfProject, setParcelsOfProject] = useState(null);

  useEffect(() => {
    if (location.state) {
      ParcelActions.setProjectId(location.state.data);
      // setParcelsOfProject(location.state.data);
      ParcelActions.fetchParcels(ParcelStore.getProjectId());
    }
  }, [location.state]);



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
            <Map/>
          </ModalProvider>
        </ExportParcelsModal>
        <ParcelList/>
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