import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Qs from 'qs';
import { 
    BrowserRouter as Router, 
    Route, Link } from 'react-router-dom';
import SlideOutInfo from './SlideOutInfo';
import SearchResult from './searchResult'



class App extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        locationToSearch : "toronto",
        currentPage : 0,
        currentSearchResults : {

        },
        resultsLoaded : true,
      }

      this.setLocationToSearch = this.setLocationToSearch.bind(this);
      this.searchForJobs = this.searchForJobs.bind(this);
      this.changePage = this.changePage.bind(this);
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
      this.setState({resultsLoaded : false},() => {axios.get("https://cors-anywhere.herokuapp.com/api.indeed.com/ads/apisearch",{
        params : {
          publisher: "2117056629901044",
          v: 2,
          format: "json",
          q: "Front End Web Developer",
          l: this.state.locationToSearch,
          co: "ca",

          start : this.state.currentPage*10;
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
      console.log(e.target.value);
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

    render() {
      return (
        <div>
          

          <input onChange = {this.setLocationToSearch} id = "location-input" type="text" name="" id=""/>
          <button onClick = {this.searchForJobs}>Search for jobs!</button>
          <div className="change-page-controls">
            <button onClick = {this.changePage} id = "page-last">Last</button>
            <button onClick = {this.changePage} id = "page-next">Next</button>
          </div>
          {this.state.resultsLoaded ? Object.values(this.state.currentSearchResults).map((job) => {
            return (
              <div key = {job.jobkey}>
                <SlideOutInfo data={job} />
                <SearchResult data={job}/>
              </div>
            )
          }): <h6>Retrieving Job Prospects...</h6>}       
        </div>
      )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
