-- USER TABLES
CREATE TABLE
    IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        name VARCHAR(25) UNIQUE NOT NULL,
        creationdate TIMESTAMPTZ NOT NULL DEFAULT NOW ()
    );

CREATE TABLE
    IF NOT EXISTS user_credentials (
        user_id UUID PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
        email VARCHAR(50) UNIQUE,
        password VARCHAR(80) NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS user_roles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        priority INT NOT NULL DEFAULT 50
    );

-- ROLE TABLES
CREATE TABLE
    IF NOT EXISTS role_permissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS user_role_containers (
        user_id UUID REFERENCES users (id) ON DELETE CASCADE,
        role_id INT REFERENCES user_roles (id) ON DELETE CASCADE DEFAULT 6,
        PRIMARY KEY (user_id, role_id)
    );

CREATE TABLE
    IF NOT EXISTS role_permission_containers (
        role_id INT REFERENCES user_roles (id) ON DELETE CASCADE,
        permission_id INT REFERENCES role_permissions (id) ON DELETE CASCADE,
        PRIMARY KEY (role_id, permission_id)
    );

-- CHAT TABLES
CREATE TABLE
    IF NOT EXISTS channels (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        isPrivate BOOLEAN DEFAULT false,
        creationdate TIMESTAMPTZ NOT NULL DEFAULT NOW ()
    );

CREATE TABLE
    IF NOT EXISTS channel_messages (
        id SERIAL PRIMARY KEY,
        channel_id INT REFERENCES channels (id) ON DELETE CASCADE,
        user_id UUID REFERENCES users (id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        isVisible BOOLEAN DEFAULT true,
        creationdate TIMESTAMPTZ NOT NULL DEFAULT NOW ()
    );

-- POST TABLES
CREATE TABLE
    IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        user_id UUID REFERENCES users (id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        visible BOOLEAN NOT NULL DEFAULT true,
        creationdate TIMESTAMPTZ NOT NULL DEFAULT NOW ()
    );

CREATE TABLE
    IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        post_id INT REFERENCES posts (id) ON DELETE CASCADE,
        user_id UUID REFERENCES users (id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        visible BOOLEAN NOT NULL DEFAULT true,
        edited BOOLEAN NOT NULL DEFAULT false,
        creationdate TIMESTAMPTZ NOT NULL DEFAULT NOW ()
    );

CREATE TABLE
    IF NOT EXISTS post_edit_history (
        id SERIAL PRIMARY KEY,
        post_id INT REFERENCES posts (id) ON DELETE CASCADE,
        old_content TEXT NOT NULL,
        creationdate TIMESTAMPTZ NOT NULL DEFAULT NOW ()
    );

CREATE TABLE
    IF NOT EXISTS comment_edit_history (
        id SERIAL PRIMARY KEY,
        comment_id INT REFERENCES comments (id) ON DELETE CASCADE,
        old_content TEXT NOT NULL,
        creationdate TIMESTAMPTZ NOT NULL DEFAULT NOW ()
    );