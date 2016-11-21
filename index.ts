import * as convert from 'xml-js'
import * as explode from '@turf/explode'
const flatten = require('geojson-flatten')

const assign = Object.assign

export const Declaration = {
  _declaration: {
    _attributes: {
      version: '1.0',
      encoding: 'UTF-8',
    },
  },
}

export const Generator = {
  osm: {
    _attributes: {
      version: '0.6',
      generator: 'geojson2osm-es6',
    },
  },
}

export function createOSM(features?: any) {
  const generator = Generator
  if (features !== undefined) { generator.osm = assign(generator.osm, features) }
  return Object.assign(Declaration, generator)
}

export function geojson2osm(geojson: GeoJSON.Feature<any> | GeoJSON.FeatureCollection<any>) {
  const osm = createOSM()
  const xml = convert.js2xml(osm, { spaces: 2 })
  return xml
}

export function Tag(key: string | number, value: string | number) {
  return {
    _attributes: {
      k: key,
      v: value,
    },
  }
}

export function nodeRef(ref: number | string) {
  return {
    nd: {
      _attributes: {
        ref: String(ref),
      },
    },
  }
}

/**
 * Round multiple coordinates
 *
 * @param {Array<Array<number>>} coords Coordinates
 * @returns {Array<Array<number>>} coords Rounded coordinates
 */
export function roundCoords(coords: Array<Array<number>>): Array<Array<number>> {
  return coords.map(coord => {
    return roundCoord(coord)
  })
}

/**
 * Round single coordinate
 *
 * @param {Array<number>} Coordinates
 * @returns {Array<number>} Rounded coordinates
 */
export function roundCoord(coord: Array<number>): Array<number> {
  return coord.map(i => Number(i.toFixed(6)))
}

/**
 * Properties Edit
 *
 * @param {Object} properties
 * @returns {Element} OSM XML string
 */
function propertiesToEdit(properties: any) {
  const attributes: any = {}
  Object.keys(properties).map(key => {
    if (key.indexOf('@') !== -1) {
      attributes[key.replace('@', '')] = properties[key]
    }
  })
  if (attributes.timestamp !== undefined) { attributes.timestamp = new Date(properties[attributes.timestamp] * 1000).toISOString() }
  if (attributes.id === undefined) { attributes.id = count }
  if (attributes.changeset === undefined) { attributes.changeset = 'false' }
  return attributes
}

/**
 * Properties To Tags
 *
 * @param {Object} properties
 * @returns {string} OSM XML string
 */
function propertiesToTags(properties: any): Array<any> {
  const tags: Array<any> = []
  Object.keys(properties).map(key => {
    if (properties[key] !== undefined && key.indexOf('@') === -1) {
      tags.push(Tag(key, properties[key]))
    }
  })
  return tags
}

/**
 * Convert GeoJSON.Point to OSM XML
 *
 * @param {Point}
 * @param {Object} properties
 * @returns {string} OSM XML String
 */
export function Point(coord: Array<number>, properties: any) {
  const [lon, lat] = coord
  const _attributes = assign({lat, lon}, propertiesToEdit(properties))
  return {
    node: assign({ _attributes }, {tag: propertiesToTags(properties)}),
  }
}

const geojson: GeoJSON.FeatureCollection<any> = require('./test/fixtures/simple/polygon.json')

let count = 0
const hash: any = {}
const nodes: Array<any> = []
// const ways: Array<any> = []
// const relations: Array<any> = []
const flattened: GeoJSON.FeatureCollection<any> = flatten(geojson)

flattened.features.map(feature => {
  const properties = feature.properties
  const type = feature.geometry.type
  const nodeRefs: Array<any>  = []
  console.log(propertiesToEdit(properties))
  console.log(propertiesToTags(properties))
  console.log(type)
  console.log(properties)
  explode(feature).features.map(point => {
    const coord = point.geometry.coordinates
    let id: number
    if (hash[coord.join(',')] !== undefined) {
      id = hash[coord.join(',')]
    } else {
      count --
      id = count
      hash[coord.join(',')] = id
    }
    nodeRefs.push(nodeRef(id))
    nodes.push(Point(coord, assign({ id })))
  })
  console.log(nodeRefs)
})

// const p = Point([-75, 45], {'@id': 100, place: 'city', state: '<ON>'})
// const xml = convert.js2xml(p, { compact: true,  spaces: 2 })
// console.log(xml)

export default {
  geojson2osm,
}

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
