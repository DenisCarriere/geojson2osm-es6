interface Obj {
  nodes?: string
  osm?: string
  ways?: string
  relations?: string
}

interface Properties {
  [key: string]: any
}

interface Hash {
  [coord: string]: number
}

type Coordinates = [number, number][]

/**
 * Convert GeoJSON.Point to OSM XML
 *
 * @param {Point}
 * @param {Object} properties
 * @returns {string} OSM XML String
 */
function Point(geo: GeoJSON.GeometryObject, properties: Properties = {}) {
  let nodes = ''
  let coord = roundCoords([geo.coordinates])
  nodes += `<node lat="${ coord[0][1] }" lon="${ coord[0][0] }" ${ propertiesEdit(properties)}>`
  nodes += propertiesToTags(properties)
  nodes += '</node>'
  count --
  return {
    nodes,
  }
}

/**
 * Converts GeoJSON.LineString to OSM XML
 * 
 * @param {LineString}
 * @param {Object} properties
 * @returns {string} OSM XML string
 */
function LineString(geo: GeoJSON.GeometryObject, properties: Properties) {
  let nodes = ''
  let ways = ''
  const coordinates: Coordinates = []
  ways += '<way visible="true" ' + propertiesEdit(properties) + '>'
  count --
  for (let i = 0; i <= geo.coordinates.length - 1; i++) {
    coordinates.push([geo.coordinates[i][1], geo.coordinates[i][0]])
  }
  const coords = createNodes(coordinates, false)
  nodes += coords.nodes
  ways += coords.nds
  ways += propertiesToTags(properties)
  ways += '</way>'
  return {
    nodes,
    ways,
  }
}

/**
 * Converts GeoJSON.MultiLineString to OSM XML
 * 
 * @param {MultiLineString}
 * @param {Object} properties
 * @returns {string} OSM XML string
 */
function MultiLineString(geo: GeoJSON.GeometryObject, properties: Properties) {
  let nodes = ''
  let ways = ''
  const coordinates: Coordinates = []
  ways += '<way visible="true" ' + propertiesEdit(properties) + ' >'
  count --
  for (let i = 0; i <= geo.coordinates[0].length - 1; i++) {
    coordinates.push([geo.coordinates[0][i][1], geo.coordinates[0][i][0]])
  }
  const coords = createNodes(coordinates, false)
  nodes += coords.nodes
  ways += coords.nds
  ways += propertiesToTags(properties)
  ways += '</way>'
  return {
    nodes,
    ways,
  }
}

/**
 * Converts GeoJSON.Polygon to OSM XML
 * 
 * @param {Polygon}
 * @param {Object} properties
 * @returns {string} OSM XML string
 */
function Polygon(geo: GeoJSON.GeometryObject, properties: Properties) {
  let nodes = ''
  let ways = ''
  const coordinates: Coordinates = []
  ways += '<way visible="true" ' + propertiesEdit(properties) + ' >'
  count --
  for (let i = 0; i <= geo.coordinates[0].length - 1; i++) {
    coordinates.push([geo.coordinates[0][i][1], geo.coordinates[0][i][0]])
  }
  const coords = createNodes(coordinates, false)
  nodes += coords.nodes
  ways += coords.nds
  ways += propertiesToTags(properties)
  ways += '</way>'
  return {
    nodes,
    ways,
  }
}

/**
 * Round coordinates
 * 
 * @param {number[][]} coords Coordinates
 * @returns {number[][]} coords Rounded coordinates
 */
function roundCoords(coords: [number, number][]): [number, number][] {
  for (let a = 0; a < coords.length; a++) {
    coords[a][0] = Math.round(coords[a][0] * 1000000) / 1000000
    coords[a][1] = Math.round(coords[a][1] * 1000000) / 1000000
  }
  return coords
}

/**
 * Properties Edit
 *
 * @param {Object} properties
 * @returns {string} OSM XML string
 */
