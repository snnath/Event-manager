import React, { useState, useEffect } from "react";

const TaskCreation = () => {
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    deadline: "",
    attendee_id: "",
    event_id: "", // Store selected event_id
  });
  const [status, setStatus] = useState("Pending");
  const [message, setMessage] = useState(""); // Success or error message
  const [attendees, setAttendees] = useState([]); // Store attendees for dropdown
  const [events, setEvents] = useState([]); // Store events for event selection

  // Fetch events for event assignment dropdown
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:4000/events");
        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();
        setEvents(data); // Store events
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
  }, []);

  // Fetch attendees for task assignment dropdown
  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const response = await fetch("http://localhost:4000/attendees");
        if (!response.ok) throw new Error("Failed to fetch attendees");
        const data = await response.json();
        setAttendees(data); // Store attendees
      } catch (err) {
        console.error("Error fetching attendees:", err);
      }
    };

    fetchAttendees();
  }, []);

  // Handle input changes for the new task form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  // Handle task creation
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const body = { ...newTask, status }; // Pass status along with task details
      console.log("Task creation request body:", body);

      const response = await fetch("http://localhost:4000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error response:", error);
        throw new Error(error.error || "Failed to add task");
      }

      const result = await response.json();
      setMessage(`Task '${result.task.name}' added successfully!`); // Show success message

      // Reset form fields after successful submission
      setNewTask({
        name: "",
        description: "",
        deadline: "",
        attendee_id: "",
        event_id: "", // Reset event ID as well
      });
      setStatus("Pending");
    } catch (err) {
      console.error("Error adding task:", err.message);
      setMessage(err.message || "Error adding task. Please try again.");
    }
  };

  return (
    <div>
      <h1 className="text-center mt-5">Create New Task</h1>

      {message && (
        <div className="alert alert-info" role="alert">
          {message}
        </div>
      )}

      <form className="d-flex flex-column mt-5" onSubmit={handleCreateTask}>
        <div className="mb-3">
          <label htmlFor="event_id" className="form-label">
            Assign to Event
          </label>
          <select
            id="event_id"
            name="event_id"
            className="form-control"
            value={newTask.event_id}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Event</option>
            {events.length > 0 ? (
              events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name} ({event.id}) {/* Display event name and ID */}
                </option>
              ))
            ) : (
              <option disabled>No Events Available</option>
            )}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Task Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            value={newTask.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Task Description
          </label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            value={newTask.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="deadline" className="form-label">
            Deadline
          </label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            className="form-control"
            value={newTask.deadline}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="attendee_id" className="form-label">
            Assign to Attendee
          </label>
          <select
            id="attendee_id"
            name="attendee_id"
            className="form-control"
            value={newTask.attendee_id}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Attendee</option>
            {attendees.length > 0 ? (
              attendees.map((attendee) => (
                <option key={attendee.id} value={attendee.id}>
                  {attendee.id} {/* Display attendee's ID */}
                </option>
              ))
            ) : (
              <option disabled>No Attendees Available</option>
            )}
          </select>
        </div>

        <button className="btn btn-success">Create Task</button>
      </form>
    </div>
  );
};

export default TaskCreation;
