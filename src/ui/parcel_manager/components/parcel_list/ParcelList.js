import { useEffect, useState } from "react";
import "./AreaCoverList.css";
import "./ParcelList.css";
import ParcelStore from "../../../../stores/ParcelStore";
import { ParcelActions } from "../../../../actions/ParcelActions";


function ParcelList() {
  const [selectedParcel, setSelectedParcel] = useState(null);

  const [parcels, setParcels] = useState([]);

  useEffect(() => {
    ParcelStore.on("selectedParcel", selectedParcelChanged);
    ParcelStore.on("changed", listChanged);

    return () => {
      ParcelStore.removeListener("selectedParcel", selectedParcelChanged);
      ParcelStore.on("changed", listChanged);

    };
  }, []);

  const selectedParcelChanged = () => {
    setSelectedParcel(ParcelStore.getSelectedParcel());
  };


  const listChanged = () => {
    console.log("listChanged", ParcelStore.getProjectParcels().length);
    setParcels([...ParcelStore.getProjectParcels()]);
  };

  return (
    <div className={"listStyle"}>
      {parcels.map((parcel) => {
        return (
          <div
            key={parcel.id}
            className={"itemStyle"}
            onClick={() => 
              ParcelActions.setSelectedParcel(parcel)
            }
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
              {(selectedParcel
                ? selectedParcel.id === parcel.id
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
            {(selectedParcel
              ? selectedParcel.id === parcel.id
              : false) && (
              <div>
                <button
                  onClick={() => {
                    ParcelActions.editParcel();
                  }}
                >
                  Edit Parcel
                </button>

                <button
                  className="red"
                  onClick={() => {
                    ParcelActions.removeParcel(ParcelStore.getProjectId(), parcel);
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
