import React from "react";

import { DrawingManager } from "@react-google-maps/api";

function CustomDrawingManager({onComplete}) {
  return (
    <DrawingManager
      options={{
        drawingControl: true,
        drawingControlOptions: {
          position: window.google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [
            window.google.maps.drawing.OverlayType.POLYGON,
            window.google.maps.drawing.OverlayType.RECTANGLE,
          ],
        },
        polygonOptions: {
          editable: false,
          fillOpacity: 0.0,
          strokeColor: "white",
          strokeOpacity: 1,
          strokeWeight: 2,
        },

        rectangleOptions: {
          editable: false,
          fillOpacity: 0.0,
          strokeColor: "white",
          strokeOpacity: 1,
          strokeWeight: 2,
        },
      }}
      onPolygonComplete={onComplete}
      onRectangleComplete={onComplete}
    />
  );
}
export default CustomDrawingManager;
