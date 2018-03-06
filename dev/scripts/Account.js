import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';
import JobsView from './jobsview';

/**
 * ApplicationDetails allows the user to edit their application and displays a preview of the application on the screen
 */
class ApplicationDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode : false
        }
        this.enterEditMode = this.enterEditMode.bind(this);
        this.exitEditMode = this.exitEditMode.bind(this);
    }

    /**
     * Initiates a mode that allows the user to edit their application by setting the editMode to true
     */
    enterEditMode(){
        this.setState({
            editMode : true
        })
    }

    /**
     * Exits the mode that allows the user to edit their application by setting the editMode to false
     */
    exitEditMode(){
        this.setState({
            editMode : false
        })
    }

    /**
     * Renders input fields for the user application so the user can edit and save the application
     */
    renderEditMode(){
        return (
            <div>
                    <div className="account-form-input">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" onChange={this.props.setApplicationDetails} value={this.props.application.name}/>
                    </div>
                    <div className="account-form-input">
                        <label htmlFor="summary">Summary</label>
                        <textarea name="" id="summary" onChange={this.props.setApplicationDetails} value={this.props.application.summary}></textarea>
                    </div>
                    <div className="account-form-input">
                        <label htmlFor="experience">Job Experience</label>
                        <textarea name="" id="experience" onChange={this.props.setApplicationDetails} value={this.props.application.experience}></textarea>
                    </div>
                    <div className="account-form-input">
                        <label htmlFor="education">Education</label>
                        <textarea name="" id="education" onChange={this.props.setApplicationDetails} value={this.props.application.education}></textarea>
                    </div>
                    <div className="account-form-input">
                        <label htmlFor="skills">Skills & Qualifications</label>
                        <textarea name="" id="skills" onChange={this.props.setApplicationDetails} value={this.props.application.skills}></textarea>
                    </div>
                    <div className="account-form-input">
                        <label htmlFor="interests">Interests</label>
                        <textarea name="" id="interests" onChange={this.props.setApplicationDetails} value={this.props.application.interests}></textarea>
                    </div>
                    <div className="account-form-input">
                        <label htmlFor="cover-letter">Cover Letter</label>
                        <textarea name="" id="coverLetter" onChange={this.props.setApplicationDetails} value={this.props.application.coverLetter}></textarea>
                    </div>
                    <button onClick = {() => {this.exitEditMode();this.props.saveApplicationChanges()} } className="account-form-submit">Save changes</button> 
            </div>
        )
    }

    /**
     * Renders a preview of the user's application from the entered information on application
     */
    renderPreviewMode(){
        return (
            <div className="wrapper">
                    <h2 className="my-application">My Application:
                        <span>
                            <button onClick={this.enterEditMode}>
                                <i className="far fa-edit"></i>
                            </button>
                        </span>
                    </h2>
                <section className="application-section">
                    <ApplicationPreview application = {this.props.application}/>
                </section>               
            </div>
        )
    }

    /**
    * Renders edit mode and preview mode for ApplicationDetails based on the editMode state
    */
    render() {
        return (
            <div className="wrapper">
                {this.state.editMode ? this.renderEditMode() : this.renderPreviewMode()}
            </div>
        );
    }
}

/**
 * Returns a preview of the user's application
 * @param {*} props - The props passed to ApplicationPreview
 */
export const ApplicationPreview = (props) =>{
    return (
        <div>
            <h3>{props.application.name}</h3>
            <h4>About Me</h4>
            <p>{props.application.summary}</p>
            <h4>Job Experience</h4>
            <p>{props.application.experience}</p>
            <h4>Education</h4>
            <p>{props.application.education}</p>
            <h4>Skills & Qualifications</h4>
            <p>{props.application.skills}</p>
            <h4>Interests</h4>
            <p>{props.application.interests}</p>
            <h4>Cover Letter</h4>
            <p>{props.application.coverLetter}</p>           
        </div>
    )
}

/**
 * Account displays the information about the user's application, jobs applied for and jobs saved
 */
export class Account extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            accountDetailsToDisplay : "applications"
        }

        this.displayAccountDetails = this.displayAccountDetails.bind(this);
        this.setApplicationDetails = this.setApplicationDetails.bind(this);
        this.saveApplicationChanges = this.saveApplicationChanges.bind(this);
    }

    /**
     * Upon change, passes the changed application to a function that then updates the state of the user's application
     * @param {Event} e - Event that is received on change in the user application
     */
    setApplicationDetails(e) {
        let applicationState = this.props.application;
        applicationState[[e.target.id]] = e.target.value;

        // set the userApplication state in App
        this.props.changeApplication(applicationState);
    }

    /**
     * Stores the current user application in firebase
     */
    saveApplicationChanges() {
        const dbRef = firebase.database().ref(`users/${this.props.user}/currentApplication`);
        // this can be props
        dbRef.set(this.props.application);
    }

    /**
     * Creates a date stamp when the apply button is clicked and adds it to the job object
     * Creates a job key based on the event received
     * Creates a job object using this job key to find the object in the search results
     * Passes the job object and job key to the function applyForJob
     * @param {Event} e - An event that is passed when the apply button is clicked
     */
    applyForJob(e) {
        let currentDate = new Date();
        currentDate = currentDate.toString();
        currentDate = currentDate.substring(0, 15);

        let jobkey = e.target.id;
        let jobObject = this.state.currentSearchResults[e.target.id];
        jobObject.dateApplied = currentDate;

        this.props.applyForJob(jobkey, jobObject);
    }

      
    /**
     * Renders the account information if the user is signed in, else prompts the user to sign in
     */
    render() {
        return (
            <div>
                {this.props.loggedIn 
                    ? this.renderAccount() 
                    : <h4 className="sign-in-to-view">Sign in to view your account details</h4>
                }
            </div>
        )
    }

    /**
     * Renders account page views
     * Allows the user to toggle between Application and Jobs sections
     */
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
                        application = {this.props.application}
                        /> 
                    : <JobsView 
                        jobsAppliedFor = {this.props.jobsAppliedFor} 
                        jobsSaved = {this.props.jobsSaved}
                        saveJob = {this.props.saveJob}
                        application = {this.props.application}
                        applyForJob = {this.props.applyForJob}
                    /> }                
            </div>
        )   
    }

    /**
     * Sets the state depending on the the view that the user has selected
     * @param {*} detailsToDisplay - The view that is passed on click
     */
    displayAccountDetails(detailsToDisplay){
        this.setState({
            accountDetailsToDisplay : detailsToDisplay
        })
    }
}

