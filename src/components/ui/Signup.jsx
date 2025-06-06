import React, { useState,useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {useSelector} from "react-redux"

const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const{users}=useSelector(store=>store.author)
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const onChangeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  useEffect(()=>{
    if(users){
        navigate('/home')
    }
},[])
  const signUpHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "https://peekaboo-backend-2-49bc.onrender.com/api/peekaBoo/user/register",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message, {
          position: "bottom-right",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, {
        position: "bottom-right",
      });
    } finally {
      setInput({ username: "", email: "", password: "" });
      setLoading(false);
    }
  };

  
  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-4 py-8 mx-auto min-h-screen sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg dark:border shadow-cyan-800/50 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 sm:p-8">
            <div className="flex justify-center">
              <img
                className="h-12 w-12 rounded-full"
                src="https://media.istockphoto.com/id/1131321003/vector/white-bunny-rabbit-holding-wall-signboard-cute-cartoon-funny-animal-hiding-behind-paper.jpg?s=612x612&w=0&k=20&c=JLdEjmjJkW4cjZiAzSP3d0RzbY8wUZM28bHOQjjOnr8="
                alt="logo"
              />
            </div>
            <h1 className="text-xl font-bold leading-tight tracking-tight text-center text-gray-900 md:text-2xl dark:text-white">
              Create an account
            </h1>
            <form onSubmit={signUpHandler} className="space-y-4 md:space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 text-left dark:text-white"
                >
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={input.username}
                  onChange={onChangeHandler}
                  id="username"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-blue-400/70 focus:ring-transparent block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="username"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-left text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={input.email}
                  onChange={onChangeHandler}
                  id="email"
                  placeholder="user@gmail.com"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-blue-400/70 focus:ring-transparent block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-left text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={input.password}
                  onChange={onChangeHandler}
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-blue-400/70 focus:ring-transparent block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    aria-describedby="terms"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 accent-blue-500 focus:outline-blue-500 focus:ring-transparent dark:bg-gray-700 dark:border-gray-600 dark:ring-offset-gray-800"
                    required
                  />
                </div>

                <div className="ml-3 text-sm">
                  <label
                    htmlFor="terms"
                    className="font-light text-gray-500 dark:text-gray-300"
                  >
                    I accept the{" "}
                    <a
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                      href="#"
                    >
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </div>
              <button
                disabled={loading}
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline w-4 h-4 me-3 text-white animate-spin"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="#E5E7EB"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentColor"
                      />
                    </svg>
                    Loading...
                  </div>
                ) : (
                  "Create an account"
                )}
              </button>
              
              
              <p className="text-sm font-light text-center text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <NavLink
                  to="/login"
                  className="font-medium text-blue-600 hover:underline dark:text-primary-500"
                >
                  Login here
                </NavLink>
              </p>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer autoClose={3000} />
    </section>
  );
};

export default Signup;
