# Laravel CBT — Computer-Based Testing (Online Exam)

Aplikasi ujian online berbasis web yang dibangun menggunakan **Laravel**, **Inertia.js**, **React**, **TailwindCSS**, **shadcn/ui**, dan **Spatie Laravel Permission**.

---

## Tech Stack

- **Backend**: Laravel
- **Frontend**: React + Inertia.js
- **Styling**: TailwindCSS + shadcn/ui

---

## Roles

| Role            | Access                                                                                                     |
| --------------- | ---------------------------------------------------------------------------------------------------------- |
| **admin**       | Full access: manage subjects, exams, questions, participants, results, users, roles, permissions, settings |
| **participant** | Dashboard, take assigned exams, view own results only                                                      |

---

## Installation & Setup

```bash
composer install
npm install

cp .env.example .env
php artisan key:generate

touch database/database.sqlite
php artisan migrate --seed

npm run build
```

### Development Server

```bash
composer dev
```

---

## Default Credentials

| Field        | Value             |
| ------------ | ----------------- |
| **Email**    | `admin@gmail.com` |
| **Username** | `admin`           |
| **Password** | `password`        |

### Participant

| Field        | Value                   |
| ------------ | ----------------------- |
| **Email**    | `participant@gmail.com` |
| **Username** | `participant`           |
| **Password** | `password`              |

---

## Available Scripts

| Command          | Description                           |
| ---------------- | ------------------------------------- |
| `composer setup` | Full project bootstrap                |
| `composer dev`   | Jalankan server + queue + vite        |
| `composer test`  | Clear config lalu jalankan Pest tests |
