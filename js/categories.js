/**
 * categories.js
 * Category color map and display metadata.
 */

export const CATEGORY_COLORS = {
  'ufo-sightings':    '#4FC3C3',
  'volcanoes':        '#E8863A',
  'bigfoot':          '#5A8A5A',
  'haunted-places':   '#9B7BB8',
  'megaliths':        '#C4A96B',
  'meteorites':       '#C8C8C8',
  'tornadoes':        '#5A7A9B',
  'caves':            '#A0614A',
  'ghost-towns':      '#B87878',
  'shipwrecks':       '#3A8A8A',
  'earthquakes':      '#B89B3A',
  'fireballs':        '#D4623A',
  'thermal-springs':  '#6A9B6A',
  'storm-events':     '#7A8A9B',
};

export function getColor(categoryId) {
  return CATEGORY_COLORS[categoryId] || '#888';
}
