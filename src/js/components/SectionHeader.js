import React from 'react'
import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import Social from "./Social"
// util
import getCode from '../util/getCode'

export default function SectionHeader(props) {

  function getNav(param) {
    if(param === 'results') {
      return(
        <>
          <div className="top-nav-link">
            <Link to="/" onClick={() => props.resetFilters()}>Back to search</Link>
          </div>
          <span>&nbsp;&nbsp;&#8226;&nbsp;&nbsp;</span>
          <div className="top-nav-link active">Results</div>
        </>
      )
    }
    if(param === 'race') {
      return(
          <>
            <div className="top-nav-link">
              <Link to="/" onClick={() => props.resetFilters()}>Back to search</Link>
            </div>
            <span>&nbsp;&nbsp;&#8226;&nbsp;&nbsp;</span>
            {props.resultsHash
            ? <> <div className="top-nav-link">
            <Link to={`/results/${props.resultsHash}`}>Results</Link>
            </div>
            <span>&nbsp;&nbsp;&#8226;&nbsp;&nbsp;</span></>
            : ''}
            <div className="top-nav-link active">Race</div>
          </>
      )
    }
    if(param === 'candidate') {
      return(
          <>
            <div className="top-nav-link">
              <Link to="/" onClick={() => props.resetFilters()}>Back to search</Link>
            </div>
            <span>&nbsp;&nbsp;&#8226;&nbsp;&nbsp;</span>
            {props.resultsHash
            ? <> <div className="top-nav-link">
            <Link to={`/results/${props.resultsHash}`}>Results</Link>
            </div>
            <span>&nbsp;&nbsp;&#8226;&nbsp;&nbsp;</span></>
            : ''}
            <div className="top-nav-link">
              <Link to={`/race/${getCode(props.office)}`}>Race</Link>
            </div>
            <span>&nbsp;&nbsp;&#8226;&nbsp;&nbsp;</span>
            <div className="top-nav-link active">Candidate</div>
          </>
      )
    }
  }


  return(
    <div>
      <h1>{props.meta.meta.displayTitle}</h1>
      <div>
       <Social encodedUrl={props.encodedUrl}/>
       <div className="top-nav">
        {getNav(props.level)}
       </div>
      </div>
    </div>
  )
}