function propertiesEdit(properties: Properties) {
  let attributes = ''
  let hasId = false
  let hasChangeset = false
  for (let attrb in properties) {
    if (attrb.indexOf('@') > -1) {
      if (attrb === '@timestamp') {
        let date = new Date(properties[attrb] * 1000)
        attributes += attrb.replace('@', '') + '="' + date.toISOString() + '" '
      } else if (attrb === '@id') {
        attributes += attrb.replace('@', '') + '="' + properties[attrb] + '" '
        hasId = true
      } else if (attrb === '@changeset') {
        attributes += attrb.replace('@', '') + '="' + properties[attrb] + '" '
        hasChangeset = true
      } else {
        attributes += attrb.replace('@', '') + '="' + properties[attrb] + '" '
      }
    }
  }
  if (!hasId) {
    attributes += ` id="${ count }" `
  }
  if (!hasChangeset) {
    attributes += ' changeset="false" '
  }
  return attributes
}

/**
 * Properties To Tags
 *
 * @param {Object} properties
 * @returns {string} OSM XML string
 */
function propertiesToTags(properties: Properties) {
  let tags = ''
  for (const key in properties) {
    if (properties[key] !== null && key && key.indexOf('@') === -1) {
      const value = properties[key].toString().replace(/"/g, '').replace(/&/g, '').replace('<', '&lt').replace('<', '&gt')
      tags += `<tag k="${ key }" v="${ value }"/>`
    }
  }
  return tags
}

/**
 * Create Nodes
 */
function createNodes(coords: [number, number][], repeatLastND: boolean | number) {
  let nds = ''
  let nodes = ''
  let length = coords.length
  repeatLastND = repeatLastND || false
  coords = roundCoords(coords)
  for (let a = 0; a < length; a ++) {
    if (hash.hasOwnProperty(coords[a].join(','))) {
      nds += `<nd ref="${ hash[coords[a].join(',')] }"/>`
    } else {
      hash[coords[a].join(',')] = count
      if (repeatLastND && a === 0) {
        repeatLastND = count
      }
      nds += `<nd ref="${ count }"/>`
      nodes += `<node id="${ count }" lat="${ coords[a][0] }" lon="${ coords[a][1] }" changeset="${ changeset }"/>`

      if (repeatLastND && a === length - 1) {
        nds += '<nd ref="' + repeatLastND + '"/>'
      }
    }
    count --
  }
  return {
    nds,
    nodes,
  }
}
/**
 * GeoJSON Geometry to OSM XML string
 * 
 * @param {GeometryObject} geom
 * @param {Object} properties
 */
function togeojson(geo: GeoJSON.GeometryObject, properties: Properties = {}) {
  let nodes = ''
  let ways = ''
  let relations = ''

  switch (geo.type) {
    case 'Point':
      append(Point(geo, properties))
      break
    case 'MultiPoint':
      break
    case 'LineString':
      append(LineString(geo, properties))
      break
    case 'MultiLineString':
      append(MultiLineString(geo, properties))
      break
    case 'Polygon':
      append(Polygon(geo, properties))
      break
    case 'MultiPolygon':
      break
    default:
      break
  }

  function append(obj: Obj) {
    nodes += obj.nodes
    ways += obj.ways
    relations += obj.relations
  }

  return {
    nodes,
    ways,
    relations,
  }
}

let hash: Hash
let count: number
let changeset: string
let osm_file: string

export function geojson2osm(geojson: GeoJSON.Feature<any> | GeoJSON.FeatureCollection<any>) {
  hash = {}
  count = -1
  changeset = 'false'
  osm_file = ''
  if (typeof geojson === 'string') { geojson = JSON.parse(geojson) }
  switch (geojson.type) {
    case 'FeatureCollection':
      let temp = {
        nodes: '',
        osm: '',
        relations: '',
        ways: '',
      }
      let obj: Obj[] = []
      for (let i = 0; i < geojson.features.length; i++) {
        obj.push(togeojson(geojson.features[i].geometry, geojson.features[i].properties))
      }
      for (let n = 0; n < obj.length; n++) {
        if (obj[n].nodes !== 'undefined') {
          temp.nodes += obj[n].nodes
        }
        if (obj[n].ways !== 'undefined') {
          temp.ways += obj[n].ways
        }
        if (obj[n].relations !== 'undefined') {
          temp.relations += obj[n].relations
        }
      }
      temp.osm = '<?xml version="1.0" encoding="UTF-8"?><osm version="0.6" generator="https://github.com/Rub21/geojson2osm">'
      temp.osm += temp.nodes + temp.ways + temp.relations
      temp.osm += '</osm>'
      osm_file = temp.osm
      break
    default:
      console.log('default')
      break
  }
  return osm_file
}
export default geojson2osm
