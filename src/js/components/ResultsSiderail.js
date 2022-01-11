import React, {Component} from 'react'
import { Map, GeoJSON, TileLayer } from 'react-leaflet'
import * as topojson from "topojson-client";
import {featureCollection} from '@turf/helpers'
import bbox from '@turf/bbox'
import bboxPolygon from '@turf/bbox-polygon'
// util
import getCode from '../util/getCode'
// consts
const topology = require("../../data/topo.json")
// styles
require('../../scss/components/ResultsSiderail.scss')


const arr = []

Object.keys(topology.objects).forEach(obj => {
  let layer = topojson.feature(topology, obj);
  layer.features.forEach(feature => arr.push(feature))
})

class ResultsSiderail extends Component {

  render() {


      const tile = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
      let geojson = arr.filter(d => d.properties.districtCo === this.props.districtCode)
      var polygonLayer = featureCollection(geojson);

      let boundsArr = []
      var bboxArr = bbox(polygonLayer);
      var bboxPolygonArr = bboxPolygon(bboxArr);
      bboxPolygonArr.geometry.coordinates[0].map(d => {
        let r = d.slice().reverse()
        boundsArr.push(r)
      })
      return(
        <Map
        className="districtMap"
        bounds={boundsArr}

        >
          <TileLayer
            url={tile}
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          <GeoJSON
            key='my-geojson'
            data={geojson}
             />
        </Map>
      )


  }


}

export default ResultsSiderail
