import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import App from './App';
import About from './About';
import Contact from './Contact';
import firebase from 'firebase';
// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
// import * as firebase from "firebase/app";

// Add the Firebase services that you want to use
// import "firebase/auth";
// import "firebase/firestore";
// import BlogPost from './BlogPost';
// import { stripWhateSpace, generateKey } from './utils/helper';



export default class Router extends React.Component {

  state = {
    websiteName: 'EXPLORICA',
		data: [],
    inputValue: '',
    searchArray: [],
    favoriteArray: []
	};

  componentDidMount() {
    var firebaseConfig = {
      apiKey: "AIzaSyAHLHnY7aoCPC2Sjl7fEhhstbm3ps52-T4",
      authDomain: "jsr-709-sam.firebaseapp.com",
      databaseURL: "https://jsr-709-sam.firebaseio.com",
      projectId: "jsr-709-sam",
      storageBucket: "",
      messagingSenderId: "1061331343323",
      appId: "1:1061331343323:web:81504f2ae8488ee7"
  };
    firebase.initializeApp(firebaseConfig);
		let database = firebase.database();
    let favoriteSavedArray = database.ref('favoriteSavedFirebase');

		this.setState({
			favoriteSavedArray: favoriteSavedArray
		});
	}



  makeRequest = () => {
    let allCities = [];
    let actualData = [];
    const place = this.state.inputValue;
    const url = `https://api.foursquare.com/v2/venues/explore?categoryId=4deefb944765f83613cdba6e&client_id=JDFOE0O0TWPFCHRHQAHMUKIUQJT32XANBRVKV0Q5KTDZM2FY&client_secret=NLBE1S1XICQWIUNIHBDXMWVM2N4NXAXQ1N5EMXTNLVRZMBPE&v=20180323&limit=8&venuePhotos=1&near=${place}`;
      fetch(url).then((response) => {
        return response.json();
      }).then((data) => {
        this.setState({
          data: data
        })
        allCities = data.response.groups[0].items;

        for ( let key of allCities) {
            let searchData = {
              title: key.venue.name,
              city: key.venue.location.city,
              country: key.venue.location.country
            }
            actualData.push(searchData);
            };
            console.log(actualData)
        this.setState({
          searchArray: actualData
        })
      })
  };

  handleChange = (e) => {
        this.setState({
            inputValue: e.target.value
        })
  }

  handleSubmit = (e) => {
        e.preventDefault();
        this.makeRequest();
  }

  favoriteClick = (placeObject) => {
    this.state.favoriteSavedArray.push({
      ...placeObject
    })

    console.log(this.state.favoriteSavedArray)

  }


  render() {
    console.log(this.state.data.response && this.state.searchArray)
    return (
      <BrowserRouter>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>

        <Route path="/" component={App} exact />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <main className="container p-3">
          <h1 className="row justify-content-center">{this.state.websiteName}</h1>
          <form className="row justify-content-center" onSubmit={this.handleSubmit}>
            <input type="text" className="" value={this.state.inputValue} onChange={this.handleChange} />
            <button className="btn btn-primary">Where do you want to explore?</button>
          </form>
          <div className="row justify-content-center">
                {this.state.data.response && this.state.searchArray.map((place,index) => {
                  return (
                    <div className="card col-lg-4 p-2 m-1">
                         <h2 className="row justify-content-center">{place.title}</h2>
                         <img src="https://image.shutterstock.com/image-photo/rome-october-4-2012-tourists-260nw-147643949.jpg"/>
                         <h3 className="row justify-content-center">{place.city}, {place.country}</h3>
                         <button className="btn btn-danger" size="sm">Remove</button>
                         <button className="btn btn-success" size="sm" onClick={() => this.favoriteClick(place)}>Favorite this</button>
                     </div>
                  );
                })}
          </div>
        </main>

      </BrowserRouter>



    )

  }
}
