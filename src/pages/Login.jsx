/**
 * @file Login.jsx
 * @description Multi-step login component for email/password authentication, including password reset.
 * @module components/Login
 */

import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import useLoginForm from "../hook/useLoginForm.js";


/**
 * Login component provides a 3-step login interface:
 * - Step 1: Email input and validation.
 * - Step 2: Password input and login.
 * - Step 3: Password reset form.
 *
 * @component
 * @returns {JSX.Element} Login form interface.
 */


function Login() {
  const {
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
} = useLoginForm();

 return (
  <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="block sm:flex bg-white rounded-2xl shadow-md w-[90%] sm:max-w-4xl sm:w-full overflow-hidden">
      {/*======== Left Side Message ==========*/}
      <div className="flex flex-col items-start p-10 w-1/2">
        <FcGoogle size={40} />
        <p className="text-2xl mt-2">Sign in</p>
          <h2 className="mb-2">
            to continue to <span className="text-red-600 font-semibold">YouTube Clone</span>
          </h2>
        {step === 2 ?  <p className="mb-2 text-gray-700">Email: {email}</p> : null}
      </div>

      {/*========== Right Side Form ============*/}
      <form
        onSubmit={
          step === 1 ? handleEmailNext : step === 2 ? handleLogin : handleResetPassword
        }
        className="flex flex-col justify-between p-8 w-full md:w-1/2"
      >
        <div>

          {/*======== Step 1: Enter Email ==========*/}
          {step === 1 && (
            <>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full mb-3 px-3 py-2 border border-gray-400 rounded mt-16"
                required
              />
              {emailError && (
                <p className="text-red-500 text-sm mb-3">{emailError}</p>
              )}
              <div className="flex justify-between items-center mb-3">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            </>
          )}

          {/*======== Step 2: Enter Password =========*/}
          {step === 2 && (
            <>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full mb-3 px-3 py-2 border border-gray-400 rounded mt-16"
                required
              />
              <label className="text-sm flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                Show Password
              </label>
            </>
          )}

          {/*=========== Step 3: Forgot Password Form =========*/}
          {step === 3 && (
            <>
              <p className="mb-2 text-gray-700">Reset password for: {email}</p>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full mb-3 px-3 py-2 border border-gray-400 rounded mt-16"
                required
              />
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-sm text-gray-600 mt-2 underline block text-center"
              >
                Back to Login
              </button>
            </>
          )}
          <div className="mt-16">
            <p className="text-sm">
              Not your computer? Use Guest mode to sign in privately. <span className="text-blue-400">Learn more about using Guest mode</span>
            </p>
          </div>
        </div>

        {/*============= Bottom Right Buttons ===========*/}
        <div className="flex justify-end gap-4 mt-6">
          <Link to="/register" className="text-blue-600 font-medium hover:underline flex justify-center items-center">
            create account
          </Link>
          <button
            type="submit"
            className="bg-blue-400 text-white px-5 py-2 rounded-full hover:bg-blue-700"
          >
            {step === 1 ? "Next" : step === 2 ? "Login" : "Update"}
          </button>
        </div>
      </form>
    </div>
  </div>
);

}

export default Login;
