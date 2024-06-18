class MapUtils {
  static exportToKML(parcels) {
    console.log("export to kml", parcels.length);
    let kml =
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<kml xmlns="http://www.opengis.net/kml/2.2">\n' +
      "<Document>\n";
    parcels.forEach((parcel) => {
      kml += MapUtils.convertShapeToKML(parcel.polygon);
    });
    kml += "</Document>\n</kml>";

    MapUtils.download("map.kml", kml);
  }

  static convertShapeToKML(shape) {
    let kml = "";
    if (shape instanceof window.google.maps.Marker) {
      const position = shape.getPosition();
      kml +=
        "<Placemark>\n" +
        "<Point>\n" +
        `<coordinates>${position.lng()},${position.lat()},0</coordinates>\n` +
        "</Point>\n" +
        "</Placemark>\n";
    } else if (shape instanceof window.google.maps.Circle) {
      const center = shape.getCenter();
      const radius = shape.getRadius();
      kml +=
        "<Placemark>\n" +
        "<Circle>\n" +
        `<center>${center.lng()},${center.lat()},0</center>\n` +
        `<radius>${radius}</radius>\n` +
        "</Circle>\n" +
        "</Placemark>\n";
    } else if (
      shape instanceof window.google.maps.Polygon ||
      shape instanceof window.google.maps.Polyline
    ) {
      const path = shape.getPath();
      kml += "<Placemark>\n";
      if (shape instanceof window.google.maps.Polygon) {
        kml += "<Polygon>\n<outerBoundaryIs>\n<LinearRing>\n<coordinates>\n";
      } else {
        kml += "<LineString>\n<coordinates>\n";
      }
      path.forEach((latlng) => {
        kml += `${latlng.lng()},${latlng.lat()},0\n`;
      });
      if (shape instanceof window.google.maps.Polygon) {
        kml +=
          "</coordinates>\n</LinearRing>\n</outerBoundaryIs>\n</Polygon>\n";
      } else {
        kml += "</coordinates>\n</LineString>\n";
      }
      kml += "</Placemark>\n";
    } else if (shape instanceof window.google.maps.Rectangle) {
      const bounds = shape.getBounds();
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      kml +=
        "<Placemark>\n" +
        "<Polygon>\n" +
        "<outerBoundaryIs>\n" +
        "<LinearRing>\n" +
        "<coordinates>\n" +
        `${sw.lng()},${sw.lat()},0\n` +
        `${ne.lng()},${sw.lat()},0\n` +
        `${ne.lng()},${ne.lat()},0\n` +
        `${sw.lng()},${ne.lat()},0\n` +
        `${sw.lng()},${sw.lat()},0\n` +
        "</coordinates>\n" +
        "</LinearRing>\n" +
        "</outerBoundaryIs>\n" +
        "</Polygon>\n" +
        "</Placemark>\n";
    }
    return kml;
  }

  static download(filename, text) {
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
}

export default MapUtils;
