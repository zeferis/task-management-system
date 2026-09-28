CREATE TABLE
    users (
        id SERIAL PRIMARY KEY,
        username VARCHAR NOT NULL UNIQUE,
        email VARCHAR NOT NULL UNIQUE,
        password VARCHAR NOT NULL,
        create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR NOT NULL,
        description TEXT,
        status VARCHAR NOT NULL DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_id INTEGER NOT NULL,
        CONSTRAINT task_status_check CHECK (status IN ('active', 'complete')),
        CONSTRAINT tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );