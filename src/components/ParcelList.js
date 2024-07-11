import "../styles/AreaCoverList.css";
import "../styles/ParcelList.css";

function ParcelList(props) {
  return (
    <div className={"listStyle"}>
      {props.parcels.map((parcel) => {
        return (
          <div
            key={parcel.id}
            className={"itemStyle"}
            onClick={() => props.setSelectedParcel(parcel)}
          >
            <h2 className={"titleStyle"}>{parcel.name}</h2>

            <i className={"descStyle"}>{parcel.desc}</i>
            <p
              className={"areaStyle"}
              dangerouslySetInnerHTML={{
                __html: `Parcel Area: ${(parcel.parcelArea / 10000).toFixed(
                  2
                )}ha`,
              }}
            />
            <p
              className={"areaStyle"}
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
                  const landCoverColor = area["color"];

                  const percentage = (
                    (areaCovered / parcel.totalArea) *
                    100
                  ).toFixed(2);
                  return (
                    <li
                      className={"areasStyle"}
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
              <div>
                <button
                  onClick={() => {
                    props.setEditParcel(props.selectedParcel);
                  }}
                >
                  Edit Parcel
                </button>

                <button
                  className="red"
                  onClick={() => {
                    // props.setEditParcel(props.selectedParcel);
                    props.removeParcel(parcel);
                  }}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ParcelList;
