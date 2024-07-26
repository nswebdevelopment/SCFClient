import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/scf_logo.png"; // replace 'yourLogo.png' with your actual file name

import { UserActions } from "../../actions/UserActions";

import UserStore from "../../stores/UserStore";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleUserLoggedIn = useCallback(() => {
    navigate("/home");
  }, [navigate]);

  const handleLoginError = useCallback(() => {
    setError(UserStore.getError());
  }, []);

  const handleLogin = useCallback((data) => {
    // navigate("/home");
    UserActions.login(data.username, data.password);
  }, []);

  useEffect(() => {
    UserStore.on("change", handleUserLoggedIn);
    UserStore.on("login_error", handleLoginError);
    return () => {
      UserStore.removeListener("change", handleUserLoggedIn);
      UserStore.removeListener("login_error", handleLoginError);
    };
  }, []);

  return (
    <div className="login_container">
      <img
        className="logo"
        src={logo}
        alt="logo"
        style={{ marginLeft: "0px" }}
      />

      <form className="login_form" onSubmit={handleSubmit(handleLogin)}>
        <input
          {...register("username", { required: "Username is required" })}
        />
        {errors.username && <p className="error">{errors.username.message}</p>}

        <input
          {...register("password", { required: "Password is required" })}
          type="password"
        />
        {errors.password && <p className="error">{errors.password.message}</p>}

        {error && <p className="error">{error}</p>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
