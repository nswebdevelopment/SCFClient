import React, { useState } from "react";
import PropTypes from "prop-types";

function SCFRequestPopup({ projects, parcels,  sendRequest, onClose }) {
  // const [projectName, setProjectName] = useState(`Project ${id}`);
    console.log("SCFRequestPopup", projects);
  const [projectList] = useState(projects);
  const [parcelList] = useState(parcels);

  const [selectedParcels, setSelectedParcels] = useState([]);

  const [croplandArea, setCroplandArea] = useState(0);
  const [grasslandArea, setGrasslandArea] = useState(0);

  // console.log("SCFRequestPopup", projects);
  const handleSendRequest = (event) => {
    event.preventDefault();
    // if (projectName) {
    sendRequest();
    // }
  };


  const checkIsAllParcelsSelected = (project) => {
    return project.parcels.every((parcel) =>
      selectedParcels.includes(parseInt(parcel.id, 0))
    );
  };

  const setParcelSelected = (parcel) => {
    setSelectedParcels((prevTypes) => [
        ...prevTypes,
        parseInt(parcel.id, 0),
      ]);

      const { grassland, cropland } = getCropGrassLandArea(parcel);

     
      if(grassland)
        setGrasslandArea((prevArea) => prevArea + grassland);
    
      if(cropland)
        setCroplandArea((prevArea) => prevArea + cropland);
      
  };

  const setParcelUnselected = (parcel) => {
    setSelectedParcels((prevTypes) =>
        prevTypes.filter((t) => t !== parseInt(parcel.id, 0))
      );
      const { grassland, cropland } = getCropGrassLandArea(parcel);
        
      if(cropland)
      setCroplandArea((prevArea) => prevArea - cropland);
    if(grassland)
      setGrasslandArea((prevArea) => prevArea - grassland);
  };



const getCropGrassLandArea = (parcel) => {
    if(parcel.groundTypes){
            return { grassland: parcel.groundTypes[30], cropland: parcel.groundTypes[40] };
     }

    if(parcel.areas){

        var grasslandArea = 0
        var croplandArea = 0
        parcel.areas.forEach((area) => {
            if(area.land_cover_name === "30") {  
                grasslandArea = area.area
            }
            if(area.land_cover_name === "40") {
                croplandArea = area.area
            }
        })

        return { grassland: grasslandArea, cropland: croplandArea };
    }
}
          
  return (
    <div className="dialog">
      <div className="dialog-content">
        <h2>Request SCF Project</h2>
        <p>Select the parcels you want to request for SCF</p>
        <p>Selected Cropland area: {((croplandArea<0 ? 0 :croplandArea) / 10000).toFixed(2)}ha</p>
        <p>Selected Grassland area: {((grasslandArea<0 ? 0 :grasslandArea) / 10000).toFixed(2)}ha</p>
        <ul>
          {projectList.map((project) => (
            <li>
              <div
                key={project.id}
                style={{ alignItems: "center", justifyContent: "flex-start" }}
              >
                <input
                  type="checkbox"
                  id={project.id}
                  name={project.name}
                  value={project}
                  checked={checkIsAllParcelsSelected(project)}
                  onChange={(e) => {
                    if (e.target.checked) {
                        project.parcels.forEach((parcel) => {
                            setParcelSelected(parcel);
                        });
                    } else {
                        project.parcels.forEach((parcel) => {
                            setParcelUnselected(parcel);
                        });
                    }
                  }}
                />
                <label>{project.name}</label>
                <ul>
                  {project.parcels.map((parcel) => (
                    <li key={parcel.id}>
                      <div
                        key={parcel.id}
                        style={{
                          alignItems: "center",
                          justifyContent: "flex-start",
                          marginLeft: "20px",
                        }}
                      >
                        <input
                          type="checkbox"
                          id={parcel.id}
                          name={parcel.name}
                          value={parcel}
                          checked={selectedParcels.includes(
                            parseInt(parcel.id, 0)
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                            setParcelSelected(parcel);
                            } else {
                            setParcelUnselected(parcel);
                            }
                          }}
                        />
                        <label>{parcel.name}</label>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}

                <ul>
                  {parcelList.map((parcel) => (
                    <li key={parcel.id}>
                      <div
                        key={parcel.id}
                        style={{
                          alignItems: "center",
                          justifyContent: "flex-start",
                          marginLeft: "20px",
                        }}
                      >
                        <input
                          type="checkbox"
                          id={parcel.id}
                          name={parcel.name}
                          value={parcel}
                          checked={selectedParcels.includes(
                            parseInt(parcel.id, 0)
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                            setParcelSelected(parcel);
                            } else {
                            setParcelUnselected(parcel);
                            }
                          }}
                        />
                        <label>{parcel.name}</label>
                      </div>
                    </li>
                  ))}
                </ul>
        </ul>

        <form onSubmit={handleSendRequest}>
          <button type="submit">Send Request</button>
        </form>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

SCFRequestPopup.propTypes = {
  sendRequest: PropTypes.func.isRequired,
  projects: PropTypes.array,
  parcels: PropTypes.array,
  onClose: PropTypes.func.isRequired,
};

export default SCFRequestPopup;
