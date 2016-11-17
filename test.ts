import * as fs from 'fs'
import * as convert from 'xml-js'
import { geojson2osm } from './index'

const test: GeoJSON.FeatureCollection<any> = require('./fixtures/place-planet-4.json')
const osm = geojson2osm(test)

const json = convert.xml2json(osm)
console.log(json)
