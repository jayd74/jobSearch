import React from 'react';
import ReactDOM from 'react-dom';
import SearchResult from './searchResult';
import SlideOutInfo from './SlideOutInfo';

/**
 * Component for the "My Jobs" section of the app. Displays both Saved and Applied jobs
 */
class JobsView extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            jobApplicationView: "savedJobs",
            currentlySelectedJob : null
        }   
        this.showApplied = this.showApplied.bind(this);
        this.showSaved = this.showSaved.bind(this);
        this.renderJobsAppliedFor = this.renderJobsAppliedFor.bind(this);
        this.showJobDetails = this.showJobDetails.bind(this);
        this.renderJobDetails = this.renderJobDetails.bind(this);
        this.hideJobDetails = this.hideJobDetails.bind(this);
        this.renderJobsSaved = this.renderJobsSaved.bind(this);
        this.removeSaveJob = this.removeSaveJob.bind(this);
        this.applyForJob = this.applyForJob.bind(this);
    }
    /**
     *  Method set the view to show the jobs applied for
     */
    showApplied () {
        this.setState({
            jobApplicationView: "appliedJobs"
        }) 
    }
    /** 
     * Method set to view to show the jobs saved
    */
    showSaved () {
        this.setState ({
            jobApplicationView: "savedJobs"
        })
    }

    /**
     * method to remove a saved job. only called if there is a job saved.
     * @param {string} k - these are the jobkeys of each job posting from the API to target the specific listing. 
     */
    removeSaveJob(k){
        let jobkey = k;
        let jobObject = this.props.jobsSaved[k];
        this.props.saveJob(jobkey,jobObject);
        this.hideJobDetails();
    }
    /**
     * // method to set the view of Saved Jobs and Applied Jobs
     * @param {event} e - event to listen for which event is being targeted
     */
    showJobDetails(e){
        switch(this.state.jobApplicationView){
            case "savedJobs" :
                this.setState({
                    currentlySelectedJob: this.props.jobsSaved[e.target.id]
                })
            break;

            case "appliedJobs" :
                this.setState({
                    currentlySelectedJob: this.props.jobsAppliedFor[e.target.id]
                })
            break;
        }      
    }
    /** 
     * Method to hide the job details when the "X" is clicked. The metod sets currentlySelectedJob to null to close job details.
    */
    hideJobDetails() {
        this.setState({
            currentlySelectedJob: null
        })
    }
    /**
     * Method to render the My Jobs section onto the page. the page renders either "Jobs Applied" or "Jobs Saved" based on the user's selection
     */
    renderJobDetails() {
        switch(this.state.jobApplicationView){
            case "appliedJobs" :
                return <SlideOutInfo 
                    data={this.state.currentlySelectedJob} 
                    hideApplyButton = {true} 
                    hideSaveButton = {true} 
                    onClose={this.hideJobDetails} 
                    application={this.props.application} 
                    />
            break;

            case "savedJobs" :
                return <SlideOutInfo 
                    hideApplyButton={Boolean(this.props.jobsAppliedFor[this.state.currentlySelectedJob.jobkey])}
                    saved = {true} 
                    onSave = {this.removeSaveJob} 
                    data={this.state.currentlySelectedJob} 
                    onClose={this.hideJobDetails} 
                    application={this.props.application} 
                    onApply = {this.applyForJob} 
                    />
            break;

        }
    }

    /**
     * // passes the jobkey and jobObject that it recieves from the event.
     * @param {Event} e - onClick event for Apply Button
     */
    applyForJob(e){
        let jobkey = e.target.id;
        let jobObject = this.props.jobsSaved[e.target.id];       
        this.props.applyForJob(jobkey,jobObject);
    }

    /** 
     * Method that renders the jobs Applied. It maps the items in jobsAppliedFor then it returns those results onto the page.
    */
    renderJobsAppliedFor(){
        return (
            <div className="wrapper jobs-view">
                {Object.values(this.props.jobsAppliedFor).map((item)=>{
                    return (
                        <div>
                        <SearchResult data={item} onClick={this.showJobDetails}/>
                    </div>
                    )
                })}
                {this.state.currentlySelectedJob ? this.renderJobDetails(): null}
            </div>
        )
    }

    /** 
     * Method that renders Jobs Saved. maps through the items of jobsSaved and returns results onto the page. 
    */
    renderJobsSaved(){
        return (
            <div className="wrapper">
                {Object.values(this.props.jobsSaved).map((item)=>{
                    return (
                        <div>
                        <SearchResult data={item} onClick={this.showJobDetails}/>
                    </div>
                    )
                })}
                {this.state.currentlySelectedJob ? this.renderJobDetails(): null}
            </div>
            
        )
    }
    /**
     * Method to render the both jobsSaved and jobsApplied onto the page. There is a ternerary operator that toggles between the jobsSaved and jobsApplied view.
     */
    render(){
        return (
            <div>
                <div className="jobs-saved-applied-btn"> 
                    <button className = {this.state.jobApplicationView === "savedJobs" ? "jobs-view-button-toggled" : null} onClick={this.showSaved}>Jobs Saved</button>
                    <button className = {this.state.jobApplicationView !== "savedJobs" ? "jobs-view-button-toggled" : null} onClick={this.showApplied}>Jobs Applied</button>
                </div>
                    {/* ternerary operator to toggle between jobsSaved and jobsApplied */}
                    {this.state.jobApplicationView === "appliedJobs" ?
                        this.renderJobsAppliedFor()
                        :
                        this.renderJobsSaved()
                    }
            </div>
        );
    }
}

export default JobsView;