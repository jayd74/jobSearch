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

/**
 * A Home Component. A Home component loads and displays search results to the page. 
 */
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

    
    /**
     * Apply for a job, given a event from a button.
     * @param {Event} e - The event that originates from the button pressed.
     */
    applyForJob(e){
      let jobkey = e.target.id;
      let jobObject = this.state.currentSearchResults[e.target.id];
      this.props.applyForJob(jobkey,jobObject);
    }

    /**
     * For a given job string, save a job to the database.
     * @param {String} k - The string key of the job to save.
     */
    saveJob(k){
      let jobkey = k;
      let jobObject;

      if(this.props.jobsAppliedFor[k]){
        jobObject = this.props.jobsAppliedFor[k];
      }

      else if(this.state.currentSearchResults[k]){
        jobObject = this.state.currentSearchResults[k];
      }

      this.props.saveJob(jobkey,jobObject);
    }

    /**
     * Make an axios request to the Indeed API. Load and display search results. 
     */
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
        let _currentResults = {};
        for(let i = 0; i < res.data.results.length; i++){
          _currentResults[res.data.results[i].jobkey] = res.data.results[i];
        }
        this.setState({
          currentSearchResults : _currentResults,
          resultsLoaded : true
        })
        document.querySelector('.search-result').scrollIntoView({
          behavior: 'smooth',
        })
      })});   
    }

    /**
     * Sets a new location for a job search.
     * @param {Event} e - Event that originates setting of new location.
     */
    setLocationToSearch(e){
      this.setState({
        locationToSearch : e.target.value
      })
    }

    /**
     * Changes the currently viewed page of search results for an originating event.
     * @param {Event} e - Event that originates the page change.
     */
    changePage(e){

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

    /**
     * For a given originating event with an id, display the details of a job.
     * @param {Event} e - Event with an id (jobkey).
     */
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

    /**
     * Hides the details modal for the currently selected job.
     */
    hideJobDetails(){
      this.setState({
        currentlySelectedJob : null
      })
    }

    /**
     * The render method for Home.
     */
    render() {
      return (
          <div>
            <div className="search-for-jobs">
              <h1>Hacked<span>In</span></h1>

              <input onKeyDown= {(e)=>{if(e.keyCode === 13) this.searchForJobs()}} onChange = {this.setLocationToSearch} id = "location-input" type="text" name="" id=""/>
              <button  onClick = {this.searchForJobs}>Search!</button>

            </div>

            <div className="wrapper">
            {Object.keys(this.state.currentSearchResults).length !== 0 ?
              <div className="change-page-controls">
                  <button className = "test" onClick = {this.changePage} id = "page-last">Previous Page</button>
                  <button onClick = {this.changePage} id = "page-next">Next Page</button>
              </div>
              :
              null
            }
            {this.state.resultsLoaded ? Object.values(this.state.currentSearchResults).map((job) => {
                return (
                 
                                   
                  <div key = {job.jobkey}>   
                    <SearchResult 
                      appliedFor = {Boolean(this.props.jobsAppliedFor[job.jobkey])} 
                      saved = {Boolean(this.props.jobsSaved[job.jobkey])}
                      onClick = {this.displayJobDetails} 
                      onSave = {this.saveJob} 
                      data={job}
                      changePage={this.changePage}/>
                  </div>
                )

            }): <h6 className="retrieving-jobs">Retrieving Job Prospects...</h6>}    
            {this.state.currentlySelectedJob
                ? <SlideOutInfo 
                    hideApplyButton = {Boolean(this.props.jobsAppliedFor[this.state.currentlySelectedJob.jobkey])}
                    onApply = {this.applyForJob} 
                    onSave = {this.saveJob} 
                    onClose = {this.hideJobDetails} 
                    data={this.state.currentlySelectedJob}
                    application = {this.props.application}
                    saved = {Boolean(this.props.jobsSaved[this.state.currentlySelectedJob.jobkey])}
                    loggedIn = {this.props.loggedIn}
                  /> 
                : null}  

            {Object.keys(this.state.currentSearchResults).length !== 0 ?
              <div className="change-page-controls">
                <button className="test" onClick={this.changePage} id="page-last">Previous Page</button>
                <button onClick={this.changePage} id="page-next">Next Page</button>
              </div>
              :
              null
            }
            </div> {/* end wrapper */}
            
          </div> // end main div
      );
    }
}



/**
 * The main App component.
 */
class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      user : null,
      userName: '',
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
  }

  /**
   * For a given jobkey and jobObject, apply for a job.
   * @param {String} jobkey - key value at which to store jobObject
   * @param {Object} jobObject - jobObject to store
   */
  applyForJob(jobkey,jobObject){  
    // get applied for jobs from state
    let appliedFor = this.state.jobsAppliedFor;
    // add jobObject to applied for jobs at given jobkey
    appliedFor[jobkey] = jobObject;
    // add application property to applied for job
    appliedFor[jobkey].jobApplication = this.state.userApplication;

    // add date applied property to applied for job
    let currentDate = new Date();
    currentDate = currentDate.toString();
    currentDate = currentDate.substring(0, 15); 
    appliedFor[jobkey].dateApplied = currentDate;

    let saved = this.state.jobsSaved;
    // if job applied for has already been saved, update fields for the saved job
    if(saved[jobkey]){
      saved[jobkey] = jobObject;
      saved[jobkey].jobApplication = this.state.userApplication;
      saved[jobkey].dateApplied = currentDate;
    }
    
    // update state
    this.setState({
      jobsAppliedFor : appliedFor,
      jobsSaved : saved
    });

    // update database
    if(this.state.loggedIn && this.state.user !== null){
      let dbRef = firebase.database().ref(`users/${this.state.user}/jobsAppliedFor`);
      dbRef.set(appliedFor);
      let dbRefB = firebase.database().ref(`users/${this.state.user}/jobsSaved`);
      dbRefB.set(saved);
    }
  }

  /**
   * For a given jobkey and jobObject, save a job.
   * @param {String} jobkey - key value at which to store jobObject
   * @param {Object} jobObject - jobObject to store
   */
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

  /**
   * Signs the user in.
   */
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

  /**
   * Signs the user out.
   */
  signOut() {
    firebase.auth().signOut().then(function (success) {
      console.log('Signed out!')
    }, function (error) {
      console.log(error);
    });
  }

  /**
   * Sets up database value change callback. Loads database data as initial application state.
   */
  componentDidMount(){
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          loggedIn: true,
          user: user.uid,
          userName: user.displayName
        })

        let dbRef = firebase.database().ref(`users/${this.state.user}`);

        dbRef.on('value', (data) => {
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
          jobsAppliedFor : {},
          jobsSaved : {},
          userApplication : {}
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

          <div className="wrapper clearfix">
            <div className="header-col1">
              <nav className = "clearfix">
                <ul className = "clearfix">
                  <li><Link to={`/`}>Home</Link></li>
                  <li><Link to={`/account/`}>Account</Link></li>
                </ul>
              </nav>            
            </div>
            <div className="header-col2">
              <div className="logo">
              <h2>Hacked<span>In</span></h2>
              </div>            
            </div>
            <div className="header-col3">
              <div className="sign-in-out">
                  <button 
                    className="sign-in" 
                    onClick = {this.state.loggedIn ? this.signOut : this.signIn}
                  >
                    {this.state.loggedIn ? <div><p>Sign Out {this.state.userName}</p></div> : <div><span className="google-span"><i className="fab fa-google"></i></span><span>Sign In</span></div>}
                </button>
              </div>            
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
