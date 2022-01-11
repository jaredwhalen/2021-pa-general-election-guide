import React, {Component} from 'react'

// components
import SectionHeader from './SectionHeader'
import CTA from './CTA'
// util
import groupBy from '../util/groupBy'
import getCode from '../util/getCode'
import fixCase from '../util/fixCase'

// styles
require('../../scss/components/Results.scss')

// consts
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_API_ACCESS_TOKEN

class Results extends Component {

  getActiveSelection = (data, filter) => {
    var selection = data
    .filter(d => {
      if ( (filter.split(';').includes(d.districtCode) || d.districtCode === 'statewide')  ) {
        return true
      }
    })
    return {
      data: selection,
      filter
    }
  }

  getUniqueRaces = (group) => group.map( (value) => value.office).filter( (value, index, _group) => _group.indexOf(value) == index)
  // .sort()

  goToRace = (race) => window.location.hash = `#race/${race}`

  render() {
    window.scrollTo(0, 0);

    let hash = window.location.hash.replace('#results/', '')
    let filter = hash

    let selection = this.getActiveSelection(this.props.data, filter)

    var groubedByLevel = groupBy(selection.data, 'level')
    let levels = Object.keys(groubedByLevel)
    let LevelComponents = levels.map(l => {
      let uniqueRaces = this.getUniqueRaces( groubedByLevel[l] )

    let RaceComponents = uniqueRaces.map(r => {
      return <div className='g-item'><a className='g-link' style={{'text-transform': 'capitalize'}} onClick={() => this.goToRace( getCode(r) ) }>{fixCase(r)}</a><br/></div>
    })
    return(
        <div className="g-list results-section">
          <h3><span style={{'text-transform':'capitalize'}}>{l}</span> races</h3>
          {RaceComponents}
        </div>
      )
    })

    return(



      <div className="section">
        <SectionHeader encodedUrl={this.props.encodedUrl} level={'results'} meta={this.props.meta} resetFilters={this.props.resetFilters}/>
          <div className='flex-container results'>
            <div className='flex-siderail'>
              <p>
                Based on the address {
                  this.props.address
                  ? (
                    <>of <b>{this.props.address}</b></>
                  )
                  : (
                    <> entered</>
                  )
                }, you are eligible to vote in these races. Click on a race to see the candidates running for office.
              </p>

              <CTA/>
            </div>
            <div className='flex-main'>
              {LevelComponents}
            </div>
          </div>
      </div>
    )
  }
}

export default Results
