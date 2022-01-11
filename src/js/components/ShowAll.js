import React, {Component} from 'react'
// components
import SectionHeader from './SectionHeader'
import CTA from './CTA'
// util
import groupBy from '../util/groupBy'
import getCode from '../util/getCode'
// data
const images = require.context('../../assets/images', true);
const silhouette = 'https://cdn.pixabay.com/photo/2012/04/18/00/07/silhouette-of-a-man-36181_960_720.png'
// styles
require('../../scss/components/ShowAll.scss')


class ShowAll extends Component {

  state = {
    show: 'races'
  }

  toggleShow = () => {
    this.setState(prevState => {
      return {
        show: prevState.show === 'candidates' ? 'races' : 'candidates'
      }
    })
  }

  goToCandidate = candidateCode => window.location.hash = `#candidate/${candidateCode}`

  getUniqueRaces = (group) => group.map( (value) => value.office).filter( (value, index, _group) => _group.indexOf(value) == index).sort()




  render() {


    window.scrollTo(0, 0);

    let letters = []

    let races = []

    this.props.data.forEach(d => {
      letters.push( d.lastName.slice(0,1) )
      races.push( {
        level: d.level,
        name: <>{d.office}</>,
        link: `#race/${getCode(d.office)}`
      } )
    })

    const uniqueRaces = [];
    const map = new Map();
    for (const item of races) {
        if(!map.has(item.link)){
            map.set(item.link, true);
            uniqueRaces.push({
                level: item.level,
                name: item.name,
                link: item.link
            });
        }
    }



    const clone = JSON.parse(JSON.stringify(this.props.data))
    clone.sort((a, b) => (a.lastName + ", " + a.firstName).localeCompare(b.lastName + ", " + b.firstName));
    let uniqueChars = [...new Set(letters)];
    uniqueChars.sort()

    function assignPartyCode(party) {
      if (party == "Democratic/Republican") {
        return("D/R")
      } else {
        return(party.slice(0,1))
      }
    }


    let ByNameComponent = uniqueChars.map(c => {
      let CandidateComponents = clone
      .filter(d => d.lastName.slice(0,1) === c)
      .map(d => {
        // d.candidateCode = `${getCode(d.office)}_${d.lastName.toLowerCase()}_${d.firstName.toLowerCase()}`
        // candidateCodes.push(d.candidateCode)
        return(
          <div className='g-candidate' onClick={() => this.goToCandidate( d.candidateCode ) }>
            <div className='g-candidate-photo'><img src={d.image ?  images('./' + d.image) : silhouette}/></div>
            <div className='g-candidate-displayName'>
            {d.displayName}{d.incumbent && '*'}
            <span className={assignPartyCode(d.party)}>{assignPartyCode(d.party)}</span></div>
          </div>
        )
      })
      return(
        <div className='letter-block'>
          <div className='letter-title'>{c}</div>
          <div className='g-candidateList'>
            {CandidateComponents}
          </div>
        </div>
      )
    })


    var groubedByLevel = groupBy(races, 'level')
    let levels = Object.keys(groubedByLevel)
    let ByRaceComponent = levels.map(l => {

      let RaceComponents = uniqueRaces
      .filter(d => d.level == l)
      .map(r => {
        return <div className='g-item'><a className='g-link' style={{'text-transform': 'capitalize'}} onClick={() => window.location.hash = r.link }>{r.name}</a><br/></div>
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
            <div className='flex-container showAll'>
              <div className='flex-siderail'>

                <CTA/>
              </div>
              <div className='flex-main'>
                <h2>All included {this.state.show} for 2020 General Election</h2>
                  {this.state.show === 'candidates'
                  ? (
                    <>
                      <div className='side-by-side'>
                        <h4 className='g-link toggle' onClick={() => this.toggleShow() }> > Show all races</h4>
                        <div className='right-note'>*Incumbent</div>
                      </div>
                      {ByNameComponent}
                    </>
                  )
                  : (
                    <>
                      <div className='side-by-side'>
                        <h4 className='g-link toggle' onClick={() => this.toggleShow() }> > Show all candidates</h4>
                      </div>
                      {ByRaceComponent}
                    </>
                  )}
              </div>
            </div>
        </div>
      )
  }

}

export default ShowAll
