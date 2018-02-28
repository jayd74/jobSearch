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
        currentSearchResults : {

        },
        resultsLoaded : true,
        currentlySelectedJob : null,
        loggedIn: false,
        user: null
      }

      this.setLocationToSearch = this.setLocationToSearch.bind(this);
      this.searchForJobs = this.searchForJobs.bind(this);
      this.changePage = this.changePage.bind(this);
      this.displayJobDetails = this.displayJobDetails.bind(this);
      this.hideJobDetails = this.hideJobDetails.bind(this);
      this.signIn = this.signIn.bind(this);
      this.signOut = this.signOut.bind(this);
    }

    componentDidMount(){
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.setState({
            loggedIn: true,
            user: user.uid
          })
        }
        else {
          this.setState({
            loggedIn: false,
            user: null
          })
        }
      })
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
          
          <input onKeyDown= {(e)=>{if(e.keyCode === 13) this.searchForJobs()}} onChange = {this.setLocationToSearch} id = "location-input" type="text" name="" id=""/>
          <button  onClick = {this.searchForJobs}>Search for jobs!</button>

          <button onClick = {this.signIn}>Sign in</button>
          <button onClick={this.signOut}>Sign out</button>

          <div className="change-page-controls">
            <button onClick = {this.changePage} id = "page-last">Last</button>
            <button onClick = {this.changePage} id = "page-next">Next</button>
          </div>
          {this.state.resultsLoaded ? Object.values(this.state.currentSearchResults).map((job) => {
            return (
              <div key = {job.jobkey}>
                
                <SearchResult onClick = {this.displayJobDetails} data={job}/>
              </div>
            )
          }): <h6>Retrieving Job Prospects...</h6>}    
          {this.state.currentlySelectedJob ? <SlideOutInfo onClose = {this.hideJobDetails} data={this.state.currentlySelectedJob} /> : null}  
        </div>
      )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
