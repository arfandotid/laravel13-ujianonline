# AI Agent Guide - Laravel 13 + Inertia.js + React + Spatie Permission

## 1. Project Overview & Architecture

This repository is a modern web application built with:
- **Backend**: Laravel 13 (PHP 8.3+)
- **Frontend**: React 19 + Inertia.js v2 + TailwindCSS v4
- **Auth & Access Control**: Laravel Web Guard + Spatie `laravel-permission`
- **UI Components**: Custom components + Shadcn UI primitives (`resources/js/Components/ui`)

### Key Architecture Patterns
1. **Inertia.js Protocol**: Server returns Inertia responses (`Inertia::render('PageName', $props)`). Client renders matching React pages in `resources/js/Pages/PageName/Index.jsx`.
2. **Permission Middleware**: Actions are protected via static `middleware()` method in Controllers or route definitions using Spatie permissions (e.g. `permission:users.index`).
3. **Explicit Querying & IDs**: Controllers accept `$id` for model lookups instead of implicit route model binding to allow custom query logic, scoping, and data mapping.
4. **Form Requests**: All HTTP validation lives in dedicated `app/Http/Requests` classes.

---

## 2. Directory Structure & Conventions

```
app/
├── Http/
│   ├── Controllers/         # Handles HTTP requests & Inertia renders
│   │   ├── Auth/            # Authentication controllers
│   │   ├── UserController.php
│   │   ├── RoleController.php
│   │   ├── PermissionController.php
│   │   ├── ProfileController.php
│   │   └── SettingController.php
│   ├── Middleware/          # HandleInertiaRequests (shares auth, permissions, settings, flash)
│   └── Requests/            # Form Validation classes grouped by feature/domain
│       ├── User/
│       ├── Role/
│       ├── Permission/
│       ├── Profile/
│       └── Setting/
├── Models/                  # Eloquent Models (User, Setting, etc.)
└── Traits/                  # Reusable server traits (e.g., FileUploadTrait)

resources/
├── js/
│   ├── Components/          # Frontend React components
│   │   ├── common/          # Shared page components (PageHeader, Search, Delete, TablePagination, TableEmpty)
│   │   ├── form/            # Form controls & specialized selects (StatusSelect)
│   │   ├── table/           # Table components (BasicTable)
│   │   ├── theme/           # Theme provider & toggle (ThemeProvider, ThemeToggle)
│   │   ├── Sidebar/         # App navigation sidebar components
│   │   └── ui/              # Shadcn UI low-level primitives (Button, Input, Avatar, etc.)
│   ├── Layouts/             # Layout components (LayoutApp, LayoutAuth)
│   ├── Pages/               # Inertia page views (Auth, Dashboard, Users, Roles, Permissions, Profile, Settings)
│   ├── utils/               # Helper utilities (permissions.js)
│   └── constants/           # JS constants (app.js)
```

---

## 3. Naming Conventions

- **Controllers**: PascalCase plural/singular resource name + `Controller.php` (`UserController.php`)
- **Form Requests**: Action + Resource + `Request.php` (`StoreUserRequest.php`, `UpdateUserRequest.php`)
- **Permissions**: `resource.action` (`users.index`, `users.create`, `users.edit`, `users.delete`)
- **React Components**: PascalCase (`.jsx`)
- **React Utilities**: camelCase (`.js`) in `resources/js/utils/`

---

## 4. How to Implement a New Feature / Module

When adding a new CRUD module (e.g., `Product`):

1. **Database & Model**:
   - Create migration & Eloquent Model (`app/Models/Product.php`)
   - Add permission seeders (`products.index`, `products.create`, `products.edit`, `products.delete`)

2. **Form Requests**:
   - Create `app/Http/Requests/Product/StoreProductRequest.php`
   - Create `app/Http/Requests/Product/UpdateProductRequest.php`

3. **Controller**:
   - Create `app/Http/Controllers/ProductController.php`
   - Implement `middleware()` for Spatie permissions
   - Use `$id` parameters for `edit`, `update`, `destroy` methods (e.g., `$product = Product::findOrFail($id);`)
   - Return Inertia render calls and redirect using named routes (`redirect()->route('products.index')`)

4. **Routes**:
   - Register resource or individual routes in `routes/web.php` with named routes.

5. **Frontend Pages**:
   - Create `resources/js/Pages/Products/Index.jsx`
   - Create `resources/js/Pages/Products/Create.jsx`
   - Create `resources/js/Pages/Products/Edit.jsx`
   - Update sidebar menu config in `resources/js/Components/Sidebar/menuConfig.js`

---

## 5. Shared Inertia Props

Available on `usePage().props`:
- `auth.user`: Current authenticated user object
- `auth.permissions`: Map of user permissions (e.g. `{ "users.index": true }`)
- `flash.success`: Flash success message string
- `flash.error`: Flash error message string
- `settings`: Global application settings object
