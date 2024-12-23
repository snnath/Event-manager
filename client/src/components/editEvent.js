import React, { Fragment, useState } from "react";

const EditEvent = ({ event }) => {
  // State for each field
  const [name, setName] = useState(event.name);
  const [description, setDescription] = useState(event.description);
  const [location, setLocation] = useState(event.location);
  const [date, setDate] = useState(event.date);

  // Function to handle update
  const updateEvent = async (e) => {
    e.preventDefault();
    try {
      const body = { name, description, location, date }; // Send all fields
      const response = await fetch(`http://localhost:4000/events/${event.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        window.location = "/"; // Refresh page
      } else {
        console.error("Failed to update event");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <button
        type="button"
        className="btn btn-warning"
        data-toggle="modal"
        data-target={`#id${event.id}`}
      >
        Edit
      </button>

      {/* Modal */}
      <div className="modal" id={`id${event.id}`}>
        <div className="modal-dialog">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h4 className="modal-title">Edit Event</h4>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                onClick={() => setName(event.name)}
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              <input
                type="text"
                className="form-control mb-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Event Name"
              />
              <input
                type="text"
                className="form-control mb-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Event Description"
              />
              <input
                type="text"
                className="form-control mb-2"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Event Location"
              />
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Event Date"
              />
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-warning"
                data-dismiss="modal"
                onClick={updateEvent}
              >
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-danger"
                data-dismiss="modal"
                onClick={() => setName(event.name)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default EditEvent;
