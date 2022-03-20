export type Lng = number | null | undefined;
export type Lat = number | null | undefined;

/** optimization by https://stackoverflow.com/questions/5260423/torad-javascript-function-throwing-error/21623256#21623256 **/
export function haversine_distance(lat1: Lat, lon1: Lng, lat2: Lat, lon2: Lng) {
  if (lat1 && lon1 && lat2 && lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = ((lat2 - lat1) * Math.PI) / 180; // deg2rad below
    var dLon = ((lon2 - lon1) * Math.PI) / 180;
    var a =
      0.5 -
      Math.cos(dLat) / 2 +
      (Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        (1 - Math.cos(dLon))) /
        2;
    return R * 2 * Math.asin(Math.sqrt(a));
  }
}
