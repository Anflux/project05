import React, { useState } from 'react';
import './Reset.css';
import { Link } from 'react-router-dom';
import { projectAuth } from '../../../firebase/config';

const resetPasswordHandler = async (email) => {
  try {
    await projectAuth.sendPasswordResetEmail(email);
  } catch (error) {
    alert(error);
  }
};

const Reset = () => {
  const [email, setEmail] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    await resetPasswordHandler(email);
    alert("Password reset has been sent to your email!");
  };

  return (
    <div className="reset">
      <h1>Reset password!</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            name="Email"
            type="email"
            placeHolder="Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </label>
        <button className="submit">Submit</button>
        
        <Link to={`/login`}>Log in</Link>
      </form>
    </div>
  );
};

export default Reset;
