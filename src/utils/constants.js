
const baseUrl = process.env.NODE_ENV === 'production' ? 'https://scfserver.onrender.com' : '';

const landCoverNames = {
  10: "Trees",
  20: "Shrubland",
  30: "Grassland",
  40: "Cropland",
  50: "Built-up",
  60: "Bare / Sparse vegetation",
  70: "Snow and ice",
  80: "Permanent water bodies",
  90: "Herbaceous wetland",
  95: "Mangroves",
  100: "Moss and lichen",
};

const landCoverColors = {
  10: '#1A6401',
  20: '#F9BA00',
  30: '#FEFE35',
  40: '#EA96FF',
  50: '#EF0100',
  60: '#B4B4B4',
  70: '#F0F0F0',
  80: '#2565CB',
  90: '#3096A1',
  95: '#43CF71',
  100: '#F8E69D',
};


  module.exports = {
   landCoverNames, landCoverColors, baseUrl
  };