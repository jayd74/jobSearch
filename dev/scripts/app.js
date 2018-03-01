import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Qs from 'qs';
import { 
    BrowserRouter as Router, 
    Route, Link } from 'react-router-dom';
import SlideOutInfo from './SlideOutInfo';
import SearchResult from './searchResult'

var config = {
  apiKey: "AIzaSyApx_i3WVOsw9ZQLATIbmLAG_-J-OYYKA4",
  authDomain: "hyjobsearchapp.firebaseapp.com",
  databaseURL: "https://hyjobsearchapp.firebaseio.com",
  projectId: "hyjobsearchapp",
  storageBucket: "",
  messagingSenderId: "984509463838"
};
firebase.initializeApp(config);

class App extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        locationToSearch : "toronto",
        currentPage : 0,
        currentSearchResults : {},
        resultsLoaded : true,
        currentlySelectedJob : null,
        loggedIn: false,
        user: null,
        jobsAppliedFor : {}
      }

      this.setLocationToSearch = this.setLocationToSearch.bind(this);
      this.searchForJobs = this.searchForJobs.bind(this);
      this.changePage = this.changePage.bind(this);
      this.displayJobDetails = this.displayJobDetails.bind(this);
      this.hideJobDetails = this.hideJobDetails.bind(this);
      this.signIn = this.signIn.bind(this);
      this.signOut = this.signOut.bind(this);
      this.applyForJob = this.applyForJob.bind(this);
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
            this.setState({
              jobsAppliedFor : data.val().jobsAppliedFor
            })
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

    applyForJob(e){
      
      let appliedFor = this.state.jobsAppliedFor;
      appliedFor[e.target.id] = this.state.currentSearchResults[e.target.id];
      this.setState({
        jobsAppliedFor : appliedFor
      });

      if(this.state.loggedIn && this.state.user !== null){
        let dbRef = firebase.database().ref(`users/${this.state.user}/jobsAppliedFor`);
        dbRef.set(appliedFor);
      }
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
      this.setState({
        currentlySelectedJob : this.state.currentSearchResults[e.target.id]
      })
    }

    hideJobDetails(){
      this.setState({
        currentlySelectedJob : null
      })
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

    render() {
      return (
        <div>
          <div className="wrapper">
          

          <div className="search-for-jobs">

            <input onKeyDown= {(e)=>{if(e.keyCode === 13) this.searchForJobs()}} onChange = {this.setLocationToSearch} id = "location-input" type="text" name="" id=""/>
            <button  onClick = {this.searchForJobs}>Search for jobs!</button>

            <button onClick = {this.state.loggedIn ? this.signOut : this.signIn}>
              {this.state.loggedIn ? "Sign out" : "Sign in"}
            </button>
            {/* <button onClick={this.signOut}>Sign out</button> */}

            <div className="change-page-controls">
              <button onClick = {this.changePage} id = "page-last">Last</button>
              <button onClick = {this.changePage} id = "page-next">Next</button>
            </div>

          </div>


          {this.state.resultsLoaded ? Object.values(this.state.currentSearchResults).map((job) => {
            // if(this.state.jobsAppliedFor[job.jobkey]){
              return (
                <div key = {job.jobkey}>
                  
                  <SearchResult appliedFor = {Boolean(this.state.jobsAppliedFor[job.jobkey])} onClick = {this.displayJobDetails} data={job}/>
                </div>
              )
            // }
          }): <h6>Retrieving Job Prospects...</h6>}    
          {this.state.currentlySelectedJob ? <SlideOutInfo onApply = {this.applyForJob} onClose = {this.hideJobDetails} data={this.state.currentlySelectedJob} /> : null}  
         
          </div> {/* end wrapper */}
        </div> // end main div
      )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
