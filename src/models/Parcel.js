class Parcel {
  constructor(id, name, desc, area, polygon, imageUrl, grasslandImageUrl, croplandImageUrl, forrestImageUrl, areas, parcelArea, totalArea, coverTypes) {
    this.id = id;
    this.name = name;
    this.desc = desc;
    this.area = area;
    this.polygon = polygon;
    this.imageUrl = imageUrl;
    this.grasslandImageUrl = grasslandImageUrl;
    this.croplandImageUrl = croplandImageUrl;
    this.forrestImageUrl = forrestImageUrl;
    this.areas = areas;
    this.totalArea = totalArea;
    this.parcelArea = parcelArea;
    this.coverTypes = coverTypes;
  }
}

// data["grasslandUrlFormat"],
// data["croplandUrlFormat"],
// data["forestUrlFormat"],

export default Parcel;
