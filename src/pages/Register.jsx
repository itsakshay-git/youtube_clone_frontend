/**
 * @file Register Component
 * 
 * This component handles the user registration process in a multi-step form. 
 * It provides the UI for users to enter their name, date of birth, gender, email, 
 * avatar, and password in sequential steps. The form uses a custom hook `useRegisterForm`
 * to manage form state and step transitions.
 * 
 * @component
 * @example
 * return <Register />;
 */

import { FcGoogle } from "react-icons/fc";
import useRegisterForm from "../hook/useRegisterForm.js";

function Register() {

    const {
    step,
    form,
    loading,
    isStepValid,
    handleChange,
    handleNext,
    handleBack,
    handleSubmit,
  } = useRegisterForm();

return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div className="bg-white shadow-md w-full max-w-4xl rounded-2xl block sm:flex overflow-hidden">
      

        <div className="w-1/2 p-6 block">
          <FcGoogle size={40} />
          <h2 className="text-2xl font-semibold mb-4 mt-2">Create a Google Account</h2>
          {step === 1 ? (
            <p className="text-gray-700 text-sm font-semibold">
              Enter your name
            </p>
          ) : (null)}

          {step === 2 ? (
            <p className="text-gray-700 text-sm font-semibold">
              Enter your date of birth
            </p>
          ) : (null)}

          {step === 3 ? (
            <p className="text-gray-700 text-sm font-semibold">
              Enter your email
            </p>
          ) : (null)}

          {step === 4 ? (
            <p className="text-gray-700 text-sm font-semibold">
              Enter your avatar
            </p>
          ) : (null)}

          {step === 5 ? (
            <p className="text-gray-700 text-sm font-semibold">
              Enter your password
            </p>
          ) : (null)}
        </div>

      {/*======== Right section: the form =========*/}
      <form
        onSubmit={handleSubmit}
        className={`p-6 w-full ${step === 1 ? "md:w-1/2" : "w-full"} transition-all`}
      >

        <div className="my-20">
          {/*======== STEP 1: Name =========*/}
          {step === 1 && (
            <>
              <input name="firstname" onChange={handleChange} placeholder="First Name" required className="input border border-gray-300 p-2 rounded-lg w-full" />
              <br />
              <input name="lastname" onChange={handleChange} placeholder="Last Name" required className="input mt-3 border border-gray-300 p-2 rounded-lg w-full" />
            </>
          )}

          {/*========== STEP 2: DOB and Gender ==========*/}
          {step === 2 && (
            <>
              <div className="flex space-x-2">
                <input name="month" placeholder="MM" onChange={handleChange} className="input border border-gray-300 p-2 rounded-lg w-full" />
                <input name="day" placeholder="DD" onChange={handleChange} className="input border border-gray-300 p-2 rounded-lg w-full" />
                <input name="year" placeholder="YYYY" onChange={handleChange} className="input border border-gray-300 p-2 rounded-lg w-full" />
              </div>
              <select name="gender" onChange={handleChange} className="input mt-3 border border-gray-300 p-2 rounded-lg w-full">
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </>
          )}

          {/*========= STEP 3: Email ===========*/}
          {step === 3 && (
            <input name="email" type="email" onChange={handleChange} placeholder="Email Address" required className="input border border-gray-300 p-2 rounded-lg w-full" />
          )}

          {/*========= STEP 4: Avatar Upload ========*/}
          {step === 4 && (
            <input name="avatar" type="file" accept="image/*" onChange={handleChange} required className="input border border-gray-300 p-2 rounded-lg w-full" />
          )}

          {/*======== STEP 5: Password ===========*/}
          {step === 5 && (
            <input name="password" type="password" onChange={handleChange} placeholder="Password" required className="input border border-gray-300 p-2 rounded-lg w-full" />
          )}
        </div>

        <div className="mt-6 flex justify-end-safe gap-3">
          {step > 1 && <button type="button" onClick={handleBack} className="btn rounded-full bg-blue-300 px-3 p-2">Back</button>}
          {step < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!isStepValid()}
                className="btn rounded-full bg-blue-300 px-3 p-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
          ) : (
            <button type="submit" className="btn rounded-full bg-blue-300 px-3 p-2" disabled={loading}>
              {loading ? "Creating..." : "Register"}
            </button>
          )}
        </div>
      </form>
    </div>
  </div>
);

}

export default Register;
