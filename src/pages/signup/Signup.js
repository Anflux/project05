import React, { useState, useCallback } from 'react'
import "./Signup.css"
import { projectAuth } from '../../firebase/config'
import { useNavigate, Link } from 'react-router-dom'

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState(null);
    const navigate = useNavigate();
  
    const signupHandler = useCallback(async (e) => {
      e.preventDefault();
      try {
        const res = await projectAuth.createUserWithEmailAndPassword(email, password);
        await res.user.updateProfile({ displayName });
        await res.user.sendEmailVerification();
        navigate("/");
      } catch (error) {
        alert(error);
      }
    }, [email, password, displayName, navigate]);
  

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
                <input name="DisplayName" type="text" placeHolder="Display Name" onChange={(e)=>setDisplayName(e.target.value)} value={displayName}/>
            </label>
            <label>
                Password
                <input name="Password" type="password" placeHolder="Password" onChange={(e)=>setPassword(e.target.value)} value={password}/>
            </label>
            <button className='submit'>Submit</button>
            <Link to={`/login`}>Have an account? Log in!</Link> <br/>
            <Link to={`/reset`}>Reset password?</Link>
        </form>
    </div>
  )
}

export default Signup