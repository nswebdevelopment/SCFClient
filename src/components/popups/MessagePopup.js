import React from "react";


function MessagePopup(title, text) {
  return (
    <div className="dialog">
      <div className="dialog-content">
        <h3>{title}</h3>
            <h3>{text}</h3>
      </div>
    </div>
  );
}


export default MessagePopup;
