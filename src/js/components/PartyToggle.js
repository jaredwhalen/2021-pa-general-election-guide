import React from 'react'
import {
  useRouteMatch
} from 'react-router-dom';

// styles
require('../../scss/components/PartyToggle.scss')

export default function PartyToggle(props) {

  let currentParty = window.location.hash.includes('democratic') ? 'democratic' : 'republican'
  let changeParty = currentParty === 'democratic' ? 'republican' : 'democratic'
  let filter = window.location.hash.match(/([^\/]+$)/)[0]
  let { url } = useRouteMatch();
  let destination = url.includes('results') ? `${url}/${filter.replace(currentParty, changeParty)}` : `${url}/${changeParty}/${filter}`
  return(
    <div className={`${changeParty} partyToggle-container`} onClick={() => window.location.hash = destination}>
      > See {props.text || ''} <span>{changeParty}</span> candidates
    </div>
  )
}
