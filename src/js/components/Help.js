import React from "react";
// styles
require('../../scss/components/Help.scss')
export default function Help() {
  return(
    <div className='Help'>
    <div className='w-medium'>
      <h3>Need help?</h3>
      For technical questions about how to use this Voter Guide, or to report inaccuracies or omissions, please email <a className='g-link' href='mailto:jared.m.whalen@gmail.com'>jared.m.whalen@gmail.com</a>.
      </div>
    </div>
  )
}
