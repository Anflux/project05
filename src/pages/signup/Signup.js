import React, { useState, useCallback } from 'react'
import "./Signup.css"
import { projectAuth } from '../../firebase/config'
import { Navigate, Link } from 'react-router-dom'

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState(null);

    const signupHandler = useCallback(async (e) => {
        e.preventDefault();
        try {
            const res = await projectAuth.createUserWithEmailAndPassword(email, password);
            await res.user.updateProfile({displayName});
            <Navigate to="/" />
        } catch (error) {
            alert(error);
        }
    }, [email, password, displayName]);
  return (
    <div className='signup'>
        <h1>Sign Up!</h1>
        <form onSubmit={signupHandler}>
            <label>
                Email
                <input name="Email" type="email" placeHolder="Email" onChange={(e)=>setEmail(e.target.value)} value={email}/>
            </label>
            <label>
                Display name:
                <input name="DisplayName" type="text" placeHolder="Name" onChange={(e)=>setDisplayName(e.target.value)} value={displayName}/>
            </label>
            <label>
                Password
                <input name="Password" type="password" placeHolder="Password" onChange={(e)=>setPassword(e.target.value)} value={password}/>
            </label>
            <button className='submit'>Submit</button>
            <Link to={`/login`}>Have an account? Log in!</Link>
        </form>
    </div>
  )
}

export default Signup