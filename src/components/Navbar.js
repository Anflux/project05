import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Searchbar from './Searchbar';
import { useTheme } from '../hooks/useTheme';
import { AuthContext } from '../context/Auth';
import Dropdown from './Dropdown';

const NavbarWrapper = styled.div`
  background-color: #2c3e50;
  padding: 20px;
  color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: -17px auto;
  flex-wrap: wrap;

  & > * {
    margin: 10px 0; // Add vertical margin to all direct children
  }

  @media (max-width: 600px) {
    display: 'flex';
    align-items: flex-start;
  }
`;


const Brand = styled(Link)`
  margin-right: auto;
  color: #fff;
  text-decoration: none;

  &:hover {
    color: #fff;
  }

  h1 {
    font-size: 1.5rem;
    margin-bottom: 0;
  }
`;

const CreateActivityLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  margin-left: 40px;
  padding: 8px 16px;
  border: 1px solid #fff;
  border-radius: 4px;
  transition: background 0.3s, color 0.3s;

  &:hover {
    background: #fff;
    color: #333;
  }
`;

const Navbar = () => {
  const { color } = useTheme();
  const { currentUser } = useContext(AuthContext);

  return (
    <NavbarWrapper>
      <Nav>
        <Brand to="/">
          <h1>My Activities</h1>
        </Brand>
        {currentUser && <Searchbar />}
        <Dropdown />
        {currentUser && (
          <CreateActivityLink className="lastLink" to="/create">
            Create An Activity
          </CreateActivityLink>
        )}
      </Nav>
    </NavbarWrapper>
  );
};

export default Navbar;
