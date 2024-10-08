import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/scf_logo.png"; // replace 'yourLogo.png' with your actual file name

import { UserActions } from "../../actions/UserActions";

import UserStore from "../../stores/UserStore";
import "./LoginPage.css";
import FullScreenLoader from "../../components/loader/Loader";

function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loader, setLoader] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleUserLoggedIn = useCallback(() => {
    setLoader(false);  
    navigate("/home");
  }, [navigate]);

  const handleLoginError = useCallback(() => {
    setLoader(false);  
    setError(UserStore.getError());
  }, []);

  const handleLogin = useCallback((data) => {
    // navigate("/home");
    setLoader(true);  
    UserActions.login(data.username, data.password);
  }, []);

  // const handleLoader = useCallback((loader) => {
  //   setLoader(loader);
  // }, []);

  useEffect(() => {
    UserStore.on("change", handleUserLoggedIn);
    UserStore.on("login_error", handleLoginError);
    return () => {
      UserStore.removeListener("change", handleUserLoggedIn);
      UserStore.removeListener("login_error", handleLoginError);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="login_container">
        {loader ? <FullScreenLoader /> : null}
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
