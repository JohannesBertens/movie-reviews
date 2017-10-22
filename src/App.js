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
      reviews: new Map()
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
      reviews[res[4]] = [res[0], res[1].c[0], res[2], res[3]];
      this.setState({ reviews: reviews });
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
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">Movie Reviews!</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Welcome to Smart Movie Reviews</h1>
              <form onSubmit={this.addReviewFromSubmit}>
                <label htmlFor="rating">Rating (between 1 and 10):</label>
                <input id="rating" name="formRating" min="1" max="10" onChange={this.handleInputChange}></input><br />
                <label htmlFor="imdbTag">IMDB Tag:</label>
                <input id="imdbTag" name="formImdbTag" onChange={this.handleInputChange}></input><br />
                <label htmlFor="review">Review:</label>
                <textarea id="review" name="formReview" onChange={this.handleInputChange}></textarea><br />
                <input id="submit" type="submit" value="Add Review"></input>
              </form>
              {this.state.reviewCount === 0 &&
                <p>No reviews available yet!</p>
              }
              {this.state.reviewCount === 1 &&
                <p>One review available:</p>
              }
              {this.state.reviewCount > 1 &&
                <p>{this.state.reviewCount.toString()} reviews available:</p>
              }
              <ul>
                {Object.keys(this.state.reviews).map((key) => {
                  return <li key={key}>
                    <p>Author: {this.state.reviews[key][0]}, rating: {this.state.reviews[key][1]}, imdb Tag: {this.state.reviews[key][3]}</p>
                    <p>{this.state.reviews[key][2]}</p>
                  </li>
                })
                }
              </ul>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
