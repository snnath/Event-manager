const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");



//middelware
app.use(cors());
app.use(express.json()); //req.body

//ROUTES

//Create an event
        app.post("/events", async (req, res) => {
        try {
            const { name, description, location, date } = req.body;

            // Ensure required fields are provided
            if (!name || !date) {
            return res
                .status(400)
                .json({ error: "Name and date are required fields." });
            }

            // Use the current time for createdAt and updatedAt
            const createdAt = new Date();
            const updatedAt = new Date();

            const newEvent = await pool.query(
            `INSERT INTO events (name, description, location, date, createdAt, updatedAt) 
                    VALUES ($1, $2, $3, $4, $5, $6) 
                    RETURNING *`, // Return the inserted event
            [name, description, location, date, createdAt, updatedAt]
            );

            res.json(newEvent.rows[0]); // Respond with the inserted event
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Server error" });
        }
        });


//view all the events

    app.get("/events", async (req, res) => {
        try {
        const allEvents = await pool.query("SELECT * FROM events");
        res.json(allEvents.rows);
        } catch (err) {
        console.error(err.message);
        }
    });

//get an event
        app.get("/events/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const event = await pool.query("SELECT * FROM events WHERE id = $1", [
            id,
            ]);

            res.json(events.rows[0]);
        } catch (err) {
            console.error(err.message);
        }
        });

