
const baseUrlGEE = process.env.NODE_ENV === 'production' ? 'https://scfserver.nswd.eu' : '';
// const baseUrl = 'https://scfserver.nswd.eu';

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
  10: '#358221',
  20: '#F9BA00',
  30: '#FEFE35',
  40: '#FFDB5C',
  50: '#ED022A',
  60: '#EDE9E4',
  70: '#F2FAFF',
  80: '#1A5BAB',
  90: '#3096A1',
  95: '#43CF71',
  100: '#F8E69D',
};

  module.exports = {
   landCoverNames, landCoverColors, baseUrl: baseUrlGEE
  };