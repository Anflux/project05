import React, {useState, useCallback, useContext} from 'react'
import "./Login.css"
import { projectAuth } from '../../firebase/config';
import { Navigate, Link} from 'react-router-dom';
import { AuthContext } from '../../context/Auth';


const Login = () => {
  const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loginHandler = useCallback(async (e) => {
        e.preventDefault();
        try {
            await projectAuth.signInWithEmailAndPassword(email, password);
            <Navigate to="/" />
        } catch (error) {
            alert(error);
        }
    }, [email, password]);

    const {currentUser} = useContext(AuthContext)

    if(currentUser){
      <Navigate to="/"/>
    }

  return (
    <div className='login'>
        <h1>Log in!</h1>
        <form onSubmit={loginHandler}>
            <label>
                Email
                <input name="Email" type="email" placeHolder="Email" onChange={(e)=>setEmail(e.target.value)} value={email}/>
            </label>
            <label>
                Password
                <input name="Password" type="password" placeHolder="Password" onChange={(e)=>setPassword(e.target.value)} value={password}/>
            </label>
            <button className='submit'>Submit</button>
            <Link to={`/signup`}>Sign Up!</Link>
        </form>
    </div>
  )
}

export default Login