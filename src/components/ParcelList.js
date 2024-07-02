import "../styles/AreaCoverList.css";

function ParcelList(props) {
  return (
    <div style={listStyle}>
      {props.parcels.map((parcel) => {
        return (
          <div
            key={parcel.id}
            style={itemStyle}
            onClick={() => props.setSelectedParcel(parcel)}
          >
            <h2 style={titleStyle}>{parcel.name}</h2>

            <i style={descStyle}>{parcel.desc}</i>
            <p
              style={areaStyle}
              dangerouslySetInnerHTML={{
                __html: `Parcel Area: ${(parcel.parcelArea / 10000).toFixed(
                  2
                )}ha`,
              }}
            />
            <p
              style={areaStyle}
              dangerouslySetInnerHTML={{
                __html: `Total Area: ${(parcel.totalArea / 10000).toFixed(
                  2
                )}ha`,
              }}
            />

            <ul>
              {(props.selectedParcel
                ? props.selectedParcel.id === parcel.id
                : false) &&
                parcel.areas.map((area) => {
                  const areaCovered = area["area"];

                  // const landCoverName = area["land_cover_name"];
                  const landCoverColor = area["color"];
                  // const landCoverColor = 'red';
                  // const firstWord = landCoverName.split(/\b/)[0];

                  // const className = `list-item ${firstWord
                  //   .toLowerCase()
                  //   .replace(/ /g, "-")}`;

                  const percentage = (
                    (areaCovered / parcel.totalArea) *
                    100
                  ).toFixed(2);
                  return (
                    <li
                      style={areasStyle}
                      key={area["land_cover_name"]}
                      dangerouslySetInnerHTML={{
                        __html: `
                        <div style="
                          width: 10px;
                          height: 10px;
                          background-color: ${landCoverColor};
                          border-radius: 50%;
                          display: inline-block;
                          margin-right: 5px;
                        "></div>
                        ${area["land_cover_name"]}(${percentage}%): ${(
                          areaCovered / 10000
                        ).toFixed(2)}ha`,
                      }}
                    />
                  );
                })}
            </ul>
            {(props.selectedParcel
                ? props.selectedParcel.id === parcel.id
                : false) && (
              <button onClick={() => {
              
                props.setEditParcel(props.selectedParcel);
              }}>
                Edit Parcel
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

const listStyle = {
  height: "calc(100vh - 80px)",
  width: "300px",
  background: "white",
  overflow: "auto",
  padding: "10px",
  boxSizing: "border-box",
  overscrollBehavior: "none",
};

const itemStyle = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "10px",
  marginBottom: "5px", // Reduce the space between items
  backgroundColor: "#f9f9f9",
  fontFamily: "Arial, sans-serif",
  color: "#333",
  cursor: "pointer",
};

const titleStyle = {
  marginBottom: "5px",
  fontWeight: "bold",
  fontSize: "1.4em",
  color: "#555", // Change the color to dark grey
};

const descStyle = {
  marginBottom: "5px", // Reduce the space below the description
  fontSize: "1em",
  color: "#555",
};

const areaStyle = {
  marginBottom: "5px", // Reduce the space below the area
  fontSize: "1em",
  color: "#555",
  cursor: "pointer",
};

const areasStyle = {
  marginBottom: "5px", // Reduce the space below the area
  fontSize: "0.8em",
  color: "#555",
  marginLeft: "0px",
};

export default ParcelList;
