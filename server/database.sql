CREATE DATABASE event_management;

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    date DATE NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
    updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
);


CREATE TABLE attendees (
    id VARCHAR(255) PRIMARY KEY,        
    task VARCHAR(255) NOT NULL,         
    event_id INTEGER NOT NULL,         
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    CONSTRAINT fk_event                
        FOREIGN KEY (event_id)         
        REFERENCES events(id)          
        ON DELETE CASCADE               
);



CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    deadline DATE,
    status VARCHAR(50) DEFAULT 'Pending',
    eventId INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
    updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
)

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,                         
    name VARCHAR(255) NOT NULL,                   
    description TEXT,                          
    deadline DATE,                              
    status VARCHAR(50) DEFAULT 'Pending',         
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE, 
    attendee_id VARCHAR REFERENCES attendees(id) ON DELETE CASCADE,    
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),  
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()   
);

