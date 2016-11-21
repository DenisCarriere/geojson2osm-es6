import * as convert from 'xml-js'

interface Obj {
  nodes?: string
  osm?: string
  ways?: string
  relations?: string
}

export const declaration = {
  _declaration: {
    _attributes: {
      encoding: 'utf-8',
      version: '1.0',
    },
  },
}

export const generator = {
  osm: {
    _attributes: {
      generator: 'geojson2osm-es6',
      version: '0.6',
    },
  },
}

export function createHeader() {
  return Object.assign(declaration, generator)
}

export function geojson2osm(geojson: GeoJSON.Feature<any> | GeoJSON.FeatureCollection<any>) {
  const header = createHeader()
  const xml = convert.js2xml(header, { spaces: 2 })
  return xml
}

export default {
  geojson2osm,
}

// /**
//  * Convert GeoJSON.Point to OSM XML
//  *
//  * @param {Point}
//  * @param {Object} properties
//  * @returns {string} OSM XML String
//  */
// function Point(geo: GeoJSON.GeometryObject, properties: Properties = {}) {
//   const [lon, lat] = roundCoords([geo.coordinates])
//   const _attributes = assign({lat, lon}, propertiesEdit(properties))
//   return {
//     node: assign({ _attributes }, propertiesToTags(properties)),
//   }
// }

// /**
//  * Converts GeoJSON.LineString to OSM XML
//  *
//  * @param {LineString}
//  * @param {Object} properties
//  * @returns {string} OSM XML string
//  */
// function LineString(geo: GeoJSON.GeometryObject, properties: Properties) {
//   let nodes = ''
//   let ways = ''
//   const coordinates: Coordinates = []
//   ways += '<way visible="true" ' + propertiesEdit(properties) + '>'
//   count --
//   for (let i = 0; i <= geo.coordinates.length - 1; i++) {
//     coordinates.push([geo.coordinates[i][1], geo.coordinates[i][0]])
//   }
//   const coords = createNodes(coordinates, false)
//   nodes += coords.nodes
//   ways += coords.nds
//   ways += propertiesToTags(properties)
//   ways += '</way>'
//   return {
//     nodes,
//     ways,
//   }
// }

// /**
//  * Converts GeoJSON.MultiLineString to OSM XML
//  *
//  * @param {MultiLineString}
//  * @param {Object} properties
//  * @returns {string} OSM XML string
//  */
// function MultiLineString(geo: GeoJSON.GeometryObject, properties: Properties) {
//   let nodes = ''
//   let ways = ''
//   const coordinates: Coordinates = []
//   ways += '<way visible="true" ' + propertiesEdit(properties) + ' >'
//   count --
//   for (let i = 0; i <= geo.coordinates[0].length - 1; i++) {
//     coordinates.push([geo.coordinates[0][i][1], geo.coordinates[0][i][0]])
//   }
//   const coords = createNodes(coordinates, false)
//   nodes += coords.nodes
//   ways += coords.nds
//   ways += propertiesToTags(properties)
//   ways += '</way>'
//   return {
//     nodes,
//     ways,
//   }
// }

// /**
//  * Converts GeoJSON.Polygon to OSM XML
//  *
//  * @param {Polygon}
//  * @param {Object} properties
//  * @returns {string} OSM XML string
//  */
// function Polygon(geo: GeoJSON.GeometryObject, properties: Properties) {
//   let nodes = ''
//   let ways = ''
//   const coordinates: Coordinates = []
//   ways += '<way visible="true" ' + propertiesEdit(properties) + ' >'
//   count --
//   for (let i = 0; i <= geo.coordinates[0].length - 1; i++) {
//     coordinates.push([geo.coordinates[0][i][1], geo.coordinates[0][i][0]])
//   }
//   const coords = createNodes(coordinates, false)
//   nodes += coords.nodes
//   ways += coords.nds
//   ways += propertiesToTags(properties)
//   ways += '</way>'
//   return {
//     nodes,
//     ways,
//   }
// }

// /**
//  * Round coordinates
//  *
//  * @param {number[][]} coords Coordinates
//  * @returns {number[][]} coords Rounded coordinates
//  */
// function roundCoords(coords: [number, number][]): [number, number][] {
//   return coords.map(coord => {
//     return coord.map(i => Number(i.toFixed(6)))
//   })
// }

