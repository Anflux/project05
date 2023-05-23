import React, { useEffect, useState } from "react";
import { AuthContext } from "../../../context/Auth";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { projectAuth, projectFirestore } from "../../../firebase/config";
import "./Volunteers.css";
import Message from "./message/Message";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Checkbox,
} from "@mui/material";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";

const Volunteers = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [users, setUsers] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState({ name: null });
  const [selectedVolunteers, setSelectedVolunteers] = useState([]);

  const [groups, setGroups] = useState([]);

  useEffect(() => {
    setIsPending(true);
    const unsub = projectFirestore
      .collection("Activities")
      .doc(id)
      .onSnapshot((doc) => {
        if (doc.exists) {
          setIsPending(false);
          setData(doc.data());
          setUsers(rows(doc.data().joinedUsers));
          setGroups(doc.data().groups || []);
        } else {
          setIsPending(false);
          setError("Could not find any Volunteers...");
          navigate("/");
        }
      });
    return () => unsub();
  }, [id, navigate]);

  const sendMessage = (name) => {
    setSelectedUser({ name });
    setShowMessageModal(true);
  };

  const closeModal = () => {
    setShowMessageModal(false);
    setSelectedUser({ name: null });
  };

  const assignRole = async (currentRole, newRole) => {
    console.log(`Assigning ${newRole} role to user with role: ${currentRole}`);
    try {
      const activityRef = projectFirestore.collection("Activities").doc(id);
      const snapshot = await activityRef.get();
      const joinedUsers = snapshot.data().joinedUsers;
      const userIndex = joinedUsers.indexOf(currentRole);

      if (userIndex !== -1) {
        joinedUsers[userIndex] = newRole;
        await activityRef.update({ joinedUsers });
      }
    } catch (error) {
      console.error("Error updating role: ", error);
    }
  };

  const toggleVolunteerSelection = (volunteer) => {
    setSelectedVolunteers((prevSelected) => {
      if (prevSelected.includes(volunteer)) {
        return prevSelected.filter((v) => v !== volunteer);
      } else {
        return [...prevSelected, volunteer];
      }
    });
  };

  const createGroup = async () => {
    const groupName = prompt("Enter a group name:");

    if (!groupName) {
      alert("Group name is required.");
      return;
    }

    if (selectedVolunteers.length === 0) {
      alert("You cannot create an empty group.");
      return;
    }

    const newGroups = [
      ...groups,
      {
        groupName,
        volunteers: selectedVolunteers,
      },
    ];

    try {
      const activityRef = projectFirestore.collection("Activities").doc(id);
      await activityRef.update({ groups: newGroups });
      setGroups(newGroups);
      setSelectedVolunteers([]);
    } catch (error) {
      console.error("Error creating a new group: ", error);
    }
  };

  const removeFromGroup = (volunteer, groupIndex) => {
    setGroups((prevGroups) => {
      const newGroups = [...prevGroups];
      const group = newGroups[groupIndex];
      group.volunteers = group.volunteers.filter((v) => v !== volunteer);
      if (group.volunteers.length === 0) {
        newGroups.splice(groupIndex, 1);
      }
      return newGroups;
    });
  };

  const addVolunteerToGroup = (volunteer, groupName) => {
    setGroups((prevGroups) => {
      const newGroups = [...prevGroups];
      const group = newGroups.find((g) => g.groupName === groupName);

      if (group && !group.volunteers.includes(volunteer)) {
        group.volunteers.push(volunteer);
      }
      return newGroups;
    });
  };

  const rows = (joinedUsers) => {
    let result = [];
    for (let i = 0; i < joinedUsers.length; i += 2) {
      result.push([joinedUsers[i], joinedUsers[i + 1]]);
    }
    console.log(result);
    return result;
  };

  return (
    <div>
      {showMessageModal && (
        <Message
          recipientName={selectedUser.name}
          activityId={id}
          closeModal={closeModal}
          visible={setShowMessageModal}
        />
      )}
      {error && <p className="error">{error}</p>}
      {isPending && <p className="loading">Loading...</p>}
      {users && (
        <>
          <div className="joined-users-list">
            {users.map((user, index) => (
              <div key={Math.random()} className="user-card">
                <div className="user-info-container">
                  <div className="user-info">
                    {currentUser.uid === data.uid ? (
                      <Checkbox
                        className="user-checkbox"
                        color="primary"
                        checked={selectedVolunteers.includes(user[0])}
                        onChange={() => toggleVolunteerSelection(user[0])}
                      />
                    ) : (
                      ""
                    )}
                    <div className="user-details">
                      <span className="user-name">{user[0]}</span>
                      <span className="user-role">{user[1]}</span>
                    </div>
                  </div>
                  <div className="send-message-container">
                    <button
                      className="send-message-button"
                      onClick={() => sendMessage(user[0])}
                    >
                      <i className="material-icons">mail_outline</i>
                      Send message
                    </button>
                  </div>
                </div>
                {currentUser.uid === data.uid ? (
                  <select
                    className="role-select"
                    value={user[1]}
                    onChange={(e) => assignRole(user[1], e.target.value)}
                  >
                    <option value="Coordinator">Coordinator</option>
                    <option value="Volunteer">Volunteer</option>
                    <option value="Manager">Manager</option>
                  </select>
                ) : (
                  ""
                )}
                {currentUser.uid === data.uid && (
                  <select
                    className="group-select"
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        addVolunteerToGroup(user[0], e.target.value);
                      }
                    }}
                  >
                    <option value="" disabled>
                      Add to group
                    </option>
                    {groups.map((group) => (
                      <option key={group.groupName} value={group.groupName}>
                        {group.groupName}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
          <Box
            sx={{
              width: "100%",
              maxWidth: 1200,
              padding: "20px",
              bgcolor: "background.paper",
              margin: "40px auto",
            }}
          >
            <div className="create-new-group">
              {currentUser.uid === data.uid ? (
                <Button variant="contained" onClick={createGroup} >
                  Create new group
                </Button>
              ) : (
                <h3 style={{padding: "5px"}}>Volunteering Groups</h3>
              )}
            </div>
            {groups.map((group, groupIndex) => (
              <>
                <h3 className="group-name">{group.groupName}</h3>
                <List key={groupIndex}>
                  {console.log(group.groupName)}
                  {group.volunteers.map((volunteer, volunteerIndex) => (
                    <ListItem key={volunteerIndex}>
                      <ListItemText primary={volunteer} />
                      <ListItemSecondaryAction>
                        {currentUser.uid === data.uid ? (
                          <IconButton
                            edge="end"
                            aria-label="remove"
                            onClick={() =>
                              removeFromGroup(volunteer, groupIndex)
                            }
                          >
                            <GroupRemoveIcon />
                          </IconButton>
                        ) : (
                          ""
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </>
            ))}
          </Box>
        </>
      )}
      <div></div>
    </div>
  );
};

export default Volunteers;
