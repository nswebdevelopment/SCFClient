class MapUtils {
  static initialCenter = { lat: 0, lng: 0 };
  static initialZoom = 2;
  
  
  
  static exportToKML(parcels) {
    console.log("export to kml", parcels.length);
    let kml =
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<kml xmlns="http://www.opengis.net/kml/2.2">\n' +
      "<Document>\n";
    parcels.forEach((parcel) => {
      kml += MapUtils.convertShapeToKML(parcel.shape);
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



  static centerToCurrentLocation(map) {
    if (navigator.geolocation && map) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.updateCenter(
          map,
          position.coords.latitude,
          position.coords.longitude
        );
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  static updateCenter(map, lat, lng) {
    map.setZoom(10);
    map.panTo({ lat: parseFloat(lat), lng: parseFloat(lng) });
  }

  static drawPolygonsOnMap(map, parcel, callback) {

    console.log("Draw polygon on map", parcel);
    if (map === null || parcel === null) return;


    parcel.shape.setMap(map);
    parcel.shape.addListener("click", (event) => callback());
  }

  static getVertices(shape) {
    console.log("Shape:", shape);

    if (shape.getBounds) {
      const bounds = shape.getBounds();

      // Get the North East and South West points
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();

      // Create an array of the four corner points
      const path = [
        new window.google.maps.LatLng(ne.lat(), ne.lng()), // North East,
        new window.google.maps.LatLng(ne.lat(), sw.lng()), // North West,
        new window.google.maps.LatLng(sw.lat(), sw.lng()), // South West,
        new window.google.maps.LatLng(sw.lat(), ne.lng()), // South East
      ];

      console.log("Rectangle bounds:", path);

      // Return the path
      return path;
    } else if (shape.getPath) {
      console.log("Polygon");

      const path = shape.getPath().getArray();
      console.log("Rectangle bounds:", path);
      return path;
    }

    return null;
  }


  static getShape(shape) {
    if (shape.getBounds) {
      return [
        shape.getBounds().getSouthWest(),
        shape.getBounds().getNorthEast(),
      ];
    } else if (shape.getPath) {
       return shape
          .getPath()
          .getArray()
          .map((coord) => ({ lat: coord.lat(), lng: coord.lng() }))
      ;
    }
  }

  static getShapeType(shape) {
    if (shape.getBounds) {
      return "rectangle";
    } else if (shape.getPath) {
      return "polygon";
    }
  }

  static getBoundsOfShape(shape) {
    if (shape.getBounds) {
      return shape.getBounds();
    } else if (shape.getPath) {
      const bounds = new window.google.maps.LatLngBounds();
      shape.getPath().forEach(function (point) {
        bounds.extend(point);
      });

      return bounds;
    }
    return null;
  }

  static clearOverlayForParcel(map, parcelId) {
    console.log("Clear overlay for parcel", parcelId);
    if (map === null || parcelId === null) return;

    if(map instanceof window.google.maps.Map){

    if (map.overlayMapTypes === null) return;

    const overlayIndex = map.overlayMapTypes.getArray().findIndex((overlay) => {
      return overlay.name === parcelId;
    });

    if (overlayIndex !== -1) {
      map.overlayMapTypes.removeAt(overlayIndex);
    }
  }
  }

  static addOverlaysForParcel(parcel, map) {

    if (map && map instanceof window.google.maps.Map) {

    const index = map.overlayMapTypes.getArray().findIndex((overlay) => {
      return overlay.name === parcel.id;
    });

    if (index !== -1) return;
      const imageMapType = this.getImageMapType(
        parcel.imageUrl,
        1.0,
        parcel.id
      );

        map.overlayMapTypes.push(imageMapType);
      
    }
  }

  static getImageMapType(urlFormat, opacity = 1.0, name = "Clipped Image") {
    return new window.google.maps.ImageMapType({
      getTileUrl: function (tile, zoom) {
        return urlFormat
          .replace("{z}", zoom)
          .replace("{x}", tile.x)
          .replace("{y}", tile.y);
      },
      tileSize: new window.google.maps.Size(256, 256),
      name: name,
      opacity: opacity,
    });
  }

  static getPolygonCenter(polygon) {
    var bounds = new window.google.maps.LatLngBounds();

    if (polygon.getBounds) {
      return polygon.getBounds().getCenter();
    } else {
      polygon.getPath().forEach(function (point, index) {
        bounds.extend(point);
      });
    }

    return bounds.getCenter();
  }
}

export default MapUtils;
