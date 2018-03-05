import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';
import JobsView from './jobsview';


class ApplicationDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode : false
        }
        this.enterEditMode = this.enterEditMode.bind(this);
        this.exitEditMode = this.exitEditMode.bind(this);
    }

    render() {
        return (
            <div>
                <div className="application-details-mode-selections">
                    <button>Preview</button>
                    <button onClick = {this.enterEditMode}>Edit</button>
                </div>
                {this.state.editMode ? this.renderEditMode() : this.renderPreviewMode()}
            </div>
            );
    }

    enterEditMode(){
        this.setState({
            editMode : true
        })
    }

    exitEditMode(){
        this.setState({
            editMode : false
        })
    }

    renderEditMode(){
        return (
            <div>
                <form onSubmit={this.props.saveApplicationChanges}>
                    <div className="account-form-input">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" onChange={this.props.setApplicationDetails} value={this.props.data.application.name}/>
                    </div>
                    <div className="account-form-input">
                        <label htmlFor="summary">Summary</label>
                        <textarea name="" id="summary" onChange={this.props.setApplicationDetails} value={this.props.data.application.summary}></textarea>
                    </div>
                    <div className="account-form-input">
                        <label htmlFor="experience">Experience</label>
                        <textarea name="" id="experience" onChange={this.props.setApplicationDetails} value={this.props.data.application.experience}></textarea>
                    </div>
                    <div className="account-form-input">
                        <label htmlFor="education">Education</label>
                        <textarea name="" id="education" onChange={this.props.setApplicationDetails} value={this.props.data.application.education}></textarea>
                    </div>
                    <div className="account-form-input">
                        <label htmlFor="skills">Skills</label>
                        <textarea name="" id="skills" onChange={this.props.setApplicationDetails} value={this.props.data.application.skills}></textarea>
                    </div>
                    <div className="account-form-input">
                        <label htmlFor="interests">Interests</label>
                        <textarea name="" id="interests" onChange={this.props.setApplicationDetails} value={this.props.data.application.interests}></textarea>
                    </div>
                    <div className="account-form-input">
                        <label htmlFor="cover-letter">Cover Letter</label>
                        <textarea name="" id="coverLetter" onChange={this.props.setApplicationDetails} value={this.props.data.application.coverLetter}></textarea>
                    </div>
                    <button className="account-form-submit">Save changes</button> 
                </form>
            </div>
        )
    }

    renderPreviewMode(){
        return (
            <div>PREVIEW!</div>
        )
    }

}

class Account extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            application: {
                name: '',
                summary: '',
                experience: '',
                education: '',
                skills: '',
                interests: '',
                coverLetter: ''
            },
            accountDetailsToDisplay : "applications"
        }

        this.displayAccountDetails = this.displayAccountDetails.bind(this);
        this.setApplicationDetails = this.setApplicationDetails.bind(this);
        this.saveApplicationChanges = this.saveApplicationChanges.bind(this);
    }
      
    setApplicationDetails(e) {
        let applicationState = this.state.application;
        applicationState[[e.target.id]] = e.target.value;
        console.log("change");
        this.setState({
           application: applicationState
        })
    }

    saveApplicationChanges(event) {
        event.preventDefault();
        console.log("save changes");
        const dbRef = firebase.database().ref(`users/${this.props.user}/currentApplication`);
        dbRef.set(this.state.application);
        
    }

    componentDidMount(){
        console.log("Account: " + this.props.loggedIn + " " + this.props.user);
    }
      
    render() {
        return (
            <div>
                {this.props.loggedIn 
                    ? this.renderAccount() 
                    : <h4>Sign in to view your account details</h4>
                }
            </div>
        )
    }

    renderAccount(){
        return (
            <div>
                <div className = "account-page-options">
                    <button 
                        className = {`account-page-button ${this.state.accountDetailsToDisplay === "applications" ? 'account-button-toggled' : null}`}
                        onClick = {() => {this.displayAccountDetails("applications")}}
                    >
                        My Applications
                    </button>
                    <button 
                        className = {`account-page-button ${this.state.accountDetailsToDisplay === "jobs" ? 'account-button-toggled' : null}`}
                        onClick = {() => {this.displayAccountDetails("jobs")}}
                    >
                        My Jobs
                    </button>
                </div>
                {this.state.accountDetailsToDisplay === "applications" 
                    ? <ApplicationDetails 
                        data={this.state} 
                        setApplicationDetails={this.setApplicationDetails} 
                        saveApplicationChanges={this.saveApplicationChanges}
                        user = {this.props.user}
                        /> 
                    : <JobsView 
                        jobsAppliedFor = {this.props.jobsAppliedFor} 
                        jobsSaved = {this.props.jobsSaved}
                        saveJob = {this.props.saveJob}
                    /> }                
            </div>
        )   
    }

    displayAccountDetails(detailsToDisplay){
        this.setState({
            accountDetailsToDisplay : detailsToDisplay
        })
    }
}

export default Account;