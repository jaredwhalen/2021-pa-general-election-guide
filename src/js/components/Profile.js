import React, {Component} from "react"
// components
import SectionHeader from './SectionHeader'
import ResultsSiderail from './ResultsSiderail'
import CTA from './CTA'
// util
import getCode from '../util/getCode'
import getAge from '../util/getAge'
import isValidHttpUrl from '../util/isValidHttpUrl'
// styles
require('../../scss/components/Profile.scss')
// data
const questionnaireData = require('../../data/questionnaire.json')
const bioData = require('../../data/bioResponses.json')
const images = require.context('../../assets/images', true);
const archie = require('../../data/archie.json')

class Profile extends Component {

  render() {
    window.scrollTo(0, 0);

    let hash = window.location.hash.replace('#candidate/', '')


    let profileData = this.props.data.filter(d => {
      return hash === d.candidateCode
    })[0]

    let {office, party, displayName, incumbent, image} = profileData

    let questions = questionnaireData.filter(d => d.candidateCode === hash && d.response)
    let bio = bioData.filter(d => d.candidateCode === hash)[0]

    let {dob, occupation, twitter, facebook, website, email, residence} = bio || {}

    let {candidateResponseDisclaimer} = archie.meta



    let Contact = (
      <div className="contact">
        <div className='flex-table'>
          <div className='flex-row'>
            {isValidHttpUrl(facebook) && <div className='icon-wrapper'><a href={facebook} target='_blank'><div className='icon-button'><i class="fab fa-facebook-f"></i></div> <span></span></a></div>}
            {isValidHttpUrl(twitter) && <div className='icon-wrapper'><a href={twitter} target='_blank'><div className='icon-button'><i class="fab fa-twitter"></i></div> <span></span></a></div>}
            {isValidHttpUrl(website) && <div className='icon-wrapper'><a href={website} target='_blank'><div className='icon-button'><i class="fas fa-link"></i></div> <span>Campaign website</span></a></div>}
          </div>
        </div>
      </div>
    )

    let About = (<div className="bio">
        <div className='flex-table padding-top-2'>
          {dob
          ? (<div className='flex-row'>
            <div className='label'>Age</div>
            <div className='value'>{getAge(dob)}</div>
          </div>)
          : ''}
          {occupation
          ? (<div className='flex-row'>
            <div className='label'>Occupation</div>
            <div className='value'>{occupation}</div>
          </div>)
          : ''}
          {residence
          ? (<div className='flex-row'>
            <div className='label'>Primary residence</div>
            <div className='value'>{residence}</div>
          </div>)
          : ''}
        </div>
      </div>)



    let QuestionnaireComponents = (
      <div className='questionnaire-section padding-top-3'>
        <h3>Candidate responses</h3>
        <span dangerouslySetInnerHTML={{ __html: candidateResponseDisclaimer }} />
        {questions.length
          ?
          questions.map(d => {
            console.log(d.response.length)
            return(
              <div className='questionnaire-block padding-top-2'>
                <h4 className='question'>{d.question}</h4>
                <div className='response'>{!!d.response ? d.response.map(p => <p>{p}</p>) : ''}</div>
              </div>
            )
          })
          : (
            <div className='questionnaire-block padding-top-2'>
              <p>Candidate answers are not yet available.</p>
            </div>
          )
        }
      </div>
    )

    function assignPartyCode(party) {
      if (party == "Democratic/Republican") {
        return("D/R")
      } else {
        return(party.slice(0,1))
      }
    }

    return(
      <div className="section">
        <SectionHeader encodedUrl={this.props.encodedUrl} level={'candidate'} meta={this.props.meta}
          resetFilters={this.props.resetFilters}
          office={office}
          resultsHash={
            this.props.filter
            ? `${this.props.filter.join(';')}`
            : undefined
          }
        />
          <div className='flex-container padding-top-2 profile'>
            <div className='flex-siderail'>
              {image
              ? <div className='candidate-image'><img src={images('./' + profileData.image)}/></div>
              : ''}
              <CTA/>
            </div>
            <div className='flex-main'>
              <div className="name-title">
                <h2>{displayName} {incumbent && <span>INCUMBENT</span>}</h2>
                <div className='detail padding-top-1'><span className={'party ' + assignPartyCode(party)}>{party}</span> candidate for {office}</div>
              </div>
              {About}
              {Contact}
              {office === 'President' || office === 'Vice President'
              ?     <div className='questionnaire-section padding-top-3'>
                      <h3>To learn more about the candidates for President and Vice President, <a href='https://www.usatoday.com/storytelling/election-2020-voter-guide/' target='_blank' className='g-link'>visit the USA Today voter guide</a>.</h3>
                    </div>
              : QuestionnaireComponents}

            </div>
          </div>
      </div>
    )
  }
}


export default Profile
