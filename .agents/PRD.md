# Product Requirements Document (PRD)

## Product Overview

**Name**: Laravel 13 + Inertia.js + React Admin Starter  
**Type**: Web Application Boilerplate / Admin Panel  
**Target Audience**: Developers building multi-role Laravel admin applications

---

## Goals

1. Provide a production-ready Laravel admin starter with authentication and role-based access control out of the box.
2. Enable rapid feature development by following consistent CRUD patterns.
3. Be easily understandable and extendable by both developers and AI agents.

---

## Core Features (MVP)

### Authentication
- [x] Login
- [x] Logout
- [x] Password reset (forgot password flow)
- [x] Remember me

### User Management
- [x] List users (with search + pagination)
- [x] Create user (assign roles, set status)
- [x] Edit user (update info, avatar, roles)
- [x] Delete user (with confirmation)
- [x] Active / Inactive status toggle

### Role Management
- [x] List roles
- [x] Create role (with permission assignment)
- [x] Edit role (update permissions)
- [x] Delete role

### Permission Management
- [x] List permissions
- [x] Create permission
- [x] Edit permission
- [x] Delete permission

### Profile
- [x] View & edit own profile
- [x] Upload avatar
- [x] Change password

### Settings
- [x] Update app name
- [x] Upload app logo

### Dashboard
- [x] Overview statistics

---

## Access Control

All actions are protected by **Spatie laravel-permission**:

| Permission | Who can use it |
|---|---|
| `users.index` | List users |
| `users.create` | Create users |
| `users.edit` | Edit users |
| `users.delete` | Delete users |
| `roles.index` | List roles |
| `roles.create` | Create roles |
| `roles.edit` | Edit roles |
| `roles.delete` | Delete roles |
| `permissions.index` | List permissions |
| `permissions.create` | Create permissions |
| `permissions.edit` | Edit permissions |
| `permissions.delete` | Delete permissions |
| `settings.index` | View settings |
| `settings.edit` | Edit settings |

---

## Non-Functional Requirements

- **Performance**: Pages render fast via Inertia.js (no full page reloads after initial load).
- **Security**: All routes authenticated. Permissions checked both server-side (middleware) and client-side (UI).
- **Maintainability**: Consistent CRUD patterns across all modules for easy onboarding.
- **Extensibility**: New modules can be added following the Architecture guide without touching existing code.
- **Accessibility**: Use semantic HTML and Shadcn UI which follows WAI-ARIA standards.

---

## Future Features (Post-MVP)

- [ ] Multi-tenancy / organization support
- [ ] Activity log / audit trail
- [ ] Email notifications
- [ ] Two-factor authentication (2FA)
- [ ] API support (Laravel Sanctum)
- [ ] Role-based dashboard (different views per role)
- [ ] Export to CSV / Excel

---

## Out of Scope

- Mobile app (this is a web-only admin panel)
- Public-facing frontend (separate project)
