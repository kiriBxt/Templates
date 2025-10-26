-- Roles with priority (higher = more powerful)
INSERT INTO
    user_roles (name, priority)
VALUES
    ('founder', 100),
    ('owner', 95),
    ('superadmin', 80),
    ('admin', 50),
    ('moderator', 25),
    ('user', 10) ON CONFLICT (name) DO NOTHING;

-- Permissions
INSERT INTO
    role_permissions (name)
VALUES
    ('users.view'),
    ('users.edit'),
    ('users.delete'),
    ('posts.create'),
    ('posts.edit'),
    ('posts.delete') ON CONFLICT (name) DO NOTHING;

-- Link permissions to roles
INSERT INTO
    role_permission_containers (role_id, permission_id)
SELECT
    r.id,
    p.id
FROM
    user_roles r,
    role_permissions p
WHERE
    (r.name = 'founder')
    OR (r.name = 'owner')
    OR (
        r.name = 'admin'
        AND p.name IN (
            'users.view',
            'users.edit',
            'posts.create',
            'posts.edit'
        )
    )
    OR (
        r.name = 'moderator'
        AND p.name IN ('users.view', 'posts.edit', 'posts.delete')
    )
    OR (
        r.name = 'user'
        AND p.name IN ('posts.create')
    ) ON CONFLICT DO NOTHING;