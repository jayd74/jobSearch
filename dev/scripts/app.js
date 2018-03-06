import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Qs from 'qs';
import { 
    BrowserRouter as Router, 
    Route, Link } from 'react-router-dom';
import SlideOutInfo from './SlideOutInfo';
import SearchResult from './searchResult';
import {Account} from './Account';
import JobsView from './jobsview';

var config = {
  apiKey: "AIzaSyApx_i3WVOsw9ZQLATIbmLAG_-J-OYYKA4",
  authDomain: "hyjobsearchapp.firebaseapp.com",
  databaseURL: "https://hyjobsearchapp.firebaseio.com",
  projectId: "hyjobsearchapp",
  storageBucket: "",
  messagingSenderId: "984509463838"
};
firebase.initializeApp(config);

class Home extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        locationToSearch : "toronto",
        currentPage : 0,
        currentSearchResults : {},
        resultsLoaded : true,
        currentlySelectedJob : null
      }


      this.setLocationToSearch = this.setLocationToSearch.bind(this);
      this.searchForJobs = this.searchForJobs.bind(this);
      this.changePage = this.changePage.bind(this);
      this.displayJobDetails = this.displayJobDetails.bind(this);
      this.hideJobDetails = this.hideJobDetails.bind(this);
      this.applyForJob = this.applyForJob.bind(this);
      this.saveJob = this.saveJob.bind(this);
    }

    

    applyForJob(e){
      // let currentDate = new Date();
      // currentDate = currentDate.toString();
      // currentDate = currentDate.substring(0, 15); 

      let jobkey = e.target.id;
      let jobObject = this.state.currentSearchResults[e.target.id];
      // jobObject.dateApplied = currentDate;
      
      this.props.applyForJob(jobkey,jobObject);
    }

    saveJob(k){
      console.log(k);
      let jobkey = k;
      let jobObject = this.state.currentSearchResults[k];
      this.props.saveJob(jobkey,jobObject);
    }

    searchForJobs(){
      this.setState({resultsLoaded : false, currentlySelectedJob : null},() => {axios.get("https://cors-anywhere.herokuapp.com/api.indeed.com/ads/apisearch",{
        params : {
          publisher: "2117056629901044",
          v: 2,
          format: "json",
          q: "Front End Web Developer",
          l: this.state.locationToSearch,
          co: "ca",

          start : this.state.currentPage*10,
          limit : 10
        }

      }).then((res) => {
        console.log(res);
        let _currentResults = {};
        for(let i = 0; i < res.data.results.length; i++){
          _currentResults[res.data.results[i].jobkey] = res.data.results[i];
        }
        this.setState({
          currentSearchResults : _currentResults,
          resultsLoaded : true
        })
      })});   
    }

    setLocationToSearch(e){
      this.setState({
        locationToSearch : e.target.value
      })
    }

    changePage(e){
      console.log(e.target.className);
      let _currentPage = this.state.currentPage;
      switch(e.target.id){  
        case "page-last" :
          if(this.state.currentPage !== 0){
            this.setState(
              {currentPage : _currentPage-1},() => {
            });
          }
        break;
        case "page-next" :
          this.setState(
            {currentPage : _currentPage+1},() => {
          });
        break;
      }
      this.searchForJobs();
    }

    displayJobDetails(e){
      // in case that there is a job in jobsAppliedFor of e.target.id, then set currently selection job 
      // to that job applied for
      if(this.props.jobsAppliedFor[e.target.id]){
        this.setState({
          currentlySelectedJob : this.props.jobsAppliedFor[e.target.id]
        })
      }
      // else, set currently selected job from list of search results
      else{
        this.setState({
          currentlySelectedJob : this.state.currentSearchResults[e.target.id]
        })
      }
    }

    hideJobDetails(){
      this.setState({
        currentlySelectedJob : null
      })
    }

    render() {
      return (
          <div>
            <div className="search-for-jobs">
              <h1>Hacked<span>In</span></h1>

              <input onKeyDown= {(e)=>{if(e.keyCode === 13) this.searchForJobs()}} onChange = {this.setLocationToSearch} id = "location-input" type="text" name="" id=""/>
              <button  onClick = {this.searchForJobs}>Search!</button>

            </div>

            <div className="wrapper">
              <div className="change-page-controls">
                  <button className = "test" onClick = {this.changePage} id = "page-last">Last</button>
                  <button onClick = {this.changePage} id = "page-next">Next</button>
              </div>
            {this.state.resultsLoaded ? Object.values(this.state.currentSearchResults).map((job) => {
              // if(this.state.jobsAppliedFor[job.jobkey]){
                return (
                  <div key = {job.jobkey}>                   
                    <SearchResult 
                      appliedFor = {Boolean(this.props.jobsAppliedFor[job.jobkey])} 
                      saved = {Boolean(this.props.jobsSaved[job.jobkey])}
                      onClick = {this.displayJobDetails} 
                      onSave = {this.saveJob} 
                      data={job}/>
                  </div>
                )
              // }
            }): <h6 className="retrieving-jobs">Retrieving Job Prospects...</h6>}    
            {this.state.currentlySelectedJob 
                ? <SlideOutInfo 
                    renderJobApplicationFile = {() => {this.props.renderJobApplicationFile(this.state.currentlySelectedJob)}}
                    hideApplyButton = {Boolean(this.props.jobsAppliedFor[this.state.currentlySelectedJob.jobkey])}
                    onApply = {this.applyForJob} 
                    onSave = {this.saveJob} 
                    onClose = {this.hideJobDetails} 
                    data={this.state.currentlySelectedJob}
                    application = {this.props.application}
                    saved = {Boolean(this.props.jobsSaved[this.state.currentlySelectedJob.jobkey])}
                  /> 
                : null}  
          
            </div> {/* end wrapper */}
          </div> // end main div
      );
    }
}




