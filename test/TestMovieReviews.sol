pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/MovieReviews.sol";

contract TestMovieReviews {

  function testItReturnsZero() {
    MovieReviews movieReviews = MovieReviews(DeployedAddresses.MovieReviews());

    movieReviews.getReviewCount();

    uint expected = 0;

    Assert.equal(movieReviews.getReviewCount(), expected, "It should return the value 0.");
  }

  function testItReturnsOne() {
    MovieReviews movieReviews = MovieReviews(DeployedAddresses.MovieReviews());

    movieReviews.addReview(1,"2","3");

    uint expected = 1;

    Assert.equal(movieReviews.getReviewCount(), expected, "It should return the value 1.");
  }

}
