export const permissionsValidator = async (req, res) => {
  const permissions = req.routeOptions.config.permission;
  if (!permissions) return;
  if (!req.user_id) {
    throw new Error("Must be logged in!", { cause: 401 });
  }

  if (!(await hasPermission(req, permissions))) {
    throw new Error(`Missing permission: ${permissions}`, { cause: 401 });
  }
};

const hasPermission = async (req, permissions) => {
  const actorUser_id = req.user_id;
  const targetUser_id = req.body?.user_id || null;
  const targetRole_id = req.body?.role_id || null;

  if (actorUser_id) {
    const [user] = await psql`
      SELECT array_agg(DISTINCT rp.name) AS permissions
        FROM users u
        JOIN user_role_containers urc ON urc.user_id = u.id
        JOIN user_roles ur ON ur.id = urc.role_id
        JOIN role_permission_containers rpc ON rpc.role_id = ur.id
        JOIN role_permissions rp ON rp.id = rpc.permission_id
        WHERE u.id = ${actorUser_id};
    `;
    if (!user) return false; // no permission, no further checks
    permissions.forEach((e) => {
      if (!user.permissions.includes(e))
        throw new Error(`Missing permission: ${permissions}`, { cause: 401 });
    });
  }

  if (targetUser_id) {
    // Self check (always allowed)
    if (actorUser_id === targetUser_id && !targetUser_id) return true;

    // Hierarchy check
    const [hierarchy] = await psql`
    WITH 
    actor_role AS (
      SELECT MAX(r.priority) AS priority
      FROM user_role_containers urc
      JOIN user_roles r ON urc.role_id = r.id
      WHERE urc.user_id = ${actorUser_id}
    ),
    target_user_role AS (
      SELECT MAX(r.priority) AS priority
      FROM user_role_containers urc
      JOIN user_roles r ON urc.role_id = r.id
      WHERE urc.user_id = ${targetUser_id}
    )
    SELECT 1
    FROM actor_role, target_user_role
    WHERE actor_role.priority > target_user_role.priority   -- actor outranks target
       OR actor_role.priority > 90                          -- owner bypass
    LIMIT 1
  `;
    if (!hierarchy) return false;
  }

  if (targetRole_id) {
    const [hierarchy] = await psql`
    WITH actor AS (
      SELECT MAX(r.priority) AS priority FROM user_role_containers urc JOIN user_roles r ON urc.role_id=r.id WHERE urc.user_id=${actorUser_id}
        ), target AS (
      SELECT MAX(r.priority) AS priority FROM user_role_containers urc JOIN user_roles r ON urc.role_id=r.id WHERE urc.user_id=${targetUser_id}
        ) SELECT 1 FROM actor, target WHERE actor.priority >= target.priority LIMIT 1;`;

    if (!hierarchy) return false;
  }

  return true;
};
