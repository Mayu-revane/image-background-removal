import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { testimonials } from "../assets/assets";

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [allFeedbacks, setAllFeedbacks] = useState([]); // ✅ CHANGED: All public feedbacks
  const [userFeedbacks, setUserFeedbacks] = useState([]); // User's own feedbacks
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);

  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();

  // ✅ UPDATED: Fetch ALL public feedbacks (shows username)
  const fetchAllFeedbacks = async () => {
    setLoadingFeedbacks(true);
    try {
      const response = await fetch("http://localhost:8080/api/feedback"); // Public endpoint
      
      if (response.ok) {
        const feedbacks = await response.json();
        setAllFeedbacks(feedbacks); // ✅ Now contains username instead of clerkUserId
        
        // Filter user's own feedbacks
        if (isSignedIn && user?.id) {
          const myFeedbacks = feedbacks.filter(f => f.clerkUserId === user.id);
          setUserFeedbacks(myFeedbacks);
        }
      }
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    } finally {
      setLoadingFeedbacks(false);
    }
  };

  // Fetch feedbacks when component mounts or user signs in
  useEffect(() => {
    fetchAllFeedbacks();
  }, [isSignedIn]);

  // Refetch after successful submission
  const submitFeedback = async () => {
    if (!feedback.trim() || rating === 0) {
      alert("Please add rating and feedback!");
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      
      const response = await fetch("http://localhost:8080/api/feedback", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: feedback,
          rating: rating,
        }),
      });

      if (response.ok) {
        setMessage("Feedback submitted successfully! 🎉");
        setFeedback("");
        setRating(0);
        setTimeout(() => setMessage(""), 2000);
        
        // ✅ Refetch to show new feedback
        fetchAllFeedbacks();
      } else {
        throw new Error("Failed to submit feedback");
      }
    } catch (error) {
      console.error("Feedback error:", error);
      setMessage("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  const t = testimonials[current];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
        They love us. You will too.
      </h2>

      {/* ✅ NEW: Public Testimonials Section */}
      {allFeedbacks.length > 0 && (
        <div className="max-w-4xl mx-auto mb-16">
          <h3 className="text-2xl font-semibold mb-8 text-center text-gray-900">
            What Our Users Say
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allFeedbacks.slice(0, 6).map((fb) => ( // Show latest 6
              <div key={fb.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center mb-4">
                  {/* ✅ Shows username from backend */}
                  <h4 className="font-semibold text-gray-900 text-lg">{fb.username}</h4>
                </div>
                <div className="flex justify-center mb-4">
                  {[...Array(fb.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4">"{fb.comment}"</p>
                <p className="text-sm text-gray-500">
                  {new Date(fb.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Testimonial Card */}
      <div className="relative max-w-xl mx-auto mb-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            {[...Array(t.rating || 5)].map((_, i) => (
              <span key={i} className="text-yellow-400 text-xl">★</span>
            ))}
          </div>
          <p className="text-gray-700 mb-6">"{t.quote}"</p>
          <p className="font-semibold text-gray-900">{t.author}</p>
          <p className="text-gray-500 text-sm">{t.handle}</p>
        </div>

        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl text-gray-400 hover:text-black"
        >
          ‹
        </button>
        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-3xl text-gray-400 hover:text-black"
        >
          ›
        </button>
      </div>

      {/* Your Feedbacks Section (Only When Signed In) */}
      {isSignedIn && userFeedbacks.length > 0 && (
        <div className="max-w-xl mx-auto mb-12">
          <h3 className="text-2xl font-semibold mb-6 text-center text-gray-900">
            Your Feedbacks
          </h3>
          <div className="space-y-4">
            {userFeedbacks.slice(0, 3).map((fb) => (
              <div key={fb.id} className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                <div className="flex justify-center mb-3">
                  {[...Array(fb.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-800 italic">"{fb.comment}"</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(fb.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feedback Form (Only When Signed In) */}
      {isSignedIn && (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Give your feedback
          </h3>

          {message && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {message}
            </div>
          )}

          {/* Star Rating */}
          <div className="flex justify-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                className={`cursor-pointer text-3xl mx-1 transition-colors ${
                  star <= rating ? "text-yellow-400" : "text-gray-300 hover:text-yellow-400"
                }`}
              >
                ★
              </span>
            ))}
          </div>

          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Write your feedback here..."
            className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-black resize-vertical"
            rows={4}
          />

          <button 
            onClick={submitFeedback}
            disabled={loading || !feedback.trim() || rating === 0}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      )}

      {/* Show Login Prompt if Not Signed In */}
      {!isSignedIn && (
        <div className="max-w-xl mx-auto mt-12 text-center bg-white p-6 rounded-2xl shadow">
          <h3 className="text-xl font-semibold mb-4">Want to give feedback?</h3>
          <p className="text-gray-600 mb-6">Sign in to share your experience!</p>
        </div>
      )}

      {loadingFeedbacks && (
        <div className="text-center py-8 text-gray-500">Loading feedbacks...</div>
      )}
    </div>
  );
};

export default Testimonials;
