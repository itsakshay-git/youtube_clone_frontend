import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../redux/authSlice";
import axios from "axios";
import API_BASE_URL from "../config/api.js";

/**
 * Custom hook to manage the state and logic of a multi-step login form.
 *
 * @returns {{
 *   step: number,
 *   setStep: function(number): void,
 *   email: string,
 *   setEmail: function(string): void,
 *   emailError: string,
 *   password: string,
 *   setPassword: function(string): void,
 *   showPassword: boolean,
 *   setShowPassword: function(boolean): void,
 *   newPassword: string,
 *   setNewPassword: function(string): void,
 *   handleEmailNext: function(Event): Promise<void>,
 *   handleLogin: function(Event): Promise<void>,
 *   handleResetPassword: function(Event): Promise<void>
 * }}
 */

const useLoginForm = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /**
   * Handles the first step of login (checking if email exists).
   *
   * @param {React.FormEvent} e - The form submission event.
   * @returns {Promise<void>}
   */

  const handleEmailNext = async (e) => {
    e.preventDefault();
    setEmailError("");
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/auth/check-email?email=${email}`
      );
      if (res.data.exists) {
        setStep(2);
      } else {
        setEmailError("Email not found.");
      }
    } catch (err) {
      setEmailError("Something went wrong.");
    }
  };

  /**
   * Handles the actual login step with email and password.
   *
   * @param {React.FormEvent} e - The form submission event.
   * @returns {Promise<void>}
   */

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });
      dispatch(loginSuccess(res.data));
      navigate("/");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  /**
   * Handles resetting the user's password.
   *
   * @param {React.FormEvent} e - The form submission event.
   * @returns {Promise<void>}
   */

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/api/auth/reset-password`, {
        email,
        newPassword,
      });
      alert("Password updated. Please login.");
      setStep(2);
    } catch (err) {
      alert("Error resetting password");
    }
  };

  return {
    step,
    setStep,
    email,
    setEmail,
    emailError,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    newPassword,
    setNewPassword,
    handleEmailNext,
    handleLogin,
    handleResetPassword,
  };
};

export default useLoginForm;
