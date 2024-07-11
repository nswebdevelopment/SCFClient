
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';


export const SidebarData = [
  {
    title: 'Home',
    path: '/home',
    icon:<AiIcons.AiFillHome/>,
    cName: 'nav-text'
  },
  {
    title: 'Projects',
    path: '/projects',
    icon: <IoIcons.IoIosPaper/>,
    cName: 'nav-text'
  },
  // {
  //   title: 'Products',
  //   path: '/products',
  //   icon: <FaIcons.FaCartPlus />,
  //   cName: 'nav-text'
  // },
  {
    title: 'Team',
    path: '/team',
    icon: <IoIcons.IoMdPeople />,
    cName: 'nav-text'
  },
  // {
  //   title: 'Messages',
  //   path: '/messages',
  //   icon: <FaIcons.FaEnvelopeOpenText />,
  //   cName: 'nav-text'
  // },
  {
    title: 'Support',
    path: '/support',
    icon: <IoIcons.IoMdHelpCircle />,
    cName: 'nav-text'
  }
];



// function HoverIcon({ IconComponent }) {
//   const [hover, setHover] = useState(false);

//   const iconStyle = {
//     color: hover ? '#fff' : '#028361', // Change color on hover
//     display: 'flex', 

//     justifyContent: 'center', 
//     alignItems: 'center', 
//   };

//   return (
//     <div
//     onMouseEnter={() => setHover(true)}
//     onMouseLeave={() => setHover(false)}
//     >

//     <IconComponent style={iconStyle}
    
//     />

// </div>
//   );
// }