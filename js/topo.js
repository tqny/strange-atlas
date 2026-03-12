/**
 * topo.js
 * Minimal TopoJSON → GeoJSON converter.
 * Only handles what we need: land-110m.json → polygon coordinates.
 * No external dependency.
 */

export function topoToGeo(topology, objectName) {
  const obj = topology.objects[objectName];
  if (!obj) throw new Error(`Object "${objectName}" not found in topology`);

  const arcs = topology.arcs;
  const transform = topology.transform;

  // Decode quantized arcs if transform exists
  function decodeArc(arcIndex) {
    const reversed = arcIndex < 0;
    const idx = reversed ? ~arcIndex : arcIndex;
    const rawArc = arcs[idx];
    const coords = [];

    let x = 0, y = 0;
    for (const point of rawArc) {
      x += point[0];
      y += point[1];
      let lng, lat;
      if (transform) {
        lng = x * transform.scale[0] + transform.translate[0];
        lat = y * transform.scale[1] + transform.translate[1];
      } else {
        lng = x;
        lat = y;
      }
      coords.push([lng, lat]);
    }

    return reversed ? coords.slice().reverse() : coords;
  }

  function decodeRing(ring) {
    let coords = [];
    for (const arcRef of ring) {
      const decoded = decodeArc(arcRef);
      // Avoid duplicate points at arc junctions
      if (coords.length > 0) {
        decoded.shift();
      }
      coords = coords.concat(decoded);
    }
    return coords;
  }

  function decodeGeometry(geom) {
    if (geom.type === 'Polygon') {
      return {
        type: 'Polygon',
        coordinates: geom.arcs.map(decodeRing),
      };
    }
    if (geom.type === 'MultiPolygon') {
      return {
        type: 'MultiPolygon',
        coordinates: geom.arcs.map(polygon => polygon.map(decodeRing)),
      };
    }
    if (geom.type === 'GeometryCollection') {
      return {
        type: 'GeometryCollection',
        geometries: geom.geometries.map(decodeGeometry),
      };
    }
    return geom;
  }

  return decodeGeometry(obj);
}
