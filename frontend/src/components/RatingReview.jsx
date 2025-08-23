import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { postReview, getProductReviews } from "../api/api";

export default function RatingReview({ order }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (order.is_review) fetchReviews();
  }, [order]);

  const fetchReviews = async () => {
  try {
    const res = await getProductReviews(order.id); // pass order.id
    setReviews(res.data); // array of reviews
  } catch (err) {
    console.error(err);
  }
};

  const handleSubmit = async () => {
        if (!rating || !reviewText.trim()) {
            setErrorMessage("Please provide rating and review text.");
            return;
        }

        const data = {
            order: order.id,
            rating,
            review: reviewText,
        };

        try {
            await postReview(data);
            setSuccessMessage("Review submitted successfully!");
            setErrorMessage("");
            setReviewText("");
            setRating(5);

            // Refresh the page after successful submission
            window.location.reload();
            
        } catch (err) {
            console.error(err);
            setErrorMessage(err.response?.data?.detail || "Failed to submit review.");
            setSuccessMessage("");
        }
    };
    
    
    
    
    const ReviewCard = ({ rev }) => (
        <div className="flex justify-center">
            <div className="max-w-md w-full bg-white shadow-sm rounded-lg p-4 mb-4 border border-gray-200">
            {/* Product Name */}
            <h4 className="font-semibold text-base text-gray-800 mb-2">
                {rev.product_name}
            </h4>

            {/* Rating */}
            <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                <FaStar
                    key={i}
                    size={18}
                    color={i < rev.rating ? "#facc15" : "#d1d5db"}
                    className="mr-0.5"
                />
                ))}
                <span className="ml-2 text-sm text-gray-500">{rev.rating}/5</span>
            </div>

            {/* Review Text */}
            <p className="text-gray-700 text-sm leading-relaxed">{rev.review}</p>
            </div>
        </div>
    );


  return (
    <div className="mt-6">
        {order.is_review}
      {order.is_review ? (
        

        <div className="max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold mb-6 text-center">
                Your given Reviews
            </h3>

            {reviews.length === 0 ? (
                <p className="text-gray-500 text-center">No reviews found.</p>
            ) : (
                <div className="space-y-4">
                {reviews.map((rev) => (
                    <ReviewCard key={rev.id} rev={rev} />
                ))}
                </div>
            )}
        </div>

      ) : (

        <div className="max-w-lg mx-auto bg-white shadow-lg rounded-xl p-6 border border-gray-200">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Submit Your Review</h3>

            {/* Rating */}
            <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                <FaStar
                    key={i}
                    size={28}
                    className="cursor-pointer transition-transform transform hover:scale-110 mr-1"
                    color={i < rating ? "#facc15" : "#d1d5db"} // gold for active, gray for inactive
                    onClick={() => setRating(i + 1)}
                />
                ))}
                <span className="ml-3 text-gray-600 font-medium">{rating}/5</span>
            </div>

            {/* Review Textarea */}
            <textarea
                className="border border-gray-300 rounded-lg p-4 w-full mb-4 focus:ring-2 focus:ring-blue-400 focus:outline-none placeholder-gray-400 resize-none transition-all duration-200 hover:ring-blue-300"
                rows={5}
                placeholder="Share your experience..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
            />

            {/* Messages */}
            {successMessage && (
                <p className="text-green-600 mb-4 font-medium">{successMessage}</p>
            )}
            {errorMessage && (
                <p className="text-red-600 mb-4 font-medium">{errorMessage}</p>
            )}

            {/* Submit Button */}
            <button
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                onClick={handleSubmit}
            >
                Submit Review
            </button>
            </div>

        )}
    </div>
  );
}
