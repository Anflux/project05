import './Navbar.css'

import { Link } from 'react-router-dom'
import React, { useContext } from 'react'
import Searchbar from './Searchbar'
import { useTheme } from '../hooks/useTheme'
import { AuthContext } from '../context/Auth'
import Dropdown from './Dropdown'


const Navbar = () => {
  const {color} = useTheme();
  const {currentUser} = useContext(AuthContext)


  return (
    <div className='navbar'>
        <nav>
            <Link to='/' className='brand'><h1>My Activities</h1></Link>
            {currentUser && <Searchbar/>}
            <Dropdown/>
            {currentUser && <Link className='lastLink' to="/create"> Create An Activity </Link>}
        </nav>
    </div>
  )
}

export default Navbar