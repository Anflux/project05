import "./ActivityList.css"
import { Link } from "react-router-dom"
import Heart from "../assets/heart.png"
import { projectFirestore } from "../firebase/config"
import React from 'react'
import { AuthContext } from "../context/Auth"
import { useContext } from "react"


const ActivityList = ({activities}) => {
  const { currentUser } = useContext(AuthContext);


const likeHandler = (id, likedUsers, likes) =>{

      if(likedUsers.includes(currentUser.uid)){
        likedUsers.splice(currentUser.uid)
        likes=likes-1;
        projectFirestore.collection("Activities").doc(id).update({likedUsers});
        projectFirestore.collection("Activities").doc(id).update({likes})
        return;
      }
      else{
        likedUsers.push(currentUser.uid)
        likes=likes+1;
        projectFirestore.collection("Activities").doc(id).update({likedUsers});
        projectFirestore.collection("Activities").doc(id).update({likes})
        return;
      }
    }

  return (
    <div className="activity-list">
        {activities.map(activity =>(
            <div key={activity.id} className="card">
                <h3>{activity.title}</h3>
                <p>{activity.activityTime} minutes to do.</p>
                <div>{activity.description.substring(0,100)}...</div>
                <p className={activity.user}>Date: {activity.date}</p>
                <p className={activity.user}>{activity.city}, {activity.street}</p>
                <Link to={`/activities/${activity.id}`}>See more</Link>
                <div className="heart">
                  <img src={Heart} alt="Like" onClick={()=>likeHandler(activity.id, activity.likedUsers, activity.likes)}/>
                  <p>{activity.likes}</p>
                </div>
            </div>
        ))}
    </div>
  )
} 

export default ActivityList