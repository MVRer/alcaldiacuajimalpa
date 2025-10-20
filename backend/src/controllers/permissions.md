# Permissions Documentation

## Reports Permissions

### `view_reports`
- **Required for:** Viewing list of reports and individual report details
- **Methods:**
  - `GET /reports` (getAllReports)
  - `GET /reports/:id` (getReportById)
- **Description:** Allows users to view all reports or specific report by ID

### `create_reports`
- **Required for:** Creating new reports
- **Methods:**
  - `POST /reports` (createReport)
- **Description:** Allows users to create new emergency reports. Automatically tracks creator, turn, and timestamp.

### `edit_reports`
- **Required for:** Updating existing reports
- **Methods:**
  - `PUT /reports/:id` (updateReport)
- **Description:** Allows users to modify report details including all fields from the frontend form.

### `delete_reports`
- **Required for:** Deleting reports
- **Methods:**
  - `DELETE /reports/:id` (deleteReport)
- **Description:** Allows users to permanently delete reports from the system.

---

## Users Permissions

### `view_users`
- **Required for:** Viewing list of users and individual user details
- **Methods:**
  - `GET /users` (getAllUsers)
  - `GET /users/:id` (getUserById)
- **Description:** Allows users to view all system users or specific user by ID. Passwords are never returned.

### `create_users`
- **Required for:** Creating new users
- **Methods:**
  - `POST /users` (createUser)
- **Description:** Allows users to create new system users. Validates email uniqueness, hashes passwords, and tracks who created the user.

### `edit_users`
- **Required for:** Updating existing users
- **Methods:**
  - `PUT /users/:id` (updateUser)
- **Description:** Allows users to modify user details including personal info, role, and turnos. Password can be updated (will be hashed).

### `delete_users`
- **Required for:** Deleting users
- **Methods:**
  - `DELETE /users/:id` (deleteUser)
- **Description:** Allows users to permanently delete users from the system.

---

## Special Permissions

### `*` (Wildcard)
- **Description:** Grants all permissions. Typically assigned to admin users.
- **Usage:** User with `permissions: ['*']` can perform any action.

---

## Notes
- All routes require authentication via JWT token in `Authorization: Bearer <token>` header
- Missing or invalid token returns `401 Unauthorized`
- Valid token but insufficient permissions returns `403 Forbidden`
- Permission checking is done using `authController.hasPermission(userId, permission)`
