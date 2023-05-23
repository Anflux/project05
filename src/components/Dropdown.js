import React, { useState } from 'react';
import './Dropdown.css';
import { AuthContext } from '../context/Auth';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { projectAuth } from '../firebase/config';
import { confirmAlert } from 'react-confirm-alert';
import AccountCircle from '@material-ui/icons/AccountCircle';

const Dropdown = () => {
  const [state, setState] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const showDropdown = () => {
    setState(true);
  };
  const hideDropdown = () => {
    setState(false);
  };

  const logoutHandler = (e) => {
    e.preventDefault();
    confirmAlert({
      title: 'Confirm to logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => projectAuth.signOut(),
        },
        {
          label: 'No',
          onClick: () => '',
        },
      ],
    });
  };

  return (
    <div className="dropdown">
      <div
        className="dropdown-menu"
        onMouseEnter={showDropdown}
        onMouseLeave={hideDropdown}
      >
        {currentUser && <AccountCircle style={{ fontSize: 40, color: '#fff' }} />}
        {state ? (
          <ul className="dropdown-list" onMouseEnter={showDropdown}>
            <li>
              <Link to="/settings">Profile</Link>
            </li>
            <li>
              <Link to="/myposts">My Posts</Link>
            </li>
            <li>
              <Link to="/mylikes">My Likes</Link>
            </li>
            <li>
              <Link onClick={(e) => logoutHandler(e)} to="/login">
                Logout
              </Link>
            </li>
          </ul>
        ) : null}
      </div>
    </div>
  );
};

export default Dropdown;
