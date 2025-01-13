import './Header.css'
import {useAuth} from "../hooks/useAuth.tsx";
import {Link} from "react-router";
import Avatar from "./parts/Avatar.tsx";

function Header() {
  const { user, logout } = useAuth();

  let navLinks;

  if(user) {
    navLinks = (
      <ul className="nav-links">
        <li className="menu-item">
          <Link to="chat" className="nav-link">Updates</Link>
        </li>
        <li className="menu-item">
          <Link to="#" className="nav-link">Connections</Link>
        </li>
        <li className="menu-item">
          <Link to="#" className="nav-link">Investors</Link>
        </li>
        <li className="menu-item">
          <Link to="#" className="nav-link">Advisors</Link>
        </li>
        <li className="menu-item">
          <Link to="#" className="nav-link">Report</Link>
        </li>
        <li className="menu-item">
          <Link to="#" className="nav-link">Legal</Link>
        </li>
        <li className="menu-item">
          <div className="messaging-wrapper">
            <Link to="#" className="nav-link">
              <img src='/messaging.svg' alt="messaging"/>
            </Link>
          </div>
        </li>
        <li className="menu-item">
          <div className="messaging-wrapper">
            <Link to="#" className="nav-link">
              <img src='/bell.svg' alt="notification"/>
            </Link>
          </div>
        </li>
        <li className="menu-item">
          <a href='#' className="nav-link" onClick={logout}>Sign out</a>
        </li>
        <Avatar name={user.name}/>
      </ul>
    )
  } else {
      navLinks = (
        <ul className="nav-links">
          <li className="menu-item">
            <Link to="login" className="nav-link">Login</Link>
          </li>
          <Avatar name={null}/>
        </ul>
      )
    }


  return (
    <nav className="nav-container">
      <div className="nav-content">
        <Link to='/' className="desktop-logo-href" >
          <img className="nav-logo-desktop-img"
               src="/logo.svg"
               alt="logo"/>
        </Link>
        {navLinks}
      </div>
    </nav>
  )
}

export default Header;