class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      user : null,
      loggedIn : false,
      jobsAppliedFor : {},
      jobsSaved : {},
      userApplication: {
          name: '',
          summary: '',
          experience: '',
          education: '',
          skills: '',
          interests: '',
          coverLetter: ''
      },
    }

    this.applyForJob = this.applyForJob.bind(this);
    this.saveJob = this.saveJob.bind(this);
    this.changeApplication = this.changeApplication.bind(this);
    this.renderJobApplicationFile = this.renderJobApplicationFile.bind(this);
  }

  renderJobApplicationFile(jobObject) {
    console.log(jobObject);
  }

  applyForJob(jobkey,jobObject){  
    let appliedFor = this.state.jobsAppliedFor;
    appliedFor[jobkey] = jobObject;
    appliedFor[jobkey].jobApplication = this.state.userApplication;

    let currentDate = new Date();
    currentDate = currentDate.toString();
    currentDate = currentDate.substring(0, 15); 
    appliedFor[jobkey].dateApplied = currentDate;

    let saved = this.state.jobsSaved;

    if(saved[jobkey]){
      saved[jobkey] = jobObject;
      saved[jobkey].jobApplication = this.state.userApplication;
      saved[jobkey].dateApplied = currentDate;
    }

    
    this.setState({
      jobsAppliedFor : appliedFor,
      jobsSaved : saved
    });

    if(this.state.loggedIn && this.state.user !== null){
      let dbRef = firebase.database().ref(`users/${this.state.user}/jobsAppliedFor`);
      dbRef.set(appliedFor);
      let dbRefB = firebase.database().ref(`users/${this.state.user}/jobsSaved`);
      dbRefB.set(saved);
    }
  }

  saveJob(jobkey, jobObject){
    // get currently saved jobs from state
    let _jobsSaved = this.state.jobsSaved;

    // if job has been saved, remove saved job
    if(_jobsSaved[jobkey]){
      delete _jobsSaved[jobkey];
    }
    // if job has not been saved, add job to saved jobs
    else{
      _jobsSaved[jobkey] = jobObject;
    }
    // set state
    this.setState({
      jobsSaved : _jobsSaved
    })

    if(this.state.loggedIn && this.state.user !== null){
      let dbRef = firebase.database().ref(`users/${this.state.user}/jobsSaved`);
      dbRef.set(_jobsSaved);
    }
  }

  signIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    firebase.auth().signInWithPopup(provider)
      .catch(function (error) {
        console.log(error)
      }).then((result)=>{
        console.log(result)
      })  
  }

  signOut() {
    firebase.auth().signOut().then(function (success) {
      console.log('Signed out!')
    }, function (error) {
      console.log(error);
    });
  }

  callMeBack(){
    console.log("baby");
  }

  componentDidMount(){
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          loggedIn: true,
          user: user.uid
        })

        let dbRef = firebase.database().ref(`users/${this.state.user}`);

        dbRef.on('value', (data) => {
          console.log(data.val());
          if(data.val().jobsAppliedFor){
            this.setState({
              jobsAppliedFor : data.val().jobsAppliedFor,
            })
          }
          if(data.val().jobsSaved){
            this.setState({
              jobsSaved : data.val().jobsSaved
            })
          }
          if(data.val().currentApplication) {
            this.setState({
              userApplication: data.val().currentApplication
            })
          }
        });
      }
      else {
        this.setState({
          loggedIn: false,
          user: null,
          jobsAppliedFor : {}
        })
      }
    })
  }

  changeApplication(newApplication){
    this.setState({
      userApplication : newApplication
    })
  }


  render(){
    return(
    <Router>
      <div>
        <header>

          <div className="wrapper">
            <nav>
              <ul>
                <li><Link to={`/`}>Home</Link></li>
                <li><Link to={`/account/`}>Account</Link></li>
              </ul>
            </nav>
            
            <div className="logo">
            <h2>Hacked<span>In</span></h2>
              {/* <img src="/images/noun_1036986_cc.svg" /> */}
            </div>
            
            <div className="sign-in-out">
                <button 
                  className="sign-in" 
                  onClick = {this.state.loggedIn ? this.signOut : this.signIn}
                >
                {this.state.loggedIn ? "Sign out" : "Sign in"}
              </button>
            </div>

          </div>
        </header>
        <Route 
          path = "/" 
          exact 
          render = {(props) => {
            return (
              <Home 
                {...props} 
                loggedIn = {this.state.loggedIn} 
                user = {this.state.user}
                applyForJob = {this.applyForJob} 
                saveJob = {this.saveJob}
                jobsAppliedFor = {this.state.jobsAppliedFor}
                jobsSaved = {this.state.jobsSaved}
                application = {this.state.userApplication}
                renderJobApplicationFile = {this.renderJobApplicationFile}
              />);
            }
          } 
        />
        <Route 
          path = "/account/" 
          exact 
          render = {(props) => {
            return (
              <Account 
                {...props} 
                loggedIn = {this.state.loggedIn} 
                user = {this.state.user} 
                jobsAppliedFor = {this.state.jobsAppliedFor}
                applyForJob = {this.applyForJob}
                jobsSaved = {this.state.jobsSaved}
                saveJob = {this.saveJob}
                application = {this.state.userApplication}
                changeApplication = {this.changeApplication}
              />);
            }
          } 
        />
      </div>

    </Router>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
