import React from 'react';

const SearchResult = (props) => {
    return (
        <div>

        {/* <div className="change-page-controls">
            <button className="test" onClick={props.changePage} id="page-last">Last</button>
            <button onClick={props.changePage} id="page-next">Next</button>
        </div> */}

        <div id = {props.data.jobkey} onClick = {props.onClick} className = "search-result">  
            {props.appliedFor ? <div><i className="fas fa-check-circle"></i></div> : null}
            {props.saved ? <div><i className="fas fa-star"></i></div> : null} 
            <h3>{props.data.jobtitle}</h3>
            <h4>{props.data.company}</h4>           
            <button id={props.data.jobkey} onClick={props.onClick} className="more-info">More Info <div><i className="fas fa-arrow-right"></i></div></button>
        </div>
        </div>
    )
}


export default SearchResult;