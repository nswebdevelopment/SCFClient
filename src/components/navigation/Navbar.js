import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { Link } from "react-router-dom";
import { getSidebarData } from "./SidebarData";
import "./Navbar.css";
import { IconContext } from "react-icons";
import logo from "../../assets/scf_logo.png";
import appStore from "../../stores/AppStore";

function Navbar() {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <IconContext.Provider value={{ color: "#fff" }}>
    <div className="navbar" style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', alignContent: 'center'}}>
        <Link  className="menu-bars">
          <FaIcons.FaBars onClick={showSidebar} />
        </Link>
        <img className="logo" src={logo} alt="logo" />
      </div>

      <h2 style={{ paddingRight: '20px' }}>{localStorage.getItem('user_name')}</h2>
    </div>
      <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
        <ul className="nav-menu-items" onClick={showSidebar}>
          <li className="navbar-toggle">
            <Link to="#" className="menu-bars">
              <AiIcons.AiOutlineClose />
            </Link>
          </li>
          {getSidebarData(appStore.getUserRole()).map((item, index) => {
            return (
              <li key={index} className={item.cName}>
                <Link to={item.path}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}

          <button onClick={logout}>Logout</button>
        </ul>
      </nav>
    </IconContext.Provider>
  );
}

export default Navbar;
