import React, { Component } from 'react'
import MovieReviewsContract from '../build/contracts/MovieReviews.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      reviewCount: 0,
      web3: null,
      instance: null,
      reviews: new Map(),
      movieDBkey: "9d15b8de0087f7fee6f70840777414d6"
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.addReviewFromSubmit = this.addReviewFromSubmit.bind(this);
  }

  componentWillMount() {
    // See utils/getWeb3 for more info.
    getWeb3.then(results => {
      this.setState({ web3: results.web3 });
      this.instantiateContract(() => this.getReviews());
    });
  }

  addReviewFromSubmit(e) {
    e.preventDefault();
    this.addReview(this.state.formRating, this.state.formImdbTag, this.state.formReview);
    this.getReviews();
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  addReview(rating, imdbTag, review) {
    console.log(this.state.account);
    this.state.instance.addReview(parseInt(rating, 10), imdbTag, review, { gas: 2000000, from: this.state.account }).then((res) => {
      console.log('Added review.');
    });
  }

  getReviews() {
    this.getReviewCount((count) => {
      for (let i = 0; i < count; i++) {
        this.getReviewDetails(i);
      }
    });
  }

  getReviewDetails(index) {
    this.state.instance.getReview(index).then((res) => {
      // console.log('Details for ' + index + ' are: ' + res[0] + ', ' + res[1].c[0] + ', ' + res[2] + ', ' + res[3] + ', ' + res[4]);
      let reviews = this.state.reviews;
      fetch("https://api.themoviedb.org/3/find/" + res[3] + "?api_key=" + this.state.movieDBkey + "&language=en-US&external_source=imdb_id").then(results => {
        return results.json();
      }).then(data => {
        if (data.movie_results.length > 0) {
          console.log(data.movie_results[0]);
          console.log(data.movie_results[0].title);
          console.log(data.movie_results[0].poster_path);
          reviews[res[4]] = [res[0], res[1].c[0], res[2], res[3], data.movie_results[0].title, data.movie_results[0].backdrop_path];
        } else {
          reviews[res[4]] = [res[0], res[1].c[0], res[2], res[3], "Unknown", "not found"];
        }
        this.setState({ reviews: reviews });
      });
    })
  }

  getReviewCount(callback) {
    console.log('Getting review count...');
    if (this.state.instance !== null) {
      this.state.instance.getReviewCount().then((count) => {
        console.log('Count is ' + count);
        this.setState({ reviewCount: parseInt(count, 10) });
        callback(count);
      })
    } else {
      console.log('Instance is null');
      callback(0);
    }
  }

  instantiateContract(callback) {
    const contract = require('truffle-contract')
    const movieReviews = contract(MovieReviewsContract)
    movieReviews.setProvider(this.state.web3.currentProvider)

    this.state.web3.eth.getAccounts((error, accounts) => {
      if (error) {
        console.log(error);
      } else {
        movieReviews.deployed().then((instance) => {
          this.setState({ instance: instance, account: accounts[0] });
          callback();
        });
      }
    })
  }

  render() {
    return (
      <div className="App" id="wrapper">
        <section id="intro" className="wrapper featured style1">
          <div className="inner">
            <span className="image"><img src="images/pic01.jpg" alt="" /></span>
            <div className="content">
              <header>
                <h1>Smart Movie Reviews</h1>
                <p>The best place to check reviews.<br />
                  Backed by an Ethereum smart contract,<br />
                  so you know they can be trusted! ;-)</p>
              </header>
            </div>
          </div>
        </section>

        <section className="wrapper style2 special">
          <div className="inner">
            <header>
              <h2>Current Reviews</h2>
              {this.state.reviewCount === 0 &&
                <p>No reviews available yet!</p>
              }
              {this.state.reviewCount === 1 &&
                <p>One review available:</p>
              }
              {this.state.reviewCount > 1 &&
                <p>{this.state.reviewCount.toString()} reviews available:</p>
              }
            </header>
            {Object.keys(this.state.reviews).map((key) => {
              return <section className="spotlight" key={key}>
                <span className="image"><img src={"https://image.tmdb.org/t/p/w500/" + this.state.reviews[key][5]} alt="" /></span>
                <div className="content">
                  <header>
                    <h3>{this.state.reviews[key][4]}</h3>
                  </header>
                  <p>Rating: {this.state.reviews[key][1]}, IMDB Tag: {this.state.reviews[key][3]} <br />
                    Author: {this.state.reviews[key][0]},
                  </p>
                  <p>{this.state.reviews[key][2]}</p>
                </div>
              </section>
            })
            }
          </div>
        </section>

        <section className="wrapper style1 special">
          <div className="inner">
            <header>
              <h2>Add your own review:</h2>
              <p>Additional costs to interact with the contract can apply.</p>
            </header>
            <form onSubmit={this.addReviewFromSubmit}>
              <div className="field half first"><input type="text" name="formRating" id="formRating" placeholder="IMDB Tag" onChange={this.handleInputChange} /></div>
              <div className="field half"><input type="text" name="formRating" id="formRating" placeholder="Rating" onChange={this.handleInputChange} /></div>
              <div className="field"><textarea name="formReview" id="formReview" placeholder="Review" rows="4" onChange={this.handleInputChange}></textarea></div>
              <ul className="actions">
                <li><input type="submit" value="Add Review" /></li>
              </ul>
            </form>
          </div>
        </section>

        <section id="footer" className="wrapper split style2">
          <div className="copyright">
            <p>&copy; Smart Movie Reviews. All rights reserved. Images from <a href="https://www.themoviedb.org/" target="_blank">The Movie Database</a> &amp; <a href="http://www.unsplash.com" target="_blank">Unsplash</a>.</p>
          </div>
        </section>
      </div>
    );
  }
}

export default App
