import React from 'react';
import {ApplicationPreview} from './Account';

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

    renderJobDetails(){
        return (
            <div>
                <h2>{this.props.data.jobtitle}</h2>
                <h3>{this.props.data.company}</h3>
                <h3>{this.props.data.formattedLocation}</h3>

                <p dangerouslySetInnerHTML={{ __html: this.props.data.snippet }}></p>
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

    renderApplyButton(){
        return (
            <div>
                {this.props.hideApplyButton
                    ?
                    <div>
                        <p>Applied on {this.props.data.dateApplied}</p>
                        <button onClick={this.toggleApplicationDetails}>{this.state.showApplicationDetails ? "Back to Job Posting" : "Show My Application"}</button>
                    </div>
                    : <button id={this.props.data.jobkey} onClick={this.props.onApply}
                        className="apply-button">Apply</button>
                }
            </div>
        )
    }

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