// /**
//  * Properties Edit
//  *
//  * @param {Object} properties
//  * @returns {Element} OSM XML string
//  */
// function propertiesEdit(properties: Properties) {
//   const _attributes: any = {}
//   Object.keys(properties).map(key => {
//     if (key.indexOf('@') !== -1) {
//       _attributes[key.replace('@', '')] = properties[key]
//     }
//   })
//   if (_attributes.timestamp !== undefined) { _attributes.timestamp = new Date(properties[_attributes.timestamp] * 1000).toISOString() }
//   if (_attributes.id === undefined) { _attributes.id = count }
//   if (_attributes.changeset === undefined) { _attributes.changeset = 'false' }
//   return _attributes
// }

// /**
//  * Key XML element
//  *
//  * @param {string} key
//  * @param {string} value
//  * @example
//  * Key("foo", "bar")
//  * //=<key k="foo" v="bar" />
//  */
// function Key(key: string, value: string) {
//   return {
//     key: {
//       _attributes: {
//         k: key,
//         v: value,
//       },
//     },
//   }
// }

// /**
//  * Properties To Tags
//  *
//  * @param {Object} properties
//  * @returns {string} OSM XML string
//  */
// function propertiesToTags(properties: Properties) {
//   return Object.keys(properties).map(key => {
//     if (properties[key] !== undefined && key.indexOf('@') === -1) {
//       return Key(key, properties[key])
//       }
//     })
// }

// /**
//  * Create Nodes
//  */
// function createNodes(coords: [number, number][], repeatLastND: boolean | number) {
//   let nds = ''
//   let nodes = ''
//   let length = coords.length
//   repeatLastND = repeatLastND || false
//   coords = roundCoords(coords)
//   for (let a = 0; a < length; a ++) {
//     if (hash.hasOwnProperty(coords[a].join(','))) {
//       nds += `<nd ref="${ hash[coords[a].join(',')] }"/>`
//     } else {
//       hash[coords[a].join(',')] = count
//       if (repeatLastND && a === 0) {
//         repeatLastND = count
//       }
//       nds += `<nd ref="${ count }"/>`
//       nodes += `<node id="${ count }" lat="${ coords[a][0] }" lon="${ coords[a][1] }" changeset="${ changeset }"/>`

//       if (repeatLastND && a === length - 1) {
//         nds += '<nd ref="' + repeatLastND + '"/>'
//       }
//     }
//     count --
//   }
//   return {
//     nds,
//     nodes,
//   }
// }
// /**
//  * GeoJSON Geometry to OSM XML string
//  *
//  * @param {GeometryObject} geom
//  * @param {Object} properties
//  */
// function togeojson(geo: GeoJSON.GeometryObject, properties: Properties = {}) {
//   let nodes = ''
//   let ways = ''
//   let relations = ''

//   switch (geo.type) {
//     case 'Point':
//       append(Point(geo, properties))
//       break
//     case 'MultiPoint':
//       break
//     case 'LineString':
//       append(LineString(geo, properties))
//       break
//     case 'MultiLineString':
//       append(MultiLineString(geo, properties))
//       break
//     case 'Polygon':
//       append(Polygon(geo, properties))
//       break
//     case 'MultiPolygon':
//       break
//     default:
//       break
//   }

//   function append(obj: Obj) {
//     nodes += obj.nodes
//     ways += obj.ways
//     relations += obj.relations
//   }

//   return {
//     nodes,
//     ways,
//     relations,
//   }
// }

// let hash: Hash
// let count: number
// let changeset: string
// let osm_file: string

// export function geojson2osm(geojson: GeoJSON.Feature<any> | GeoJSON.FeatureCollection<any>) {
//   hash = {}
//   count = -1
//   changeset = 'false'
//   osm_file = ''
//   if (typeof geojson === 'string') { geojson = JSON.parse(geojson) }
//   switch (geojson.type) {
//     case 'FeatureCollection':
//       let temp = {
//         nodes: '',
//         osm: '',
//         relations: '',
//         ways: '',
//       }
//       let obj: Obj[] = []
//       for (let i = 0; i < geojson.features.length; i++) {
//         obj.push(togeojson(geojson.features[i].geometry, geojson.features[i].properties))
//       }
//       for (let n = 0; n < obj.length; n++) {
//         if (obj[n].nodes !== 'undefined') {
//           temp.nodes += obj[n].nodes
//         }
//         if (obj[n].ways !== 'undefined') {
//           temp.ways += obj[n].ways
//         }
//         if (obj[n].relations !== 'undefined') {
//           temp.relations += obj[n].relations
//         }
//       }
//       temp.osm = '<?xml version="1.0" encoding="UTF-8"?><osm version="0.6" generator="geojson2osm">'
//       temp.osm += temp.nodes + temp.ways + temp.relations
//       temp.osm += '</osm>'
//       osm_file = temp.osm
//       break
//     default:
//       console.log('default')
//       break
//   }
//   return osm_file
// }
// export default geojson2osm
