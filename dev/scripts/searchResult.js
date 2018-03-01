import React from 'react';

const SearchResult = (props) => {
    return (
        <div id = {props.data.jobkey} onClick = {props.onClick} className = "search-result">
            <h3>{props.data.jobtitle}</h3>
            <h4>{props.data.company}</h4>
            
            {props.appliedFor ? <h3>Applied For!!</h3> : null}
            {/* <button id = {props.data.jobkey} onClick = {props.onClick}>See more</button> */}
        </div>
    )
}


export default SearchResult;