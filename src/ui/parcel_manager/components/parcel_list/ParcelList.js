import { useCallback, useEffect, useReducer, useState } from "react";
import "./AreaCoverList.css";
import "./ParcelList.css";
import ParcelStore from "../../../../stores/ParcelStore";
import { ParcelActions } from "../../../../actions/ParcelActions";
import {
  parcelListReducer,
  initialState,
  setParcels,
  setSelectedParcel,
} from "../../../../reducers/parcelLIstReducer";
import { landCoverNames } from "../../../../utils/constants";


function ParcelList() {
  const [state, dispatch] = useReducer(parcelListReducer, initialState);
  
  // const { projectId } = useParams();

  const selectedParcelChanged = useCallback(() => {
    dispatch(setSelectedParcel(ParcelStore.getSelectedParcel()));
  }, []);

  const listChanged = useCallback(() => {
    console.log("ParcelList listChanged", ParcelStore.getProjectParcels());
    dispatch(setParcels([...ParcelStore.getProjectParcels()]));
  }, []);

  const projectSet = useCallback(() => {
    console.log("ParcelList projectSetted", ParcelStore.getProjectId());
    setAllowEdit(ParcelStore.getProjectId() != null);
  }, []);


  const [allowEdit, setAllowEdit] = useState(false);

  useEffect(() => {

    ParcelStore.on("selectedParcel", selectedParcelChanged);
    ParcelStore.on("changed", listChanged);
    ParcelStore.on("projectSet", projectSet);

    return () => {
      ParcelStore.removeListener("selectedParcel", selectedParcelChanged);
      ParcelStore.removeListener("changed", listChanged);
      ParcelStore.removeListener("projectSet", projectSet);

    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={"listStyle"}>
      {state.parcels.map((parcel) => {
        return (
          <div
            key={parcel.id}
            className={"itemStyle"}
            onClick={() => ParcelActions.setSelectedParcel(parcel)}
          >
            <h2 className={"titleStyle"}>{parcel.name}</h2>

            <i className={"descStyle"}>{parcel.description}</i>
            <p
              className={"areaStyle"}
              dangerouslySetInnerHTML={{
                __html: `Area: ${(parcel.area / 10000).toFixed(
                  2
                )}ha`,
              }}
            />

            <ul>
              {(state.selectedParcel
                ? state.selectedParcel.id === parcel.id
                : false) &&
                parcel.areas.map((area) => {
                  const areaCovered = area["area"];
                  const landCoverColor = area["color"];

                  const percentage = (
                    (areaCovered / parcel.area) *
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
                        ${landCoverNames[area["land_cover_name"]]}(${percentage}%): ${(
                          areaCovered / 10000
                        ).toFixed(2)}ha`,
                      }}
                    />
                  );
                })}
            </ul>
       
            {(state.selectedParcel ? state.selectedParcel.id === parcel.id : false) && (
              allowEdit ? 
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
                    ParcelActions.removeParcel(parcel
                    );
                  }}
                >
                  Remove
                </button>
              </div> : null
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ParcelList;
