import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import App from './App';
import Explore from './Explore';
import Favorites from './Favorites';
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
    favoritePlaces: []
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

    this.setState({
			database: database
    })
    let favoriteSavedArray = database.ref('favoriteSavedFirebase');


		favoriteSavedArray.on('value', (response) => {
			let favoritesData = response.val();

			let favoritesArray = [];

			for (let item in favoritesData) {
				favoritesArray.push({
          key: item,
          item: favoritesData[item]
        });
				console.log(favoritesArray)
			}

			this.setState({
				favoritePlaces: favoritesArray
			})


		})
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
    this.state.database.ref('favoriteSavedFirebase').push({
      ...placeObject
    })
    console.log(this.state.favoritePlaces)
  }


  	delete = (key) => {
  		this.state.database.ref('favoriteSavedFirebase/' + key).remove();
      console.log(this.state.database)
  	};



  render() {
    console.log(this.state.data.response && this.state.favoritePlaces)

    return (
      <BrowserRouter>
        <Link to="/">Home</Link>
        <Link to="/explore">Explore</Link>
        <Link to="/favorites">Favorites</Link>

        <Route path="/" component={App} exact />
        <Route path="/explore" component={Explore} />
        <Route path="/favorites" component={Favorites} />

        <main className="container p-3">
          <h1 className="row justify-content-center">{this.state.websiteName}</h1>
          <form className="row justify-content-center" onSubmit={this.handleSubmit}>
            <input type="text" className="" value={this.state.inputValue} onChange={this.handleChange} />
            <button className="btn btn-primary">Where do you want to explore?</button>
          </form>
          <h2 className="row justify-content-center">Search Results</h2>


          <div className="row justify-content-center">
                {this.state.data.response && this.state.searchArray.map((place,index) => {
                  return (
                    <div className="card col-lg-4 p-2 m-1">
                         <p className="row justify-content-center title">{place.title}</p>
                         <img src="https://image.shutterstock.com/image-photo/rome-october-4-2012-tourists-260nw-147643949.jpg"/>
                         <p className="row justify-content-center location">{place.city}, {place.country}</p>
                         <button className="btn btn-danger" size="sm">Remove</button>
                         <button className="btn btn-success" size="sm" onClick={() => this.favoriteClick(place)}>Favorite this</button>
                     </div>
                  );
                })}
          </div>
          <h2 className="row justify-content-center">Favorites</h2>
          <div className="row justify-content-center">
                {this.state.data.response && this.state.favoritePlaces.map((place,index) => {
                  return (
                    <div className="card col-lg-4 p-2 m-1">
                         <p className="row justify-content-center title">{place.item.title}</p>
                         <img src="https://image.shutterstock.com/image-photo/rome-october-4-2012-tourists-260nw-147643949.jpg"/>
                         <p className="row justify-content-center location">{place.item.city}, {place.item.country}</p>
                         <button className="btn btn-danger" size="sm" onClick={(e) => this.delete(place.key)}>Remove</button>
                     </div>
                  );
                })}
          </div>



        </main>

      </BrowserRouter>



    )

  }
}
