import React, { useState }  from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/scf_logo.png'; // replace 'yourLogo.png' with your actual file name
import api from "../api/api";


function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const[value, setValue]  = useState(0);

  const handleLogin = (event) => {
    event.preventDefault();
    // Add your login logic here. If login is successful, navigate to the home page.
    api.login(event.target.username.value, event.target.password.value)
    .then((data) => {  
      console.log("loginpage", data);
      // If login is successful, navigate to the home page
      navigate('/home');
    })
    .catch((error) => {
      console.error("Error:", error);
      // If login fails, you can show an error message here
      setError('Invalid username or password');
      
    });
  };

  return (
    <div style={{ display: 'flex',flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <img className= 'logo' src={logo} alt="logo"  style={{ marginLeft: '0px'}}/>
     
      <form style={{ width: '400px'}} onSubmit={handleLogin}>
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

      {/* <button onClick={() => {
        api.getUserDetails(value).then((data) => {
          // console.log("getUserDetails", data);
         });

         setValue(value + 1);
      }}>GET USER</button> */}
    </div>
  );
}

export default LoginPage;