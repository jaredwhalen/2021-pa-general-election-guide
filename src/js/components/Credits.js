import React from "react"
require('../../scss/components/Credits.scss')
function Credits(props) {

  const creditComponents = props.meta.credits.map(d => {
    return(
      <div className="credit-item" key={d.value}>
        <div className="credit-title">{d.type.replace("_"," ")}</div>
        <div className="credit-name">{d.value}</div>
      </div>
          )
  })

  return(
    <div id="credits">
      <div className='w-medium'>
      <h3>Credits</h3>
      {creditComponents}
      </div>
    </div>)
}

export default Credits
