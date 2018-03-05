import React from 'react';

const SlideOutInfo = (props) => {
    return (
        
            <div className="slide-out-modal">
            <div className="slide-out-container">
                <button onClick={props.onClose} className="close-btn"><i className="fas fa-times"></i></button>
                <h2>{props.data.jobtitle}</h2>
                <h3>{props.data.company}</h3>
                <h3>{props.data.formattedLocation}</h3>
                <p dangerouslySetInnerHTML={{ __html: props.data.snippet }}></p>
                <a className = "job-details" href={props.data.url}>See Job Details</a>
                <h4>{props.data.formattedRelativeTime}</h4>

                {props.hideApplyButton ? 
                <p>Applied on {props.data.dateApplied}</p>
                :
                <button id = {props.data.jobkey} onClick = {props.onApply}
                className="apply-button">Apply</button>}

            {props.hideSaveButton 
                    ? null
                    :  <button onClick = {() => {props.onSave(props.data.jobkey)}} className="save-button">
                        {!props.saved ? "Save" : "Remove From Saved Jobs"}
                    </button>
                }

                
                {/* <button id = {props.data.jobkey} onClick = {props.onApply} className="apply-button">Apply</button>
                <button onClick = {() => {props.onSave(props.data.jobkey)}} className="save-button">Save</button> */}
            </div>
        </div>
    )
}

export default SlideOutInfo;