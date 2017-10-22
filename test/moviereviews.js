var MovieReviews = artifacts.require("./MovieReviews.sol");

contract('MovieReviews', function(accounts) {

  it("...should return the value 0.", function() {
    return MovieReviews.deployed().then(function(instance) {
      movieReviewsInstance = instance;

      return movieReviewsInstance.getReviewCount.call();
    }).then(function(numberOfReviews) {
      assert.equal(numberOfReviews, 0, "The number of reviews was not 0.");
    });
  });

});
