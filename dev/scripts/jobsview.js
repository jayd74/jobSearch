import React from 'react';
import ReactDOM from 'react-dom';
import SearchResult from './searchResult';
import SlideOutInfo from './SlideOutInfo';


class JobsView extends React.Component{
    constructor(props){
        super(props);
        console.log(this.props.jobsAppliedFor);

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
    showApplied () {
        this.setState({
            jobApplicationView: "appliedJobs"
        }) 
    }
    showSaved () {
        this.setState ({
            jobApplicationView: "savedJobs"
        })
    }

    removeSaveJob(k){
        // the only time this method is ever called is when a job is being removed from save jobs
        console.log(k);
        let jobkey = k;
        let jobObject = this.props.jobsSaved[k];
        this.props.saveJob(jobkey,jobObject);
        this.hideJobDetails();
    }

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

    hideJobDetails() {
        this.setState({
            currentlySelectedJob: null
        })
    }


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

    applyForJob(e){
        console.log(e.target.id);
        console.log(this.props.applyForJob);
        let jobkey = e.target.id;
        let jobObject = this.props.jobsSaved[e.target.id];       
        this.props.applyForJob(jobkey,jobObject);
    }

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

    render(){
        return (
            <div>
                <div className="jobs-saved-applied-btn"> 
                    <button className = {this.state.jobApplicationView === "savedJobs" ? "jobs-view-button-toggled" : null} onClick={this.showSaved}>Jobs Saved</button>
                    <button className = {this.state.jobApplicationView !== "savedJobs" ? "jobs-view-button-toggled" : null} onClick={this.showApplied}>Jobs Applied</button>
                </div>
                    
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