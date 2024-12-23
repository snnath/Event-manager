import React, { Fragment, useState, useEffect } from "react";

const InputAttendee = () => {
  const [name, setAttendeeName] = useState("");
  const [task, setAttendeeTask] = useState("");
  const [event_id, setEventId] = useState(""); // Ensure correct variable name for event ID
  const [events, setEvents] = useState([]); // Store events fetched from the backend
  const [message, setMessage] = useState(""); // Success or error message

  // Fetch events from the backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:4000/events");
        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();
        setEvents(data); // Store the events
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, []);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { name, task, event_id }; // Ensure correct data is being sent
      const response = await fetch("http://localhost:4000/attendees/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Failed to add attendee");

      const result = await response.json();
      setMessage(`Attendee ${result.name} added successfully!`); // Show success message

      // Reset form fields after successful submission
      setAttendeeName("");
      setAttendeeTask("");
      setEventId("");
    } catch (err) {
      console.error("Error adding attendee:", err);
      setMessage("Error adding attendee. Please try again.");
    }
  };

  return (
    <Fragment>
      <h1 className="text-center mt-5">Attendee Management</h1>

      {message && (
        <div className="alert alert-info" role="alert">
          {message}
        </div>
      )}

      <form className="d-flex flex-column mt-5" onSubmit={onSubmitForm}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Attendee Name
          </label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={name}
            onChange={(e) => setAttendeeName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="task" className="form-label">
            Assigned Task
          </label>
          <input
            type="text"
            id="task"
            className="form-control"
            value={task}
            onChange={(e) => setAttendeeTask(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="event_id" className="form-label">
            Select Event
          </label>
          <select
            id="event_id"
            className="form-control"
            value={event_id}
            onChange={(e) => setEventId(e.target.value)}
            required
          >
            <option value="">Select Event</option>
            {events.length > 0 ? (
              events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))
            ) : (
              <option disabled>No Events Available</option>
            )}
          </select>
        </div>
        <button className="btn btn-success">Add Attendee</button>
      </form>
    </Fragment>
  );
};

export default InputAttendee;
