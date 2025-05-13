import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import API_BASE_URL from "../config/api.js";

/**
 * Custom hook to manage a multi-step registration form.
 * Handles form state, step navigation, validation, and submission.
 *
 * @returns {{
 *   step: number,
 *   form: {
 *     firstname: string,
 *     lastname: string,
 *     dob: { day: string, month: string, year: string },
 *     gender: string,
 *     email: string,
 *     password: string,
 *     avatar: File | null
 *   },
 *   isStepValid: () => boolean,
 *   handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void,
 *   handleNext: () => void,
 *   handleBack: () => void,
 *   handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
 * }}
 */

const useRegisterForm = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    dob: { day: "", month: "", year: "" },
    gender: "",
    email: "",
    password: "",
    avatar: null,
  });
  const [, forceUpdate] = useState(false);
  const navigate = useNavigate();

  const isStepValid = () => {
    switch (step) {
      case 1:
        return form.firstname && form.lastname;
      case 2:
        return form.dob.day && form.dob.month && form.dob.year && form.gender;
      case 3:
        return form.email;
      case 4:
        return form.avatar;
      case 5:
        return form.password;
      default:
        return false;
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (step === 2 && ["day", "month", "year"].includes(name)) {
      setForm((prev) => ({
        ...prev,
        dob: { ...prev.dob, [name]: value.trim() },
      }));
    } else if (name === "avatar") {
      setForm((prev) => ({ ...prev, avatar: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value.trim() }));
    }
  };

  // Advances the form to the next step if current step is valid.
  const handleNext = () => {
    if (isStepValid()) {
      setStep((prev) => prev + 1);
      forceUpdate((v) => !v);
    }
  };
  // Goes back to the previous form step.
  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  /**
   * Handles form submission and sends data to the server.
   * @param {React.FormEvent<HTMLFormElement>} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("firstname", form.firstname);
      formData.append("lastname", form.lastname);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("avatar", form.avatar);

      const response = await axios.post(
        `${API_BASE_URL}/api/auth/register`,
        formData
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Registration successful!");
        navigate("/login");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    form,
    loading,
    isStepValid,
    handleChange,
    handleNext,
    handleBack,
    handleSubmit,
  };
};

export default useRegisterForm;
