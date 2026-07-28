# Laravel 13 + Inertia React + Spatie Permissions Starter

Web Application Admin Template modern yang dibangun menggunakan **Laravel 13**, **Inertia.js v2**, **React 19**, **TailwindCSS v4**, **shadcn/ui**, dan **Spatie Laravel Permission**.

---

## Tech Stack

- **Backend**: Laravel 13 (PHP 8.3+)
- **Frontend**: React 19 + Inertia.js v2
- **Styling**: TailwindCSS v4 + shadcn/ui (new-york style)
- **Access Control**: Spatie `laravel-permission` v7 (Roles & Permissions)
- **Build Tool**: Vite 7
- **Database**: SQLite (default) / MySQL / PostgreSQL
- **Notifications**: Sonner (toast) + SweetAlert2 (confirmations & flash)
- **Icons**: Lucide React
- **Testing**: Pest v4

---

## Features

- **Authentication** — Login dengan email atau username, forgot password, reset password
- **Profile** — Edit profil (nama, email, username, avatar), ubah password
- **User Management** — CRUD lengkap dengan avatar upload, status aktif/nonaktif, role assignment
- **Role Management** — CRUD role dengan sinkronisasi permission
- **Permission Management** — CRUD permission (14 permission default)
- **Settings** — Pengaturan nama aplikasi dan logo
- **Dashboard** — Halaman utama admin
- **Dark/Light Mode** — Toggle tema dengan persistensi localStorage
- **RBAC** — Role-based access control di backend dan frontend (menu sidebar difilter berdasarkan permission)
- **Dynamic Sidebar** — Logo dan nama aplikasi dari settings, menu collapsible, breadcrumbs otomatis
- **Form Validation** — Request-based validation di backend
- **File Upload** — Upload avatar dan logo ke `public/uploads/`

---

## Folder Structure

```
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/              # Dashboard, Users, Roles, Permissions, Settings
│   │   │   ├── Auth/               # Login, ForgotPassword, ResetPassword
│   │   │   └── ProfileController.php
│   │   ├── Middleware/
│   │   │   └── HandleInertiaRequests.php
│   │   └── Requests/               # Form Request Validation per domain
│   │       ├── User/
│   │       ├── Role/
│   │       ├── Permission/
│   │       ├── Profile/
│   │       └── Setting/
│   ├── Models/
│   │   ├── User.php
│   │   └── Setting.php
│   └── Traits/
│       └── FileUploadTrait.php
├── config/
│   └── permission.php              # Spatie Permission config
├── database/
│   ├── migrations/
│   └── seeders/                    # Roles, Permissions, Users, Settings seeders
├── resources/
│   └── js/
│       ├── Components/
│       │   ├── common/             # PageHeader, Search, Delete, TablePagination, TableEmpty
│       │   ├── form/               # StatusSelect
│       │   ├── table/              # BasicTable
│       │   ├── Sidebar/            # AppSidebar, NavMain, NavUser, NavBreadcrumb, menuConfig
│       │   ├── theme/              # ThemeProvider, ThemeToggle
│       │   └── ui/                 # 22 shadcn/ui components (new-york style, JSX)
│       ├── hooks/                  # useIsMobile
│       ├── Layouts/                # LayoutApp, LayoutAuth
│       ├── lib/                    # utils.js (cn helper)
│       ├── Pages/
│       │   ├── Auth/               # Login, ForgotPassword, ResetPassword
│       │   ├── Profile/            # Index, ChangePassword
│       │   └── Admin/              # Dashboard, Users, Roles, Permissions, Settings
│       ├── utils/                  # permissions.js (hasPermission, hasRole, hasAnyPermission)
│       └── constants/              # app.js (APP_URL)
└── routes/
    └── web.php
```

---

## Installation & Setup

### Quick Setup

```bash
git clone <repository-url>
cd laravel13-react-spatie
composer setup
```

`composer setup` akan menjalankan: `composer install`, copy `.env`, generate app key, migrate database, `npm install`, dan `npm run build`.

### Manual Setup

```bash
git clone <repository-url>
cd laravel13-react-spatie

# Install dependencies
composer install
npm install

# Environment
cp .env.example .env
php artisan key:generate

# Database
touch database/database.sqlite
php artisan migrate --seed

# Build
npm run build
```

### Development Server

```bash
# Jalankan Laravel serve, Queue, dan Vite bersamaan:
composer dev

# Atau terpisah:
php artisan serve
npm run dev
```

---

## Default Credentials

| Field | Value |
|---|---|
| **Email** | `admin@gmail.com` |
| **Username** | `admin` |
| **Password** | `password` |

---

## Default Permissions

| Module | Permissions |
|---|---|
| Users | `users.index`, `users.create`, `users.edit`, `users.delete` |
| Roles | `roles.index`, `roles.create`, `roles.edit`, `roles.delete` |
| Permissions | `permissions.index`, `permissions.create`, `permissions.edit`, `permissions.delete` |
| Settings | `settings.index`, `settings.update` |

Default role `admin` memiliki semua 14 permission.

---

## Available Scripts

| Command | Description |
|---|---|
| `composer setup` | Full project bootstrap (install, .env, key, migrate, npm install, build) |
| `composer dev` | Jalankan server + queue + vite secara bersamaan |
| `composer test` | Clear config lalu jalankan Pest tests |
