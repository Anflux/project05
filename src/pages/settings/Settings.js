import React, { useContext } from "react";
import "./Settings.css";
import { useState } from "react";
import { AuthContext } from "../../context/Auth";
import { projectAuth } from "../../firebase/config";

const Settings = () => {
  const { currentUser } = useContext(AuthContext);
  const [passwordSent, setPasswordSent] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(currentUser.displayName);
  const [editDisplayName, setEditDisplayName] = useState(false);

    const resetPasswordHandler = async () => {
      try {
          await projectAuth.sendPasswordResetEmail(currentUser.email)        ;
      } catch (error) {
          alert(error);
      }
  }


    const changeDisplaynameHandler = async () => {
      try {
        
          await currentUser.updateProfile({displayName:newDisplayName});
          setEditDisplayName(false)
      } catch (error) {
          alert(error);
      }
  }

  return (
    <div className="container">
      <div className="list">
        <label>
          <span>Email Adress</span>
          <input
            className="inp"
            type="email"
            value={currentUser.email}
            disabled
          />
        </label>
        <label>
          <span>Display Name:</span>
          <input
            className="inp"
            type="text"
            value={newDisplayName}
            disabled = {!editDisplayName}
            onChange={(e) => setNewDisplayName(e.target.value)}
          />
          {!editDisplayName && <button className="edit" onClick={()=>setEditDisplayName(true)}>Edit</button>}
          {editDisplayName && <button className="edit" onClick={()=>changeDisplaynameHandler()}>Save</button>}
        </label>
        {!passwordSent && <button className="password-reset" onClick={()=>resetPasswordHandler() && setPasswordSent(true)}>Change password</button>}
        {passwordSent && <button className="password-reset">Email sent!</button>}
      </div>
    </div>
  );
};

export default Settings;
