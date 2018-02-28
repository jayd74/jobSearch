import React from 'react';

const SearchResult = (props) => {
    console.log(props.data)
    return (
        <div>
            <h3>{props.data.jobtitle}</h3>
            <h4>{props.data.company}</h4>
            <button>See more</button>
        </div>
    )
}


export default SearchResult;