var MovieReviews = artifacts.require("./MovieReviews.sol");

module.exports = function(deployer) {
  deployer.deploy(MovieReviews);
};
