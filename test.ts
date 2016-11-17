import { geojson2osm } from './index'

const test: GeoJSON.FeatureCollection<any> = require('./fixtures/place-planet-2.json')
const osm = geojson2osm(test)
