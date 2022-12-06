import "./ActivityList.css"
import { Link } from "react-router-dom"
import Heart from "../assets/heart.png"
import { projectFirestore } from "../firebase/config"
import React, { useState} from 'react'


const ActivityList = ({activities}) => {
  const [myLikes, setMyLikes] = useState(false); 



const likeHandler = (id, likes) =>{
  if(!myLikes){
    likes=likes+1;
    projectFirestore.collection("Activities").doc(id).update({likes});
    setMyLikes(true);
  }
  else{
    likes=likes-1;
    projectFirestore.collection("Activities").doc(id).update({likes});
    setMyLikes(false)
  }
}

  return (
    <div className="activity-list">
        {activities.map(activity =>(
            <div key={activity.id} className="card">
                <h3>{activity.title}</h3>
                <p>{activity.activityTime} to do.</p>
                <div>{activity.description.substring(0,100)}...</div>
                <p className={activity.user}>Date: {activity.date}</p>
                <p className={activity.user}>{activity.city}, {activity.street}</p>
                <Link to={`/activities/${activity.id}`}>See more</Link>
                <div className="heart">
                  <img src={Heart} alt="Like" onClick={()=>likeHandler(activity.id, activity.likes)}/>
                  <p>{activity.likes}</p>
                </div>
            </div>
        ))}
    </div>
  )
} 

export default ActivityList