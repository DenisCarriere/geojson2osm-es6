import test from 'ava'
import * as convert from 'xml-js'
import * as geojson2osm from '../index'

test('getCapabilities', t => {
  const xml = convert.js2xml(geojson2osm.createHeader(), { compact: true,  spaces: 2 })
  t.deepEqual(xml, `<?xml encoding="utf-8" version="1.0"?>
<osm generator="geojson2osm-es6" version="0.6"/>`)
})