// edit an event
        app.put("/events/:id", async (req, res) => {
        try {
            const { id } = req.params; // Get the event ID from the URL parameters
            const { name, description, location, date } = req.body; // Destructure fields from the request body

            // Update the event in the database
            const updatedEvent = await pool.query(
            `UPDATE events 
                    SET name = $1, 
                        description = $2, 
                        location = $3, 
                        date = $4, 
                        updatedAt = NOW() -- Update the updatedAt timestamp
                    WHERE id = $5 
                    RETURNING *`, // Return the updated row
            [name, description, location, date, id]
            );

            // If no rows are affected, the event doesn't exist
            if (updatedEvent.rowCount === 0) {
            return res.status(404).json({ error: "Event not found" });
            }

            // Respond with the updated event
            res.json({
            message: "Event updated successfully",
            updatedEvent: updatedEvent.rows[0],
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Internal server error" });
        }
        });



//delete an event

        app.delete("/events/:id", async (req, res) => {
        try {
            const { id } = req.params; // Get event ID from the request parameters
            const deleteEvent = await pool.query(
            "DELETE FROM events WHERE id = $1 RETURNING *",
            [id]
            );

            if (deleteEvent.rowCount === 0) {
            return res.status(404).json({ error: "Event not found" }); // Handle case if event doesn't exist
            }

            res.json({
            message: "Event deleted successfully",
            deletedEvent: deleteEvent.rows[0],
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Internal server error" });
        }
        });

// Create a new attendee
app.post("/attendees", async (req, res) => {
  try {
    const { name, task, event_id } = req.body;

    // Ensure required fields are provided
    if (!name || !task || !event_id) {
      return res
        .status(400)
        .json({ error: "Name, task, and event_id are required fields." });
    }

    // Use the current time for created_at and updated_at
    const created_at = new Date();
    const updated_at = new Date();

    const newAttendee = await pool.query(
      `INSERT INTO attendees (id, task, event_id, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`, // Return the inserted attendee
      [name, task, event_id, created_at, updated_at]
    );

    res.status(201).json(newAttendee.rows[0]); // Respond with the inserted attendee
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all attendees
app.get("/attendees", async (req, res) => {
  try {
    const allAttendees = await pool.query(
      `SELECT attendees.id, attendees.task, events.name AS event_name
       FROM attendees 
       INNER JOIN events ON attendees.event_id = events.id`
    ); // Includes event name from the `events` table
    res.json(allAttendees.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete an attendee
app.delete("/attendees/:id", async (req, res) => {
  try {
    const { id } = req.params; // Get attendee ID from the request parameters
    const deleteAttendee = await pool.query(
      "DELETE FROM attendees WHERE id = $1 RETURNING *",
      [id]
    );

    if (deleteAttendee.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Attendee not found" }); // Handle case if attendee doesn't exist
    }

    res.json({
      message: "Attendee deleted successfully",
      deletedAttendee: deleteAttendee.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Fetch current events (events with a date >= current date)
app.get("/current-events", async (req, res) => {
  try {
    const currentEvents = await pool.query(
      `SELECT id, name 
       FROM events 
       WHERE date >= CURRENT_DATE`
    );
    res.json(currentEvents.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});


//TASK -----------------------

// Create a Task
        app.post("/tasks", async (req, res) => {
        try {
            const { name, description, deadline, event_id, attendee_id } = req.body;

            // Ensure required fields are provided
            if (!name || !event_id) {
            return res.status(400).json({
                error: "Name and event_id are required fields.",
            });
            }

            const created_at = new Date();
            const updated_at = new Date();

            const newTask = await pool.query(
            `INSERT INTO tasks (name, description, deadline, status, event_id, attendee_id, created_at, updated_at) 
            VALUES ($1, $2, $3, 'Pending', $4, $5, $6, $7) 
            RETURNING *`,
            [name, description, deadline, event_id, attendee_id, created_at, updated_at]
            );

            res.status(201).json({
            message: "Task created successfully",
            task: newTask.rows[0],
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Server error" });
        }
        });

//get tasks for an event
        app.get("/events/:id/tasks", async (req, res) => {
          try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
              return res.status(400).json({ error: "Invalid event ID" });
            }

            const tasks = await pool.query(
              `SELECT 
        tasks.id, 
        tasks.name, 
        tasks.description, 
        tasks.deadline, 
        tasks.status, 
        attendees.name AS attendee_name 
      FROM tasks 
      LEFT JOIN attendees ON tasks.attendee_id = attendees.id 
      WHERE tasks.event_id = $1`,
              [id]
            );

            if (tasks.rows.length === 0) {
              return res
                .status(404)
                .json({ error: "No tasks found for this event." });
            }

            res.json({
              event_id: id,
              tasks: tasks.rows,
            });
          } catch (err) {
            console.error("Error fetching tasks for event:", err.message);
            res.status(500).json({ error: "Server error" });
          }
        });


//update task status
        app.put("/tasks/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            // Validate the status input
            if (!["Pending", "Completed"].includes(status)) {
            return res.status(400).json({
                error: "Invalid status. Valid values are 'Pending' or 'Completed'.",
            });
            }

            const updated_at = new Date();

            const updatedTask = await pool.query(
            `UPDATE tasks 
            SET status = $1, updated_at = $2 
            WHERE id = $3 
            RETURNING *`,
            [status, updated_at, id]
            );

            if (updatedTask.rowCount === 0) {
            return res.status(404).json({ error: "Task not found" });
            }

            res.json({
            message: "Task status updated successfully",
            task: updatedTask.rows[0],
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: "Server error" });
        }
        });

// Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await pool.query(
      `SELECT 
        tasks.id, 
        tasks.name, 
        tasks.description, 
        tasks.deadline, 
        tasks.status, 
        tasks.created_at, 
        tasks.updated_at, 
        events.name AS event_name, 
        attendees.id AS attendee_name 
      FROM tasks
      LEFT JOIN events ON tasks.event_id = events.id
      LEFT JOIN attendees ON tasks.attendee_id = attendees.id
      ORDER BY tasks.created_at DESC`
    );

    if (tasks.rows.length === 0) {
      return res.status(404).json({ error: "No tasks found." });
    }

    res.json({
      tasks: tasks.rows,
    });
  } catch (err) {
    console.error("Error fetching tasks:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});



app.listen(4000,() => {
    console.log("server has started on port 6000");
})