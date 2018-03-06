import React from 'react';

/**
 * Component for SearchResults that is gathered from the API and compiled here.
 * @param {Property} props - properties passed to SearchResult component in app.js to display the results of the search results from the API
 */
const SearchResult = (props) => {
    return (
        <div>
            <div id = {props.data.jobkey} onClick = {props.onClick} className = "search-result">  
                {props.appliedFor ? <div><i className="fas fa-check-circle"></i></div> : null}
                {props.saved ? <div><i className="fas fa-star"></i></div> : null} 
                <h3>{props.data.jobtitle}</h3>
                <h4>{props.data.company}</h4>           
                <button id={props.data.jobkey} onClick={props.onClick} className="more-info">More Info<i className="fas fa-arrow-right"></i></button>
            </div>
        </div>
    )
}


export default SearchResult;