import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

const adminSidebarData = [
  {
    title: "Home",
    path: "/home",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "Support",
    path: "/support",
    icon: <IoIcons.IoMdHelpCircle />,
    cName: "nav-text",
  },
  {
    title: "Companies",
    path: "/companies",
    icon: <IoIcons.IoMdHelpCircle />,
    cName: "nav-text",
  },

  {
    title: "Requests",
    path: "/requests",
    icon: <IoIcons.IoIosPaper />,
    cName: "nav-text",
  },

  {
    title: "My Profile",
    path: "/profile",
    icon: <AiIcons.AiOutlineUser />,
    cName: "nav-text",
  },
];

const userSidebarData = [
  {
    title: "Home",
    path: "/home",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "Projects",
    path: "/projects",
    icon: <IoIcons.IoIosPaper />,
    cName: "nav-text",
  },

  {
    title: "My Requests",
    path: "/requests",
    icon: <IoIcons.IoIosPaper />,
    cName: "nav-text",
  },

  {
    title: "Support",
    path: "/support",
    icon: <IoIcons.IoMdHelpCircle />,
    cName: "nav-text",
  },

  {
    title: "My Profile",
    path: "/profile",
    icon: <AiIcons.AiOutlineUser />,
    cName: "nav-text",
  },
];

export function getSidebarData(role) {
  console.log(role);
  switch (role) {
    case 'SuperAdmin':
      return adminSidebarData;
    case 'user':
    default:
      return userSidebarData;
  }
}