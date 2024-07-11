import MapUtils from "../utils/mapUtils";

class Parcel {
  constructor(id, name, desc, area, polygon, imageUrl, areas, parcelArea, totalArea, coverTypes) {
    this.id = id;
    this.name = name;
    this.desc = desc;
    this.area = area;
    this._polygon = polygon;
    this.coordinates = JSON.stringify(MapUtils.getVertices(polygon));
    this.imageUrl = imageUrl;
    this.areas = areas;
    this.totalArea = totalArea;
    this.parcelArea = parcelArea;
    this.coverTypes = coverTypes;
  }

  showOnMap = false;

  set polygon(polygon) {
    this.coordinates = JSON.stringify(MapUtils.getVertices(polygon));
  }

  get polygon() {
    return this._polygon;
  }
}


export default Parcel;
