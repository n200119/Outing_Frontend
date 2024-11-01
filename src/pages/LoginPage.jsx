import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const emailRegex = /^[nN](19|20|21|22|23)\d{4}@rguktn\.ac\.in$/;

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const studentSubmitHandler = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(email) && activeTab === "student") {
      setError("Invalid Email");
      toast.error("Invalid Email");
    } else {
      setError("");
      try {
        const response = await fetch(
          `http://localhost:3000/${activeTab}/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          }
        );

        const data = await response.json();
        if (response.ok) {
          toast.success(
            `${
              activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
            } login successful!`
          );
          setEmail("");
          setPassword("");
          localStorage.setItem(`${activeTab}LoginToken`, data.token);
          setTimeout(() => {
            if(activeTab === "student"){
              navigate("/welcome");
            }
            else
            {
              navigate("/caretakerwelcome");

            }      
          }, 2000);
        } else {
          toast.error("Login failed: " + (data.message || "An error occurred"));
        }
      } catch (error) {
        console.log(error);
        toast.error("Login failed: " + error.message);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* Tab Bar */}
      <div className="flex justify-center mb-8 space-x-8 ">
        <button
          className={`relative px-6 py-3 text-lg font-semibold transition-all duration-300 ${
            activeTab === "student"
              ? "text-black after:scale-x-100"
              : "text-gray-500 hover:text-black after:scale-x-0"
          } after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:bg-black after:w-full after:origin-left after:transition-transform after:duration-300`}
          onClick={() => handleTabClick("student")}
        >
          Student
        </button>
        <button
          className={`relative px-6 py-3 text-lg font-semibold transition-all duration-300 ${
            activeTab === "caretaker"
              ? "text-black after:scale-x-100"
              : "text-gray-500 hover:text-black after:scale-x-0"
          } after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:bg-black after:w-full after:origin-left after:transition-transform after:duration-300`}
          onClick={() => handleTabClick("caretaker")}
        >
          Caretaker
        </button>
      </div>

      {/* Form Container */}
      <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-blue-300 shadow-lg w-96">
        {activeTab === "student" && (
          <form onSubmit={studentSubmitHandler}>
            <h2 className="text-center text-2xl font-bold text-black mb-6">
              Student Login
            </h2>

            <label
              htmlFor="studentEmail"
              className="block text-gray-700 font-medium mb-2"
            >
              {activeTab} Email
            </label>
            <input
              type="email"
              id="studentEmail"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <p className="text-red-600">{error}</p>

            <label
              htmlFor="studentPassword"
              className="block text-gray-700 font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="studentPassword"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition duration-300"
            >
              Login as {activeTab}
            </button>

            <p className="text-center text-gray-500 mt-4">
              Don't have an account?{" "}
              <Link to="/student/register">
                <a
                  href="#"
                  className="text-black underline hover:text-gray-700"
                >
                  Sign up
                </a>
              </Link>
            </p>
          </form>
        )}

        {activeTab === "caretaker" && (
          <form onSubmit={studentSubmitHandler}>
            <h2 className="text-center text-2xl font-bold text-black mb-6">
              Caretaker Login
            </h2>

            <label
              htmlFor="caretakerEmail"
              className="block text-gray-700 font-medium mb-2"
            >
              {activeTab} Email
            </label>
            <input
              type="email"
              id="caretakerEmail"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <p className="text-red-600">{error}</p>

            <label
              htmlFor="caretakerPassword"
              className="block text-gray-700 font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="caretakerPassword"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition duration-300"
            >
              Login as {activeTab}
            </button>

            <p className="text-center text-gray-500 mt-4">
              Don't have an account?{" "}
              <Link to="/caretaker/register">
                <a
                  href="#"
                  className="text-black underline hover:text-gray-700"
                >
                  Sign up
                </a>
              </Link>
            </p>
          </form>
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
