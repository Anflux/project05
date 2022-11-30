import "./ActivityList.css"
import { Link } from "react-router-dom"
import Trashcan from "../assets/trashcan.svg"
import { projectFirestore } from "../firebase/config"
import React, {useContext} from 'react'
import { AuthContext } from "../context/Auth"


const clickHandler = (id) =>{
  projectFirestore.collection("Activities").doc(id).delete();
}



const ActivityList = ({activities}) => {
  const {currentUser} = useContext(AuthContext)
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
                {currentUser.uid===activity.uid && <img className="delete" src={Trashcan} onClick={()=>clickHandler(activity.id)}/>}
            </div>
        ))}
    </div>
  )
} 

export default ActivityList