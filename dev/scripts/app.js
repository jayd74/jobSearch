import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Qs from 'qs';
import { 
    BrowserRouter as Router, 
    Route, Link } from 'react-router-dom';


class App extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        locationToSearch : "toronto",
        currentPage : 0,
        currentSearchResults : {

        }
      }

      this.setLocationToSearch = this.setLocationToSearch.bind(this);
      this.searchForJobs = this.searchForJobs.bind(this);
    }

    componentDidMount(){
      // console.log(this.state.locationToSearch);
      // axios.get("https://cors-anywhere.herokuapp.com/api.indeed.com/ads/apigetjobs",{
      //   params : {
      //     publisher: "2117056629901044",
      //     v: 2,
      //     format: "json",
      //     jobkeys: "e6ad19e9c5eaf165",
      //     l: this.state.locationToSearch,
      //     co: "ca",
      //     start : this.state.currentPage,
      //     limit : 10
      //   }

      // }).then((res) => {
      //   console.log(res);
      // })
    }

    searchForJobs(){
      axios.get("https://cors-anywhere.herokuapp.com/api.indeed.com/ads/apisearch",{
        params : {
          publisher: "2117056629901044",
          v: 2,
          format: "json",
          q: "Front End Web Developer",
          l: this.state.locationToSearch,
          // co: "ca",
          start : this.state.currentPage,
          limit : 10
        }

      }).then((res) => {
        console.log(res.data.results);
        let _currentResults = {};
        for(let i = 0; i < res.data.results.length; i++){
          _currentResults[res.data.results[i].jobkey] = res.data.results[i];
        }
        this.setState({
          currentSearchResults : _currentResults
        })
      })      
    }

    setLocationToSearch(e){
      console.log(e.target.value);
      this.setState({
        locationToSearch : e.target.value
      })
    }

    render() {
      return (
        <div>
          <input onChange = {this.setLocationToSearch} id = "location-input" type="text" name="" id=""/>
          <button onClick = {this.searchForJobs}>Search for jobs!</button>
          {Object.values(this.state.currentSearchResults).map((job) => {
            return (
              <div key = {job.jobkey}>
                <h3 >{job.jobtitle}</h3>
                <p dangerouslySetInnerHTML = {{__html : job.snippet}}></p> 
              </div>
            )
          })}
        </div>
      )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
