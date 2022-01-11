import React, {useState} from "react";
import {
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import Social from "./Social"
// import Profile from './_Profile'

function Lawmakers(props) {



  let match = useRouteMatch();


  const [sort, setSort] = useState("district")

  function switchSort(type) {
      setSort(() => {
        if (type === "district") {
          return "district"
        } else {
          return "name"
        }
      })
    }

  const [filter, setFilter] = useState(props.filter)
  // function setFilterWrapper(id) {
  //    setFilter(id);
  //  }


  function cardComponent(d) {
    return(<Link key={d.id} className="noshow" to={"/lawmakers/" + d.id} onClick={() => setFilter(d.id)}><div key={d.id} className="g-card" data-chamber={d.chamber} data-district={d.district}>
              <div className="image"><img src={d.image_local}/></div>
              <div className="text-box">
                <div className="name element_head">{d.name} {d.party === "D" ? <div className="circle democrat"><div>D</div></div> : <div className="circle republican"><div>R</div></div>}</div>
                <div className="district">{d.chamber} District {d.district}</div>
              </div>
          </div></Link>)
  }

  let data = props.data
  if (sort === "district") {
    data.sort(function(a, b){return a.district - b.district});
  } else {
    data.sort(function (a, b) {return (a.lastName + ", " + a.firstName).localeCompare(b.lastName + ", " + b.firstName)});
  }
  const houseComponents = data.filter(d => d.chamber === "house").map(d => cardComponent(d))
  const senateComponents = data.filter(d => d.chamber === "senate").map(d => cardComponent(d))

  return(
    <Switch>
       <Route path={`${match.path}/:rep`}>

       <div className="w-medium padding-top-4">
        <Social/>
        <div className="top-nav">
          <div className="top-nav-link"><Link to="/" onClick={() => props.resetFilter()}>Search</Link></div>
          <span>&nbsp;&nbsp;&#8226;&nbsp;&nbsp;</span>
          <div className="top-nav-link"><Link to="/lawmakers" onClick={() => props.resetFilter()}>View all lawmakers</Link></div>
          <span>&nbsp;&nbsp;&#8226;&nbsp;&nbsp;</span>
          <div className="top-nav-link active">Profile</div>
        </div>
       </div>

        {/*<Profile data={props.data} filter={filter} />*/}
       </Route>
       <Route path={match.path}>
         <div className="w-medium padding-top-4">
          <Social/>
          <div className="top-nav">
            <div className="top-nav-link"><Link to="/" onClick={() => props.resetFilter()}>Search</Link></div>
                  <span>&nbsp;&nbsp;&#8226;&nbsp;&nbsp;</span>
            <div className="top-nav-link active">View all lawmakers</div>
          </div>
          <h3 className="section_head">Browse all representatives</h3>
          <p>Below are the names of the 62 lawmakers in Delaware state House and Senate. Click on a name to view more information about the representative and district.</p>
          <div className="instructions padding-bottom-2 padding-top-2">Sort representatives by
            <div className="g-pod">
              <div className={sort === "district" ? "active g-pod-cell" : "g-pod-cell"} onClick={() => switchSort("district")}>district</div>
              <div className={sort === "name" ? "active g-pod-cell" : "g-pod-cell"}  onClick={() => switchSort("name")}>name</div>
            </div>
          </div>
          <div id="lawmaker-card-container">
            <h3 className="subsection_head full-width-flex">House</h3>


            <h3 className="subsection_head full-width-flex">Senate</h3>


          </div>
         </div>
       </Route>
     </Switch>
  )
}

export default Lawmakers
