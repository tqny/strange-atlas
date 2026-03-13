export const CATEGORIES = [
  { id: 'volcanoes', display: 'Volcanoes', color: '#E8632B' },
  { id: 'shipwrecks', display: 'Shipwrecks', color: '#1B6B8A' },
  { id: 'bigfoot', display: 'Bigfoot Sightings', color: '#3D7A3D' },
  { id: 'fireballs', display: 'Fireballs', color: '#E82E2E' },
  { id: 'earthquakes', display: 'Earthquakes', color: '#D4920B' },
  { id: 'thermal-springs', display: 'Thermal Springs', color: '#2DA67A' },
  { id: 'haunted-places', display: 'Haunted Places', color: '#A855E8' },
  { id: 'meteorites', display: 'Meteorites', color: '#4A6FA5' },
  { id: 'ufo-sightings', display: 'UFO Sightings', color: '#0EAEBE' },
  { id: 'ghost-towns', display: 'Ghost Towns', color: '#C45C6A' },
] as const

export type CategoryId = (typeof CATEGORIES)[number]['id']

/** Categories that have meaningful timeline data */
export const TIMELINE_CATEGORIES = [
  'ufo-sightings',
  'bigfoot',
  'meteorites',
  'earthquakes',
  'fireballs',
  'shipwrecks',
] as const
