import React from 'react';

const SlideOutInfo = (props) => {
    return (
        <div className="slide-out-container">
            <button onClick = {props.onClose}>Close</button>
            <h2>{props.data.jobtitle}</h2>
            <h3>{props.data.company}</h3>
            <h3>{props.data.formattedLocation}</h3>
            <p dangerouslySetInnerHTML={{ __html: props.data.snippet }}></p>
            <h4>{props.data.formattedRelativeTime}</h4>

            <a className="apply-button" href={props.data.url}>Apply</a>
            <button className="save-button">Save</button>
        </div>
    )
}

export default SlideOutInfo;