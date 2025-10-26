-- Users
CREATE INDEX IF NOT EXISTS idx_users_name ON users (name);

-- Roles & permissions
CREATE INDEX IF NOT EXISTS idx_user_role_user_id ON user_role_containers (user_id);

CREATE INDEX IF NOT EXISTS idx_user_role_role_id ON user_role_containers (role_id);

CREATE INDEX IF NOT EXISTS idx_role_perm_role_id ON role_permission_containers (role_id);

CREATE INDEX IF NOT EXISTS idx_role_perm_permission_id ON role_permission_containers (permission_id);

-- Posts/comments
CREATE INDEX IF NOT EXISTS idx_posts_creationdate ON posts (creationdate);

CREATE INDEX IF NOT EXISTS idx_comments_creationdate ON comments (creationdate);