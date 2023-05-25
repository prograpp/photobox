export type LatLong = {
  latitude: number;
  longitude: number;
};

export type AggregatedLocation<T> = LatLong & {
  items: T[];
};

export const calculateDistance = (loc1: LatLong, loc2: LatLong): number => {
  // haversine formula
  const earthRadius = 6371; // Radius of the Earth in kilometers
  const latDiff = (loc2.latitude - loc1.latitude) * (Math.PI / 180);
  const lonDiff = (loc2.longitude - loc1.longitude) * (Math.PI / 180);
  const a =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos((loc1.latitude * Math.PI) / 180) * Math.cos((loc2.latitude * Math.PI) / 180) * Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
};

export const getDistanceThreshold = (zoom: number): number => {
  if (zoom < 1) zoom = 1;
  if (zoom > 18) zoom = 18;

  return [1000, 750, 500, 350, 250, 150, 100, 50, 25, 10, 3, 2, 1, 1, 0.5, 0.01, 0.01, 0.01][zoom - 1];
};

export const getLocationsAround = <T extends LatLong>(locations: T[], center: LatLong, zoom: number): T[] => {
  let threshold = getDistanceThreshold(zoom);
  return locations.filter((loc) => calculateDistance(loc, center) < threshold);
};

export const aggregateLocations = <T extends LatLong>(locations: T[], zoom: number): AggregatedLocation<T>[] => {
  let threshold = getDistanceThreshold(zoom);
  let aggLocs: AggregatedLocation<T>[] = [];

  for (let loc of locations) {
    let aggregated = false;

    for (let aggLoc of aggLocs) {
      let distance = calculateDistance(loc, aggLoc);
      if (distance < threshold) {
        aggLoc.latitude = (aggLoc.latitude + loc.latitude) / 2;
        aggLoc.longitude = (aggLoc.longitude + loc.longitude) / 2;
        aggLoc.items.push(loc);

        aggregated = true;
        break;
      }
    }

    if (!aggregated) {
      aggLocs.push({
        items: [loc],
        latitude: loc.latitude,
        longitude: loc.longitude,
      });
    }
  }

  return aggLocs;
};
