import '../../styles/App.css';
import React, { useEffect } from "react";

import UserStore from "../../stores/UserStore";
import { UserActions } from "../../actions/UserActions";
import ResetPasswordPopup from '../../components/popups/ResetPassword';


function MyProfilePage() {

    const [user, setUser] = React.useState(null);

    const [shoqPopup, setShowPopup] = React.useState(false);

    const userLoaded = () => {
        setUser(UserStore.getUserDetails());
    }

    useEffect(() => {
        UserStore.on("change", userLoaded);

        UserActions.getUserDetails();
        return () => {
          UserStore.removeListener("change", userLoaded);
        };
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);


      const resetPassword = () => {
        setShowPopup(true);
      };

      const handleSendRequest = (oldPassword, newPassword) => {
        UserActions.resetPassword(oldPassword, newPassword);
        setShowPopup(false);
      };

      const handleClose = () => {
        setShowPopup(false);
      };

      if (!user) {
        return null; 
      }

      return (
    
          <div  className="profile-details-container">
            <h2>Personal Details</h2>
            <ul>
              <li>
                <strong>First Name:</strong> {user.firstName}
              </li>

              <li>
                <strong>Last Name:</strong> {user.lastName}
              </li>
              <li>
                <strong>Phone:</strong> {user.phone}
              </li>
              <li>
                <strong>eMail:</strong> {user.email}
              </li>

              <li>
                <button onClick={resetPassword} style={{ width: '400px' }}>Reset Password</button>
              </li>
            </ul>


                  {
        shoqPopup ? (

          <ResetPasswordPopup
            sendRequest={handleSendRequest}
            onClose={handleClose}
          />
      ) : (null)}
          </div>
      );
    }
    


export default MyProfilePage;