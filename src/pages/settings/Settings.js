import React, { useContext } from "react";
import "./Settings.css"; // make sure to update the CSS file name if you've changed it
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
      await projectAuth.sendPasswordResetEmail(currentUser.email);
    } catch (error) {
      alert(error);
    }
  }

  const changeDisplaynameHandler = async () => {
    try {
      await currentUser.updateProfile({ displayName: newDisplayName });
      setEditDisplayName(false);
    } catch (error) {
      alert(error);
    }
  }

  return (
    <div className="settings-container">
      <div className="settings-list">
        <label className="settings-label">
          <span>Email Address</span>
          <input
            className="settings-input"
            type="email"
            value={currentUser.email}
            disabled
          />
        </label>
        <label className="settings-label">
          <span>Display Name:</span>
          <input
            className="settings-input"
            type="text"
            value={newDisplayName}
            disabled={!editDisplayName}
            onChange={(e) => setNewDisplayName(e.target.value)}
          />
          {!editDisplayName && <button className="settings-button" onClick={() => setEditDisplayName(true)}>Edit</button>}
          {editDisplayName && <button className="settings-button" onClick={changeDisplaynameHandler}>Save</button>}
        </label>
        {!passwordSent && <button className="settings-button" onClick={() => {resetPasswordHandler(); setPasswordSent(true);}}>Change password</button>}
        {passwordSent && <button className="settings-button">Email sent!</button>}
      </div>
    </div>
  );
};

export default Settings;
