import React, { useEffect, useState } from "react";
import CreateEvent from "./components/createEvent";
import ListEvent from "./components/listEvent";
import AttendeeManagement from "./components/AttendeeManagement";
import ListAttendees from "./components/ListAttendees";
import TaskTracker from "./components/TaskTracker";
import ListTasks from "./components/ListTasks";

function App() {
  const [page, setPage] = useState("");

  // Detect the page based on URL path
  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath === "/events") {
      setPage("events");
    } else if (currentPath === "/attendees") {
      setPage("attendees");
    } else if (currentPath === "/tasks") {
      setPage("tasks");
    } else {
      setPage("home");
    }
  }, []);

  // Handle Navigation to different pages
  const navigateToPage = (path) => {
    window.history.pushState(null, "", path); // Change URL without reload
    setPage(path.substring(1)); // Update page state based on path
    window.location.reload(); // Force reload to render the new page content
  };

  return (
    <div className="container">
      {/* Navigation Links */}
      <div className="text-center mt-5">
        <h1>Event Management Dashboard</h1>
        <div className="mt-4">
          <button
            onClick={() => navigateToPage("/events")}
            className="btn btn-primary m-2"
          >
            Go to Events
          </button>
          <button
            onClick={() => navigateToPage("/attendees")}
            className="btn btn-primary m-2"
          >
            Go to Attendees
          </button>
          <button
            onClick={() => navigateToPage("/tasks")}
            className="btn btn-primary m-2"
          >
            Go to Task Manager
          </button>
        </div>
      </div>

      {/* Conditional Page Rendering */}
      {page === "home" && (
        <div className="text-center mt-5">
          <h2>Welcome to the Event Management Dashboard</h2>
          <p>Please choose an option above.</p>
        </div>
      )}

      {page === "events" && (
        <div>
          <CreateEvent />
          <ListEvent />
        </div>
      )}

      {page === "attendees" && (
        <div>
          <AttendeeManagement />
          <ListAttendees />
        </div>
      )}
      {page === "tasks" && (
        <div>
          <TaskTracker />
          <ListTasks />
        </div>
      )}
    </div>
  );
}

export default App;
