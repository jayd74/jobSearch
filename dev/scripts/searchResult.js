import React from 'react';

const SearchResult = (props) => {
    return (
        <div id = {props.data.jobkey} onClick = {props.onClick} className = "search-result">
            {props.appliedFor ? <div><i className="fas fa-check-circle"></i></div> : null}
            <h3>{props.data.jobtitle}</h3>
            <h4>{props.data.company}</h4>
           
            <button id={props.data.jobkey} onClick={props.onClick} className="more-info">More Info <div><i className="fas fa-arrow-right"></i></div></button>

        </div>
    )
}


export default SearchResult;