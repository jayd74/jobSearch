import React from 'react';
import {ApplicationPreview} from './Account';

/**
 * SlideOutInfo displays information about a specfic job and allows users to apply for and save jobs
 */
class SlideOutInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showApplicationDetails: false
        }
    
        this.toggleApplicationDetails = this.toggleApplicationDetails.bind(this);
        this.renderJobDetails = this.renderJobDetails.bind(this);
        this.renderApplyButton = this.renderApplyButton.bind(this);
    }

    /**
     * Once a user has applied for a job, toggles the application that was submitted at that time
     */
    toggleApplicationDetails() {
        if (this.state.showApplicationDetails) {
            this.setState({
                showApplicationDetails: false
            })
        }
        else {
            this.setState({
                showApplicationDetails: true
            })
        }
    }

    /**
     * Renders information from the API about a selected job
     * Calls the method to render the apply button
     * Renders a save or remove from saved button depending on the saved value of the prop
     * Saved is a boolean that returns true if the job already exists in the saved job object
     */
    renderJobDetails(){
        return (
            <div>
                <h2>{this.props.data.jobtitle}</h2>
                <h3>{this.props.data.company}</h3>
                <h3>{this.props.data.formattedLocation}</h3>

                <p className="job-snippet" dangerouslySetInnerHTML={{ __html: this.props.data.snippet }}></p>
                <a className="job-details" href={this.props.data.url} target="_blank">See Job Details</a>
                <h4>{this.props.data.formattedRelativeTime}</h4>

                {this.renderApplyButton()}

                {this.props.hideSaveButton
                    ? null
                    : <button onClick={() => { this.props.onSave(this.props.data.jobkey) }} className="save-button">
                        {!this.props.saved ? "Save" : "Remove From Saved Jobs"}
                    </button>
                }
            </div>);      
    }

    /**
     * Renders the apply button
     * Hides the apply button if the props value hideApplyButton is true and shows the date applied and a button to see the application details
     */
    renderApplyButton(){
        return (
            <div className="apply-button-container">
                {this.props.hideApplyButton
                    ?
                    <div>
                        <p className="date-applied">Applied on {this.props.data.dateApplied}</p>
                        <button onClick={this.toggleApplicationDetails}>{this.state.showApplicationDetails ? <button className="return-to-job-posting">Back to Job Posting</button> 
                        : <button className="show-application-details">Show My Application </button>}</button>
                    </div>
                    : <button id={this.props.data.jobkey} onClick={this.props.onApply}
                        className="apply-button">Apply</button>
                }
            </div>
        )
    }

    /**
     * Renders the job application for jobs applied to if the state showApplicationDetails is true, else renders the details about the job
     */
    render() {
        return (

            <div className="slide-out-modal">
                <div className="slide-out-container">
                    <button onClick={this.props.onClose} className="close-btn"><i className="fas fa-times"></i></button>
                    {this.state.showApplicationDetails 
                        ? <div>
                            {this.renderApplyButton()}
                            <ApplicationPreview application = {this.props.data.jobApplication}/> 
                        </div>
                        : <div>{this.renderJobDetails()}</div>
                    }
                </div>
            </div>
        )
    }
    
}

export default SlideOutInfo;