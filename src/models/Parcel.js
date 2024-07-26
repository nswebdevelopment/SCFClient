import MapUtils from "../utils/mapUtils";

class Parcel {
  constructor(id, name, desc, area, shape, imageUrl, areas, parcelArea, totalArea, coverTypes) {
    this.id = id;
    this.name = name;
    this.description = desc;
    this.area = area;
    this._shape = shape;
    this.shapeType = MapUtils.getShapeType(this.shape);
    this.coordinates = JSON.stringify(MapUtils.getVertices(shape));
    this.imageUrl = imageUrl;
    this.areas = areas;
    this.totalArea = totalArea;
    this.parcelArea = parcelArea;
    this.coverTypes = coverTypes;
  }

  showOnMap = false;

  set shape(shape) {
    this.coordinates = JSON.stringify(MapUtils.getVertices(shape));
  }

  get shape() {
    return this._shape;
  }

}


export default Parcel;
