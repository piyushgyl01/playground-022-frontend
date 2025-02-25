import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentUser, loginUser, registerUser } from "./authSlice";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [isLogin, setIsLogin] = useState(true);

  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (status === "succeeded") {
      dispatch(getCurrentUser()).then(() => {
        navigate("/");
      }).catch(() => {
        // If getCurrentUser fails, still navigate or handle the error
        navigate("/");
      });
    }
  }, [status, dispatch, navigate]);
  

  const handleChange = (e) => {
    setUserData((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      // For login, we only need username and password
      const { username, password } = userData;
      dispatch(loginUser({ username, password }));
    } else {
      dispatch(registerUser(userData));
    }
  };

  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="text-center mb-4">
            <div className="btn-group" role="group" aria-label="Login/Register">
              <input
                type="radio"
                className="btn-check"
                name="authType"
                id="login"
                autoComplete="off"
                checked={isLogin}
                onChange={() => setIsLogin(true)}
              />
              <label className="btn btn-outline-primary" htmlFor="login">
                Login
              </label>

              <input
                type="radio"
                className="btn-check"
                name="authType"
                id="register"
                autoComplete="off"
                checked={!isLogin}
                onChange={() => setIsLogin(false)}
              />
              <label className="btn btn-outline-primary" htmlFor="register">
                Register
              </label>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="mb-4">
                  <label htmlFor="name" className="form-label">
                    Name:
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    value={userData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="form-label">
                    Email:
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={userData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}
            <div className="mb-4">
              <label htmlFor="username" className="form-label">
                Username:
              </label>
              <input
                type="text"
                id="username"
                className="form-control"
                value={userData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                Password:
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={userData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="text-center">
              <button type="submit" className="btn btn-primary">
                {status === "loading"
                  ? "Loading..."
                  : isLogin
                  ? "Login"
                  : "Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}