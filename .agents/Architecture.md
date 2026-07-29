# Architecture Guide

## Tech Stack

| Layer             | Technology                | Version |
| ----------------- | ------------------------- | ------- |
| Backend Framework | Laravel                   | 13      |
| PHP               | PHP                       | 8.3+    |
| Frontend Bridge   | Inertia.js                | v2      |
| Frontend UI       | React                     | 19      |
| CSS Framework     | TailwindCSS               | v4      |
| Access Control    | Spatie laravel-permission | latest  |
| UI Primitives     | Shadcn UI                 | -       |
| HTTP Client       | Axios                     | -       |
| Alert Dialogs     | SweetAlert2               | -       |
| Build Tool        | Vite                      | -       |

---

## Request Lifecycle

```
Browser → Laravel Router → Middleware → Controller → Inertia::render()
                                                          ↓
                                             React Page Component
                                             (resources/js/Pages/)
```

1. **Request** hits Laravel via `routes/web.php`.
2. **Middleware** (`HandleInertiaRequests`) shares global props: `auth`, `flash`, `settings`.
3. **Controller** processes logic and returns `Inertia::render('PageName', $props)`.
4. **Inertia.js** matches the page name to `resources/js/Pages/PageName/Index.jsx`.
5. **React** renders the component with the server-passed props.

---

## Key Architecture Patterns

### 1. Inertia.js Protocol

- Server returns `Inertia::render('PageName', $props)`.
- Client renders matching React pages at `resources/js/Pages/PageName/Index.jsx`.
- Page navigation uses `<Link>` from `@inertiajs/react` — no full-page reloads.
- Forms use `useForm()` hook from `@inertiajs/react` for form state & submission.

### 2. Permission Middleware

- Routes/Controllers are protected using Spatie Permission.
- Permissions follow `resource.action` format (e.g., `users.index`, `users.create`).
- Declare permissions in the controller's static `middleware()` method.
- Check permissions on the frontend using `auth.permissions` from `usePage().props`.

### 3. Explicit ID Parameters

- Controllers accept `$id` instead of implicit route model binding.
- Pattern: `$model = Model::findOrFail($id);`
- Allows custom query logic, scoping, and data transformation before use.

### 4. Form Requests

- All HTTP input validation lives in `app/Http/Requests/`.
- Grouped by domain/feature (e.g., `User/StoreUserRequest.php`).
- Controllers are kept lean by delegating validation to Form Requests.

---

## Directory Structure

```
laravel13-react-spatie/
├── app/
│   ├── Http/
│   │   ├── Controllers/             # HTTP controllers
│   │   │   ├── Auth/                # Authentication (Login, Register, etc.)
│   │   │   ├── Admin/               # Admin Role Controller
│   │   │   ├── Participant/         # Participant Role Controller
│   │   ├── Middleware/
│   │   └── Requests/                # Form validation — grouped by domain
│   ├── Models/
│   ├── Providers/
│   └── Traits/
│       └── FileUploadTrait.php      # Reusable file upload logic
│
├── resources/
│   ├── css/
│   │   └── app.css                  # TailwindCSS v4 + Shadcn design tokens
│   └── js/
│       ├── app.jsx                  # Inertia.js bootstrap
│       ├── bootstrap.js             # Axios setup
│       ├── Components/              # Reusable React components
│       │   ├── common/              # Page-level shared components
│       │   ├── form/                # Form controls
│       │   ├── table/               # Table components
│       │   └── ui/                  # Shadcn UI primitives (Button, Input, etc.)
│       ├── Layouts/
│       │   ├── LayoutApp.jsx        # Authenticated app shell (sidebar + header)
│       │   └── LayoutAuth.jsx       # Unauthenticated auth pages layout
│       ├── Pages/                   # Inertia page components
│       │   ├── Auth/                # Login, Register, etc.
│       │   ├── Admin/               # Admin Role Pages
│       │   ├── Participant/         # Participant Role Pages
│       ├── constants/
│       │   └── app.js               # App-wide JS constants
│       ├── hooks/                   # Custom React hooks
│       ├── lib/                     # Utility library wrappers
│       └── utils/
│           └── permissions.js       # Frontend permission helper
│
├── database/
│   ├── migrations/
│   └── seeders/
│
├── routes/
│   └── web.php                      # All web routes
│
└── .agents/                         # AI Agent documentation
    ├── Architecture.md
    ├── Design.md
    ├── PRD.md
    ├── Rules.md
    └── Schema.md
```

---

## Shared Inertia Props

The `HandleInertiaRequests` middleware shares these props to every page via `usePage().props`:

| Prop               | Type             | Description                          |
| ------------------ | ---------------- | ------------------------------------ |
| `auth.user`        | `Object`         | Authenticated user object            |
| `auth.permissions` | `Object`         | Map of `{ "permission.name": true }` |
| `flash.success`    | `string \| null` | Success flash message                |
| `flash.error`      | `string \| null` | Error flash message                  |
| `settings`         | `Object`         | Global app settings (name, logo)     |

---

## Adding a New CRUD Module

When implementing a new resource (e.g., `Product`):

### 1. Database & Model

```bash
php artisan make:model Product -m
```

- Define columns in the migration.
- Add the model to `app/Models/Product.php`.
- Seed permissions: `products.index`, `products.create`, `products.edit`, `products.delete`.

### 2. Form Requests

```bash
php artisan make:request Product/StoreProductRequest
php artisan make:request Product/UpdateProductRequest
```

### 3. Controller

```bash
php artisan make:controller ProductController
```

- Implement `public static function middleware()` for Spatie permissions.
- Use `$id` parameter: `$product = Product::findOrFail($id);`
- Return `Inertia::render('Products/Index', [...])`.
- Redirect with named routes: `redirect()->route('products.index')`.

### 4. Routes (`routes/web.php`)

```php
Route::resource('products', ProductController::class);
```

### 5. Frontend Pages

- `resources/js/Pages/Products/Index.jsx`
- `resources/js/Pages/Products/Create.jsx`
- `resources/js/Pages/Products/Edit.jsx`
- Add entry to `resources/js/Components/Sidebar/menuConfig.js`.
