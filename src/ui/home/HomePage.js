import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import appStore from "../../stores/AppStore";

function HomePage() {
  const navigate = useNavigate();
  return (
    <body>
      <header>
        <h1>SmartCloudFarming</h1>
        <p>Advanced Soil Carbon Intelligence & Mapping at Speed</p>
      </header>
      <main>
        <section>
          <p>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
            commodo ligula eget dolor. Aenean massa. Cum sociis natoque
            penatibus et magnis dis parturient montes, nascetur ridiculus mus.
            Donec quam felis
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
