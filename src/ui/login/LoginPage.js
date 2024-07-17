import React, { useState, useEffect }  from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/scf_logo.png'; // replace 'yourLogo.png' with your actual file name

import { UserActions } from '../../actions/UserActions';

import UserStore from '../../stores/UserStore';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  


  useEffect(() => {
    UserStore.on("change", loggedIn);
    UserStore.on("login_error", onLoginError);
    return () => {
      UserStore.removeListener("change", loggedIn);
      UserStore.removeListener("login_error", onLoginError);
    };
  }, []);

  const loggedIn = () => {
    navigate('/home');
  };

  const onLoginError = () => {
    setError(UserStore.getError());
  };

  const handleLogin = (event) => {
    event.preventDefault();
    UserActions.login(event.target.username.value, event.target.password.value);
  };

  return (
    <div className='login_container'>
      <img className= 'logo' src={logo} alt="logo"  style={{ marginLeft: '0px'}}/>
     
      <form className='login_form' onSubmit={handleLogin}>
            <label>
          Username:
          <input type="text" name="username" />
        </label>
        <label>
          Password:
          <input type="password" name="password" />
        </label>
        {error && <p className='error'>{error}</p>}
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default LoginPage;