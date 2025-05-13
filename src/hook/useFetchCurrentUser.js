import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import API_BASE_URL from "../config/api.js";
import axios from "axios";

/**
 * Custom React hook to fetch the current authenticated user's data from the backend.
 * It uses the stored token from localStorage and updates the Redux store upon success.
 *
 * @returns {() => Promise<object|undefined>} A function that, when invoked, fetches the user data
 * from the server and dispatches it to Redux. Returns the user object on success.
 */

const useFetchCurrentUser = () => {
  const dispatch = useDispatch();

  /**
   * Fetches the current user's profile using the JWT token from localStorage.
   * If successful, updates the Redux store with the user's info and token.
   *
   * @async
   * @function
   * @returns {Promise<object|undefined>} Returns the fresh user object or undefined if an error occurs or token is missing.
   */
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const freshUser = response.data;
      // Dispatch user and token to Redux store
      dispatch(loginSuccess({ user: freshUser, token }));
      return freshUser;
    } catch (error) {
      console.error("Failed to fetch current user:", error);
    }
  };

  return fetchUser;
};

export default useFetchCurrentUser;
