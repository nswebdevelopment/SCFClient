import React from "react";

import { OverlayView,} from "@react-google-maps/api";

function PopupShapeChange({position, onSave, onCancel}) {
  return (
    <OverlayView
    position={position}
    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
  >
    <div>
      <button
        style={{ width: "100px" }}
        onClick={onSave}
      >
        Save
      </button>
      <button
        style={{ width: "100px" }}
        onClick={onCancel}
      >
        Cancel
      </button>
    </div>
  </OverlayView>
  );
}
export default PopupShapeChange;