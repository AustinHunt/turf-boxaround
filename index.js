// Inspired by https://www.johndcook.com/blog/2009/04/27/converting-miles-to-degrees-longitude-or-latitude/\
const earthRadiusMeters = 6378137;
const radiansToDegrees =  180.0 / Math.PI;
const degreesToRadians = Math.PI / 180.0;

function changeInLatitude(meters) {
  return (meters / earthRadiusMeters) * radiansToDegrees;
}

function changeInLongitude(latitude, meters) {
  const r = earthRadiusMeters * Math.cos(latitude * degreesToRadians);
  return (meters / r) * radiansToDegrees;
}

function flatten(array, accumulator = []) {
  return array.reduce((acc, item) => {
    if (item instanceof Array) {
      return flatten(item, acc);
    }
    acc.push(item);
    return acc;
  }, accumulator);
}

module.exports = function boxAround(__feature, options = { paddingMeters: 10000 }) {
  let coordinates = [];
  if (__feature.type === 'Feature') {
    coordinates = flatten(feature.geometry.coordinates);
  }
  if (__feature.type === 'FeatureCollection') {
    coordinates = flatten(
      __feature.features.map(
        feature => feature.geometry.coordinates,
      ),
    );
  }
  let maxLat;
  let maxLng;
  let minLat;
  let minLng;

  while (coordinates.length) {
    const lat = coordinates.pop();
    const lng = coordinates.pop();
    if (typeof maxLat === 'undefined') {
      maxLat = lat;
    }
    if (typeof maxLng === 'undefined') {
      maxLng = lng;
    }
    if (typeof minLat === 'undefined') {
      minLat = lat;
    }
    if (typeof minLng === 'undefined') {
      minLng = lng;
    }
    if (lng < minLng) {
      minLng = lng;
    }
    if (lat < minLat) {
      minLat = lat;
    }
    if (lng > maxLng) {
      maxLng = lng;
    }
    if (lat > maxLat) {
      maxLat = lat;
    }
  }

  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [
          maxLng + changeInLongitude(maxLat, options.paddingMeters),
          maxLat + changeInLatitude(options.paddingMeters),
        ],
        [
          maxLng + changeInLongitude(minLat, options.paddingMeters),
          minLat - changeInLatitude(options.paddingMeters),
        ],
        [
          minLng - changeInLongitude(minLat, options.paddingMeters),
          minLat - changeInLatitude(options.paddingMeters),
        ],
        [
          minLng - changeInLongitude(maxLat, options.paddingMeters),
          maxLat + changeInLatitude(options.paddingMeters),
        ],
        [
          maxLng + changeInLongitude(maxLat, options.paddingMeters),
          maxLat + changeInLatitude(options.paddingMeters)
        ],
      ]]
    },
  }
}