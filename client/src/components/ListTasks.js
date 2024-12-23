import React, { Fragment, useEffect, useState } from "react";

const ListTasks = () => {
  const [tasks, setTasks] = useState([]);

  // Fetch all tasks from the backend
  const getTasks = async () => {
    try {
      const response = await fetch("http://localhost:4000/tasks");
      const jsonData = await response.json();

      // Check if tasks exist in the response
      if (jsonData.tasks) {
        setTasks(jsonData.tasks);
      } else {
        console.error("Error fetching tasks:", jsonData.error);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err.message);
    }
  };

  // Update task status to "Completed"
  const updateTaskStatus = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:4000/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "Completed", // Setting the status to "Completed"
        }),
      });

      const jsonData = await response.json();

      if (response.ok) {
        // Update the status locally after successful update
        setTasks(
          tasks.map((task) =>
            task.id === taskId ? { ...task, status: "Completed" } : task
          )
        );
      } else {
        console.error("Error updating task status:", jsonData.error);
      }
    } catch (err) {
      console.error("Error updating task status:", err.message);
    }
  };

  useEffect(() => {
    getTasks(); // Fetch tasks on component mount
  }, []);

  return (
    <Fragment>
      <div className="container">
        <h2 className="text-center mt-5">List of Tasks</h2>

        <table className="table">
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Description</th>
              <th>Event</th>
              <th>Assigned To</th>
              <th>Status</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.name}</td>
                  <td>{task.description}</td>
                  <td>{task.event_name || "No Event"}</td>
                  <td>{task.attendee_name || "No Attendee"}</td>
                  <td>{task.status}</td>
                  <td>
                    {task.status === "Pending" ? (
                      <button
                        className="btn btn-success"
                        onClick={() => updateTaskStatus(task.id)}
                      >
                        Mark as Complete
                      </button>
                    ) : (
                      <span>Completed</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No tasks available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Fragment>
  );
};

export default ListTasks;
