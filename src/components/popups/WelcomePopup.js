import React from "react";


function WelcomePopup() {
  return (
    <div className="dialog">
      <div className="dialog-content">
        <h3>Welcome back, {localStorage.getItem('user_name')}! </h3>
            <h3>Ready to unlock new soil insights? Draw your fields and get a personalized soil analytics quote today.</h3>
      </div>
    </div>
  );
}


export default WelcomePopup;
