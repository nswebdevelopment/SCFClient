import React, { useEffect } from "react";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import appStore from "../../stores/AppStore";
import "../../components/popups/WelcomePopup"
import WelcomePopup from "../../components/popups/WelcomePopup";

function HomePage() {
  const navigate = useNavigate();

  const [showPopup, setShowPopup] = React.useState(true);

  const handleOutsideClick = (event) => {
      setShowPopup(false); // Hide the popup
  };


  useEffect(() => {
    // Attach event listener to detect clicks outside the popup
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <body class="homeBody">
      <header>
        <h1>SmartCloudFarming</h1>
        <p class="white-text">Advanced Soil Carbon Intelligence & Mapping at Speed</p>
      </header>
      <main>
        <section>
          <p>
          Map your fields, analyze your soil, and gain soil knowledge to make informed
          decisions about land management, carbon farming, and regenerative practices.
          From farmers to food companies, SmartCloudFarming provides the soil intelligence
          needed to cultivate a healthier future. Join us, track your progress and unlock the
          power of precision agriculture.
          </p>
          {/* <p>They offer advanced, low-cost, high-speed 3D soil mapping services using AI and deep neural networks.</p>
                  <p>This allows accurate measurement of soil carbon at a fraction of traditional costs.</p>
                  <p>Their solutions, suitable for various agricultural stakeholders, provide fast and scalable soil analysis for farms globally.</p>
                  <p>Current promotional offers include reduced rates for large-scale orders.</p> */}
        </section>

        <div>
          {!appStore.isSuperAdmin() ? (
            <div>
              <button
                onClick={(event) => {
                  navigate(`/projects/`, { state: { data: true } });
                }}
              >
                Create New Project
              </button>

              <button
                onClick={(event) => {
                  navigate(`/projects`);
                }}
              >
                Project List
              </button>


              {
        showPopup ? (
          <WelcomePopup/>
      ) : (null)}

            </div>
          ) : null}

        </div>
      </main>
      <footer>
        <p>
          For more detailed information, visit{" "}
          <a href="https://www.smartcloudfarming.com/">SmartCloudFarming</a>.
        </p>
      </footer>
    </body>
  );
}

export default HomePage;
