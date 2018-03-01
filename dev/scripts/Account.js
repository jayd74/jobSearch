import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';

class ApplicationDetails extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
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
}

class Account extends React.Component {
    constructor(props) {
        super();
        this.state = {
            application: {
                name: '',
                summary: '',
                experience: '',
                education: '',
                skills: '',
                interests: '',
                coverLetter: ''
            }
        }
        this.setApplicationDetails = this.setApplicationDetails.bind(this);
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
    }

    render() {
        return (
            <ApplicationDetails data={this.state} setApplicationDetails={this.setApplicationDetails} saveApplicationChanges={this.saveApplicationChanges} />
        )
    }   
}

export default Account;