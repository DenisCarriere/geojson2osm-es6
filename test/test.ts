import test from 'ava'
import * as convert from 'xml-js'
import * as geojson2osm from '../index'

test('decleration', t => {
  const osm = geojson2osm.createOSM()
  const xml = convert.js2xml(osm, { compact: true })
  t.deepEqual(xml, `<?xml version="1.0" encoding="UTF-8"?><osm version="0.6" generator="geojson2osm-es6"/>`)
})

test('point', t => {
  const point = geojson2osm.Point([-75, 45], {'@id': -1, place: 'city', state: 'ON'})
  const xml = convert.js2xml(point, { compact: true })
  t.deepEqual(xml, `<node lat="45" lon="-75" id="-1" changeset="false"><tag k="place" v="city"/><tag k="state" v="ON"/></node>`)
})
