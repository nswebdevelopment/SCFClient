const SET_SELECTED_PARCEL = "SET_SELECTED_PARCEL";
const SET_PARCELS = "SET_PARCELS";

const initialState = {
    selectedParcel: null,
    parcels: [],
}

function parcelListReducer(state = initialState, action) {
    switch (action.type) {
        case SET_SELECTED_PARCEL:
            return {
                ...state,
                selectedParcel: action.payload
            }
        case SET_PARCELS:
            return {
                ...state,
                parcels: action.payload
            }
        default:
            return state;
    }
}

// action creators
const setSelectedParcel = (parcel) => {
    return {
        type: SET_SELECTED_PARCEL,
        payload: parcel
    }
}

const setParcels = (parcels) => {
    return {
        type: SET_PARCELS,
        payload: parcels
    }
}


export { parcelListReducer, initialState, setParcels, setSelectedParcel};