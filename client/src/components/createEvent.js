import React, { Fragment, useState } from "react";

const InputEvent = () => {
  const [name, setEventName] = useState("");
  const [description, setEventDescription] = useState("");
  const [date, setEventDate] = useState("");
  const [location, setEventLocation] = useState("");

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const body = { name, description, date, location };
      const response = await fetch("http://localhost:4000/events/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      console.log(response);

      window.location = "/";
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <form className="d-flex flex-column mt-5" onSubmit={onSubmitForm}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Event Name
          </label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={name}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Event Description
          </label>
          <textarea
            id="description"
            className="form-control"
            rows="3"
            value={description}
            onChange={(e) => setEventDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="date" className="form-label">
            Event Date
          </label>
          <input
            type="date"
            id="date"
            className="form-control"
            value={date}
            onChange={(e) => setEventDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="location" className="form-label">
            Event Location
          </label>
          <input
            type="text"
            id="location"
            className="form-control"
            value={location}
            onChange={(e) => setEventLocation(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-success">Add Event</button>
      </form>
    </Fragment>
  );
};

export default InputEvent;
