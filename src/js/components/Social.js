import React, {useState, useEffect} from "react"


function Social(props) {


// const [encodedUrl, setEncodedUrl] = useState(undefined);

  // var pymChild = new pym.Child();
  // pymChild.onMessage('loaded', onLoadedMessage);
  //
  // function onLoadedMessage(url) {
  //   console.log(url)
  //   setEncodedUrl(encodeURI(url))
  // }

  // useEffect(() => {
  //   console.log(encodedUrl)
  // }, [])

  let {encodedUrl} = props;

  return(encodedUrl ? (<div className="socialIcons padding-bottom-1">
            <a
              target="_blank"
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}>
              <i className="fab fa-facebook-f" style={{color:"#4961A7"}}></i>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodedUrl}`}
              target="_blank" rel="noopener noreferrer" data-popup="" rel="nofollow">
              <i className="fab fa-twitter" style={{color:"#2EB2E8"}}></i>
            </a>
            <a
              href={`mailto:?subject=${encodeURI('Delaware Online Voters Guide')}&body=${encodedUrl}`}>
              <i className="fas fa-envelope" style={{color:"#8A8989"}}></i>
            </a>
          </div>)
        : ('')
      )
}

export default Social
