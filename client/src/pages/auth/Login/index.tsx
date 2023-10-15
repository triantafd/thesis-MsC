import React, { useState } from "react";
import { useAuth } from "../../../context/authContext";
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleSignin, handleSignup, setUser } = useAuth();
  const navigate = useNavigate();


  React.useEffect(() => {
    // Check if user data is stored in localStorage
    const userData = localStorage.getItem("userData");
    if (userData) {
      console.log(userData)
      const parsedUserData = JSON.parse(userData);
      setUser(parsedUserData);
      navigate('/account')
    }
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await handleSignin(email, password);
      } else {
        await handleSignup(email, password);
      }
      navigate('/account')
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };


  return (
    <div className="flex items-center justify-center bg-gray-100 py-20 px-4">
      <div className="bg-white p-8 shadow-md rounded-lg w-max-w">
        <h2 className="text-2xl mb-4">{isLogin ? "Login" : "Sign Up"}</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600">Email</label>
            <input
              type="email"
              className="w-full border rounded p-2"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border rounded p-2"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-2 top-2"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`far ${showPassword ? "fa-eye" : "fa-eye-slash"}`} />
              </button>
            </div>
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold p-2 rounded"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </div>
        </form>
        <p className="text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign up here" : "Log in here"}
          </span>
        </p>
        {isLogin && (
          <p
            className="text-blue-500 cursor-pointer"
            onClick={() => console.log("Forgot Password clicked")}
          >
            Forgot password?
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
