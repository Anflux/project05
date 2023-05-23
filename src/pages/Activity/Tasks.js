import React, { useEffect, useState } from "react";
import { projectFirestore } from "../../firebase/config";
import { AuthContext } from "../../context/Auth";
import { useContext } from "react";
import "./Tasks.css";

const Tasks = ({ activityId, activityData }) => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const unsubscribe = projectFirestore
      .collection("Activities")
      .doc(activityId)
      .onSnapshot((doc) => {
        if (doc.exists) {
          const data = doc.data();
          if (data.tasks) {
            setTasks(data.tasks);
          }
        }
      });

    return () => unsubscribe();
  }, [activityId]);

  const saveTasks = async (updatedTasks) => {
    try {
      await projectFirestore
        .collection("Activities")
        .doc(activityId)
        .update({ tasks: updatedTasks });
    } catch (error) {
      console.error("Error updating tasks: ", error);
    }
  };

  const addTask = () => {
    const newTask = {
      name: taskInput,
      progress: 0,
      timeLimit: parseInt(timeLimit, 10),
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    setTaskInput("");
    setTimeLimit("");
    saveTasks(updatedTasks);
  };

  const increaseProgress = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].progress += 10;
    if (updatedTasks[index].progress > 100) {
      updatedTasks[index].progress = 100;
    }
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  return (
    <div className="tasks-container">
      {activityData?.uid === currentUser.uid ? (<div className="task-input">
        <input
          type="text"
          placeholder="Task name"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
        />
        <input
          type="number"
          placeholder="Time limit (optional)"
          value={timeLimit}
          onChange={(e) => setTimeLimit(e.target.value)}
        />
        <button onClick={addTask}>
          <i className="material-icons">add</i>
          Add Task
        </button>
      </div>) : ("")}
      <div className="tasks-list">
        {tasks.map((task, index) => (
          <div key={index} className="task-item">
            <div className="task-info">
              <span className="task-name">
                {task.name} {task.timeLimit} minutes
              </span>
              <div className="task-progress-container">
                <div
                  className="task-progress"
                  style={{ width: `${task.progress}%` }}
                ></div>
              </div>
            </div>
            {activityData?.uid === currentUser.uid ? (
              <button onClick={() => increaseProgress(index)}>
                <i className="material-icons">add</i>
                10%
              </button>
            ) : (
              ""
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
