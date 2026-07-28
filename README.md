# Laravel 13 + Inertia React + Spatie Permissions Starter

Web Application Admin Template modern yang dibangun menggunakan **Laravel 13**, **Inertia.js v2**, **React 19**, **TailwindCSS v4**, dan **Spatie Laravel Permission**.

---

## 🚀 Tech Stack

- **Backend**: Laravel 13 (PHP 8.3+)
- **Frontend**: React 19 + Inertia.js v2
- **Styling**: TailwindCSS v4 + Shadcn UI primitives
- **Access Control**: Spatie `laravel-permission` (Roles & Permissions)
- **Database**: SQLite / MySQL / PostgreSQL

---

## 📁 Struktur Folder Project

```
├── .agents/
│   └── AGENTS.md            # Dokumentasi arsitektur & konvensi untuk AI agent
├── app/
│   ├── Http/
│   │   ├── Controllers/     # Controller per fitur (bebas base Controller)
│   │   ├── Middleware/      # HandleInertiaRequests (Shared props)
│   │   └── Requests/        # Form Request Validation per domain
│   ├── Models/              # Eloquent Models (User, Setting)
│   └── Traits/              # FileUploadTrait
├── config/                  # Configuration files
├── database/
│   ├── migrations/          # DB Migrations
│   └── seeders/             # Roles, Permissions, User seeders
├── resources/
│   └── js/
│       ├── Components/
│       │   ├── common/      # Reusable page components (PageHeader, Search, Delete, TablePagination, TableEmpty)
│       │   ├── form/        # Form inputs & custom selects (StatusSelect)
│       │   ├── table/       # Table wrapper components (BasicTable)
│       │   ├── theme/       # Dark/Light mode theme provider & toggle
│       │   ├── Sidebar/     # Sidebar navigation components & menuConfig
│       │   └── ui/          # Low-level Shadcn UI primitives
│       ├── Layouts/         # App & Auth Layouts
│       ├── Pages/           # Inertia Views (Auth, Users, Roles, Permissions, Settings, Profile, Dashboard)
│       ├── utils/           # Utility functions (permissions.js)
│       └── constants/       # JS Constants (app.js)
└── routes/
    └── web.php              # Application web routes
```

---

## 🛠️ Instalasi & Setup

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd laravel13-react-spatie

# Install PHP dependencies
composer install

# Install JS dependencies
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
php artisan key:generate
```

### 3. Database Migration & Seeding

```bash
php artisan migrate --seed
```

### 4. Run Development Server

```bash
# Menjalankan Laravel serve, Queue, dan Vite bersamaan:
composer dev

# Atau terpisah:
php artisan serve
npm run dev
```

---

## 🔐 Credentials Default (dari Seeder)

- **Email**: `admin@gmail.com`
- **Password**: `password`
