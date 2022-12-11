import React, { useState } from 'react'
import "./Dropdown.css"
import Profile from "../assets/profile.png"

const Dropdown = () => {
    const [state, setState] = useState(false);


    const showDropdown = () => {
        setState(true)
    }

    const hideDropdown = () => {
        setState(false)
    }

  return (
    <div className='dropdown'>
        <div className='dropdown-menu' onMouseEnter={showDropdown} onMouseLeave={hideDropdown}>
            <img src={Profile}/>
            {state && (
            <ul className='dropdown-list' onMouseEnter={showDropdown}>
                <li>My Posts</li>
                <li>My Likes</li>
                <li>Profile</li>
            </ul>
            )}
        </div>
    </div>
  )
}

export default Dropdown