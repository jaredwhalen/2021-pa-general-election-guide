import React, {Component} from 'react'
// components
import SectionHeader from './SectionHeader'
import ResultsSiderail from './ResultsSiderail'
import CTA from './CTA'
// util
import getCode from '../util/getCode'
import groupBy from '../util/groupBy'
import fixCase from '../util/fixCase'
// data
const candidateData = require('../../data/gsheet.json')
const images = require.context('../../assets/images', true);
// const questionnaireData = require('../../data/questionnaire.json')
const silhouette = images('./noImage.png')
// styles
require('../../scss/components/Race.scss')

class Race extends Component {


  goToCandidate = candidateCode => window.location.hash = `#candidate/${candidateCode}`

  render() {
    window.scrollTo(0, 0);

    let hash = window.location.hash.replace('#race/', '').split('/')
    let officeCode = hash[0]

    let districtCode = candidateData.filter(d => getCode(d.office) == officeCode)[0].districtCode
    let raceData = this.props.data.filter(d => getCode(d.office) === officeCode )
    let candidateCodes = []


    let CandidateComponents = raceData.map(d => {

      candidateCodes.push(d.candidateCode)
      return(
        <div className='g-candidate' onClick={() => this.goToCandidate( d.candidateCode ) }>
          <div className='g-candidate-photo'><img src={d.image ?  images('./' + d.image) : silhouette}/></div>
          <div className='g-candidate-displayName'>{d.displayName}{d.incumbent && '*'} <span className={d.party.slice(0,1)}>{d.party.slice(0,1)}</span></div>
        </div>
      )
    })

    return(
      <div className="section">
        <SectionHeader encodedUrl={this.props.encodedUrl} level={'race'} meta={this.props.meta}
          resetFilters={this.props.resetFilters}
          resultsHash={
            this.props.filter
            ? `${this.props.filter.join(';')}`
            : undefined
          }
        />
          <div className='flex-container padding-top-2 race'>
            <div className='flex-siderail'>

            {officeCode === 'president' || officeCode === 'vice_president'
            ?    ''
            : <ResultsSiderail districtCode={districtCode}/>}



              <CTA/>
            </div>
            <div className='flex-main'>
              <h2>Candidates for <span style={{'text-transform':'capitalize'}}>{raceData[0].office}</span></h2>
              {raceData.length
              ? (<div className='side-by-side'>
                  <p>
                    Click on a candidate to view their profile.
                  </p>
                  <div className='right-note'>*Incumbent</div>
                </div>)
              : ''
              }
              <div className='g-candidateList padding-top-1'>
                {CandidateComponents}
              </div>
            </div>
          </div>
      </div>
    )
  }
}

export default Race
