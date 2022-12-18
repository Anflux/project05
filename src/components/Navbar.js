import './Navbar.css'

import { Link, useNavigate } from 'react-router-dom'
import React, { useContext } from 'react'
import Searchbar from './Searchbar'
import { useTheme } from '../hooks/useTheme'
import { projectAuth } from '../firebase/config'
import { AuthContext } from '../context/Auth'
import Logout from "../assets/logout.png"
import Profile from "../assets/profile.png"


const Navbar = () => {
  const navigate = useNavigate()
  const {color} = useTheme();
  const {currentUser} = useContext(AuthContext)
  return (
    <div className='navbar'>
        <nav>
            <Link to='/' className='brand'><h1>My Activities</h1></Link>
            {currentUser && <Searchbar/>}
            {currentUser && <img alt="logout" src={Logout} onClick={()=> projectAuth.signOut() && navigate("/")} className='signout'/>}
            {currentUser && <img alt="settings" src={Profile} onClick={()=> navigate("/settings")}/>}
            {currentUser && <Link className='lastLink' to="/create"> Create An Activity </Link>}
        </nav>
    </div>
  )
}

export default Navbar