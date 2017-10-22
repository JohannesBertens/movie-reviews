pragma solidity ^0.4.2;

contract MovieReviews {
    // Review represents a single review.
    struct Review {
        uint reviewId;      // unique ID of the review
        address author;     // address of author
        uint rating;        // rating given to movie
        string review;      // the actual review
        string imdbTag;     // imdb movie
    }

    // Public available list of reviews
    Review[] public reviews;

    function addReview(uint rating, string imdbTag, string review) payable {
        reviews.push(Review({
            reviewId: reviews.length, 
            author: msg.sender, 
            rating: rating, 
            review: review, 
            imdbTag: imdbTag
        }));
    }

    function getReviewCount() public constant returns(uint) {
        return reviews.length;
    }

    function getReview(uint index) public constant returns(address, uint, string, string, uint) {
        return (reviews[index].author, reviews[index].rating, reviews[index].review, reviews[index].imdbTag, reviews[index].reviewId);
    }
}