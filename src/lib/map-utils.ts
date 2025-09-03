'use client';

// Function to get a point along a path
export const getPointAlongPath = (path: { lat: number; lng: number }[], distance: number) => {
  if (!window.google || !window.google.maps.geometry) {
    // Return a default or handle the case where the geometry library is not loaded
    return path[0] || { lat: 0, lng: 0 };
  }
  if (distance <= 0) return path[0];
  if (distance >= 1) return path[path.length - 1];

  let totalPathLength = 0;
  for (let i = 0; i < path.length - 1; i++) {
    totalPathLength += window.google.maps.geometry.spherical.computeDistanceBetween(
      new window.google.maps.LatLng(path[i]),
      new window.google.maps.LatLng(path[i + 1])
    );
  }

  let distanceCovered = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const segmentStart = new window.google.maps.LatLng(path[i]);
    const segmentEnd = new window.google.maps.LatLng(path[i + 1]);
    const segmentLength = window.google.maps.geometry.spherical.computeDistanceBetween(segmentStart, segmentEnd);

    if (distanceCovered + segmentLength >= distance * totalPathLength) {
      const fraction = (distance * totalPathLength - distanceCovered) / segmentLength;
      return window.google.maps.geometry.spherical.interpolate(segmentStart, segmentEnd, fraction).toJSON();
    }
    distanceCovered += segmentLength;
  }
  return path[path.length - 1];
};

// Function to calculate bearing between two points
export const getBearing = (start: { lat: number; lng: number }, end: { lat: number; lng: number }) => {
    const startLat = (start.lat * Math.PI) / 180;
    const startLng = (start.lng * Math.PI) / 180;
    const endLat = (end.lat * Math.PI) / 180;
    const endLng = (end.lng * Math.PI) / 180;

    const dLng = endLng - startLng;
    const y = Math.sin(dLng) * Math.cos(endLat);
    const x = Math.cos(startLat) * Math.sin(endLat) - Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);
    
    let brng = Math.atan2(y, x);
    brng = (brng * 180) / Math.PI;
    return (brng + 360) % 360;
}
