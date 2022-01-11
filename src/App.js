import React, {Component} from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import pym from "pym.js"

// components
import Header from './js/components/Header'
import Home from './js/components/Home'
import Results from './js/components/Results'
import Race from './js/components/Race'
import Profile from './js/components/Profile'
import About from "./js/components/About"
import Help from "./js/components/Help"
import ShowAll from './js/components/ShowAll'
import Credits from './js/components/Credits'

import Lawmakers from './js/components/Lawmakers'
import './App.scss';
// util

// data
// const {data: candidateData} = require('./data/gsheet.json')
const candidateData = require('./data/gsheet.json')

// candidateData.forEach((item, i) => {
//   candidateData[i].image = ''
// });


console.log(candidateData)

const meta= require('./data/archie.json')
class App extends Component {

  state = {
    filter: undefined,
    error: '',
    address: undefined,
    policy: false,
    encodedUrl: undefined
  }

  componentDidMount() {
    window.addEventListener("hashchange", () => {
      this.forceUpdate();
    }, false);

    var pymChild = new pym.Child();
    pymChild.onMessage('loaded', url => {
      this.setState({
        encodedUrl: encodeURI(url)
      })
    });
  }


  resetFilters = () => {
    this.setState({
      filter: undefined
    })
  }

  setFilter = (filter) => {
    this.setState({
      filter: filter
    })
  }

  setAddress = (address) => {
    this.setState({
      address: address
    })
  }

  setPolicy = (policy) => {
    this.setState({
      policy: policy
    })
  }


  onBuildBallot = () => {
    if (this.state.policy) {
      if (this.state.filter) {
        this.setState({
          error: false
        })
        let hash = `${this.state.filter.join(';')}`
        window.location.hash = 'results/' + hash
      } else {
        if (!this.state.filter) {
          this.setState({
            error: 'Please select a location'
          })
        }
      }
    } else {
      this.setState({
        error: 'Please agree to the data policy below.'
      })
    }
  }

  render() {

    return (
      <Router hashType='noslash'>
        <div className='App'>
          {/*<Header/>*/}
          <Switch>
            <Route path='/results'>
            <div className='section-wrapper'>
                <div className='w-medium'>
                  <Results meta={meta} setFilter={this.setFilter} resetFilters={this.resetFilters} data={candidateData} {...this.state}/>
                </div>
              </div>
            </Route>
            <Route path='/race'>
              <div className='section-wrapper'>
                <div className='w-medium'>
                  <Race data={candidateData} meta={meta} resetFilters={this.resetFilters} {...this.state}/>
                </div>
                </div>
            </Route>
            <Route path='/candidate'>
              <div className='section-wrapper'>
                <div className='w-medium'>
                  <Profile data={candidateData} meta={meta} resetFilters={this.resetFilters} {...this.state}/>
                </div>
              </div>
            </Route>
            <Route path='/showAll'>
              <div className='section-wrapper'>
                <div className='w-medium'>
                  <ShowAll data={candidateData} meta={meta} resetFilters={this.resetFilters} {...this.state}/>
                </div>
              </div>
            </Route>
            <Route path='/'>
              <Home meta={meta} data={candidateData} setFilter={this.setFilter} setAddress={this.setAddress} setPolicy={this.setPolicy}  onBuildBallot={this.onBuildBallot} {...this.state}/>
            </Route>
          </Switch>
          <Credits meta={meta}/>
          <Help/>
        </div>
      </Router>
    );
  }
}

export default App;
