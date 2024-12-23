import React, { Fragment, useEffect, useState } from "react";

const ListAttendees = () => {
  const [attendees, setAttendees] = useState([]);

  // Delete attendee function
  const deleteAttendee = async (id) => {
    try {
      const deleteResponse = await fetch(
        `http://localhost:4000/attendees/${id}`,
        {
          method: "DELETE",
        }
      );

      if (deleteResponse.ok) {
        setAttendees(attendees.filter((attendee) => attendee.id !== id));
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  // Get all attendees
  const getAttendees = async () => {
    try {
      const response = await fetch("http://localhost:4000/attendees");
      const jsonData = await response.json();
      setAttendees(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getAttendees();
  }, []);

  return (
    <Fragment>
      <div className="container">
        <h2 className="text-center mt-5">List of Attendees</h2>

        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Task</th>
              <th>Event</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {attendees.length > 0 ? (
              attendees.map((attendee) => (
                <tr key={attendee.id}>
                  {/* Assuming attendee.name is missing, use attendee.id or handle accordingly */}
                  <td>{attendee.id || ""}</td> {/* Fallback to id */}
                  <td>{attendee.task}</td>
                  <td>{attendee.event_name || "No Event"}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteAttendee(attendee.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No attendees available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Fragment>
  );
};

export default ListAttendees;
