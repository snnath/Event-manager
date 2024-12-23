import React, { Fragment, useEffect, useState } from "react";
import EditEvent from "./editEvent";

const ListEvent = () => {
  // Change the function name to ListEvent

  const [events, setEvent] = useState([]);

  //delete event function 

  const deleteEvent  = async id => {
    try {
        const deleteEvent = await fetch(`http://localhost:4000/events/${id}`, {
          method: "DELETE",
        });

        setEvent(events.filter((event) => event.id !== id));

    } catch (err ) {
        console.error(err.message)
    }
  }

  const getEvent = async () => {
    try {
      const response = await fetch("http://localhost:4000/events");
      const jsonData = await response.json();

      setEvent(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getEvent();
  }, []);

  return (
    <Fragment>
      <div className="container">
        <h2 className="text-center mt-5">List of upcoming Events</h2>

        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Location</th>
              <th>Date</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                {" "}
                {/* Assuming each event has a unique 'id' */}
                <td>{event.name}</td>
                <td>{event.description}</td>
                <td>{event.location}</td>
                <td>{event.date}</td>
                <td><EditEvent event = {event}/></td>
                <td>
                  {" "}
                  <button
                    className="btn btn-danger" onClick={() => deleteEvent(event.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Fragment>
  );
};

export default ListEvent;
