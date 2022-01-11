import 'mapbox-gl/dist/mapbox-gl.css'
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'
import React, {Component, useState} from "react";
import {
  Link
} from "react-router-dom";
import MapGL from 'react-map-gl'
import Geocoder from 'react-map-gl-geocoder'
// components
import Social from "./Social"

// util
import getDistricsFromPoint from '../util/getDistrictsFromPoint'
import getRaceCount from '../util/getRaceCount'

// styles
require('../../scss/components/Home.scss')
require('../../scss/components/Geocoder.scss')


const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_API_ACCESS_TOKEN

class Home extends Component {

  state = {
      searchQuery: '',
      policy: false
    }

  // onAddressSelect = (viewport, item) => this.props.setFilter( getDistricsFromPoint(item.center) )
  onAddressSelect = (item) => {
    this.props.setFilter( getDistricsFromPoint(item.result.center) )
    this.setState({searchQuery: item.result['place_name']})
    this.props.setAddress(item.result['place_name'].replace(', United States', ''))
  }

  onPolicySelect = (e) => this.props.setPolicy(e.target.checked)

  mapRef = React.createRef()
  geocoderContainerRef = React.createRef()


  render() {

    const {meta: {displayTitle, intro, searchBbox, state, dataPolicy, backgroundImage}} = this.props.meta

    return (
      <div className="topBackground" id="topContainer">
        <div className="topBackgroundImage">
          <img src={backgroundImage}/>
        </div>
        <div className="topBox w-medium">
          <div className="topBoxWrapper">
          <Social encodedUrl={this.props.encodedUrl}/>
        <div className="main-head">{displayTitle}</div>

          {intro.split("\n").map((i,key) => {
              return <p key={key} dangerouslySetInnerHTML={{ __html: i }}/>;
          })}
          <div className="instructions padding-bottom-2 padding-top-2">Enter your home address to begin:</div>

          <div
            ref={this.geocoderContainerRef}
          />

          <MapGL
            ref={this.mapRef}
            width="100%"
            height="1px"
            mapboxApiAccessToken={MAPBOX_TOKEN}>
            <Geocoder
              mapRef={this.mapRef}
              mapboxApiAccessToken={MAPBOX_TOKEN}
              containerRef={this.geocoderContainerRef}
              onResult={this.onAddressSelect}
              country='US'
              placeholder='Ex. 501 N 3rd St, Harrisburg'
              inputValue={this.state.searchQuery}
              bbox={searchBbox && Array.from(searchBbox.split(',')).map(d => Number(d))}
              minLength={3}
              filter={item => {
                if (item.context.filter(d => d.id.includes('region'))[0] && item.context.filter(d => d.id.includes('region'))[0].text == state) {
                  return true
                } else {
                  return false
                }
              } }
            />
          </MapGL>

          <div className='g-launchButton'  onClick={this.props.onBuildBallot}>Build my ballot</div>

          {this.props.error ?
          <div className='padding-top-2'><em>{this.props.error}</em></div> :
          ''}

          {dataPolicy ? (
            <form className='policy-select padding-bottom-1 padding-top-2' onChange={this.onPolicySelect}>
              <input type="checkbox" id="policy" name="policy" value="policy" checked={this.props.policy}/>
              <label for="policy">{dataPolicy}</label>
            </form>
          ) : ''}


          <div className="instructions padding-bottom-1 padding-top-2" >Or <Link to="/showAll" className="g-link">browse a list of all {getRaceCount(this.props.data)} included races and the {this.props.data.length} candidates</Link> available during this election.</div>
          </div>
        </div>
      </div>
    )
  }

}

export default Home
