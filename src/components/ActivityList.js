import React from 'react';
import { Link } from 'react-router-dom';
import { projectFirestore } from '../firebase/config';
import { AuthContext } from '../context/Auth';
import { useContext } from 'react';
import './ActivityList.css';

const ActivityList = ({ activities }) => {
  const { currentUser } = useContext(AuthContext);

  const likeHandler = (id, likedUsers, likes) => {
    if (likedUsers.includes(currentUser.uid)) {
      likedUsers.splice(currentUser.uid);
      likes = likes - 1;
      projectFirestore.collection('Activities').doc(id).update({ likedUsers });
      projectFirestore.collection('Activities').doc(id).update({ likes });
      return;
    } else {
      likedUsers.push(currentUser.uid);
      likes = likes + 1;
      projectFirestore.collection('Activities').doc(id).update({ likedUsers });
      projectFirestore.collection('Activities').doc(id).update({ likes });
      return;
    }
  };

  return (
    <div className="activity-list">
      {activities.map((activity) => (
        <div key={activity.id} className="card">
          <h3>{activity.title}</h3>
          <p>{activity.activityTime} minutes to do.</p>
          <div>{activity.description.substring(0, 100)}...</div>
          <p className='details'>Date: {activity.date} <br></br>
            {activity.city}, {activity.street}
          </p>
          <Link to={`/activities/${activity.id}`}>See more</Link>
          <div
            className="heart"
            onClick={() =>
              likeHandler(activity.id, activity.likedUsers, activity.likes)
            }
          >
            <i
              className="material-icons"
              style={{
                color: activity.likedUsers.includes(currentUser.uid)
                  ? 'red'
                  : 'gray',
              }}
            >
              {activity.likedUsers.includes(currentUser.uid)
                ? 'favorite'
                : 'favorite_border'}
            </i>
            <span className="likes-count">{activity.likes}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityList;
