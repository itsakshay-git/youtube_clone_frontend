/**
 * @file ErrorPage Component
 * 
 * @component
 * @description
 * A fallback error page displayed when a user navigates to an unknown route or encounters a server error.
 * It provides a visual message, search functionality, and navigation options (go back or return to home).
 * 
 * @returns {JSX.Element} A styled error UI with dynamic messaging, a search bar, and navigation controls.
 * 
 * @functions
 * - handleSearchChange: Updates the `searchQuery` state based on user input.
 * - handleSearchSubmit: Navigates to the `/search` page using the typed query.
 * - goBack: Redirects the user back to the previous page, or to home if no history exists.
 * - getErrorMessage: Dynamically determines an error message based on the current route.
 * 
 */


import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  

  /**
 * Handles input change for the search bar.
 * @param {React.ChangeEvent<HTMLInputElement>} event 
 */

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  /**
 * Handles the form submission for searching.
 * Navigates to the search results page if input is valid.
 * @param {React.FormEvent} event 
 */

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  /**
   * Returns an appropriate error message based on the current URL path.
   * @returns {string} Error message to display
   */

  const getErrorMessage = () => {
    if (location.pathname.includes('404')) {
      return "Sorry, the page you're looking for doesn't exist.";
    }
    if (location.pathname.includes('500')) {
      return "Oops! Something went wrong on our end.";
    }
    return "An unexpected error has occurred.";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black px-4">
      <div>
        <img src="./monkey.png" alt="" />
      </div>
      <div className="text-4xl font-bold text-red-600 mb-4">
        <span className="text-black">Oops!</span> Error
      </div>

      {/* Dynamic error message */}
      <p className="text-sm text-gray-600 mb-6 text-center">
        {getErrorMessage()}
      </p>

      {/* Search bar with dynamic input */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex items-center border border-gray-300 rounded-md w-full sm:w-96 py-2 px-4 mb-4"
      >
        <input
          type="text"
          placeholder="Search YouTube"
          value={searchQuery}
          onChange={handleSearchChange}
          className="bg-transparent text-black flex-grow outline-none placeholder-gray-500 pr-4"
        />
        <button type="submit" className="text-gray-400 hover:text-white">
        </button>
      </form>

      {/* Navigation buttons */}
      <div className="flex justify-center space-x-4 mt-4">
        <button
          onClick={goBack}
          className="bg-gray-200 px-4 py-2 rounded-full text-sm text-black hover:text-red-500"
        >
          Go Back
        </button>
        <a
          href="/"
          className="bg-gray-200 px-4 py-2 rounded-full text-sm text-black hover:text-red-500"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
};

export default ErrorPage;
